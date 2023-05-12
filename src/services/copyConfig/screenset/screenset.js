/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import UrlBuilder from '../../gigya/urlBuilder'
import client from '../../gigya/client'
import generateErrorResponse from '../../errors/generateErrorResponse'
import { stringToJson } from '../objectHelper'

class ScreenSet {
  static #ERROR_MSG_GET_CONFIG = 'Error getting screen sets'
  static #ERROR_MSG_SET_CONFIG = 'Error setting screen sets'
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
    const url = UrlBuilder.buildUrl(ScreenSet.#NAMESPACE, this.#dataCenter, ScreenSet.getGetScreenSetEndpoint())
    const res = await client.post(url, this.#getScreenSetParameters(this.#site)).catch(function (error) {
      return generateErrorResponse(error, ScreenSet.#ERROR_MSG_GET_CONFIG)
    })

    return res.data
  }

  async set(site, dataCenter, body) {
    const url = UrlBuilder.buildUrl(ScreenSet.#NAMESPACE, dataCenter, ScreenSet.getSetScreenSetEndpoint())
    const res = await client.post(url, this.#setScreenSetParameters(site, body)).catch(function (error) {
      return generateErrorResponse(error, ScreenSet.#ERROR_MSG_SET_CONFIG)
    })

    return res.data
  }

  async copy(destinationSite, destinationSiteConfiguration, options) {
    let response = await this.get()

    if (response.errorCode === 0) {
      response = await this.#copyScreenSets(destinationSite, destinationSiteConfiguration.dataCenter, response, options)
    }
    stringToJson(response, 'context')

    return response
  }

  #getScreenSetParameters(apiKey) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.#credentials.userKey
    parameters.secret = this.#credentials.secret
    parameters.include = 'screenSetID,html,css,javascript,translations,metadata'

    parameters.context = JSON.stringify({ id: 'screenSet', targetApiKey: apiKey })

    return parameters
  }

  #setScreenSetParameters(apiKey, body) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.#credentials.userKey
    parameters.secret = this.#credentials.secret
    parameters['screenSetID'] = body.screenSetID
    parameters['html'] = body.html
    if (body.css) {
      parameters['css'] = body.css
    }
    if (body.javascript) {
      parameters['javascript'] = body.javascript
    }
    if (body.translations) {
      parameters['translations'] = JSON.stringify(body.translations)
    }
    if (body.metadata) {
      parameters['metadata'] = JSON.stringify(body.metadata)
    }
    parameters['context'] = JSON.stringify({ id: body.screenSetID, targetApiKey: apiKey })
    return parameters
  }

  static getGetScreenSetEndpoint() {
    return `${ScreenSet.#NAMESPACE}.getScreenSets`
  }

  static getSetScreenSetEndpoint() {
    return `${ScreenSet.#NAMESPACE}.setScreenSet`
  }

  async #copyScreenSets(destinationSite, dataCenter, response, options) {
    const promises = []
    for (const screenSetCollectionInfo of options.getOptions().branches) {
      for (const screenSetInfo of screenSetCollectionInfo.branches) {
        if (screenSetInfo.value) {
          promises.push(this.#copyScreenSet(destinationSite, screenSetInfo.name, dataCenter, response))
        }
      }
    }
    return Promise.all(promises)
  }

  #copyScreenSet(destinationSite, screenSetID, dataCenter, response) {
    const screenSet = this.#getScreenSet(screenSetID, response)
    return this.set(destinationSite, dataCenter, screenSet)
  }

  #getScreenSet(screenSetID, response) {
    return response.screenSets.find((obj) => obj.screenSetID === screenSetID)
  }
}

export default ScreenSet
