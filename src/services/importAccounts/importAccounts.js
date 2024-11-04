import ConsentStatement from '../copyConfig/consent/consentStatement'
import Schema from '../copyConfig/schema/schema'
import { exportToCSV } from '../exportToCsv/exportToCsv'
//for profile e data, internal e address só é necessario os headers não e preciso o conteudo
//cdc-toolkit-data-workbench-utility
class ImportAccounts {
  #credentials
  #site
  #dataCenter
  #schema
  #consent
  constructor(credentials, site, dataCenter) {
    this.#credentials = credentials
    this.#site = site
    this.#dataCenter = dataCenter
    this.#schema = new Schema(credentials, site, dataCenter)
    this.#consent = new ConsentStatement(credentials, site, dataCenter)
  }

  async importAccountToConfigTree() {
    const result = []
    const schemaData = await this.getSchema()
    const consent = await this.getConsent()
    if (schemaData.errorCode === 0 && schemaData.errorCode === 0) {
      const cleanSchemaData = this.cleanSchemaData(schemaData)
      const cleanConsentData = this.getConsentData(consent)

      const combinedData = { ...cleanSchemaData, ...cleanConsentData }
      result.push(...this.extractAndTransformFields(combinedData))
      return result
    }
  }
  extractAndTransformFields(obj) {
    const fieldsTransformed = []
    Object.entries(obj).forEach(([key, value]) => {
      if (value && typeof value === 'object' && value.fields) {
        const transformed = {
          id: key,
          name: key.replace('Schema', ''),
          value: false,
          branches: this.transformSchema(value.fields, key),
        }
        fieldsTransformed.push(transformed)
      }
      if (key === 'preferences' && value && typeof value === 'object') {
        const transformed = {
          id: key,
          name: 'ConsentStatements',
          value: false,
          branches: this.transformSchema(value, key),
        }
        fieldsTransformed.push(transformed)
      }
    })

    return fieldsTransformed
  }
  hasNestedObject(field) {
    for (let key in field) {
      if (typeof field[key] === 'object' && field[key] !== null) {
        return true
      }
    }
    return false
  }

  transformSchema(fields, parentKey) {
    const transformedSchema = []

    for (let key in fields) {
      if (fields.hasOwnProperty(key)) {
        const fieldDetail = fields[key]
        let branches = []

        if (parentKey === 'subscriptionsSchema') {
          const transformed = {
            id: key,
            name: key,
            value: false,
          }
          transformedSchema.push(transformed)
          continue
        }
        if (parentKey === 'preferences') {
          const transformed = {
            id: key,
            name: key,
            value: false,
          }
          transformedSchema.push(transformed)
          continue
        }

        if (this.hasNestedObject(fieldDetail)) {
          branches = this.transformSchema(fieldDetail, parentKey)
          if (branches.length > 0) {
            const transformed = {
              id: key,
              name: key,
              value: false,
              branches,
            }
            transformedSchema.push(transformed)
            continue
          }
        }

        const transformed = {
          id: key,
          name: key,
          value: false,
        }
        transformedSchema.push(transformed)
      }
    }

    return transformedSchema
  }
  getOptionsFromTree(items) {
    let ids = []
    items.forEach((item) => {
      if (item.value === true) {
        ids.push(item.id)
      }
      if (item.branches && item.branches.length > 0) {
        ids = ids.concat(this.getOptionsFromTree(item.branches))
      }
    })

    return ids
  }
  getValueByKey(obj, key) {
    return obj[key]
  }
  findValueByKeyInCombinedData(data, key) {
    if (data == null || typeof data !== 'object') {
      return null
    }

    if (data.hasOwnProperty(key)) {
      return data[key]
    }

    for (let prop in data) {
      if (data.hasOwnProperty(prop)) {
        let result = this.findValueByKeyInCombinedData(data[prop], key)
        if (result !== null) {
          return result
        }
      }
    }

    return null
  }
  async exportDataToCsv(items) {
    const schemaData = await this.getSchema()
    const consentData = await this.getConsent()
    if (schemaData.errorCode === 0 && consentData.errorCode === 0) {
      const cleanSchemaData = this.cleanSchemaData(schemaData)
      const cleanConsentData = this.getConsentData(consentData)
      const combinedData = { ...cleanSchemaData, ...cleanConsentData }
      exportToCSV(items, combinedData)
    }
  }

  cleanSchemaData(schemaResponse) {
    delete schemaResponse.apiVersion
    delete schemaResponse.context
    delete schemaResponse.errorCode
    delete schemaResponse.statusCode
    delete schemaResponse.statusReason
    delete schemaResponse.time
    delete schemaResponse.callId
    return schemaResponse
  }
  getConsentData(consentResponse) {
    delete consentResponse.apiVersion
    delete consentResponse.context
    delete consentResponse.errorCode
    delete consentResponse.statusCode
    delete consentResponse.statusReason
    delete consentResponse.time
    delete consentResponse.callId
    return consentResponse
  }

  async getSchema() {
    return this.#schema.get()
  }
  async getConsent() {
    return this.#consent.get()
  }
}
export default ImportAccounts
