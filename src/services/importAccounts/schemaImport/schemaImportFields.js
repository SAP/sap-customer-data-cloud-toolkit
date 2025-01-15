/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import Schema from '../../copyConfig/schema/schema'
import { extractAndTransformSchemaFields } from './transformSchemaFields'

class SchemaImportFields {
  #credentials
  #site
  #dataCenter
  #schema
  static METADATA = 'metadata'
  static EMAIL = 'email'
  constructor(credentials, site, dataCenter) {
    this.#credentials = credentials
    this.#site = site
    this.#dataCenter = dataCenter
    this.#schema = new Schema(credentials, site, dataCenter)
  }
  async exportSchemaData() {
    const schemaResponse = await this.getSchema()
    if (schemaResponse.errorCode === 0) {
      this.cleanSchemaData(schemaResponse)
    }
    return schemaResponse
  }
  async exportTransformedSchemaData() {
    const result = []
    const cleanSchemaResponse = await this.exportSchemaData()

    result.push(...extractAndTransformSchemaFields(cleanSchemaResponse))
    return result
  }
  async exportLiteSchemaData() {
    const result = []
    const schemaResponse = await this.getSchema()
    const cleanSchemaResponse = this.cleanLiteSchemaData(schemaResponse)

    result.push(...extractAndTransformSchemaFields(cleanSchemaResponse))
    return result
  }
  async getSchema() {
    return this.#schema.get()
  }
  cleanSchemaData(schemaResponse) {
    delete schemaResponse.apiVersion
    delete schemaResponse.context
    delete schemaResponse.errorCode

    const unwantedFields = ['allowNull', 'writeAccess', 'encrypt', 'tags', 'subType', 'description', 'enableConditionalDoubleOptIn', 'relatedConsentIds']

    function cleanFields(fields) {
      for (const key in fields) {
        if (fields.hasOwnProperty(key)) {
          unwantedFields.forEach((field) => delete fields[key][field])
          if (fields[key].fields) {
            cleanFields(fields[key].fields)
          }
          if (fields[key].metadata) {
            delete fields[key].metadata
          }
        }
      }
    }

    function removeEmail(fields) {
      for (const key in fields) {
        if (fields.hasOwnProperty(key)) {
          if (fields[key].email) {
            delete fields[key].email
          }
          if (fields[key].fields) {
            removeEmail(fields[key].fields)
          }
        }
      }
    }

    cleanFields(schemaResponse.profileSchema.fields)
    cleanFields(schemaResponse.dataSchema.fields)
    cleanFields(schemaResponse.internalSchema.fields)
    cleanFields(schemaResponse.addressesSchema.fields)
    cleanFields(schemaResponse.addressesSchema.fields.metadata)
    cleanFields(schemaResponse.subscriptionsSchema.fields)

    removeEmail(schemaResponse.subscriptionsSchema.fields)
  }
  cleanLiteSchemaData(schemaResponse) {
    delete schemaResponse.apiVersion
    delete schemaResponse.context
    delete schemaResponse.errorCode
    delete schemaResponse.statusCode
    delete schemaResponse.statusReason
    delete schemaResponse.time
    delete schemaResponse.callId
    this.removeFieldFromSubscriptionSchema(schemaResponse)
    this.removeFieldFromAddressesSchema(schemaResponse)
    delete schemaResponse.addressesSchema
    delete schemaResponse.internalSchema
    return schemaResponse
  }
  removeFieldFromAddressesSchema(schemaResponse) {
    const traverseAndRemoveEmail = (obj) => {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (key === SchemaImportFields.METADATA) {
            delete obj[key]
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            traverseAndRemoveEmail(obj[key])
          }
        }
      }
    }

    traverseAndRemoveEmail(schemaResponse)
    return schemaResponse
  }
  removeFieldFromSubscriptionSchema(schemaResponse) {
    const traverseAndRemoveEmail = (obj) => {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (key === SchemaImportFields.EMAIL) {
            delete obj[key]
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            traverseAndRemoveEmail(obj[key])
          }
        }
      }
    }

    traverseAndRemoveEmail(schemaResponse)
    return schemaResponse
  }
}
export default SchemaImportFields
