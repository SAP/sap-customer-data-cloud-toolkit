'use strict'
const client = require('../gigya/client')

class SiteConfigurator {
  constructor(userKey, secret, dataCenter) {
    this.userKey = userKey
    this.secret = secret
    this.dataCenter = dataCenter
  }

  connectAsync(parentApiKey, childApiKey) {
    const url = 'https://admin.' + this.dataCenter + '.gigya.com/admin.setSiteConfig'
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
    const body = {}
    body.apiKey = childApiKey
    body.siteGroupOwner = parentApiKey
    body.userKey = this.userKey
    body.secret = this.secret
    return body
  }

  static generateErrorResponse(error) {
    const resp = { data: {} }
    resp.data.errorCode = error.code
    resp.data.errorDetails = error.details
    resp.data.errorMessage = 'Error configuring site'
    resp.data.time = Date.now()
    return resp
  }
}

module.exports = SiteConfigurator
