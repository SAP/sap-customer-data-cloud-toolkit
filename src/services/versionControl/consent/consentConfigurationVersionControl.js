/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import ConsentConfiguration from '../../copyConfig/consent/consentConfiguration'
import LegalStatementManager from './legalStatementVersionControl'
import { extractConsentIdsAndLanguages } from '../utils'
import LegalStatement from '../../copyConfig/consent/legalStatement'

class ConsentConfigurationManager {
  #consentConfiguration
  #legalStatementManager
  #legalStatement

  constructor(credentials, site, dataCenter) {
    this.#consentConfiguration = new ConsentConfiguration(credentials, site, dataCenter)
    this.#legalStatementManager = new LegalStatementManager(credentials, site, dataCenter)
    this.#legalStatement = new LegalStatement(credentials, site, dataCenter)
  }

  async getConsentsAndLegalStatements() {
    try {
      const consents = await this.#consentConfiguration.get()
      if (!consents) {
        throw new Error('getConsentStatement returned undefined or null')
      }
      if (consents.errorCode !== 0) {
        return consents
      }
      if (!consents.preferences) {
        throw new Error('consents.preferences is undefined or null')
      }
      const consentsWithLegalStatements = { ...consents }
      const idsAndLanguages = extractConsentIdsAndLanguages(consents.preferences)
      for (const { consentId, language } of idsAndLanguages) {
        const legalStatements = await this.#legalStatementManager.getFilteredLegalStatement(consentId, language)
        consentsWithLegalStatements.preferences[consentId].legalStatements = consentsWithLegalStatements.preferences[consentId].legalStatements || {}
        consentsWithLegalStatements.preferences[consentId].legalStatements[language] = legalStatements.legalStatements
      }

      return consentsWithLegalStatements
    } catch (error) {
      console.error('Error in getConsentStatement:', error)
      throw error
    }
  }

  async setConsentsAndLegalStatements(apiKey, siteInfo, content) {
    try {
      const preferencesWithoutLegalStatements = JSON.parse(JSON.stringify(content.preferences))
      for (const consentId of Object.keys(preferencesWithoutLegalStatements)) {
        delete preferencesWithoutLegalStatements[consentId].legalStatements
      }

      const consentsPayload = ConsentConfiguration.splitConsents(preferencesWithoutLegalStatements)
      const legalStatementsPayload = ConsentConfigurationManager.#splitLegalStatements(content.preferences)

      const consentResponses = await this.#consentConfiguration.copyConsentStatements(apiKey, siteInfo, consentsPayload)
      const legalStatementResponses = await this.copyLegalStatementsFromFile(apiKey, siteInfo, legalStatementsPayload)

      return [...consentResponses, ...legalStatementResponses]
    } catch (error) {
      console.error('Error in setConsentsAndLegalStatements:', error)
      throw error
    }
  }

  static #splitLegalStatements(preferences) {
    const legalStatementsList = []
    for (const consentId of Object.keys(preferences)) {
      const consent = preferences[consentId]
      if (consent.legalStatements) {
        for (const language of Object.keys(consent.legalStatements)) {
          const payload = {
            consentId,
            language,
            legalStatements: consent.legalStatements[language],
          }
          legalStatementsList.push(payload)
        }
      }
    }
    return legalStatementsList
  }

  async copyLegalStatementsFromFile(destinationSite, destinationSiteConfiguration, legalStatementsPayload) {
    const promises = []
    for (const legalStatementPayload of legalStatementsPayload) {
      promises.push(this.#copyLegalStatement(destinationSite, destinationSiteConfiguration.dataCenter, legalStatementPayload))
    }
    return Promise.all(promises)
  }

  async #copyLegalStatement(destinationSite, dataCenter, legalStatementPayload) {
    const { consentId, language, legalStatements } = legalStatementPayload
    const response = await this.#legalStatement.set(destinationSite, dataCenter, consentId, language, legalStatements)
    return response
  }
}

export default ConsentConfigurationManager
