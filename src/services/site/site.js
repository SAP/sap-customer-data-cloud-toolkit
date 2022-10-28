import client from '../gigya/client'
import generateErrorResponse from './generateErrorResponse'

class Site {
  static #ERROR_MSG_CREATE = 'Error creating site'
  static #ERROR_MSG_DELETE = 'Error deleting site'

  constructor(partnerId, userKey, secret) {
    this.partnerId = partnerId
    this.userKey = userKey
    this.secret = secret
  }

  createAsync(body) {
    const url = `https://admin.${body.dataCenter}.gigya.com/${Site.getCreateEndpoint()}`
    const bodyWithCredentials = this.#addCredentials(body)
    return client.post(url, bodyWithCredentials).catch(function (error) {
      return generateErrorResponse(error, Site.#ERROR_MSG_CREATE)
    })
  }

  async create(body) {
    const response = await this.createAsync(body).catch(function (error) {
      return generateErrorResponse(error, Site.#ERROR_MSG_CREATE)
    })
    return response.data
  }

  static getCreateEndpoint() {
    return 'admin.createSite'
  }

  static getDeleteEndpoint() {
    return 'admin.deleteSite'
  }

  #addCredentials(body) {
    const bodyWithCredentials = Object.assign({}, body)
    bodyWithCredentials.partnerID = this.partnerId
    bodyWithCredentials.userKey = this.userKey
    bodyWithCredentials.secret = this.secret
    return bodyWithCredentials
  }

  async delete(site, dataCenter) {
    const url = `https://admin.${dataCenter}.gigya.com/${Site.getDeleteEndpoint()}`

    // GET TOKEN
    const getDeleteTokenRes = await client.post(url, this.#deleteSiteParameters(site)).catch(function (error) {
      return generateErrorResponse(error, Site.#ERROR_MSG_DELETE)
    })
    if (getDeleteTokenRes.data.errorCode !== 0) {
      return getDeleteTokenRes.data
    }

    // DELETE SITE
    const response = await client.post(url, this.#deleteSiteParameters(site, getDeleteTokenRes.data.deleteToken)).catch(function (error) {
      return generateErrorResponse(error, Site.#ERROR_MSG_DELETE)
    })
    return response.data
  }

  #deleteSiteParameters(apiKey, deleteToken) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.userKey
    parameters.secret = this.secret

    if (deleteToken !== undefined) {
      parameters.deleteToken = deleteToken
    }
    return parameters
  }
}

export default Site
