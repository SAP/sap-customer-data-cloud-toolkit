import generateErrorResponse from '../../errors/generateErrorResponse'
import UrlBuilder from '../../gigya/urlBuilder'
import client from '../../gigya/client'
import { stringToJson } from '../objectHelper'

class Policy {
  static #NAMESPACE = 'accounts'
  static #GET_ENDPOINT = 'accounts.getPolicies'
  static #SET_ENDPOINT = 'accounts.setPolicies'
  static #ERROR_GET_POLICY_CONFIG = 'Error retrieving policy configuration'
  static #ERROR_SET_POLICY_CONFIG = 'Error setting policy configuration'

  constructor(credentials, apiKey, dataCenter) {
    this.userKey = credentials.userKey
    this.secret = credentials.secret
    this.originApiKey = apiKey
    this.originDataCenter = dataCenter
  }

  async get() {
    const url = UrlBuilder.buildUrl(Policy.#NAMESPACE, this.originDataCenter, Policy.#GET_ENDPOINT)
    const response = await client.post(url, this.#getPolicyConfigParameters(this.originApiKey)).catch(function (error) {
      return generateErrorResponse(error, Policy.#ERROR_GET_POLICY_CONFIG)
    })

    return response.data
  }

  async set(apiKey, config, targetDataCenter) {
    const url = UrlBuilder.buildUrl(Policy.#NAMESPACE, targetDataCenter, Policy.#SET_ENDPOINT)
    const response = await client.post(url, this.#setPolicyConfigParameters(apiKey, config)).catch(function (error) {
      return generateErrorResponse(error, Policy.#ERROR_SET_POLICY_CONFIG)
    })
    return response.data
  }

  async copy(targetApi, targetDataCenter, options) {
    let response = await this.get()

    this.#cleanResponse(response)
    if (response.errorCode === 0) {
      response = await this.set(targetApi, this.#removeUnecessaryFields(response, options), targetDataCenter.dataCenter)
    }
    if (response.context) {
      response['context'] = response.context.replace(/&quot;/g, '"')
      stringToJson(response, 'context')
    }

    return response
  }
  #deleteOptions(response, options) {
    for (const templateInfo of options.branches) {
      if (!templateInfo.value) {
        delete response[templateInfo.id]
      }
    }
    return response
  }

  #removeUnecessaryFields(response, options) {
    if (options.branches === undefined) {
      this.#deleteOptions(response, options.options)
      return response
    } else {
      this.#deleteOptions(response, options)
      return response
    }
  }

  #cleanResponse(response) {
    delete response['authentication']
    delete response['doubleOptIn']
    delete response['preferencesCenter']
    delete response['rba']

    if (response['security']) {
      delete response['security'].accountLockout
      delete response['security'].captcha
      delete response['security'].ipLockout
    }
  }

  #getPolicyConfigParameters(apiKey) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.userKey
    parameters.secret = this.secret
    parameters.format = 'json'
    return parameters
  }

  #setPolicyConfigParameters(apiKey, config) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.userKey
    parameters.secret = this.secret
    parameters.accountOptions = JSON.stringify(config.accountOptions)
    parameters.emailNotifications = JSON.stringify(config.emailNotifications)
    parameters.emailVerification = JSON.stringify(config.emailVerification)
    parameters.gigyaPlugins = JSON.stringify(config.gigyaPlugins)
    parameters.passwordComplexity = JSON.stringify(config.passwordComplexity)
    parameters.passwordReset = JSON.stringify(config.passwordReset)
    parameters.profilePhoto = JSON.stringify(config.profilePhoto)
    parameters.registration = JSON.stringify(config.registration)
    parameters.security = JSON.stringify(config.security)
    parameters.twoFactorAuth = JSON.stringify(config.twoFactorAuth)
    parameters.federation = JSON.stringify(config.federation)
    parameters.context = JSON.stringify({ id: 'policy', targetApiKey: apiKey })
    parameters.format = 'json'

    return parameters
  }
}

export default Policy
