import UrlBuilder from '../../gigya/urlBuilder'
import client from '../../gigya/client'
import generateErrorResponse from '../../errors/generateErrorResponse'
import { removePropertyFromObjectCascading, stringToJson } from '../objectHelper'
import Options from "../options";

class Schema {
  static #ERROR_MSG_GET_CONFIG = 'Error getting schema'
  static #ERROR_MSG_SET_CONFIG = 'Error setting schema'
  static #NAMESPACE = 'accounts'
  static DATA_SCHEMA = 'dataSchema'
  static PROFILE_SCHEMA = 'profileSchema'
  static SUBSCRIPTIONS_SCHEMA = 'subscriptionsSchema'
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

  async copy(destinationSite, destinationSiteConfiguration, options) {
    let response = await this.get()
    if (response.errorCode === 0) {
      response = await this.#copySchema(destinationSite, destinationSiteConfiguration, response, options)
    }
    stringToJson(response, 'context')
    return response
  }

  async #copySchema(destinationSite, destinationSiteConfiguration, payload, options) {
    const responses = []
    const isParentSite = this.#isParentSite(destinationSiteConfiguration)
    removePropertyFromObjectCascading(payload, 'preferencesSchema') // to be processed later
    const schemaOptions = new Options(options)
    if (schemaOptions.getOptionValue(Schema.DATA_SCHEMA)) {
      responses.push(this.#copyDataSchema(destinationSite, destinationSiteConfiguration.dataCenter, payload, isParentSite))
    }
    if (schemaOptions.getOptionValue(Schema.PROFILE_SCHEMA)) {
      responses.push(this.#copyProfileSchema(destinationSite, destinationSiteConfiguration.dataCenter, payload, isParentSite))
    }
    if (schemaOptions.getOptionValue(Schema.SUBSCRIPTIONS_SCHEMA)) {
      responses.push(this.#copySubscriptionsSchema(destinationSite, destinationSiteConfiguration.dataCenter, payload, isParentSite))
    }
    return Promise.all(responses)
  }

  async #copyDataSchema(destinationSite, dataCenter, payload, isParentSite) {
    let response
    const dataSchemaPayload = JSON.parse(JSON.stringify(payload))
    removePropertyFromObjectCascading(dataSchemaPayload, Schema.PROFILE_SCHEMA)
    removePropertyFromObjectCascading(dataSchemaPayload, Schema.SUBSCRIPTIONS_SCHEMA)
    dataSchemaPayload.context = { targetApiKey: destinationSite, id: Schema.DATA_SCHEMA }
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
    removePropertyFromObjectCascading(clonePayload, Schema.DATA_SCHEMA)
    removePropertyFromObjectCascading(clonePayload, Schema.SUBSCRIPTIONS_SCHEMA)
    clonePayload.context = { targetApiKey: destinationSite, id: Schema.PROFILE_SCHEMA }
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

  async #copySubscriptionsSchema(destinationSite, dataCenter, payload, isParentSite) {
    let response
    const subscriptionsSchemaPayload = JSON.parse(JSON.stringify(payload))
    removePropertyFromObjectCascading(subscriptionsSchemaPayload, Schema.DATA_SCHEMA)
    removePropertyFromObjectCascading(subscriptionsSchemaPayload, Schema.PROFILE_SCHEMA)
    subscriptionsSchemaPayload.context = { targetApiKey: destinationSite, id: Schema.SUBSCRIPTIONS_SCHEMA }
    if (isParentSite) {
      response = await this.set(destinationSite, dataCenter, subscriptionsSchemaPayload)
    } else {
      response = await this.#copySubscriptionsSchemaToChildSite(destinationSite, dataCenter, subscriptionsSchemaPayload)
    }
    return response
  }

  async #copySubscriptionsSchemaToChildSite(destinationSite, dataCenter, payload) {
    let response
    let clonePayload = JSON.parse(JSON.stringify(payload))
    // the field 'required' cannot be copied to a child site together with other fields
    removePropertyFromObjectCascading(clonePayload.subscriptionsSchema, 'required')
    response = await this.set(destinationSite, dataCenter, clonePayload)
    if (response.errorCode === 0) {
      // the field 'required' can only be copied alone to a child site together with scope=site
      clonePayload = JSON.parse(JSON.stringify(payload))
      removePropertyFromObjectCascading(clonePayload.subscriptionsSchema, 'type')
      removePropertyFromObjectCascading(clonePayload.subscriptionsSchema, 'doubleOptIn')
      removePropertyFromObjectCascading(clonePayload.subscriptionsSchema, 'description')
      removePropertyFromObjectCascading(clonePayload.subscriptionsSchema, 'enableConditionalDoubleOptIn')
      clonePayload['scope'] = 'site'
      response = await this.set(destinationSite, dataCenter, clonePayload)
    }
    return response
  }

  #isParentSite(site) {
    return site.siteGroupConfig.members !== undefined
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
      parameters[Schema.DATA_SCHEMA] = JSON.stringify(body.dataSchema)
    }
    if (body.profileSchema) {
      parameters[Schema.PROFILE_SCHEMA] = JSON.stringify(body.profileSchema)
    }
    if (body.subscriptionsSchema) {
      parameters[Schema.SUBSCRIPTIONS_SCHEMA] = JSON.stringify(body.subscriptionsSchema)
    }
    if (body.scope) {
      parameters['scope'] = body.scope
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
