/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import ConsentConfiguration from '../../copyConfig/consent/consentConfiguration'
import LegalStatement from '../../copyConfig/consent/legalStatement'
import { extractConsentIdsAndLanguages } from '../../versionControl/utils'

class ConsentConfigurationManager {
  #consentConfiguration
  #legalStatement

  constructor(credentials, site, dataCenter) {
    this.#consentConfiguration = new ConsentConfiguration(credentials, site, dataCenter)
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
        const legalStatements = await this.#legalStatement.getFilteredLegalStatement(consentId, language)
        consentsWithLegalStatements.preferences[consentId].legalStatements = consentsWithLegalStatements.preferences[consentId].legalStatements || {}
        consentsWithLegalStatements.preferences[consentId].legalStatements[language] = legalStatements.legalStatements
      }

      return consentsWithLegalStatements
    } catch (error) {
      console.error('Error in getConsentStatement:', error)
      throw error
    }
  }
}

export default ConsentConfigurationManager
