import ConsentStatement from './consentStatement'
import LegalStatement from './legalStatement'

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
    if (options && options.value === false) {
      return {}
    }
    let response = await this.#consentStatement.copy(destinationSite, destinationSiteConfiguration, options)
    if (response.errorCode === 0) {
      response = await this.#legalStatement.copy(destinationSite, destinationSiteConfiguration, options)
    }
    response.context.id = 'consents'
    return response
  }
}

export default ConsentConfiguration
