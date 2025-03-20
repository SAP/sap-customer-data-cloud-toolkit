/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import client from '../../gigya/client.js'
import generateErrorResponse from '../../errors/generateErrorResponse.js'
import UrlBuilder from '../../gigya/urlBuilder.js'
import { stringToJson } from '../objectHelper.js'
import SiteConfigurator from '../../configurator/siteConfigurator.js'

class WebSdk {
  static #NAMESPACE = 'admin'
  static #SET_ENDPOINT = 'admin.setSiteConfig'
  static #ERROR_SET_WEB_SDK_CONFIG = 'Error setting web sdk configuration'
  #credentials

  constructor(credentials, apiKey, dataCenter) {
    this.#credentials = credentials
    this.originApiKey = apiKey
    this.originDataCenter = dataCenter
    this.siteConfigurator = new SiteConfigurator(credentials.userKey, credentials.secret, credentials.gigyaConsole)
  }

  async get() {
    const response = await this.siteConfigurator.getSiteConfig(this.originApiKey, this.originDataCenter)
    response.context = JSON.stringify({ id: 'webSdk', targetApiKey: this.originApiKey })
    return response
  }

  async set(apiKey, config, targetDataCenter) {
    const url = UrlBuilder.buildUrl(WebSdk.#NAMESPACE, targetDataCenter, WebSdk.#SET_ENDPOINT, this.#credentials.gigyaConsole)
    const response = await client.post(url, this.#setWebSdkConfigParameters(apiKey, config)).catch(function (error) {
      return generateErrorResponse(error, WebSdk.#ERROR_SET_WEB_SDK_CONFIG)
    })
    return response.data
  }

  async copy(targetApi, targetSiteConfiguration) {
    let response = await this.get()
    if (response.errorCode === 0) {
      response = await this.set(targetApi, response, targetSiteConfiguration.dataCenter)
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
    parameters.userKey = this.#credentials.userKey
    parameters.secret = this.#credentials.secret
    parameters.globalConf = config.globalConf
    parameters.context = JSON.stringify({ id: 'webSdk', targetApiKey: apiKey })
    return parameters
  }

  static hasWebSdk(response) {
    return !(response.globalConf === '' || response.globalConf === undefined)
  }
}
export default WebSdk
