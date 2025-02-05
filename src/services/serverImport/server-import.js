/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import Dataflow from '../copyConfig/dataflow/dataflow'
import { genericFullAccountDataflow, genericLiteAccountDataflow } from '../storageProvider/dataflow/fullAccountSteps'
import { serverStructure } from './serverStructure/serverStructure'

class ServerImport {
  #credentials
  #site
  #dataCenter
  #dataFlow

  static #SERVER_IMPORT_SCHEDULER = 'server_import_scheduler'

  static #ERROR_FINDING_DATAFLOW = 'Error finding dataflow'

  static #SERVER_TYPE = 'azure'

  static #ACCOUNT_TYPE_LITE = 'Lite'

  constructor(credentials, site, dataCenter, storageProvider) {
    this.#credentials = credentials
    this.#site = site
    this.#dataCenter = dataCenter
    this.#dataFlow = new Dataflow(credentials, site, dataCenter)
    this.storageProvider = storageProvider
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
    const dataflowBody = accountOption === ServerImport.#ACCOUNT_TYPE_LITE ? this.#liteAccountAddReaderWriter() : this.#fullAccountAddReaderWriter()
    const createDataflow = await this.#dataFlow.create(this.#site, this.#dataCenter, dataflowBody)
    if (createDataflow.errorCode === 0) {
      await this.#searchDataflowOnApiKey(this.#site, createDataflow.id, dataflowBody, dataflowConfig)
    }
    return createDataflow.id
  }

  async #searchDataflowOnApiKey(apiKey, dataflowId, dataflowBody, dataflowConfig) {
    const searchDataflow = await this.searchDataflowIdOnApiKey(apiKey, dataflowId)
    if (searchDataflow) {
      await this.#replaceAndSetDataflow(dataflowId, dataflowBody, dataflowConfig)
    }
  }

  async searchDataflowIdOnApiKey(apiKey, dataflowId, retryCount = 5) {
    const searchDataflow = await this.#dataFlow.search()
    let dataflowFound = false
    for (const dataflow of searchDataflow.result) {
      if (dataflow.id === dataflowId && dataflow.apiKey === apiKey) {
        dataflowFound = true
        return true
      }
    }
    if (!dataflowFound) {
      if (retryCount > 0) {
        console.log(`Retrying searchDataflowOnApiKey... Attempts left: ${retryCount}`)
        return await this.searchDataflowIdOnApiKey(apiKey, dataflowId, retryCount - 1)
      }
      return false
    }
  }

  async #replaceAndSetDataflow(dataflowId, dataflowBody, dataflowConfig) {
    dataflowBody.id = dataflowId
    const replacedBody = this.replaceVariables(dataflowBody, dataflowConfig)
    const setResponse = await this.#dataFlow.set(this.#site, this.#dataCenter, replacedBody)
    if (setResponse.errorCode === 0) {
      await this.#scheduleReplacedDataflow(dataflowId)
    }
    return setResponse
  }

  #fullAccountAddReaderWriter() {
    const dataflow = genericFullAccountDataflow('Write to Azure Blobs')
    dataflow.steps.splice(1, 0, this.storageProvider.getReader())
    dataflow.steps.splice(7, 0, this.storageProvider.getWriter())
    return dataflow
  }

  #liteAccountAddReaderWriter() {
    const dataflow = genericLiteAccountDataflow('Write to Azure Blobs')
    dataflow.steps.splice(1, 0, this.storageProvider.getReader())
    dataflow.steps.splice(4, 0, this.storageProvider.getWriter())
    return dataflow
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
