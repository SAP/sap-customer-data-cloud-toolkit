/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

class AccountManager {
  dataflow = ''
  storageProvider

  constructor(storageProvider) {
    this.storageProvider = storageProvider
  }

  getDataflow() {
    return this.dataflow
  }

  replaceVariables(id, variables) {
    this.dataflow.id = id
    let dataflowString = JSON.stringify(this.dataflow)
    for (const variable of variables) {
      const regex = new RegExp(variable.id, 'g')
      if (variable.value) {
        const escapedValue = variable.value.replace(/\\/g, '\\\\')
        dataflowString = dataflowString.replaceAll(regex, escapedValue)
      } else {
        dataflowString = dataflowString.replaceAll(regex, '')
      }
    }
    return JSON.parse(dataflowString)
  }
}

export default AccountManager
