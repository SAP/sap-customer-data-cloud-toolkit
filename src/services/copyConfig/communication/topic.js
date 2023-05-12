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

class Topic {
  static #ERROR_MSG_GET_CONFIG = 'Error getting topics'
  static #ERROR_MSG_SET_CONFIG = 'Error setting topics'
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
    const url = UrlBuilder.buildUrl(Topic.#NAMESPACE, this.#dataCenter, Topic.getGetTopicEndpoint())
    const res = await client.post(url, this.#getTopicParameters(this.#site)).catch(function (error) {
      return generateErrorResponse(error, Topic.#ERROR_MSG_GET_CONFIG)
    })
    return res.data
  }

  async set(site, dataCenter, body) {
    const url = UrlBuilder.buildUrl(Topic.#NAMESPACE, dataCenter, Topic.getSetTopicEndpoint())
    const res = await client.post(url, this.#setTopicParameters(site, body)).catch(function (error) {
      return generateErrorResponse(error, Topic.#ERROR_MSG_SET_CONFIG)
    })
    return res.data
  }

  #getTopicParameters(apiKey) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.#credentials.userKey
    parameters.secret = this.#credentials.secret
    parameters.context = JSON.stringify({ id: 'communication_topic_get', targetApiKey: apiKey })

    return parameters
  }

  #setTopicParameters(apiKey, body) {
    const parameters = Object.assign({}, this.#getTopicParameters(apiKey))
    parameters.CommunicationSettings = JSON.stringify(body.CommunicationSettings)
    parameters.context = JSON.stringify({ id: `communication_topic_${Object.keys(body.CommunicationSettings)[0]}`, targetApiKey: apiKey })
    return parameters
  }

  static getGetTopicEndpoint() {
    return `${Topic.#NAMESPACE}.communication.getTopicSettings`
  }

  static getSetTopicEndpoint() {
    return `${Topic.#NAMESPACE}.communication.setTopicSettings`
  }
}

export default Topic
