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
    if (option.option === 'azure') {
      console.log('configurations', configurations)
      const dataflowConfig = this.getConfigurations(configurations, option.option)
      console.log('dataflowConfig', dataflowConfig)
      const replacedDataflow = this.replaceVariables(accountOption === 'Lite' ? importLiteAccountAzure : importFullAccountAzure, dataflowConfig)
      const createDataflow = await this.#dataFlow.create(this.#site, this.#dataCenter, replacedDataflow)
      const schedule = this.scheduleStructure(createDataflow)
      const createSchedule = await this.#dataFlow.setScheduling(this.#site, this.#dataCenter, schedule)
      return createSchedule
    }
  }
  getConfigurations(configurations, key) {
    return configurations[key]
  }
  scheduleStructure(response) {
    const structure = {
      data: {
        name: 'server_import_scheduler',
        dataflowId: response.id,
        frequencyType: 'once',
        fullExtract: true,
      },
    }
    return structure
  }

  replaceVariables(dataflow, variables) {
    let dataflowString = JSON.stringify(dataflow)
    console.log('dataflowString', dataflowString)
    console.log('variable', variables)
    for (const variable of variables) {
      const regex = new RegExp(variable.id, 'g')
      dataflowString = dataflowString.replaceAll(regex, variable.value)
    }
    return JSON.parse(dataflowString)
  }
}
export default ServerImport
