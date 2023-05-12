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

class ConsentStatement {
  static #ERROR_MSG_GET_CONFIG = 'Error getting consent statements'
  static #ERROR_MSG_SET_CONFIG = 'Error setting consent statements'
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
    const url = UrlBuilder.buildUrl(ConsentStatement.#NAMESPACE, this.#dataCenter, ConsentStatement.getGetConsentStatementEndpoint())
    const res = await client.post(url, this.#getConsentStatementParameters(this.#site)).catch(function (error) {
      return generateErrorResponse(error, ConsentStatement.#ERROR_MSG_GET_CONFIG)
    })
    return res.data
  }

  async set(site, dataCenter, body) {
    const url = UrlBuilder.buildUrl(ConsentStatement.#NAMESPACE, dataCenter, ConsentStatement.getSetConsentStatementEndpoint())
    const res = await client.post(url, this.#setConsentStatementParameters(site, body)).catch(function (error) {
      return generateErrorResponse(error, ConsentStatement.#ERROR_MSG_SET_CONFIG)
    })
    return res.data
  }

  #getConsentStatementParameters(apiKey) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.#credentials.userKey
    parameters.secret = this.#credentials.secret
    parameters.context = JSON.stringify({ id: 'consent_consentStatement_get', targetApiKey: apiKey })

    return parameters
  }

  #setConsentStatementParameters(apiKey, body) {
    const parameters = Object.assign({}, this.#getConsentStatementParameters(apiKey))
    parameters.preferences = JSON.stringify(body.preferences)
    parameters.context = JSON.stringify({ id: `consent_consentStatement_${Object.keys(body.preferences)[0]}`, targetApiKey: apiKey })
    return parameters
  }

  static getGetConsentStatementEndpoint() {
    return `${ConsentStatement.#NAMESPACE}.getConsentsStatements`
  }

  static getSetConsentStatementEndpoint() {
    return `${ConsentStatement.#NAMESPACE}.setConsentsStatements`
  }
}

export default ConsentStatement
