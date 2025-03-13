/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import Dataflow from '../../copyConfig/dataflow/dataflow'
import { serverStructure } from './serverStructure/serverStructure'

class ServerImport {
  #credentials
  #site
  #dataCenter
  #dataFlow
  #accountManager

  static #SERVER_IMPORT_SCHEDULER = 'server_import_scheduler'

  constructor(credentials, site, dataCenter, accountManager) {
    this.#credentials = credentials
    this.#site = site
    this.#dataCenter = dataCenter
    this.#dataFlow = new Dataflow(credentials, site, dataCenter)
    this.#accountManager = accountManager
  }

  getStructure() {
    return serverStructure
  }

  async setDataflow(configurations, option) {
    try {
      const dataflowConfig = this.getConfigurations(configurations, option.option)
      const createdDataflowId = await this.#createAndCheckDataflow(dataflowConfig)
      return createdDataflowId
    } catch (error) {
      console.log('error setDataflow', error)
      throw new Error(error)
    }
  }

  async #scheduleReplacedDataflow(createDataflowId) {
    const schedule = this.scheduleStructure(createDataflowId)
    await this.#dataFlow.setScheduling(this.#site, this.#dataCenter, schedule)
  }

  async #createAndCheckDataflow(dataflowConfig) {
    const createDataflow = await this.#dataFlow.create(this.#site, this.#dataCenter, this.#accountManager.getDataflow())
    if (createDataflow.errorCode === 0) {
      await this.#searchDataflowOnApiKey(this.#site, createDataflow.id, dataflowConfig)
    }
    if (createDataflow.errorCode !== 0) {
      throw new Error(createDataflow.errorMessage)
    }
    return createDataflow.id
  }

  async #searchDataflowOnApiKey(apiKey, dataflowId, dataflowConfig) {
    const searchDataflow = await this.searchDataflowIdOnApiKey(apiKey, dataflowId)
    if (searchDataflow) {
      await this.#replaceAndSetDataflow(dataflowId, dataflowConfig)
    }
  }

  async searchDataflowIdOnApiKey(apiKey, dataflowId, retryCount = 5) {
    const searchDataflow = await this.#dataFlow.search()
    let dataflowFound = false
    for (const dataflow of searchDataflow.result) {
      if (dataflow.id === dataflowId && dataflow.apiKey === apiKey) {
        return true
      }
    }
    if (!dataflowFound) {
      if (retryCount > 0) {
        return await this.searchDataflowIdOnApiKey(apiKey, dataflowId, retryCount - 1)
      }
      return false
    }
  }

  async #replaceAndSetDataflow(dataflowId, dataflowConfig) {
    const setResponse = await this.#dataFlow.set(this.#site, this.#dataCenter, this.#accountManager.replaceVariables(dataflowId, dataflowConfig))
    if (setResponse.errorCode === 0) {
      await this.#scheduleReplacedDataflow(dataflowId)
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
}

export default ServerImport
