import client from '../gigya/client'
import UrlBuilder from '../gigya/urlBuilder'
import SiteConfigurator from '../configurator/siteConfigurator'
import generateErrorResponse from '../errors/generateErrorResponse'

class Email {
  static #ERROR_MSG_CONFIG = 'Error retriving email templates'
  static #NAMESPACE = 'accounts'

  constructor(userKey, secret) {
    this.userKey = userKey
    this.secret = secret
  }

  async getSiteEmails(site) {
    const siteConfigurator = new SiteConfigurator(this.userKey, this.secret, 'us1')
    const getConfigRes = await siteConfigurator.getSiteConfig(site)
    if (getConfigRes.errorCode !== 0) {
      return getConfigRes
    }

    const url = UrlBuilder.buildUrl(Email.#NAMESPACE, getConfigRes.dataCenter, Email.getGetEmailsTemplatesEndpoint())
    const res = await client.post(url, this.#getEmailsTemplatesParameters(site)).catch(function (error) {
      //console.log(`error=${error}`)
      return generateErrorResponse(error, Email.#ERROR_MSG_CONFIG)
    })

    return res.data
  }

  #getEmailsTemplatesParameters(apiKey) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.userKey
    parameters.secret = this.secret

    return parameters
  }

  static getGetEmailsTemplatesEndpoint() {
    return '/accounts.policies.emailTemplates.getConfig'
  }
}

export default Email
