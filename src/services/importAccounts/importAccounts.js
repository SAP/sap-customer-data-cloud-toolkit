import Topic from '../copyConfig/communication/topic'
import ConsentStatement from '../copyConfig/consent/consentStatement'
import Schema from '../copyConfig/schema/schema'
import { exportToCSV } from '../exportToCsv/exportToCsv'
import TopicImportFields from './communicationImport/communicationImport'
import PreferencesImportFields from './preferencesImport/preferencesImport'
import SchemaImportFields from './schemaImport/schemaImportFields'
import { extractAndTransformFields } from './utils'
//for profile e data, internal e address só é necessario os headers não e preciso o conteudo
//cdc-toolkit-data-workbench-utility
class ImportAccounts {
  #credentials
  #site
  #dataCenter
  #schemaFields
  #consent
  #topic
  #preferences
  constructor(credentials, site, dataCenter) {
    this.#credentials = credentials
    this.#site = site
    this.#dataCenter = dataCenter
    this.#consent = new ConsentStatement(credentials, site, dataCenter)
    // this.#topic = new Topic(credentials, site, dataCenter)
    this.#schemaFields = new SchemaImportFields(credentials, site, dataCenter)
    this.#preferences = new PreferencesImportFields(credentials, site, dataCenter)
    this.#topic = new TopicImportFields(credentials, site, dataCenter)
  }

  async importAccountToConfigTree() {
    const result = []
    // const schemaData = await this.getSchema()
    // const consent = await this.getConsent()
    // const topics = await this.getTopics()
    // console.log('topics', topics)
    // if (schemaData.errorCode === 0 && schemaData.errorCode === 0) {
    // const cleanSchemaData = this.cleanSchemaData(schemaData)
    // const cleanConsentData = this.getConsentData(consent)
    const cleanSchemaData = await this.#schemaFields.exportSchemaData()
    const cleanPreferencesData = await this.#preferences.exportPreferencesData()
    const cleanTopicData = await this.#topic.exportTopicData()
    // const cleanTopicsData = this.getTopicsData(topics)
    const combinedData = { ...cleanSchemaData, ...cleanTopicData, ...cleanPreferencesData }
    console.log('combinedData', combinedData)
    result.push(...extractAndTransformFields(combinedData))
    return result
    // // }
  }

  // extractAndTransformFields(combinedData) {
  //   const fieldsTransformed = []
  //   Object.entries(combinedData).forEach(([key, value]) => {
  //     if (value && typeof value === 'object') {
  //       const transformed = this.transformField(key, value)
  //       if (transformed) {
  //         fieldsTransformed.push(transformed)
  //       }
  //     }
  //   })
  //   console.log('fieldsTransformed', fieldsTransformed)
  //   return fieldsTransformed
  // }

  transformField(key, value) {
    if (value.fields) {
      return {
        id: key,
        name: key.replace('Schema', ''),
        value: false,
        branches: this.transformSchema(value.fields, key),
      }
    }
    if (key === 'preferences') {
      return {
        id: key,
        name: 'consent statements',
        value: false,
        branches: this.transformSchema(value, key),
      }
    }
    if (key === 'communications') {
      const transformedCommunications = this.transformCommunications(value)
      console.log(JSON.stringify(transformedCommunications, null, 2))
      return transformedCommunications
    }

    return null
  }
  transformCommunications(communications) {
    const result = {
      id: 'communications',
      name: 'communications',
      value: false,
      branches: [],
    }

    const channels = {}

    Object.values(communications).forEach((item, index) => {
      const unique_id = `${item.topic}.${item.topicChannelId}`
      if (!channels[item.channel]) {
        channels[item.channel] = {
          id: item.topicChannelId,
          name: item.topicChannelId,
          value: false,
          branches: [],
        }
      }
      const statusBranch = {
        id: `status.${item.topicChannelId}`,
        name: 'status',
        value: false,
        branches: [],
      }
      const topicBranch = {
        id: unique_id,
        name: item.topic,
        value: false,
        branches: [],
      }
      topicBranch.branches = [statusBranch]
      if (item.schema && item.schema.properties && item.schema.properties.optIn) {
        const optInProperties = item.schema.properties.optIn.properties
        const optInBranches = Object.keys(optInProperties).map((key) => ({
          id: `${key}.${item.topicChannelId}`,
          name: key,
          value: false,
          branches: [],
        }))
        topicBranch.branches.push(...optInBranches)
      }

      channels[item.channel].branches.push(topicBranch)
    })

    result.branches = Object.values(channels)
    return result
  }
  hasNestedObject(field) {
    for (let key in field) {
      if (typeof field[key] === 'object' && field[key] !== null) {
        return true
      }
    }
    return false
  }
  addPreferencesBranches(branches, parentId) {
    const additionalBranches = [
      { id: `${parentId}.isConsentGranted`, name: 'isConsentGranted', value: false, branches: [] },
      { id: `${parentId}.actionTimestamp`, name: 'actionTimestamp', value: false, branches: [] },
      { id: `${parentId}.lastConsentModified`, name: 'lastConsentModified', value: false, branches: [] },
      { id: `${parentId}.docVersion`, name: 'docVersion', value: false, branches: [] },
      { id: `${parentId}.docDate`, name: 'docDate', value: false, branches: [] },
      { id: `${parentId}.tags`, name: 'tags', value: false, branches: [] },
      { id: `${parentId}.entitlements`, name: 'entitlements', value: false, branches: [] },
    ]

    branches.push(...additionalBranches)
  }
  addCommunitacionBranches(branches, parentId) {
    const additionalBranches = [
      { id: `${parentId}.status`, name: 'isConsentGranted', value: false, branches: [] },
      { id: `${parentId}.optIn.brand `, name: 'actionTimestamp', value: false, branches: [] },
      { id: `${parentId}.lastConsentModified`, name: 'lastConsentModified', value: false, branches: [] },
      { id: `${parentId}.docVersion`, name: 'docVersion', value: false, branches: [] },
      { id: `${parentId}.docDate`, name: 'docDate', value: false, branches: [] },
      { id: `${parentId}.tags`, name: 'tags', value: false, branches: [] },
      { id: `${parentId}.entitlements`, name: 'entitlements', value: false, branches: [] },
    ]

    branches.push(...additionalBranches)
  }
  transformSubscriptions(splitKeys, currentLevel) {
    const id = splitKeys.join('.')
    let existing = currentLevel.find((item) => item.id === id)
    if (!existing) {
      existing = {
        id: id,
        name: id,
        value: false,
        branches: [],
      }
      currentLevel.push(existing)
    }
    return existing
  }
  transformSchema(fields, parentKey, skipFields = true) {
    const transformedSchema = []
    for (let key in fields) {
      if (fields.hasOwnProperty(key)) {
        const fieldDetail = fields[key]
        const splitKeys = key.split('.')
        let currentLevel = transformedSchema
        console.log('splitKeys', splitKeys)
        if (parentKey === 'subscriptionsSchema' && splitKeys.length > 1) {
          const existing = this.transformSubscriptions(splitKeys, currentLevel)
          if (this.isFieldDetailObject(fieldDetail, parentKey, skipFields) && this.hasNestedObject(fieldDetail)) {
            existing.branches = this.transformSchema(fieldDetail, parentKey, skipFields)
          }
          continue
        }

        splitKeys.forEach((part, index) => {
          let id
          if (parentKey === 'preferences') {
            id = splitKeys.slice(0, index + 1).join('.')
          } else {
            id = `${part}.${parentKey}`
          }
          let existing = currentLevel.find((item) => item.id === id)
          if (!existing) {
            existing = {
              id: id,
              name: part,
              value: false,
              branches: [],
            }
            currentLevel.push(existing)
          }

          if (index === splitKeys.length - 1) {
            if (this.isFieldDetailObject(fieldDetail, parentKey, skipFields) && this.hasNestedObject(fieldDetail)) {
              existing.branches = this.transformSchema(fieldDetail, parentKey, skipFields)
            }
            if (parentKey === 'preferences') {
              this.addPreferencesBranches(existing.branches, existing.id)
            }
          } else {
            currentLevel = existing.branches
          }
        })
      }
    }
    return transformedSchema
  }
  isFieldDetailObject(fieldDetail, parentKey, skipFields = true) {
    if (fieldDetail && typeof fieldDetail === 'object') {
      const stopFields = ['required', 'type', 'allowNull', 'writeAccess', 'tags']
      return skipFields ? !stopFields.some((field) => field in fieldDetail) : true
    }
    return false
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
    const cleanSchemaData = await this.#schemaFields.exportSchemaData()
    const cleanPreferencesData = await this.#preferences.exportPreferencesData()
    const cleanTopicData = await this.#topic.exportTopicData()
    // const cleanTopicsData = this.getTopicsData(topics)
    const combinedData = { ...cleanSchemaData, ...cleanTopicData, ...cleanPreferencesData }
    exportToCSV(items, combinedData)
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
  getTopicsData(topicsResponse) {
    const communications = {}
    topicsResponse.results.forEach((obj, index) => {
      communications[index] = obj
    })
    return { communications }
  }

  // async getSchema() {
  //   return this.#schema.get()
  // }
  async getConsent() {
    return this.#consent.get()
  }
  async getTopics() {
    return this.#topic.searchTopics()
  }
}
export default ImportAccounts
