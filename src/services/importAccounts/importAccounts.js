/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import ConsentStatement from '../copyConfig/consent/consentStatement'
import { exportCommunicationData } from '../exportToCsv/communication/communicationMatches'
import { createCSVFile } from '../exportToCsv/exportToCsv'
import { exportPasswordData } from '../exportToCsv/password/passwordMatches'
import { exportPreferencesData } from '../exportToCsv/preferences/preferencesMatches'
import { exportSchemaData } from '../exportToCsv/schema/schemaMatches'
import TopicImportFields from './communicationImport/communicationImport'
import { passwordImportTreeFields } from './passwordImport/passwordImport'
import PreferencesImportFields from './preferencesImport/preferencesImport'
import SchemaImportFields from './schemaImport/schemaImportFields'
import { rootOptionsValue } from './rootOptions/rootOptions'
import { getContext, getLiteRootElementsStructure, getRootElementsStructure, getUID } from './rootOptions/rootLevelFields'
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

  async importAccountToConfigTree(selectedValue) {
    const result = []
    if (selectedValue === 'Full') {
      result.push(...getUID())
      result.push(...(await this.#schemaFields.exportTransformedSchemaData()))
      result.push(...(await this.#preferences.exportTransformedPreferencesData()))
      result.push(...(await this.#topic.exportTransformedCommunicationData()))
      result.push(...passwordImportTreeFields())
      result.push(...getRootElementsStructure())
    }
    if (selectedValue === 'Lite') {
      result.push(...getLiteRootElementsStructure())
      result.push(...(await this.#schemaFields.exportLiteSchemaData()))
      result.push(...(await this.#preferences.exportTransformedPreferencesData()))
      result.push(...getContext())
    }
    return result
  }

  async exportDataToCsv(items) {
    let result = []
    const { data, preferencesOptions, communicationsOptions, informationOption, rootOptions } = this.seperateOptionsFromTree(items)
    if (rootOptions.length > 0) {
      const rootData = rootOptionsValue(rootOptions)
      result.push(...rootData)
    }
    if (data.length > 0) {
      const schemaData = exportSchemaData(data)
      result.push(...schemaData)
    }
    if (preferencesOptions.length > 0) {
      const preferencesData = exportPreferencesData(preferencesOptions)
      result.push(...preferencesData)
    }
    if (communicationsOptions.length > 0) {
      result.push(...exportCommunicationData(communicationsOptions))
    }
    if (informationOption.length > 0) {
      result.push(...exportPasswordData(informationOption))
    }

    createCSVFile(result)
  }
  seperateOptionsFromTree(items) {
    const data = []
    const preferencesOptions = []
    const communicationsOptions = []
    const informationOption = []
    const rootOptions = []
    const schemaFields = ['data', 'subscriptions', 'internal', 'addresses', 'profile']
    const preferences = 'preferences'
    const communications = 'communications'
    const pass = 'pass'
    const rootElements = this.getRootElements()

    items.forEach((item) => {
      if (rootElements.some((root) => item.id === root && item.value === true)) {
        rootOptions.push(item)
      } else if (schemaFields.some((field) => item.id.startsWith(field) && item.value === true)) {
        data.push(item)
      } else if (item.id.startsWith(preferences) && item.value === true) {
        preferencesOptions.push(item)
      } else if (item.id.startsWith(communications) && item.value === true) {
        communicationsOptions.push(item)
      } else if (item.id.startsWith(pass) && item.value === true) {
        informationOption.push(item)
      }
    })
    return { data, preferencesOptions, communicationsOptions, informationOption, rootOptions }
  }
  getRootElements() {
    return ['uid', 'dataCenter', 'phoneNumber', 'loginIds', 'isActive', 'isRegistered', 'isVerified', 'verified', 'email', 'regSource', 'registered', 'context', 'lang']
  }
}

export default ImportAccounts
