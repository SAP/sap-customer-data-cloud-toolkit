import UrlBuilder from '../../gigya/urlBuilder'
import client from '../../gigya/client'
import generateErrorResponse from '../../errors/generateErrorResponse'
import { removePropertyFromObjectCascading } from '../objectHelper'

class Schema {
  static #ERROR_MSG_GET_CONFIG = 'Error getting schema'
  static #ERROR_MSG_SET_CONFIG = 'Error setting schema'
  static #NAMESPACE = 'accounts'
  #credentials
  #site
  #dataCenter

  constructor(credentials, site, dataCenter) {
    this.#credentials = credentials
    this.#site = site
    this.#dataCenter = dataCenter
  }

  async get() {
    const url = UrlBuilder.buildUrl(Schema.#NAMESPACE, this.#dataCenter, Schema.getGetSchemaEndpoint())
    const res = await client.post(url, this.#getSchemaParameters(this.#site)).catch(function (error) {
      return generateErrorResponse(error, Schema.#ERROR_MSG_GET_CONFIG)
    })
    return res.data
  }

  async set(site, dataCenter, body) {
    const url = UrlBuilder.buildUrl(Schema.#NAMESPACE, dataCenter, Schema.getSetSchemaEndpoint())
    const res = await client.post(url, this.#setSchemaParameters(site, body)).catch(function (error) {
      return generateErrorResponse(error, Schema.#ERROR_MSG_SET_CONFIG)
    })
    return res.data
  }

  async copy(destinationSite, destinationSiteDataCenter) {
    let response = await this.get()
    if (response.errorCode === 0) {
      removePropertyFromObjectCascading(response.profileSchema, 'allowNull')
      // removePropertyFromObjectCascading(response.profileSchema, 'dynamicSchema')
      response = await this.set(destinationSite, destinationSiteDataCenter, response)
    }
    response['id'] = `${this.constructor.name};${destinationSite}`
    return response.errorCode === 0 ? Promise.resolve(response) : Promise.reject(response)
  }

  #getSchemaParameters(apiKey) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.#credentials.userKey

    return parameters
  }

  #setSchemaParameters(apiKey, body) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.#credentials.userKey
    parameters.secret = this.#credentials.secret
    parameters['dataSchema'] = JSON.stringify(body.dataSchema)
    parameters['profileSchema'] = JSON.stringify(body.profileSchema)
    // The following schemas should not be handled now
    //parameters["subscriptionsSchema"] = JSON.stringify(body.subscriptionsSchema)
    //parameters["preferencesSchema"] = JSON.stringify(body.preferencesSchema)
    return parameters
  }

  static getGetSchemaEndpoint() {
    return `${Schema.#NAMESPACE}.getSchema`
  }

  static getSetSchemaEndpoint() {
    return `${Schema.#NAMESPACE}.setSchema`
  }
}

export default Schema
