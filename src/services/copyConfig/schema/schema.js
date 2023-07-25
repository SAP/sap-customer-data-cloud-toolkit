/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import UrlBuilder from '../../gigya/urlBuilder'
import client from '../../gigya/client'
import generateErrorResponse, { ERROR_CODE_CANNOT_CHANGE_DATA_SCHEMA_FIELD_TYPE, ERROR_SEVERITY_WARNING } from '../../errors/generateErrorResponse'
import { removePropertyFromObjectCascading, stringToJson } from '../objectHelper'

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
    return await this.#_get(this.#site, this.#dataCenter)
  }

  async #_get(site, dataCenter) {
    const url = UrlBuilder.buildUrl(Schema.#NAMESPACE, dataCenter, Schema.#getGetSchemaEndpoint())
    const res = await client.post(url, this.#getSchemaParameters(site)).catch(function (error) {
      return generateErrorResponse(error, Schema.#ERROR_MSG_GET_CONFIG)
    })
    return res.data
  }

  async #getSchemaOfSite(site, dataCenter) {
    return await this.#_get(site, dataCenter)
  }

  async set(site, dataCenter, body) {
    const url = UrlBuilder.buildUrl(Schema.#NAMESPACE, dataCenter, Schema.#getSetSchemaEndpoint())
    const res = await client.post(url, this.#setSchemaParameters(site, body)).catch(function (error) {
      return generateErrorResponse(error, Schema.#ERROR_MSG_SET_CONFIG)
    })
    return res.data
  }

  async copy(destinationSite, destinationSiteConfiguration, options) {
    let response = await this.get()
    if (response.errorCode === 0) {
      response = (await this.#copySchema(destinationSite, destinationSiteConfiguration, response, options)).flat()
    }
    stringToJson(response, 'context')
    return response
  }

  async #copySchema(destinationSite, destinationSiteConfiguration, payload, options) {
    const responses = []
    const isParentSite = !this.#isChildSite(destinationSiteConfiguration, destinationSite)
    removePropertyFromObjectCascading(payload, 'preferencesSchema') // to be processed later
    if (options.getOptionValue(Schema.DATA_SCHEMA)) {
      responses.push(this.#copyDataSchema(destinationSite, destinationSiteConfiguration.dataCenter, payload, isParentSite))
    }
    if (options.getOptionValue(Schema.PROFILE_SCHEMA)) {
      responses.push(this.#copyProfileSchema(destinationSite, destinationSiteConfiguration.dataCenter, payload, isParentSite))
    }
    if (options.getOptionValue(Schema.SUBSCRIPTIONS_SCHEMA)) {
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
    const responses = await this.#removeFromThePayloadObjectsWithDifferentTypes(destinationSite, dataCenter, dataSchemaPayload)
    if (responses.length === 0 || responses[0].errorCode === ERROR_CODE_CANNOT_CHANGE_DATA_SCHEMA_FIELD_TYPE) {
      removePropertyFromObjectCascading(dataSchemaPayload.dataSchema.fields, 'subType')
      if (isParentSite) {
        response = await this.set(destinationSite, dataCenter, dataSchemaPayload)
      } else {
        response = await this.#copyDataSchemaToChildSite(destinationSite, dataCenter, dataSchemaPayload)
      }
      responses.unshift(response)
    }
    return responses
  }

  async #removeFromThePayloadObjectsWithDifferentTypes(destinationSite, dataCenter, dataSchemaPayload) {
    const responses = []
    const destinationSiteSchema = await this.#getSchemaOfSite(destinationSite, dataCenter)
    if (destinationSiteSchema.errorCode === 0) {
      for (const schemaObjKey of Object.keys(destinationSiteSchema.dataSchema.fields)) {
        if (this.#typeIsDifferent(dataSchemaPayload, destinationSiteSchema, schemaObjKey)) {
          delete dataSchemaPayload.dataSchema.fields[schemaObjKey].type
          responses.push({
            errorCode: ERROR_CODE_CANNOT_CHANGE_DATA_SCHEMA_FIELD_TYPE,
            errorDetails: "Data schema field already exists on the destination site with a different type.",
            errorMessage: `Partially copied data schema field "${schemaObjKey}"`,
            statusCode: 412,
            statusReason: 'Precondition Failed',
            time: Date.now(),
            severity: ERROR_SEVERITY_WARNING,
            context: { targetApiKey: destinationSite, id: Schema.DATA_SCHEMA },
          })
        }
      }
    } else {
      responses.push(destinationSiteSchema)
    }
    return responses
  }

  #typeIsDifferent(dataSchemaPayload, destinationSiteSchema, schemaObjKey) {
    const schemaObj = dataSchemaPayload.dataSchema.fields[schemaObjKey]
    if (schemaObj) {
      return schemaObj.type !== destinationSiteSchema.dataSchema.fields[schemaObjKey].type
    }
    return false
  }

  async #copyProfileSchema(destinationSite, dataCenter, payload, isParentSite) {
    let response
    const clonePayload = JSON.parse(JSON.stringify(payload))
    removePropertyFromObjectCascading(clonePayload, Schema.DATA_SCHEMA)
    removePropertyFromObjectCascading(clonePayload, Schema.SUBSCRIPTIONS_SCHEMA)
    clonePayload.context = { targetApiKey: destinationSite, id: Schema.PROFILE_SCHEMA }
    Schema.#removeUnsuportedProfileSchemaFields(clonePayload)
    if (isParentSite) {
      response = await this.set(destinationSite, dataCenter, clonePayload)
    } else {
      removePropertyFromObjectCascading(clonePayload.profileSchema, 'required')
      response = await this.set(destinationSite, dataCenter, clonePayload)
    }
    return response
  }

  static #removeUnsuportedProfileSchemaFields(clonePayload) {
    // the fields 'allowNull' and 'dynamicSchema' cannot be copied
    removePropertyFromObjectCascading(clonePayload.profileSchema, 'allowNull')
    removePropertyFromObjectCascading(clonePayload.profileSchema, 'dynamicSchema')
    removePropertyFromObjectCascading(clonePayload.profileSchema.fields.gender, 'format')
    if (clonePayload.profileSchema.fields['lastLoginLocation.coordinates.lat']) {
      removePropertyFromObjectCascading(clonePayload.profileSchema.fields['lastLoginLocation.coordinates.lat'], 'type')
      removePropertyFromObjectCascading(clonePayload.profileSchema.fields['lastLoginLocation.coordinates.lon'], 'type')
    }
  }

  async #copyDataSchemaToChildSite(destinationSite, dataCenter, payload) {
    let response
    let clonePayload = JSON.parse(JSON.stringify(payload))
    // the field 'required' cannot be copied to a child site together with other fields
    removePropertyFromObjectCascading(clonePayload.dataSchema.fields, 'required')
    response = await this.set(destinationSite, dataCenter, clonePayload)
    if (response.errorCode === 0) {
      // the field 'required' can only be copied alone to a child site together with scope=site
      clonePayload = this.#createDataPayloadWithRequiredOnly(payload, 'dataSchema')
      clonePayload['scope'] = 'site'
      response = await this.set(destinationSite, dataCenter, clonePayload)
    }
    return response
  }

  #createDataPayloadWithRequiredOnly(payload, schemaName) {
    const clonePayload = JSON.parse(JSON.stringify(payload))
    for(const field of Object.keys(clonePayload[schemaName].fields)) {
      clonePayload[schemaName].fields[field] = { 'required' : clonePayload[schemaName].fields[field].required }
    }
    return clonePayload
  }

  #createSubscriptionsPayloadWithRequiredOnly(payload, schemaName) {
    const clonePayload = JSON.parse(JSON.stringify(payload))
    for(const subscription of Object.keys(clonePayload[schemaName].fields)) {
      for(const field of Object.keys(clonePayload[schemaName].fields[subscription])) {
        clonePayload[schemaName].fields[subscription][field] = {'required': clonePayload[schemaName].fields[subscription][field].required}
      }
    }
    return clonePayload
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
      clonePayload = this.#createSubscriptionsPayloadWithRequiredOnly(payload, 'subscriptionsSchema')
      clonePayload['scope'] = 'site'
      response = await this.set(destinationSite, dataCenter, clonePayload)
    }
    return response
  }

  #isChildSite(siteInfo, siteApiKey) {
    return siteInfo.siteGroupOwner !== undefined && siteInfo.siteGroupOwner !== siteApiKey
  }

  #getSchemaParameters(apiKey) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.#credentials.userKey
    parameters.secret = this.#credentials.secret
    parameters.context = JSON.stringify({ id: 'schema', targetApiKey: apiKey })

    return parameters
  }

  #setSchemaParameters(apiKey, body) {
    const parameters = Object.assign({}, this.#getSchemaParameters(apiKey))

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

  static #getGetSchemaEndpoint() {
    return `${Schema.#NAMESPACE}.getSchema`
  }

  static #getSetSchemaEndpoint() {
    return `${Schema.#NAMESPACE}.setSchema`
  }

  static hasDataSchema(response) {
    return Schema.#has(response.dataSchema)
  }

  static hasProfileSchema(response) {
    return Schema.#has(response.profileSchema)
  }

  static hasSubscriptionsSchema(response) {
    return Schema.#has(response.subscriptionsSchema)
  }

  static #has(property) {
    return property !== undefined && Object.keys(property).length > 0
  }
}

export default Schema
