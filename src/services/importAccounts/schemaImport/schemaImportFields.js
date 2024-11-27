import Schema from '../../copyConfig/schema/schema'
import { extractAndTransformSchemaFields } from './transformSchemaFields'

class SchemaImportFields {
  #credentials
  #site
  #dataCenter
  #schema
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
      return schemaResponse
    }
  }
  async exportTransformedSchemaData() {
    const result = []
    const cleanSchemaResponse = await this.exportSchemaData()
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
    delete schemaResponse.statusCode
    delete schemaResponse.statusReason
    delete schemaResponse.time
    delete schemaResponse.callId
    this.removeFieldFromSubscriptionSchema(schemaResponse)
    this.removeFieldFromAddressesSchema(schemaResponse)
    return schemaResponse
  }
  removeFieldFromAddressesSchema(schemaResponse) {
    const traverseAndRemoveEmail = (obj) => {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (key === 'metadata') {
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
          if (key === 'email') {
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
// [
//   { id: 'data', name: 'data', value: true, branches: [] },
//   { id: 'data.loyalty', name: 'loyalty', value: true, branches: [],switchId },
//   { id: 'data.loyalty.rewardAmount', name: 'data.loyalty.rewardAmount', value: true, branches: [] },
//   { id: 'data.loyalty.loyaltyStatus', name: 'newsletter.commercial', value: true, branches: [] },
//   { id: 'internal', name: 'internal', value: true, branches: [] },
//   { id: 'addresses', name: 'addresses', value: true, branches: [] },
//   { id: 'profile', name: 'profile', value: true, branches: [] },
//   { id: 'other', name: 'other', value: true, branches: [] },
// ];
