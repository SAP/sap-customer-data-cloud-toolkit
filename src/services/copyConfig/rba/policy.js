import generateErrorResponse from '../../errors/generateErrorResponse.js'
import client from '../../gigya/client.js'
import UrlBuilder from '../../gigya/urlBuilder.js'

export default class Policy {
  static #NAMESPACE = 'accounts'
  static #ERROR_GET_POLICY_CONFIG = 'Error retrieving RBA policy configuration'
  static #ERROR_SET_POLICY_CONFIG = 'Error setting RBA policy configuration'
  static CONTEXT_ID = 'rba.policy'
  static #GETPOLICY = 'accounts.rba.getPolicy'
  static #SETPOLICY = 'accounts.rba.setPolicy'
  #credentials

  constructor(credentials, apiKey, dataCenter) {
    this.#credentials = credentials
    this.originApiKey = apiKey
    this.originDataCenter = dataCenter
  }

  async get() {
    const url = UrlBuilder.buildUrl(Policy.#NAMESPACE, this.originDataCenter, Policy.#GETPOLICY, this.#credentials.gigyaConsole)
    try {
      const response = await client.post(url, this.#getPolicyParameters(this.originApiKey))
      return response.data
    } catch (error) {
      return generateErrorResponse(error, Policy.#ERROR_GET_POLICY_CONFIG)
    }
  }

  async set(apiKey, policy, targetDataCenter) {
    const url = UrlBuilder.buildUrl(Policy.#NAMESPACE, targetDataCenter, Policy.#SETPOLICY, this.#credentials.gigyaConsole)
    try {
      const response = await client.post(url, this.#setPolicyParameters(apiKey, policy))
      return response.data
    } catch (error) {
      return generateErrorResponse(error, Policy.#ERROR_SET_POLICY_CONFIG)
    }
  }

  #getPolicyParameters(apiKey) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.#credentials.userKey
    parameters.secret = this.#credentials.secret
    parameters.context = JSON.stringify({ id: Policy.CONTEXT_ID, targetApiKey: apiKey })

    return parameters
  }

  #setPolicyParameters(apiKey, payload) {
    const parameters = this.#getPolicyParameters(apiKey)
    if (payload.policy) {
      parameters.policy = JSON.stringify(payload.policy)
    }
    return parameters
  }
}
