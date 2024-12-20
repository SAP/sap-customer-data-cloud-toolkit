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
    const structure = serverStructure
    return structure
  }
  async setDataflow(configurations, option, accountOption) {
    if (option.option === 'azure') {
      const dataflowConfig = this.getConfigurations(configurations, option.option)
      const replacedDataflow = this.replaceVariables(accountOption === 'Lite' ? importLiteAccountAzure : importFullAccountAzure, dataflowConfig)
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
        name: 'test_schedule',
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
      if (variable.value) {
        dataflowString = dataflowString.replaceAll(regex, variable.value)
      } else {
        dataflowString = dataflowString.replaceAll(regex, '')
      }
    }
    return JSON.parse(dataflowString)
  }
}
export default ServerImport
