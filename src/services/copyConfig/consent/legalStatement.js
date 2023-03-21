import UrlBuilder from '../../gigya/urlBuilder'
import client from '../../gigya/client'
import generateErrorResponse from '../../errors/generateErrorResponse'
import { stringToJson } from '../objectHelper'

class LegalStatement {
  static #ERROR_MSG_GET_CONFIG = 'Error getting legal statements'
  static #ERROR_MSG_SET_CONFIG = 'Error setting legal statements'
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
    const url = UrlBuilder.buildUrl(LegalStatement.#NAMESPACE, this.#dataCenter, LegalStatement.getGetLegalStatementEndpoint())
    const res = await client.post(url, this.#getLegalStatementParameters(this.#site)).catch(function (error) {
      return generateErrorResponse(error, LegalStatement.#ERROR_MSG_GET_CONFIG)
    })
    return res.data
  }

  async set(site, dataCenter, body) {
    const url = UrlBuilder.buildUrl(LegalStatement.#NAMESPACE, dataCenter, LegalStatement.getSetLegalStatementEndpoint())
    const res = await client.post(url, this.#setLegalStatementParameters(site, body)).catch(function (error) {
      return generateErrorResponse(error, LegalStatement.#ERROR_MSG_SET_CONFIG)
    })
    return res.data
  }

  async copy(destinationSite, destinationSiteConfiguration) {
    let response = await this.get()
    if (response.errorCode === 0) {
      response = await this.set(destinationSite, destinationSiteConfiguration.dataCenter, response)
    }
    stringToJson(response, 'context')
    return response
  }

  #getLegalStatementParameters(apiKey) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.#credentials.userKey
    parameters.secret = this.#credentials.secret
    parameters.context = JSON.stringify({ id: 'legalStatement', targetApiKey: apiKey })

    return parameters
  }

  #setLegalStatementParameters(apiKey, body) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.#credentials.userKey
    parameters.secret = this.#credentials.secret
    parameters['preferences'] = body.preferences
    parameters['context'] = JSON.stringify({ id: 'legalStatement', targetApiKey: apiKey })
    return parameters
  }

  static getGetLegalStatementEndpoint() {
    return `${LegalStatement.#NAMESPACE}.getLegalStatements`
  }

  static getSetLegalStatementEndpoint() {
    return `${LegalStatement.#NAMESPACE}.setLegalStatements`
  }
}

export default LegalStatement
