import client from '../gigya/client'
import UrlBuilder from '../gigya/urlBuilder'
import generateErrorResponse from '../errors/generateErrorResponse'
import GigyaManager from '../gigya/gigyaManager'

class Email {
  static #ERROR_MSG_GET_CONFIG = 'Error getting email templates'
  static #ERROR_MSG_SET_CONFIG = 'Error setting email templates'
  static #NAMESPACE = 'accounts'

  constructor(userKey, secret) {
    this.userKey = userKey
    this.secret = secret
    this.gigyaManager = new GigyaManager(this.userKey, this.secret)
  }

  async getSiteEmails(site) {
    const dataCenterResponse = await this.gigyaManager.getDataCenterFromSite(site)
    if (dataCenterResponse.errorCode !== 0) {
      return dataCenterResponse
    }
    return await this.getSiteEmailsWithDataCenter(site, dataCenterResponse.dataCenter)
  }

  async getSiteEmailsWithDataCenter(site, dataCenter) {
    const url = UrlBuilder.buildUrl(Email.#NAMESPACE, dataCenter, Email.getGetEmailsTemplatesEndpoint())
    const res = await client.post(url, this.#getEmailsTemplatesParameters(site)).catch(function (error) {
      //console.log(`error=${error}`)
      return generateErrorResponse(error, Email.#ERROR_MSG_GET_CONFIG)
    })

    return res.data
  }

  async setSiteEmails(site, templateName, template) {
    const dataCenterResponse = await this.gigyaManager.getDataCenterFromSite(site)
    if (dataCenterResponse.errorCode !== 0) {
      return dataCenterResponse
    }

    return this.setSiteEmailsWithDataCenter(site, templateName, template, dataCenterResponse.dataCenter)
  }

  async setSiteEmailsWithDataCenter(site, templateName, template, dataCenter) {
    const url = UrlBuilder.buildUrl(Email.#NAMESPACE, dataCenter, Email.getSetEmailsTemplatesEndpoint())
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
    parameters.context = JSON.stringify({ id: 'emailTemplates', targetApiKey: apiKey })

    return parameters
  }

  #setEmailsTemplatesParameters(apiKey, templateName, template) {
    const parameters = this.#getEmailsTemplatesParameters(apiKey)
    parameters.secret = this.secret
    parameters[templateName] = JSON.stringify(template)

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
