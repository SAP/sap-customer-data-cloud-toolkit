/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import UrlBuilder from '../../gigya/urlBuilder.js'
import client from '../../gigya/client.js'
import generateErrorResponse, {
  ERROR_CODE_CANNOT_CHANGE_SCHEMA_FIELD_TYPE,
  ERROR_CODE_CANNOT_COPY_CHILD_THAT_HAVE_PARENT_ON_DESTINATION,
  ERROR_CODE_CANNOT_COPY_NEW_FIELD_OF_PROFILE_SCHEMA,
  ERROR_SEVERITY_WARNING,
} from '../../errors/generateErrorResponse.js'
import { removePropertyFromObjectCascading, stringToJson } from '../objectHelper.js'
import PayloadCreator from './payloadCreator.js'

class Schema {
  static #ERROR_MSG_GET_CONFIG = 'Error getting schema'
  static #ERROR_MSG_SET_CONFIG = 'Error setting schema'
  static #NAMESPACE = 'accounts'
  static DATA_SCHEMA = 'dataSchema'
  static PROFILE_SCHEMA = 'profileSchema'
  static SUBSCRIPTIONS_SCHEMA = 'subscriptionsSchema'
  static INTERNAL_SCHEMA = 'internalSchema'
  static ADDRESSES_SCHEMA = 'addressesSchema'
  static GIGYA_MAXIMUM_PAYLOAD_SIZE = 8192
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
    const url = UrlBuilder.buildUrl(Schema.#NAMESPACE, dataCenter, Schema.#getGetSchemaEndpoint(), this.#credentials.gigyaConsole)
    const res = await client.post(url, this.#getSchemaParameters(site)).catch(function (error) {
      return generateErrorResponse(error, Schema.#ERROR_MSG_GET_CONFIG)
    })
    return res.data
  }

  async #getSchemaOfSite(site, dataCenter) {
    return await this.#_get(site, dataCenter)
  }

  async set(site, dataCenter, body) {
    const url = UrlBuilder.buildUrl(Schema.#NAMESPACE, dataCenter, Schema.#getSetSchemaEndpoint(), this.#credentials.gigyaConsole)
    const res = await client.post(url, this.#setSchemaParameters(site, body)).catch(function (error) {
      return generateErrorResponse(error, Schema.#ERROR_MSG_SET_CONFIG)
    })
    return res.data
  }

  async copy(destinationSite, destinationSiteConfiguration, options) {
    let response = await this.get()
    if (response.errorCode === 0) {
      response = (await this.copySchema(destinationSite, destinationSiteConfiguration, response, options)).flat()
    }
    stringToJson(response, 'context')
    return response
  }

  async copySchema(destinationSite, destinationSiteConfiguration, payload, options) {
    const sourceSiteSchema = JSON.parse(JSON.stringify(payload))
    removePropertyFromObjectCascading(sourceSiteSchema, 'preferencesSchema') // to be processed later
    const destinationSiteSchema = await this.#getSchemaOfSite(destinationSite, destinationSiteConfiguration.dataCenter)
    if (destinationSiteSchema.errorCode === 0) {
      return this.#copyAllSchemas(destinationSiteConfiguration, destinationSite, sourceSiteSchema, destinationSiteSchema, options)
    } else {
      return [destinationSiteSchema]
    }
  }

  async #copyAllSchemas(destinationSiteConfiguration, destinationSite, sourceSiteSchema, destinationSiteSchema, options) {
    const responses = []
    const isParentSite = !this.#isChildSite(destinationSiteConfiguration, destinationSite)
    if (options.getOptionValue(Schema.DATA_SCHEMA)) {
      responses.push(
        ...this.#removeFromThePayloadDifferentTypes(
          destinationSite,
          sourceSiteSchema.dataSchema,
          destinationSiteSchema.dataSchema,
          this.#createWarningCannotChangeDataSchemaFieldType,
        ),
      )
      responses.push(...this.#removeSourceChildsThatHaveParentOnDestination(destinationSite, sourceSiteSchema.dataSchema, destinationSiteSchema.dataSchema))
      responses.push(...(await this.#copyDataSchema(destinationSite, destinationSiteConfiguration.dataCenter, sourceSiteSchema, isParentSite)))
    }
    if (options.getOptionValue(Schema.PROFILE_SCHEMA)) {
      responses.push(
        ...this.#removeFromThePayloadDifferentTypes(
          destinationSite,
          sourceSiteSchema.profileSchema,
          destinationSiteSchema.profileSchema,
          this.#createWarningCannotChangeProfileSchemaFieldType,
        ),
      )
      responses.push(...this.#removeProfileFieldsThatDoNotExistsOnDestination(destinationSite, sourceSiteSchema.profileSchema, destinationSiteSchema.profileSchema))
      responses.push(...(await this.#copyProfileSchema(destinationSite, destinationSiteConfiguration.dataCenter, sourceSiteSchema, isParentSite)))
    }
    if (options.getOptionValue(Schema.SUBSCRIPTIONS_SCHEMA)) {
      responses.push(await this.#copySubscriptionsSchema(destinationSite, destinationSiteConfiguration.dataCenter, sourceSiteSchema, isParentSite))
    }
    if (options.getOptionValue(Schema.INTERNAL_SCHEMA)) {
      responses.push(await this.#copyInternalSchema(destinationSite, destinationSiteConfiguration.dataCenter, sourceSiteSchema, isParentSite))
    }
    if (options.getOptionValue(Schema.ADDRESSES_SCHEMA)) {
      responses.push(...(await this.#copyAddressesSchema(destinationSite, destinationSiteConfiguration.dataCenter, sourceSiteSchema, isParentSite)))
    }
    return Promise.all(responses)
  }

  #removeFromThePayloadDifferentTypes(destinationSite, schemaPayload, destinationSiteSchema, errorFunction) {
    const responses = []
    for (const schemaObjKey of Object.keys(destinationSiteSchema.fields)) {
      if (this.#typeIsDifferent(schemaPayload, destinationSiteSchema, schemaObjKey) && destinationSiteSchema.fields[schemaObjKey].type !== undefined) {
        schemaPayload.fields[schemaObjKey].type = destinationSiteSchema.fields[schemaObjKey].type
        responses.push(errorFunction(destinationSite, schemaObjKey))
      }
    }
    return responses
  }

  #removeSourceChildsThatHaveParentOnDestination(destinationSite, sourceSchema, destinationSiteSchema) {
    const responses = []
    for (const dstSchemaObjKey of Object.keys(destinationSiteSchema.fields)) {
      for (const schemaObjKey of Object.keys(sourceSchema.fields)) {
        if (schemaObjKey.includes(dstSchemaObjKey + '.')) {
          delete sourceSchema.fields[schemaObjKey]
          responses.push(this.#createWarningCannotCopyChildThatHaveParentOnDestination(destinationSite, schemaObjKey))
        }
      }
    }
    return responses
  }

  #removeProfileFieldsThatDoNotExistsOnDestination(destinationSite, sourceSchema, destinationSiteSchema) {
    const responses = []
    for (const schemaObjKey of Object.keys(sourceSchema.fields)) {
      if (destinationSiteSchema.fields[schemaObjKey] === undefined) {
        delete sourceSchema.fields[schemaObjKey]
        responses.push(this.#createWarningCannotCopyNewFieldsOfProfileSchema(destinationSite, schemaObjKey))
      }
    }
    return responses
  }

  #createWarningCannotChangeDataSchemaFieldType(destinationSite, field) {
    return {
      errorCode: ERROR_CODE_CANNOT_CHANGE_SCHEMA_FIELD_TYPE,
      errorDetails: 'Data schema field already exists on the destination site with a different type.',
      errorMessage: `Partially copied data schema field "${field}"`,
      statusCode: 412,
      statusReason: 'Precondition Failed',
      time: Date.now(),
      severity: ERROR_SEVERITY_WARNING,
      context: { targetApiKey: destinationSite, id: Schema.DATA_SCHEMA },
    }
  }

  #createWarningCannotChangeProfileSchemaFieldType(destinationSite, field) {
    return {
      errorCode: ERROR_CODE_CANNOT_CHANGE_SCHEMA_FIELD_TYPE,
      errorDetails: 'Profile schema field already exists on the destination site with a different type.',
      errorMessage: `Partially copied profile schema field "${field}"`,
      statusCode: 412,
      statusReason: 'Precondition Failed',
      time: Date.now(),
      severity: ERROR_SEVERITY_WARNING,
      context: { targetApiKey: destinationSite, id: Schema.PROFILE_SCHEMA },
    }
  }

  #createWarningCannotCopyChildThatHaveParentOnDestination(destinationSite, field) {
    return {
      errorCode: ERROR_CODE_CANNOT_COPY_CHILD_THAT_HAVE_PARENT_ON_DESTINATION,
      errorDetails: "Data schema field's parent already exists on the destination site. Gigya do not supports creating childs.",
      errorMessage: `Ignored data schema field "${field}"`,
      statusCode: 412,
      statusReason: 'Precondition Failed',
      time: Date.now(),
      severity: ERROR_SEVERITY_WARNING,
      context: { targetApiKey: destinationSite, id: Schema.DATA_SCHEMA },
    }
  }

  #createWarningCannotCopyNewFieldsOfProfileSchema(destinationSite, field) {
    return {
      errorCode: ERROR_CODE_CANNOT_COPY_NEW_FIELD_OF_PROFILE_SCHEMA,
      errorDetails: "Cannot create new fields on profile schema of the destination site. It's a Gigya limitation.",
      errorMessage: `Ignored profile schema field "${field}"`,
      statusCode: 412,
      statusReason: 'Precondition Failed',
      time: Date.now(),
      severity: ERROR_SEVERITY_WARNING,
      context: { targetApiKey: destinationSite, id: Schema.PROFILE_SCHEMA },
    }
  }

  async #copyDataSchema(destinationSite, dataCenter, payload, isParentSite) {
    const responses = []
    let response
    const dataSchemaPayload = JSON.parse(JSON.stringify(payload))
    removePropertyFromObjectCascading(dataSchemaPayload, Schema.PROFILE_SCHEMA)
    removePropertyFromObjectCascading(dataSchemaPayload, Schema.SUBSCRIPTIONS_SCHEMA)
    removePropertyFromObjectCascading(dataSchemaPayload, Schema.INTERNAL_SCHEMA)
    removePropertyFromObjectCascading(dataSchemaPayload, Schema.ADDRESSES_SCHEMA)
    dataSchemaPayload.context = { targetApiKey: destinationSite, id: Schema.DATA_SCHEMA }
    removePropertyFromObjectCascading(dataSchemaPayload.dataSchema.fields, 'subType')
    const schemaPayloads = this.breakSchemaPayloadIntoSeveralSmallerIfNeeded(dataSchemaPayload, Schema.DATA_SCHEMA, Schema.GIGYA_MAXIMUM_PAYLOAD_SIZE)
    for (const schemaPayload of schemaPayloads) {
      if (isParentSite) {
        response = await this.set(destinationSite, dataCenter, schemaPayload)
      } else {
        response = await this.#copySchemaToChildSite(destinationSite, dataCenter, schemaPayload, Schema.DATA_SCHEMA)
      }
      responses.push(response)
      if (response.errorCode !== 0) {
        break
      }
    }
    return responses
  }

  #typeIsDifferent(schemaPayload, destinationSiteSchema, schemaObjKey) {
    const schemaObj = schemaPayload.fields[schemaObjKey]
    if (schemaObj) {
      return schemaObj.type !== destinationSiteSchema.fields[schemaObjKey].type
    }
    return false
  }

  async #copyProfileSchema(destinationSite, dataCenter, payload, isParentSite) {
    const responses = []
    let response
    const clonePayload = JSON.parse(JSON.stringify(payload))
    removePropertyFromObjectCascading(clonePayload, Schema.DATA_SCHEMA)
    removePropertyFromObjectCascading(clonePayload, Schema.SUBSCRIPTIONS_SCHEMA)
    removePropertyFromObjectCascading(clonePayload, Schema.INTERNAL_SCHEMA)
    removePropertyFromObjectCascading(clonePayload, Schema.ADDRESSES_SCHEMA)
    clonePayload.context = { targetApiKey: destinationSite, id: Schema.PROFILE_SCHEMA }
    Schema.removeUnsuportedProfileSchemaFields(clonePayload)
    const schemaPayloads = this.breakSchemaPayloadIntoSeveralSmallerIfNeeded(clonePayload, Schema.PROFILE_SCHEMA, Schema.GIGYA_MAXIMUM_PAYLOAD_SIZE)
    for (const schemaPayload of schemaPayloads) {
      if (isParentSite) {
        response = await this.set(destinationSite, dataCenter, schemaPayload)
      } else {
        response = await this.#copySchemaToChildSite(destinationSite, dataCenter, schemaPayload, Schema.PROFILE_SCHEMA)
      }
      responses.push(response)
      if (response.errorCode !== 0) {
        break
      }
    }
    return responses
  }

  static removeUnsuportedProfileSchemaFields(clonePayload) {
    // the fields 'allowNull' and 'dynamicSchema' cannot be copied
    removePropertyFromObjectCascading(clonePayload.profileSchema, 'allowNull')
    removePropertyFromObjectCascading(clonePayload.profileSchema, 'dynamicSchema')
    removePropertyFromObjectCascading(clonePayload.profileSchema.fields.gender, 'format')
    if (clonePayload.profileSchema.fields['lastLoginLocation.coordinates.lat']) {
      removePropertyFromObjectCascading(clonePayload.profileSchema.fields['lastLoginLocation.coordinates.lat'], 'type')
      removePropertyFromObjectCascading(clonePayload.profileSchema.fields['lastLoginLocation.coordinates.lon'], 'type')
    }
  }
  
  async #copySchemaToChildSite(destinationSite, dataCenter, payload, schemaName) {
    let response
    let clonePayload = JSON.parse(JSON.stringify(payload))
    // the field 'required' cannot be copied to a child site together with other fields
    removePropertyFromObjectCascading(clonePayload[schemaName].fields, 'required')
    response = await this.set(destinationSite, dataCenter, clonePayload)
    if (response.errorCode === 0) {
      // the field 'required' can only be copied alone to a child site together with scope=site
      clonePayload = PayloadCreator.createPayloadWithRequiredOnly(payload, schemaName)
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
    removePropertyFromObjectCascading(subscriptionsSchemaPayload, Schema.INTERNAL_SCHEMA)
    removePropertyFromObjectCascading(subscriptionsSchemaPayload, Schema.ADDRESSES_SCHEMA)
    subscriptionsSchemaPayload.context = { targetApiKey: destinationSite, id: Schema.SUBSCRIPTIONS_SCHEMA }
    if (isParentSite) {
      response = await this.set(destinationSite, dataCenter, subscriptionsSchemaPayload)
    } else {
      response = await this.#copySchemaToChildSite(destinationSite, dataCenter, subscriptionsSchemaPayload, Schema.SUBSCRIPTIONS_SCHEMA)
    }
    return response
  }

  async #copyInternalSchema(destinationSite, dataCenter, payload, isParentSite) {
    let response
    const internalSchemaPayload = JSON.parse(JSON.stringify(payload))
    removePropertyFromObjectCascading(internalSchemaPayload, Schema.DATA_SCHEMA)
    removePropertyFromObjectCascading(internalSchemaPayload, Schema.PROFILE_SCHEMA)
    removePropertyFromObjectCascading(internalSchemaPayload, Schema.SUBSCRIPTIONS_SCHEMA)
    removePropertyFromObjectCascading(internalSchemaPayload, Schema.ADDRESSES_SCHEMA)
    internalSchemaPayload.context = { targetApiKey: destinationSite, id: Schema.INTERNAL_SCHEMA }
    if (isParentSite) {
      response = await this.set(destinationSite, dataCenter, internalSchemaPayload)
    } else {
      response = await this.#copySchemaToChildSite(destinationSite, dataCenter, internalSchemaPayload, Schema.INTERNAL_SCHEMA)
    }
    return response
  }

  async #copyAddressesSchema(destinationSite, dataCenter, payload, isParentSite) {
    const responses = []
    let response
    const addressesSchemaPayload = JSON.parse(JSON.stringify(payload))
    removePropertyFromObjectCascading(addressesSchemaPayload, Schema.DATA_SCHEMA)
    removePropertyFromObjectCascading(addressesSchemaPayload, Schema.PROFILE_SCHEMA)
    removePropertyFromObjectCascading(addressesSchemaPayload, Schema.SUBSCRIPTIONS_SCHEMA)
    removePropertyFromObjectCascading(addressesSchemaPayload, Schema.INTERNAL_SCHEMA)
    addressesSchemaPayload.context = { targetApiKey: destinationSite, id: Schema.ADDRESSES_SCHEMA }
    const schemaPayloads = this.breakSchemaPayloadIntoSeveralSmallerIfNeeded(addressesSchemaPayload, Schema.ADDRESSES_SCHEMA, Schema.GIGYA_MAXIMUM_PAYLOAD_SIZE)
    for (const schemaPayload of schemaPayloads) {
      if (isParentSite) {
        response = await this.set(destinationSite, dataCenter, schemaPayload)
      } else {
        response = await this.#copySchemaToChildSite(destinationSite, dataCenter, schemaPayload, Schema.ADDRESSES_SCHEMA)
      }
      responses.push(response)
      if (response.errorCode !== 0) {
        break
      }
    }
    return responses
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
    parameters.include = this.#getIncludedSchemas()

    return parameters
  }

  #getIncludedSchemas() {
    return `${Schema.PROFILE_SCHEMA},${Schema.DATA_SCHEMA},${Schema.SUBSCRIPTIONS_SCHEMA},${Schema.INTERNAL_SCHEMA},${Schema.ADDRESSES_SCHEMA}`
  }

  #setSchemaParameters(apiKey, body) {
    const parameters = Object.assign({}, this.#getSchemaParameters(apiKey))
    delete parameters.include

    if (body.dataSchema) {
      parameters[Schema.DATA_SCHEMA] = JSON.stringify(body.dataSchema)
    }
    if (body.profileSchema) {
      parameters[Schema.PROFILE_SCHEMA] = JSON.stringify(body.profileSchema)
    }
    if (body.subscriptionsSchema) {
      parameters[Schema.SUBSCRIPTIONS_SCHEMA] = JSON.stringify(body.subscriptionsSchema)
    }
    if (body.internalSchema) {
      parameters[Schema.INTERNAL_SCHEMA] = JSON.stringify(body.internalSchema)
    }
    if (body.addressesSchema) {
      parameters[Schema.ADDRESSES_SCHEMA] = JSON.stringify(body.addressesSchema)
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

  static hasInternalSchema(response) {
    return Schema.#has(response.internalSchema)
  }

  static hasAddressesSchema(response) {
    return Schema.#has(response.addressesSchema)
  }

  static #has(property) {
    return property !== undefined && Object.keys(property).length > 0
  }

  breakSchemaPayloadIntoSeveralSmallerIfNeeded(schemaPayload, schemaType, payloadMaximumSize) {
    const payloads = []
    this.#breakSchemaPayloadIntoSeveralSmallerIfNeededRecursive(schemaPayload, schemaType, payloadMaximumSize, payloads)
    return payloads
  }

  #breakSchemaPayloadIntoSeveralSmallerIfNeededRecursive(schemaPayload, schemaType, payloadMaximumSize, payloads) {
    const payloadStr = JSON.stringify(schemaPayload)
    if (payloadStr.length <= payloadMaximumSize) {
      payloads.push(schemaPayload)
      return
    }
    const fieldsToSend = []
    let payloadSize = payloadStr.length
    let payloadClone = JSON.parse(payloadStr)

    const fields = Object.keys(payloadClone[schemaType].fields)
    const numberOfFields = fields.length
    for (let i = 0; i < numberOfFields && payloadSize > payloadMaximumSize; ++i) {
      delete payloadClone[schemaType].fields[fields[i]]
      fieldsToSend.push(fields[i])
      payloadSize = JSON.stringify(payloadClone).length
    }
    payloads.push(payloadClone)

    payloadClone = JSON.parse(payloadStr)
    payloadClone[schemaType].fields = {}
    for (const field of fieldsToSend) {
      payloadClone[schemaType].fields[field] = schemaPayload[schemaType].fields[field]
    }

    return this.#breakSchemaPayloadIntoSeveralSmallerIfNeededRecursive(payloadClone, schemaType, payloadMaximumSize, payloads)
  }
}

export default Schema
