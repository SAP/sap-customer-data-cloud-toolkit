/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import ConsentStatement from '../copyConfig/consent/consentStatement'
import { createCSVFile } from '../exportToCsv/exportToCsv'
import TopicImportFields from './communicationImport/communicationImport'
import { passwordImportTreeFields } from './passwordImport/passwordImport'
import PreferencesImportFields from './preferencesImport/preferencesImport'
import SchemaImportFields from './schemaImport/schemaImportFields'
import { getContext, getLiteRootElementsStructure, getRootElementsStructure, getUID } from './rootOptions/rootLevelFields'
import TreeSearch from './treeSearch/treeSearch'
import { getRootElements } from './utils'
import { AccountType } from './accountManager/accountType'
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
    if (selectedValue === AccountType.Full) {
      result.push(...getUID())
      result.push(...(await this.#schemaFields.exportTransformedSchemaData()))
      result.push(...(await this.#preferences.exportTransformedPreferencesData()))
      result.push(...(await this.#topic.exportTransformedCommunicationData()))
      result.push(...passwordImportTreeFields())
      result.push(...getRootElementsStructure())
    }
    if (selectedValue === AccountType.Lite) {
      result.push(...getLiteRootElementsStructure())
      result.push(...(await this.#schemaFields.exportLiteSchemaData()))
      result.push(...(await this.#preferences.exportTransformedPreferencesData()))
      result.push(...getContext())
    }
    return result
  }

  async exportDataToCsv(items, accountOption) {
    let result = []
    const { data, preferencesOptions, communicationsOptions, informationOption, rootOptions } = this.seperateOptionsFromTree(items)
    if (rootOptions.length > 0) {
      const rootData = TreeSearch.getCheckedOptionsFromTree(rootOptions, false)
      result.push(...rootData)
    }
    if (data.length > 0) {
      const schemaData = TreeSearch.getCheckedOptionsFromTree(data, true)
      result.push(...schemaData)
    }
    if (preferencesOptions.length > 0) {
      const preferencesData = TreeSearch.getCheckedOptionsFromTree(preferencesOptions, false)
      result.push(...preferencesData)
    }
    if (communicationsOptions.length > 0) {
      const communicationData = TreeSearch.getCheckedOptionsFromTree(communicationsOptions, false)
      result.push(...communicationData)
    }
    if (informationOption.length > 0) {
      const informationData = TreeSearch.getCheckedOptionsFromTree(informationOption, false)
      result.push(...informationData)
    }
    createCSVFile(result, accountOption)
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
    const rootElements = getRootElements

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
}

export default ImportAccounts
