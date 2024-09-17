import UrlBuilder from '../../gigya/urlBuilder.js'
import client from '../../gigya/client.js'
import generateErrorResponse from '../../errors/generateErrorResponse.js'

export default class RiskAssessment {
  static #NAMESPACE = 'accounts'
  static #ERROR_GET_RISK_ASSESSMENT_CONFIG = 'Error retrieving RBA risk assessment configuration'
  static #ERROR_SET_RISK_ASSESSMENT_CONFIG = 'Error setting RBA risk assessment configuration'
  static CONTEXT_ID = 'rba.riskAssessment'
  #credentials

  constructor(credentials, apiKey, dataCenter) {
    // this class do not uses the data center because these endpoints only work on the primary data center
    this.#credentials = credentials
    this.originApiKey = apiKey
    this.originDataCenter = dataCenter
  }

  async get() {
    const url = UrlBuilder.buildUrl(RiskAssessment.#NAMESPACE, this.originDataCenter, 'accounts.rba.riskAssessment.getConfig', this.#credentials.gigyaConsole)
    const response = await client.post(url, this.#getParameters(this.originApiKey)).catch(function (error) {
      return generateErrorResponse(error, RiskAssessment.#ERROR_GET_RISK_ASSESSMENT_CONFIG)
    })
    return response.data
  }

  async set(apiKey, config) {
    const url = UrlBuilder.buildUrl(RiskAssessment.#NAMESPACE, undefined, 'accounts.rba.riskAssessment.setConfig', this.#credentials.gigyaConsole)
    const response = await client.post(url, this.#setParameters(apiKey, config)).catch(function (error) {
      return generateErrorResponse(error, RiskAssessment.#ERROR_SET_RISK_ASSESSMENT_CONFIG)
    })
    return response.data
  }

  #getParameters(apiKey) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.#credentials.userKey
    parameters.secret = this.#credentials.secret
    parameters.context = JSON.stringify({ id: RiskAssessment.CONTEXT_ID, targetApiKey: apiKey })

    return parameters
  }

  #setParameters(apiKey, payload) {
    const parameters = this.#getParameters(apiKey)
    parameters.Config = JSON.stringify(payload)
    return parameters
  }
}
