import client from '../../gigya/client'
import generateErrorResponse from '../../errors/generateErrorResponse'
import UrlBuilder from '../../gigya/urlBuilder'
import { stringToJson } from '../objectHelper'
import SiteConfigurator from '../../configurator/siteConfigurator'

class WebSdk {
  static #NAMESPACE = 'admin'
  static #SET_ENDPOINT = 'admin.setSiteConfig'
  static #ERROR_SET_WEB_SDK_CONFIG = 'Error setting web sdk configuration'

  constructor(credentials, apiKey, dataCenter) {
    this.userKey = credentials.userKey
    this.secret = credentials.secret
    this.originApiKey = apiKey
    this.originDataCenter = dataCenter
    this.siteConfigurator = new SiteConfigurator(this.userKey, this.secret)
  }

  async get() {
    const response = await this.siteConfigurator.getSiteConfig(this.originApiKey, this.originDataCenter)
    response.context = JSON.stringify({ id: 'webSdk', targetApiKey: this.originApiKey })
    return response
  }

  async #set(apiKey, config, targetDataCenter) {
    const url = UrlBuilder.buildUrl(WebSdk.#NAMESPACE, targetDataCenter, WebSdk.#SET_ENDPOINT)
    const response = await client.post(url, this.#setWebSdkConfigParameters(apiKey, config)).catch(function (error) {
      return generateErrorResponse(error, WebSdk.#ERROR_SET_WEB_SDK_CONFIG)
    })
    return response.data
  }

  async copy(targetApi, targetSiteConfiguration) {
    let response = await this.get()
    if (response.errorCode === 0) {
      response = await this.#set(targetApi, response, targetSiteConfiguration.dataCenter)
    }

    if (response.context) {
      response['context'] = response.context.replace(/&quot;/g, '"')
      stringToJson(response, 'context')
    }
    return response
  }

  #setWebSdkConfigParameters(apiKey, config) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.userKey
    parameters.secret = this.secret
    parameters.globalConf = config.globalConf
    parameters.context = JSON.stringify({ id: 'webSdk', targetApiKey: apiKey })
    return parameters
  }
}
export default WebSdk