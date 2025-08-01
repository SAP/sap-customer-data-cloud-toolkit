/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import client from '../gigya/client.js'
import UrlBuilder from '../gigya/urlBuilder.js'
import generateErrorResponse from '../errors/generateErrorResponse.js'
import SiteConfigurator from '../configurator/siteConfigurator.js'

class Email {
  static #ERROR_MSG_GET_CONFIG = 'Error getting email templates'
  static #ERROR_MSG_SET_CONFIG = 'Error setting email templates'
  static #NAMESPACE = 'accounts'

  constructor(userKey, secret, gigyaConsole) {
    this.userKey = userKey
    this.secret = secret
    this.gigyaConsole = gigyaConsole
    this.siteConfigurator = new SiteConfigurator(userKey, secret, gigyaConsole)
  }

  async getSiteEmails(site) {
    const dataCenterResponse = await this.siteConfigurator.getSiteConfig(site)
    if (dataCenterResponse.errorCode !== 0) {
      return dataCenterResponse
    }
    return await this.getSiteEmailsWithDataCenter(site, dataCenterResponse.dataCenter)
  }

  async getSiteEmailsWithDataCenter(site, dataCenter) {
    const url = UrlBuilder.buildUrl(Email.#NAMESPACE, dataCenter, Email.getGetEmailsTemplatesEndpoint(), this.gigyaConsole)
    const res = await client.post(url, this.#getEmailsTemplatesParameters(site)).catch(function (error) {
      //console.log(`error=${error}`)
      return generateErrorResponse(error, Email.#ERROR_MSG_GET_CONFIG)
    })

    return res.data
  }

  async setSiteEmails(site, templateName, template) {
    const dataCenterResponse = await this.siteConfigurator.getSiteConfig(site)
    if (dataCenterResponse.errorCode !== 0) {
      return dataCenterResponse
    }

    return this.setSiteEmailsWithDataCenter(site, templateName, template, dataCenterResponse.dataCenter)
  }

  async setSiteEmailsWithDataCenter(site, templateName, template, dataCenter) {
    const url = UrlBuilder.buildUrl(Email.#NAMESPACE, dataCenter, Email.getSetEmailsTemplatesEndpoint(), this.gigyaConsole)
    const res = await client.post(url, this.#setEmailsTemplatesParameters(site, templateName, template)).catch(function (error) {
      //console.log(`error=${error}`)
      return generateErrorResponse(error, Email.#ERROR_MSG_SET_CONFIG)
    })

    return res.data
  }

  #getEmailsTemplatesParameters(apiKey) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.userKey
    parameters.secret = this.secret
    parameters.context = JSON.stringify({ id: 'emailTemplates', targetApiKey: apiKey })

    return parameters
  }

  #setEmailsTemplatesParameters(apiKey, templateName, template) {
    const tokens = templateName.split('.')
    const parameters = this.#getEmailsTemplatesParameters(apiKey)
    parameters[tokens[0]] = JSON.stringify(template)
    parameters.context = JSON.stringify({ id: tokens[tokens.length - 1], targetApiKey: apiKey })
    return parameters
  }

  static getGetEmailsTemplatesEndpoint() {
    return 'accounts.policies.emailTemplates.getConfig'
  }

  static getSetEmailsTemplatesEndpoint() {
    return 'accounts.policies.emailTemplates.setConfig'
  }
}

export default Email
