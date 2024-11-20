import Topic from '../copyConfig/communication/topic'
import ConsentStatement from '../copyConfig/consent/consentStatement'
import Schema from '../copyConfig/schema/schema'
import { exportCommunicationData } from '../exportToCsv/communicationMatches'
import { createCSVFile } from '../exportToCsv/exportToCsv'
import { exportPasswordData } from '../exportToCsv/passwordMatches'
import { exportPreferencesData } from '../exportToCsv/preferencesMatches'
import { exportSchemaData } from '../exportToCsv/schemaMatches'
import TopicImportFields from './communicationImport/communicationImport'
import { passwordImportTreeFields } from './passwordImport/passwordImport'
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
    this.#schemaFields = new SchemaImportFields(credentials, site, dataCenter)
    this.#preferences = new PreferencesImportFields(credentials, site, dataCenter)
    this.#topic = new TopicImportFields(credentials, site, dataCenter)
  }

  async importAccountToConfigTree() {
    const result = []
    result.push(...(await this.#schemaFields.exportTransformedSchemaData()))
    result.push(...(await this.#preferences.exportTransformedPreferencesData()))
    result.push(...(await this.#topic.exportTransformedCommunicationData()))
    result.push(...passwordImportTreeFields())
    return result
  }

  async exportDataToCsv(items) {
    let result = []
    const cleanSchemaData = await this.#schemaFields.exportSchemaData()
    const cleanPreferencesData = await this.#preferences.exportPreferencesData()
    const cleanTopicData = await this.#topic.exportTopicData()
    const combinedData = { ...cleanSchemaData, ...cleanTopicData, ...cleanPreferencesData }
    result.push(...exportSchemaData(items, cleanSchemaData))
    result.push(...exportPreferencesData(items, cleanPreferencesData))
    result.push(...exportCommunicationData(items, cleanTopicData))
    result.push(...exportPasswordData(items))
    createCSVFile(result)
    // exportToCSV(items, combinedData)
  }
}
export default ImportAccounts
