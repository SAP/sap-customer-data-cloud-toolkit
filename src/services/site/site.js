const client = require('../gigya/client')

class Site {
  constructor(partnerId, userKey, secret) {
    this.partnerId = partnerId
    this.userKey = userKey
    this.secret = secret
  }

  createAsync(body) {
    const url = `https://admin.${body.dataCenter}.gigya.com/${Site.getEndpoint()}`
    const bodyWithCredentials = this.addCredentials(body)
    return client.post(url, bodyWithCredentials)
  }

  async create(body) {
    const response = await this.createAsync(body).catch(function (error) {
      return Site.generateErrorResponse(error)
    })
    return response.data
  }

  static getEndpoint() {
    return 'admin.createSite'
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

  async executeDelete(site, dataCenter) {
    const url = `https://admin.${dataCenter}.gigya.com/admin.deleteSite`

    // GET TOKEN
    const getDeleteTokenRes = (await client.post(url, this.deleteSiteParameters(site))).data
    if (getDeleteTokenRes.errorCode !== 0) {
      return getDeleteTokenRes
    }

    // DELETE SITE
    return (await client.post(url, this.deleteSiteParameters(site, getDeleteTokenRes.deleteToken))).data
  }

  deleteSiteParameters(apiKey, deleteToken) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.userKey
    parameters.secret = this.secret

    if (deleteToken !== undefined) {
      parameters.deleteToken = deleteToken
    }
    return parameters
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
