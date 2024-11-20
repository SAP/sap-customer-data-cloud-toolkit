import Schema from '../../copyConfig/schema/schema'

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
