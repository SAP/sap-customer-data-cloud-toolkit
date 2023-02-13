import client from '../../gigya/client'
import generateErrorResponse from '../../errors/generateErrorResponse'
import UrlBuilder from '../../gigya/urlBuilder'
import { stringToJson } from '../objectHelper'

class Social {
  static #NAMESPACE = 'socialize'
  static #GET_ENDPOINT = 'socialize.getProvidersConfig'
  static #SET_ENDPOINT = 'socialize.setProvidersConfig'
  static #ERROR_GET_SOCIAL_CONFIG = 'Error retrieving social configuration'
  static #ERROR_SET_SOCIAL_CONFIG = 'Error setting social configuration'
  constructor(credentials, apiKey, dataCenter) {
    this.userKey = credentials.userKey
    this.secret = credentials.secret
    this.originApiKey = apiKey
    this.originDataCenter = dataCenter
  }
  async get() {
    const url = UrlBuilder.buildUrl(Social.#NAMESPACE, this.originDataCenter, Social.#GET_ENDPOINT)
    const response = await client.post(url, this.#getSocialConfigParameters(this.originApiKey)).catch(function (error) {
      return generateErrorResponse(error, Social.#ERROR_GET_SOCIAL_CONFIG)
    })
    return response.data
  }
  async #set(apiKey, config, targetDataCenter) {
    const url = UrlBuilder.buildUrl(Social.#NAMESPACE, targetDataCenter, Social.#SET_ENDPOINT)
    const response = await client.post(url, this.#setSocialConfigParameters(apiKey, config)).catch(function (error) {
      return generateErrorResponse(error, Social.#ERROR_SET_SOCIAL_CONFIG)
    })
    return response.data
  }
  async copy(targetApi, targetSiteConfiguration) {
    let response = await this.get(this.originApiKey)

    if (response.errorCode === 0) {
      response = await this.#set(targetApi, response, targetSiteConfiguration.dataCenter)
    }
    stringToJson(response, 'context')
    return response
  }

  #getSocialConfigParameters(apiKey) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.userKey
    parameters.secret = this.secret
    parameters.includeSettings = true
    parameters.includeCapabilities = true
    parameters.includeSecretKeys = true
    parameters.format = 'json'
    parameters.context = { id: 'socialIdentities', targetApiKey: apiKey }
    return parameters
  }
  #setSocialConfigParameters(apiKey, config) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.userKey
    parameters.secret = this.secret
    parameters.settings = config.settings
    parameters.capabilities = config.capabilities
    parameters.providers = JSON.stringify(config.providers)
    parameters.format = 'json'
    if (config.context) {
      parameters['context'] = JSON.stringify(config.context)
    }
    return parameters
  }
}
export default Social
