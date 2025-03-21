/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import Dataflow from '../../copyConfig/dataflow/dataflow'

class ServerImport {
  #credentials
  #site
  #dataCenter
  #dataFlow
  #dataflowTemplate

  static #SERVER_IMPORT_SCHEDULER = 'server_import_scheduler'

  constructor(credentials, site, dataCenter, dataflowTemplate) {
    this.#credentials = credentials
    this.#site = site
    this.#dataCenter = dataCenter
    this.#dataFlow = new Dataflow(credentials, site, dataCenter)
    this.#dataflowTemplate = dataflowTemplate
  }

  async setDataflow(configurations, option) {
    try {
      const dataflowConfig = this.getConfigurations(configurations, option.option)
      const createdDataflowId = await this.#createAndCheckDataflow(dataflowConfig)
      return createdDataflowId
    } catch (error) {
      throw error
    }
  }

  async #scheduleReplacedDataflow(createDataflowId) {
    const scheduleStructure = this.#scheduleStructure(createDataflowId)
    const scheduler = await this.#dataFlow.schedule(this.#site, this.#dataCenter, scheduleStructure)
    if (scheduler.errorCode !== 0) {
      throw scheduler
    }
  }

  async #createAndCheckDataflow(dataflowConfig) {
    const createDataflow = await this.#dataFlow.create(this.#site, this.#dataCenter, JSON.parse(this.#dataflowTemplate))
    if (createDataflow.errorCode !== 0) {
      throw createDataflow
    } else {
      await this.#searchDataflowOnApiKey(this.#site, createDataflow.id, dataflowConfig)
    }
    return createDataflow.id
  }

  async #searchDataflowOnApiKey(apiKey, dataflowId, dataflowConfig) {
    const searchDataflow = await this.searchDataflowIdOnApiKey(dataflowId)
    if (searchDataflow) {
      await this.#replaceAndSetDataflow(dataflowId, dataflowConfig)
    } else {
      throw new Error(`The Dataflow with the ID ${dataflowId} was not found on the site ${apiKey}`)
    }
  }

  async searchDataflowIdOnApiKey(dataflowId, retryCount = 10) {
    let attempts = 0

    do {
      const searchDataflow = await this.#dataFlow.search()

      if (searchDataflow.result) {
        for (const dataflow of searchDataflow.result) {
          if (dataflow.id === dataflowId) {
            return true
          }
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 2000))
    } while (++attempts < retryCount)

    return false
  }

  async #replaceAndSetDataflow(dataflowId, dataflowConfig) {
    const setResponse = await this.#dataFlow.set(this.#site, this.#dataCenter, this.#replaceVariables(dataflowId, dataflowConfig))
    if (setResponse.errorCode === 0) {
      await this.#scheduleReplacedDataflow(dataflowId)
    }
  }

  getConfigurations(configurations, key) {
    return configurations[key]
  }

  #scheduleStructure(id) {
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
  #replaceVariables(id, variables) {
    const dataflowTemplate = JSON.parse(this.#dataflowTemplate)
    dataflowTemplate.id = id
    let dataflowString = JSON.stringify(dataflowTemplate)
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
