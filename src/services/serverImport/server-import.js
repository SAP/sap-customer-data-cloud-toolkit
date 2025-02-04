/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import Dataflow from '../copyConfig/dataflow/dataflow'
import AzureStorageProvider from '../storageProvider/azureStorageProvider'
import { serverStructure } from './serverStructure/serverStructure'

class ServerImport {
  #credentials
  #site
  #dataCenter
  #dataFlow

  static #SERVER_IMPORT_SCHEDULER = 'server_import_scheduler'

  static #SERVER_TYPE = 'azure'

  static #ACCOUNT_TYPE_LITE = 'Lite'

  constructor(credentials, site, dataCenter) {
    this.#credentials = credentials
    this.#site = site
    this.#dataCenter = dataCenter
    this.#dataFlow = new Dataflow(credentials, site, dataCenter)
    this.storageProvider = new AzureStorageProvider()
  }

  getStructure() {
    return serverStructure
  }

  async setDataflow(configurations, option, accountOption) {
    if (option.option === ServerImport.#SERVER_TYPE) {
      const dataflowConfig = this.getConfigurations(configurations, option.option)
      const createdDataflowId = await this.#createAndCheckDataflow(accountOption, dataflowConfig)
      return createdDataflowId
    }
  }

  async #scheduleReplacedDataflow(createDataflowId) {
    const schedule = this.scheduleStructure(createDataflowId)
    await this.#dataFlow.setScheduling(this.#site, this.#dataCenter, schedule)
  }

  async #createAndCheckDataflow(accountOption, dataflowConfig) {
    const dataflowBody = accountOption === ServerImport.#ACCOUNT_TYPE_LITE ? this.storageProvider.getLiteAccountTemplate() : this.storageProvider.getFullAccountTemplate()
    const createDataflow = await this.#dataFlow.create(this.#site, this.#dataCenter, dataflowBody)
    if (createDataflow.errorCode === 0) {
      await this.#searchDataflowOnApiKey(this.#site, createDataflow.id, dataflowBody, dataflowConfig)
      return createDataflow.id
    }
    return createDataflow
  }

  async #searchDataflowOnApiKey(apiKey, dataflowId, dataflowBody, dataflowConfig) {
    const searchDataflow = await this.#dataFlow.search()
    for (const dataflow of searchDataflow.result) {
      if (dataflow.id === dataflowId && dataflow.apiKey === apiKey) {
        await this.#replaceAndSetDataflow(dataflow, dataflowBody, dataflowConfig)
      }
    }
  }

  async #replaceAndSetDataflow(dataflow, dataflowBody, dataflowConfig) {
    dataflowBody.id = dataflow.id
    const replacedBody = this.replaceVariables(dataflowBody, dataflowConfig)
    const setResponse = await this.#dataFlow.set(this.#site, this.#dataCenter, replacedBody)
    if (setResponse.errorCode === 0) {
      await this.#scheduleReplacedDataflow(dataflow.id)
    }
    return setResponse
  }

  getConfigurations(configurations, key) {
    return configurations[key]
  }

  scheduleStructure(id) {
    const structure = {
      data: {
        name: ServerImport.#SERVER_IMPORT_SCHEDULER,
        dataflowId: id,
        frequencyType: 'once',
        fullExtract: true,
      },
    }
    return structure
  }

  replaceVariables(dataflow, variables) {
    let dataflowString = JSON.stringify(dataflow)
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

export default ServerImport
