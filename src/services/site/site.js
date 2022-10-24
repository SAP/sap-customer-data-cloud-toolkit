import client from '../gigya/client'

class Site {
  constructor(partnerId, userKey, secret) {
    this.partnerId = partnerId
    this.userKey = userKey
    this.secret = secret
  }

  createAsync(body) {
    const url = `https://admin.${body.dataCenter}.gigya.com/${Site.getCreateEndpoint()}`
    const bodyWithCredentials = this.#addCredentials(body)
    return client.post(url, bodyWithCredentials).catch(function (error) {
      return Site.#generateErrorResponse(error)
    })
  }

  async create(body) {
    const response = await this.createAsync(body).catch(function (error) {
      return Site.#generateErrorResponse(error)
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

  static #generateErrorResponse(error) {
    const resp = { data: {} }
    resp.data.errorCode = error.code
    resp.data.errorDetails = error.details
    resp.data.errorMessage = 'Error creating site'
    resp.data.time = Date.now()
    return resp
  }

  async delete(site, dataCenter) {
    const url = `https://admin.${dataCenter}.gigya.com/${Site.getDeleteEndpoint()}`

    // GET TOKEN
    const getDeleteTokenRes = (await client.post(url, this.#deleteSiteParameters(site))).data
    //console.log(`Site.delete(getToken) ${JSON.stringify(getDeleteTokenRes)}`)
    if (getDeleteTokenRes.errorCode !== 0) {
      return getDeleteTokenRes
    }

    // DELETE SITE
    const response = await client.post(url, this.#deleteSiteParameters(site, getDeleteTokenRes.deleteToken))
    //console.log(`Site.delete(delete) ${JSON.stringify(response)}`)
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
