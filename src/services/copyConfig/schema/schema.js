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

  async copy(destinationSite, destinationSiteConfiguration) {
    let response = await this.get()
    if (response.errorCode === 0) {
      response = await this.#copySchema(destinationSite, destinationSiteConfiguration, response)
    }
    response['id'] = 'schema'
    response['targetApiKey'] = `${destinationSite}`
    return response
  }

  async #copySchema(destinationSite, destinationSiteConfiguration, payload) {
    let response
    // the fields 'allowNull' and 'dynamicSchema' cannot be copied
    removePropertyFromObjectCascading(payload.profileSchema, 'allowNull')
    removePropertyFromObjectCascading(payload.profileSchema, 'dynamicSchema')
    if (this.#isParentSite(destinationSiteConfiguration)) {
      response = await this.set(destinationSite, destinationSiteConfiguration.dataCenter, payload)
    } else {
      response = await this.#copySchemaToChildSite(destinationSite, destinationSiteConfiguration.dataCenter, payload)
    }
    return response
  }

  async #copySchemaToChildSite(destinationSite, dataCenter, payload) {
    let response
    let clonePayload = JSON.parse(JSON.stringify(payload))
    // the field 'required' cannot be copied to a child site together with other fields
    removePropertyFromObjectCascading(clonePayload.profileSchema, 'required')
    removePropertyFromObjectCascading(clonePayload.dataSchema, 'required')
    response = await this.set(destinationSite, dataCenter, clonePayload)

    if (response.errorCode === 0) {
      // the field 'required' can only be copied alone to a child site together with scope=site
      clonePayload = JSON.parse(JSON.stringify(payload))
      removePropertyFromObjectCascading(clonePayload, 'profileSchema')
      removePropertyFromObjectCascading(clonePayload.dataSchema, 'type')
      removePropertyFromObjectCascading(clonePayload.dataSchema, 'writeAccess')
      removePropertyFromObjectCascading(clonePayload.dataSchema, 'allowNull')
      clonePayload['scope'] = 'site'
      response = await this.set(destinationSite, dataCenter, clonePayload)
    }
    return response
  }

  #isParentSite(site) {
    return site.siteGroupConfig.members !== undefined && site.siteGroupConfig.members.length > 0
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
    if (body.profileSchema) {
      parameters['profileSchema'] = JSON.stringify(body.profileSchema)
    }
    if (body.scope) {
      parameters['scope'] = JSON.stringify(body.scope)
    }
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
