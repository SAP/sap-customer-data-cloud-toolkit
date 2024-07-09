/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import UrlBuilder from '../../gigya/urlBuilder.js'
import client from '../../gigya/client.js'
import generateErrorResponse from '../../errors/generateErrorResponse.js'

class Topic {
  static #ERROR_MSG_GET_CONFIG = 'Error getting topics'
  static #ERROR_MSG_SET_CONFIG = 'Error setting topics'
  static #NAMESPACE = 'accounts'
  static #QUERY = 'select topicChannelId, topic, channel, lastModified, description,schema from topicChannels limit 2000'
  #credentials
  #site
  #dataCenter

  constructor(credentials, site, dataCenter) {
    this.#credentials = credentials
    this.#site = site
    this.#dataCenter = dataCenter
  }

  async searchTopics() {
    const url = UrlBuilder.buildUrl(Topic.#NAMESPACE, this.#dataCenter, Topic.getGetTopicEndpoint(), this.#credentials.gigyaConsole)
    const res = await client.post(url, this.#searchTopicParameters(this.#site, Topic.#QUERY)).catch(function (error) {
      return generateErrorResponse(error, Topic.#ERROR_MSG_GET_CONFIG)
    })
    return res.data
  }

  async set(site, dataCenter, body) {
    const url = UrlBuilder.buildUrl(Topic.#NAMESPACE, dataCenter, Topic.getSetTopicEndpoint(), this.#credentials.gigyaConsole)
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

  #searchTopicParameters(apiKey, query) {
    const parameters = Object.assign({}, this.#authenticationTopicParameters(apiKey))
    parameters.query = query
    parameters.context = JSON.stringify({})
    return parameters
  }

  #authenticationTopicParameters(apiKey) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.#credentials.userKey
    parameters.secret = this.#credentials.secret
    return parameters
  }
  #setTopicParameters(apiKey, body) {
    const parameters = Object.assign({}, this.#getTopicParameters(apiKey))
    parameters.topicChannel = JSON.stringify(body)
    parameters.context = JSON.stringify({ id: `topic_${Object.keys(body)[0]}`, targetApiKey: apiKey })
    return parameters
  }

  static getGetTopicEndpoint() {
    return `${Topic.#NAMESPACE}.communications.settings.search`
  }

  static getSetTopicEndpoint() {
    return `${Topic.#NAMESPACE}.communications.settings.set`
  }
}

export default Topic
