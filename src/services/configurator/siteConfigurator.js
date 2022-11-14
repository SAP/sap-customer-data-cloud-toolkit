import client from '../gigya/client'
import generateErrorResponse from '../errors/generateErrorResponse'

class SiteConfigurator {
  static #ERROR_MSG_CONFIG = 'Error configuring site'

  constructor(userKey, secret, dataCenter) {
    this.userKey = userKey
    this.secret = secret
    this.dataCenter = dataCenter
  }

  async connect(parentApiKey, childApiKey) {
    const url = this.#getUrl(SiteConfigurator.getSetEndpoint())
    const body = this.#createRequestBody(parentApiKey, childApiKey)
    return client.post(url, body).catch(function (error) {
      console.log(`error=${error}`)
      return generateErrorResponse(error, SiteConfigurator.#ERROR_MSG_CONFIG)
    })
  }

  #createRequestBody(parentApiKey, childApiKey) {
    return {
      apiKey: childApiKey,
      siteGroupOwner: parentApiKey,
      userKey: this.userKey,
      secret: this.secret,
    }
  }

  static getSetEndpoint() {
    return 'admin.setSiteConfig'
  }

  static getGetEndpoint() {
    return 'admin.getSiteConfig'
  }

  async getSiteConfig(apiKey) {
    const url = this.#getUrl(SiteConfigurator.getGetEndpoint())

    const response = await client.post(url, this.#siteConfigParameters(apiKey, this.userKey, this.secret)).catch(function (error) {
      console.log(`error=${error}`)
      return generateErrorResponse(error, SiteConfigurator.#ERROR_MSG_CONFIG)
    })
    return response.data
  }

  #siteConfigParameters(apiKey, userKey, secret) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = userKey
    parameters.secret = secret
    parameters.includeSiteGroupConfig = true
    return parameters
  }

  #getUrl(endpoint) {
    const protocol = 'https'
    const namespace = 'admin'
    const domain = 'gigya.com'
    return `${protocol}://${namespace}.${this.dataCenter}.${domain}/${endpoint}`
  }
}

export default SiteConfigurator
