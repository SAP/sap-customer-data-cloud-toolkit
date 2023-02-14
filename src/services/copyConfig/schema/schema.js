import UrlBuilder from '../../gigya/urlBuilder'
import client from '../../gigya/client'
import generateErrorResponse from '../../errors/generateErrorResponse'
import { removePropertyFromObjectCascading, stringToJson } from '../objectHelper'

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
    stringToJson(response, 'context')
    return response
  }

  async #copySchema(destinationSite, destinationSiteConfiguration, payload) {
    const responses = []
    const isParentSite = this.#isParentSite(destinationSiteConfiguration)
    removePropertyFromObjectCascading(payload, 'subscriptionsSchema') // to be processed later
    removePropertyFromObjectCascading(payload, 'preferencesSchema')
    responses.push(this.#copyDataSchema(destinationSite, destinationSiteConfiguration.dataCenter, payload, isParentSite))
    responses.push(this.#copyProfileSchema(destinationSite, destinationSiteConfiguration.dataCenter, payload, isParentSite))
    return Promise.all(responses)
  }

  async #copyDataSchema(destinationSite, dataCenter, payload, isParentSite) {
    let response
    const dataSchemaPayload = JSON.parse(JSON.stringify(payload))
    removePropertyFromObjectCascading(dataSchemaPayload, 'profileSchema')
    dataSchemaPayload.context = { targetApiKey: destinationSite, id: 'dataSchema' }
    if (isParentSite) {
      response = await this.set(destinationSite, dataCenter, dataSchemaPayload)
    } else {
      response = await this.#copyDataSchemaToChildSite(destinationSite, dataCenter, dataSchemaPayload)
    }
    return response
  }

  async #copyProfileSchema(destinationSite, dataCenter, payload, isParentSite) {
    let response
    const clonePayload = JSON.parse(JSON.stringify(payload))
    removePropertyFromObjectCascading(clonePayload, 'dataSchema')
    clonePayload.context = { targetApiKey: destinationSite, id: 'profileSchema' }
    // the fields 'allowNull' and 'dynamicSchema' cannot be copied
    removePropertyFromObjectCascading(clonePayload.profileSchema, 'allowNull')
    removePropertyFromObjectCascading(clonePayload.profileSchema, 'dynamicSchema')
    if (isParentSite) {
      response = await this.set(destinationSite, dataCenter, clonePayload)
    } else {
      removePropertyFromObjectCascading(clonePayload.profileSchema, 'required')
      response = await this.set(destinationSite, dataCenter, clonePayload)
    }
    return response
  }

  async #copyDataSchemaToChildSite(destinationSite, dataCenter, payload) {
    let response
    let clonePayload = JSON.parse(JSON.stringify(payload))
    // the field 'required' cannot be copied to a child site together with other fields
    removePropertyFromObjectCascading(clonePayload.dataSchema, 'required')
    response = await this.set(destinationSite, dataCenter, clonePayload)

    if (response.errorCode === 0) {
      // the field 'required' can only be copied alone to a child site together with scope=site
      clonePayload = JSON.parse(JSON.stringify(payload))
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
    parameters.context = JSON.stringify({ id: 'schema', targetApiKey: apiKey })

    return parameters
  }

  #setSchemaParameters(apiKey, body) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.#credentials.userKey
    parameters.secret = this.#credentials.secret

    if (body.dataSchema) {
      parameters['dataSchema'] = JSON.stringify(body.dataSchema)
    }
    if (body.profileSchema) {
      parameters['profileSchema'] = JSON.stringify(body.profileSchema)
    }
    if (body.scope) {
      parameters['scope'] = JSON.stringify(body.scope)
    }
    if (body.context) {
      parameters['context'] = JSON.stringify(body.context)
    }
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
