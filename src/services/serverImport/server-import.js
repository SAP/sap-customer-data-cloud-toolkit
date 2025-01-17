/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import Dataflow from '../copyConfig/dataflow/dataflow'
import { importFullAccountAzure } from './dataFlowTemplates/azureTemplate/azureFullAccount'
import { importLiteAccountAzure } from './dataFlowTemplates/azureTemplate/azureLiteAccount'
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
  }

  getStructure() {
    return serverStructure
  }

  async setDataflow(configurations, option, accountOption) {
    if (option.option === ServerImport.#SERVER_TYPE) {
      const dataflowConfig = this.getConfigurations(configurations, option.option)
      const replacedDataflow = this.replaceVariables(accountOption === ServerImport.#ACCOUNT_TYPE_LITE ? importLiteAccountAzure : importFullAccountAzure, dataflowConfig)
      const createDataflow = await this.#dataFlow.create(this.#site, this.#dataCenter, replacedDataflow)
      const schedule = this.scheduleStructure(createDataflow)
      await this.#dataFlow.setScheduling(this.#site, this.#dataCenter, schedule)
      return createDataflow.id
    }
  }

  getConfigurations(configurations, key) {
    return configurations[key]
  }

  scheduleStructure(response) {
    const structure = {
      data: {
        name: ServerImport.#SERVER_IMPORT_SCHEDULER,
        dataflowId: response.id,
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
      dataflowString = dataflowString.replaceAll(regex, variable.value)
    }
    return JSON.parse(dataflowString)
  }
}
export default ServerImport
