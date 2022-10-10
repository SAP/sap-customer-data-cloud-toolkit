'use strict'
const client = require('../gigya/client')

class Site {
  constructor(partnerId, userKey, secret) {
    this.partnerId = partnerId
    this.userKey = userKey
    this.secret = secret
  }

  createAsync(body) {
    const url = `https://admin.${body.dataCenter}.gigya.com/admin.createSite`
    const bodyWithCredentials = this.addCredentials(body)
    return client.post(url, bodyWithCredentials)
  }

  async create(body) {
    const response = await this.createAsync(body).catch(function (error) {
      return Site.generateErrorResponse(error)
    })
    return response.data
  }

  addCredentials(body) {
    const bodyWithCredentials = Object.assign({}, body)
    bodyWithCredentials.partnerID = this.partnerId
    bodyWithCredentials.userKey = this.userKey
    bodyWithCredentials.secret = this.secret
    return bodyWithCredentials
  }

  static generateErrorResponse(error) {
    const resp = { data: {} }
    resp.data.errorCode = error.code
    resp.data.errorDetails = error.details
    resp.data.errorMessage = 'Error creating site'
    resp.data.time = Date.now()
    return resp
  }

  delete(apiKey) {
    return {
      apiKey: 'apiKey',
      statusCode: 200,
      errorCode: 0,
      statusReason: 'OK',
      callId: 'callId',
      apiVersion: 2,
      time: Date.now(),
    }
  }
}

module.exports = Site
