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

class Channel {
  static #ERROR_MSG_GET_CONFIG = 'Error getting channels'
  static #ERROR_MSG_SET_CONFIG = 'Error setting channels'
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
    const url = UrlBuilder.buildUrl(Channel.#NAMESPACE, this.#dataCenter, Channel.getGetChannelEndpoint())
    const res = await client.post(url, this.#getChannelParameters(this.#site)).catch(function (error) {
      return generateErrorResponse(error, Channel.#ERROR_MSG_GET_CONFIG)
    })
    return res.data
  }

  async set(site, dataCenter, body) {
    const url = UrlBuilder.buildUrl(Channel.#NAMESPACE, dataCenter, Channel.getSetChannelEndpoint())
    const res = await client.post(url, this.#setChannelParameters(site, body)).catch(function (error) {
      return generateErrorResponse(error, Channel.#ERROR_MSG_SET_CONFIG)
    })
    return res.data
  }

  #getChannelParameters(apiKey) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.#credentials.userKey
    parameters.secret = this.#credentials.secret
    parameters.context = JSON.stringify({ id: 'communication_channel_get', targetApiKey: apiKey })

    return parameters
  }

  #setChannelParameters(apiKey, body) {
    const parameters = Object.assign({}, this.#getChannelParameters(apiKey))
    parameters.Channels = JSON.stringify(body.Channels)
    parameters.context = JSON.stringify({ id: `communication_channel_${Object.keys(body.Channels)[0]}`, targetApiKey: apiKey })
    return parameters
  }

  static getGetChannelEndpoint() {
    return `${Channel.#NAMESPACE}.communication.getChannels`
  }

  static getSetChannelEndpoint() {
    return `${Channel.#NAMESPACE}.communication.setChannels`
  }
}

export default Channel
