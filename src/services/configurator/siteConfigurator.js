/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import client from '../gigya/client'
import UrlBuilder from '../gigya/urlBuilder'
import generateErrorResponse from '../errors/generateErrorResponse'

class SiteConfigurator {
  static ERROR_MSG_CONFIG = 'Invalid ApiKey parameter'
  static #NAMESPACE = 'admin'

  constructor(userKey, secret) {
    this.userKey = userKey
    this.secret = secret
  }

  async connect(parentApiKey, childApiKey, dataCenter) {
    const url = UrlBuilder.buildUrl(SiteConfigurator.#NAMESPACE, dataCenter, SiteConfigurator.getSetEndpoint())
    const body = this.#createRequestBody(parentApiKey, childApiKey)
    return client.post(url, body).catch(function (error) {
      return generateErrorResponse(error, SiteConfigurator.ERROR_MSG_CONFIG)
    })
  }

  #createRequestBody(parentApiKey, childApiKey) {
    return {
      apiKey: childApiKey,
      siteGroupOwner: parentApiKey,
      userKey: this.userKey,
      secret: this.secret,
    }
  }

  static getSetEndpoint() {
    return 'admin.setSiteConfig'
  }

  static getGetEndpoint() {
    return 'admin.getSiteConfig'
  }

  async getSiteConfig(apiKey, dataCenter) {
    const url = UrlBuilder.buildUrl(SiteConfigurator.#NAMESPACE, dataCenter, SiteConfigurator.getGetEndpoint())

    const response = await client.post(url, this.#siteConfigParameters(apiKey, this.userKey, this.secret)).catch(function (error) {
      //console.log(`error=${JSON.stringify(error)}`)
      return generateErrorResponse(error, SiteConfigurator.ERROR_MSG_CONFIG)
    })
    return response.data
  }

  #siteConfigParameters(apiKey, userKey, secret) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = userKey
    parameters.secret = secret
    parameters.includeSiteGroupConfig = true
    parameters.includeGlobalConf = true
    return parameters
  }
}

export default SiteConfigurator
