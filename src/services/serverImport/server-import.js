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
  async setDataflow(configurations, option, accountOption) {
    console.log('setConfiguration--->', configurations)
    console.log('accountOption--->', accountOption)
    console.log('option--->', option)
    const dataflowConfig = this.getConfigurations(configurations, option.option)
    console.log('getConfigurations--->', this.getConfigurations(configurations, option.option))
    console.log('option--data->', configurations[option.option])
    console.log(`path :./dataFlowTemplates/${option}Template/${option}${accountOption}Account`)
    console.log(' JSON.parse(data)--->', importFullAccountAzure)
    const replacedDataflow = this.replaceVariables(importFullAccountAzure, dataflowConfig)
    console.log(' JSON.replacedDataflow--->', replacedDataflow)
    const createDataflow = await this.#dataFlow.create(this.#site, this.#dataCenter, replacedDataflow)
    console.log(' JSON.createDataflow--->', createDataflow.id)
    const schedule = this.scheduleStructure(createDataflow)
    console.log(' this.scheduleStructure(createDataflow)', this.scheduleStructure(createDataflow))
    console.log('schedule', schedule.data)

    const createSchedule = await this.#dataFlow.setScheduling(this.#site, this.#dataCenter, this.scheduleStructure(createDataflow))
    console.log('createSchedule', createSchedule)
    return createSchedule
  }
  getConfigurations(configurations, key) {
    console.log('configurations--->', configurations)
    console.log('key--->', key)
    return configurations[key]
  }

  // {
  //   name:'test_schedule',
  //   dataflowId:'8e74ee6bed864df6aed05d13d0ba6815',
  //   frequencyType:'once',

  // }
  scheduleStructure(response) {
    const structure = {
      data: {
        name: 'test_schedule',
        dataflowId: response.id,
        frequencyType: 'once',
      },
    }
    return structure
  }
  replaceVariables(dataflow, variables) {
    let dataflowString = JSON.stringify(dataflow)
    console.log('dataflowString', dataflowString)
    for (const variable of variables) {
      const regex = new RegExp(variable.id, 'g')
      console.log('variable.id', variable.value)
      dataflowString = dataflowString.replaceAll(regex, variable.value)
    }
    return JSON.parse(dataflowString)
  }
}
export default ServerImport
