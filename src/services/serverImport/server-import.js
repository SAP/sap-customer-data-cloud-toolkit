import Dataflow from '../copyConfig/dataflow/dataflow'
import { importFullAccountAzure } from './dataFlowTemplates/azureTemplate/azureFullAccount'
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
    console.log('serverStructure--->', serverStructure)
    const structure = serverStructure
    return structure
  }
  setDataflow(configurations, option) {
    console.log('setConfiguration--->', configurations)
    console.log('option--->', option)
    console.log('option--->', configurations[option])
    console.log(' JSON.parse(data)--->', importFullAccountAzure)
    const replacedDataflow = this.replaceVariables(importFullAccountAzure, configurations[option])
    console.log(' JSON.replacedDataflow--->', replacedDataflow)
    const createDataflow = this.#dataFlow.create(this.#site, this.#dataCenter, replacedDataflow)
    console.log(' JSON.createDataflow--->', createDataflow)
  }
  replaceVariables(dataflow, variables) {
    let dataflowString = JSON.stringify(dataflow)

    for (const variable of variables) {
      const regex = new RegExp(variable.id, 'g')
      console.log('variable.id', variable.value)
      dataflowString = dataflowString.replaceAll(regex, variable.value)
    }
    return JSON.parse(dataflowString)
  }
}
export default ServerImport
