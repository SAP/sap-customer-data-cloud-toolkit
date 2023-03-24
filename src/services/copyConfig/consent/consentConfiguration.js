import ConsentStatement from './consentStatement'
import LegalStatement from './legalStatement'
import { stringToJson } from '../objectHelper'

class ConsentConfiguration {
  #credentials
  #site
  #dataCenter
  #consentStatement
  #legalStatement

  constructor(credentials, site, dataCenter) {
    this.#credentials = credentials
    this.#site = site
    this.#dataCenter = dataCenter
    this.#consentStatement = new ConsentStatement(credentials, site, dataCenter)
    this.#legalStatement = new LegalStatement(credentials, site, dataCenter)
  }

  async get() {
    return this.#consentStatement.get()
  }

  async copy(destinationSite, destinationSiteConfiguration, options) {
    let responses = []
    if (options && options.value === false) {
      return responses
    }
    let response = await this.#consentStatement.get()
    if (response.errorCode === 0) {
      const consentsPayload = ConsentConfiguration.#splitConsents(response.preferences)
      responses.push(...(await this.#copyConsentStatements(destinationSite, destinationSiteConfiguration, consentsPayload)))
    } else {
      responses.push(response)
    }
    responses = responses.flat()
    stringToJson(responses, 'context')
    responses = ConsentConfiguration.#addSeverityToResponses(responses)
    return responses
  }

  static #splitConsents(consents) {
    const consentsList = []
    for (const consent of Object.keys(consents)) {
      const payload = { preferences: {} }
      payload.preferences[consent] = consents[consent]
      consentsList.push(payload)
    }
    return consentsList
  }

  static #addSeverityToResponses(responses) {
    return responses.map((response) => {
      if (response.errorCode === 0) {
        response.severity = 'info'
      } else if (response.errorCode === 400009 && response.errorDetails.startsWith('There is already legal statement for ')) {
        response.severity = 'warning'
      } else if (response.errorCode !== 0) {
        response.severity = 'error'
      }
      return response
    })
  }

  async #copyConsentStatements(destinationSite, destinationSiteConfiguration, consentsPayload) {
    const promises = []
    for (const consentPayload of consentsPayload) {
      promises.push(this.#copyConsentStatement(destinationSite, destinationSiteConfiguration, consentPayload))
    }
    return Promise.all(promises)
  }

  async #copyConsentStatement(destinationSite, destinationSiteConfiguration, consent) {
    const responses = []
    const response = await this.#consentStatement.set(destinationSite, destinationSiteConfiguration.dataCenter, consent)
    responses.push(response)
    if (response.errorCode === 0) {
      responses.push(...(await this.#copyLegalStatements(destinationSite, destinationSiteConfiguration, consent)))
    }
    return responses
  }

  async #copyLegalStatements(destinationSite, destinationSiteConfiguration, consent) {
    const consentId = ConsentConfiguration.#getConsentId(consent.preferences)
    const consentLanguages = consent.preferences[consentId].langs
    return this.#legalStatement.copy(destinationSite, destinationSiteConfiguration, consentId, consentLanguages)
  }

  static #getConsentId(consent) {
    return Object.keys(consent)[0]
  }
}

export default ConsentConfiguration
