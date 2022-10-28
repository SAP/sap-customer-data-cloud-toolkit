import client from '../gigya/client'
import generateErrorResponse from './error'

class SiteConfigurator {
  static #ERROR_MSG_CONFIG = 'Error configuring site'

  constructor(userKey, secret, dataCenter) {
    this.userKey = userKey
    this.secret = secret
    this.dataCenter = dataCenter
  }

  connectAsync(parentApiKey, childApiKey) {
    const url = `https://admin.${this.dataCenter}.gigya.com/${SiteConfigurator.getSetEndpoint()}`
    const body = this.#createRequestBody(parentApiKey, childApiKey)
    return client.post(url, body).catch(function (error) {
      return generateErrorResponse(error, SiteConfigurator.#ERROR_MSG_CONFIG)
    })
  }

  async connect(parentApiKey, childApiKey) {
    // console.log(`Connecting site ${childApiKey} to ${parentApiKey}`)
    const response = await this.connectAsync(parentApiKey, childApiKey).catch(function (error) {
      return generateErrorResponse(error, SiteConfigurator.#ERROR_MSG_CONFIG)
    })
    return response.data
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

  async getSiteConfig(apiKey) {
    const url = 'https://admin.us1.gigya.com/admin.getSiteConfig'

    const response = await client.post(url, this.#siteConfigParameters(apiKey, this.userKey, this.secret)).catch(function (error) {
      return generateErrorResponse(error, SiteConfigurator.#ERROR_MSG_CONFIG)
    })
    return response.data
  }

  #siteConfigParameters(apiKey, userKey, secret) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = userKey
    parameters.secret = secret
    parameters.siteConfigParameters = 'true'
    return parameters
  }
}

export default SiteConfigurator
