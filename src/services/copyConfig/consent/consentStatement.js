import UrlBuilder from '../../gigya/urlBuilder'
import client from '../../gigya/client'
import generateErrorResponse from '../../errors/generateErrorResponse'
import { stringToJson } from '../objectHelper'

class ConsentStatement {
  static #ERROR_MSG_GET_CONFIG = 'Error getting consent statements'
  static #ERROR_MSG_SET_CONFIG = 'Error setting consent statements'
  static #NAMESPACE = 'accounts'
  #credentials
  #site
  #dataCenter

  constructor(credentials, site, dataCenter) {
    this.#credentials = credentials
    this.#site = site
    this.#dataCenter = dataCenter
  }

  async get() {
    const url = UrlBuilder.buildUrl(ConsentStatement.#NAMESPACE, this.#dataCenter, ConsentStatement.getGetConsentStatementEndpoint())
    const res = await client.post(url, this.#getConsentStatementParameters(this.#site)).catch(function (error) {
      return generateErrorResponse(error, ConsentStatement.#ERROR_MSG_GET_CONFIG)
    })
    return res.data
  }

  async set(site, dataCenter, body) {
    const url = UrlBuilder.buildUrl(ConsentStatement.#NAMESPACE, dataCenter, ConsentStatement.getSetConsentStatementEndpoint())
    const res = await client.post(url, this.#setConsentStatementParameters(site, body)).catch(function (error) {
      return generateErrorResponse(error, ConsentStatement.#ERROR_MSG_SET_CONFIG)
    })
    return res.data
  }

  async copy(destinationSite, destinationSiteConfiguration) {
    let response = await this.get()
    if (response.errorCode === 0) {
      const getResponse = JSON.parse(JSON.stringify(response))
      response = await this.set(destinationSite, destinationSiteConfiguration.dataCenter, response)
      if (response.errorCode === 0) {
        this.#injectConsentStatementInfo(response, getResponse)
      }
    }
    stringToJson(response, 'context')
    return response
  }

  #getConsentStatementParameters(apiKey) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.#credentials.userKey
    parameters.secret = this.#credentials.secret
    parameters.context = JSON.stringify({ id: 'consentStatement', targetApiKey: apiKey })

    return parameters
  }

  #setConsentStatementParameters(apiKey, body) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.#credentials.userKey
    parameters.secret = this.#credentials.secret
    parameters['preferences'] = JSON.stringify(body.preferences)
    parameters['context'] = JSON.stringify({ id: 'consentStatement', targetApiKey: apiKey })
    return parameters
  }

  static getGetConsentStatementEndpoint() {
    return `${ConsentStatement.#NAMESPACE}.getConsentsStatements`
  }

  static getSetConsentStatementEndpoint() {
    return `${ConsentStatement.#NAMESPACE}.setConsentsStatements`
  }

  #injectConsentStatementInfo(response, getResponse) {
    response['consents'] = []
    for (const consentId of Object.keys(getResponse.preferences)) {
      response.consents.push({ id: consentId, langs: getResponse.preferences[consentId].langs })
    }
  }
}

export default ConsentStatement
