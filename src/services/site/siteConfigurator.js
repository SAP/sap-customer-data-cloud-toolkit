'use strict'
const client = require('../gigya/client')

class SiteConfigurator {
  constructor(userKey, secret, dataCenter) {
    this.userKey = userKey
    this.secret = secret
    this.dataCenter = dataCenter
  }

  connectAsync(parentApiKey, childApiKey) {
    const url = `https://admin.${this.dataCenter}.gigya.com/admin.setSiteConfig`
    const body = this.createRequestBody(parentApiKey, childApiKey)
    return client.post(url, body)
  }

  async connect(parentApiKey, childApiKey) {
    const response = await this.connectAsync(parentApiKey, childApiKey).catch(function (error) {
      return SiteConfigurator.generateErrorResponse(error)
    })
    return response.data
  }

  createRequestBody(parentApiKey, childApiKey) {
    return {
      apiKey: childApiKey,
      siteGroupOwner: parentApiKey,
      userKey: this.userKey,
      secret: this.secret,
    }
  }

  static generateErrorResponse(error) {
    return {
      data: {
        errorCode: error.code,
        errorDetails: error.details,
        errorMessage: 'Error configuring site',
        time: Date.now(),
      },
    }
  }
}

module.exports = SiteConfigurator
