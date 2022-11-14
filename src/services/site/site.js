import client from '../gigya/client'
import generateErrorResponse from '../errors/generateErrorResponse'

class Site {
  static #ERROR_MSG_CREATE = 'Error creating site'
  static #ERROR_MSG_DELETE = 'Error deleting site'

  constructor(partnerId, userKey, secret) {
    this.partnerId = partnerId
    this.userKey = userKey
    this.secret = secret
  }

  async create(body) {
    const url = this.#getUrl(body.dataCenter, Site.getCreateEndpoint())
    const bodyWithCredentials = this.#addCredentials(body)
    return client.post(url, bodyWithCredentials).catch(function (error) {
      return generateErrorResponse(error, Site.#ERROR_MSG_CREATE)
    })
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
    const url = this.#getUrl(dataCenter, Site.getDeleteEndpoint())

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

  #getUrl(dataCenter, endpoint) {
    const protocol = 'https'
    const namespace = 'admin'
    const domain = 'gigya.com'
    return `${protocol}://${namespace}.${dataCenter}.${domain}/${endpoint}`
  }
}

export default Site
