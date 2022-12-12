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
    const dataCenter = await this.gigyaManager.getDataCenterFromSite(site)

    const url = UrlBuilder.buildUrl(Email.#NAMESPACE, dataCenter, Email.getGetEmailsTemplatesEndpoint())
    const res = await client.post(url, this.#getEmailsTemplatesParameters(site)).catch(function (error) {
      //console.log(`error=${error}`)
      return generateErrorResponse(error, Email.#ERROR_MSG_GET_CONFIG)
    })

    return res.data
  }

  async setSiteEmails(site, templates) {
    const dataCenter = await this.gigyaManager.getDataCenterFromSite(site)

    const url = UrlBuilder.buildUrl(Email.#NAMESPACE, dataCenter, Email.getSetEmailsTemplatesEndpoint())
    const res = await client.post(url, this.#setEmailsTemplatesParameters(site, templates)).catch(function (error) {
      //console.log(`error=${error}`)
      return generateErrorResponse(error, Email.#ERROR_MSG_SET_CONFIG)
    })

    return res.data
  }

  #getEmailsTemplatesParameters(apiKey) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.userKey

    return parameters
  }

  #setEmailsTemplatesParameters(apiKey, templates) {
    const parameters = Object.assign(templates, this.#getEmailsTemplatesParameters(apiKey))
    parameters.secret = this.secret

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
