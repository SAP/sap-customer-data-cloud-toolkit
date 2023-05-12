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

class SiteMigrator {
  static #ERROR_MSG_MIGRATE = 'Error migrating site consents'
  static #NAMESPACE = 'accounts'

  constructor(userKey, secret) {
    this.userKey = userKey
    this.secret = secret
  }

  async migrateConsentFlow(apiKey, dataCenter) {
    const url = UrlBuilder.buildUrl(SiteMigrator.#NAMESPACE, dataCenter, SiteMigrator.#getMigrateEndpoint())
    const payload = this.#createMigrateConsentFlowPayload(apiKey)
    return client.post(url, payload).catch(function (error) {
      return generateErrorResponse(error, SiteMigrator.#ERROR_MSG_MIGRATE)
    })
  }

  static #getMigrateEndpoint() {
    return `${SiteMigrator.#NAMESPACE}.migrateConsentFlow`
  }

  #createMigrateConsentFlowPayload(apiKey) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.userKey
    parameters.secret = this.secret
    parameters.MigrateSite = true
    return parameters
  }
}

export default SiteMigrator
