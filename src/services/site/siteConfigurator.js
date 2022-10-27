import client from '../gigya/client'

class SiteConfigurator {
  constructor(userKey, secret, dataCenter) {
    this.userKey = userKey
    this.secret = secret
    this.dataCenter = dataCenter
  }

  connectAsync(parentApiKey, childApiKey) {
    const url = `https://admin.${this.dataCenter}.gigya.com/${SiteConfigurator.getSetEndpoint()}`
    const body = this.#createRequestBody(parentApiKey, childApiKey)
    return client.post(url, body)
  }

  async connect(parentApiKey, childApiKey) {
    // console.log(`Connecting site ${childApiKey} to ${parentApiKey}`)
    const response = await this.connectAsync(parentApiKey, childApiKey).catch(function (error) {
      return SiteConfigurator.#generateErrorResponse(error)
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

  static #generateErrorResponse(error) {
    return {
      data: {
        errorCode: error.code,
        errorDetails: error.details,
        errorMessage: 'Error configuring site',
        time: Date.now(),
      },
    }
  }

  async getSiteConfig(apiKey) {
    const url = 'https://admin.us1.gigya.com/admin.getSiteConfig'

    return (await client.post(url, this.#siteConfigParameters(apiKey, this.userKey, this.secret))).data
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
