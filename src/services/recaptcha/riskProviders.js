/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import client from '../gigya/client.js'
import UrlBuilder from '../gigya/urlBuilder.js'
import generateErrorResponse from '../errors/generateErrorResponse.js'

class RiskProviders {
  static #ERROR_MSG_GET_CONFIG = 'Error getting Risk Providers configuration'
  static #ERROR_MSG_SET_CONFIG = 'Error setting Risk Providers configuration'
  static #NAMESPACE = 'admin'

  constructor(userKey, secret, gigyaConsole) {
    this.userKey = userKey
    this.secret = secret
    this.gigyaConsole = gigyaConsole
  }

  async get(site, dataCenter) {
    const url = UrlBuilder.buildUrl(RiskProviders.#NAMESPACE, dataCenter, RiskProviders.getGetRiskProvidersEndpoint(), this.gigyaConsole)
    try {
      const res = await client.post(url, this.#getRiskProvidersParameters(site))
      return res.data
    } catch (error) {
      return generateErrorResponse(error, RiskProviders.#ERROR_MSG_GET_CONFIG)
    }
  }

  async set(site, dataCenter, config) {
    const url = UrlBuilder.buildUrl(RiskProviders.#NAMESPACE, dataCenter, RiskProviders.getSetRiskProvidersEndpoint(), this.gigyaConsole)
    try {
      const params = {
        apiKey: site,
        userKey: this.userKey,
        secret: this.secret,
        config: JSON.stringify(config),
      }
      const response = await client.post(url, params)
      return response.data
    } catch (error) {
      return generateErrorResponse(error, RiskProviders.#ERROR_MSG_SET_CONFIG)
    }
  }

  #getRiskProvidersParameters(apiKey) {
    return {
      apiKey,
      userKey: this.userKey,
      secret: this.secret,
    }
  }

  static getGetRiskProvidersEndpoint() {
    return `${RiskProviders.#NAMESPACE}.riskProviders.getConfig`
  }

  static getSetRiskProvidersEndpoint() {
    return `${RiskProviders.#NAMESPACE}.riskProviders.setConfig`
  }
}

export default RiskProviders
