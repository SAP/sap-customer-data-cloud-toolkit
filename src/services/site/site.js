'use strict'
const client = require('../gigya/client')

class Site {
  constructor(partnerId, userKey, secret) {
    this.partnerId = partnerId
    this.userKey = userKey
    this.secret = secret
  }

  createAsync(body) {
    let url = 'https://admin.' + body.dataCenter + '.gigya.com/admin.createSite'
    let bodyWithCredentials = this.addCredentials(body)
    return client.post(url, bodyWithCredentials)
  }

  async create(body) {
    const response = await this.createAsync(body).catch(function (error) {
      return Site.generateErrorResponse(error)
    })
    return response.data
  }

  addCredentials(body) {
    let bodyWithCredentials = Object.assign({}, body)
    bodyWithCredentials.partnerID = this.partnerId
    bodyWithCredentials.userKey = this.userKey
    bodyWithCredentials.secret = this.secret
    return bodyWithCredentials
  }

  static generateErrorResponse(error) {
    let resp = { data: {} }
    resp.data.errorCode = error.code
    resp.data.errorDetails = error.details
    resp.data.errorMessage = 'Error creating site'
    resp.data.time = Date.now()
    return resp
  }
}

module.exports = Site
