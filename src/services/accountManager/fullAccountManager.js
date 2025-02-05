import { genericFullAccountDataflow } from '../storageProvider/dataflow/fullAccountSteps'
import AccountManager from './accountManager'

class FullAccount extends AccountManager {
  constructor(storageProvider) {
    super(storageProvider)
    this.dataflow = this.#createDataflow(storageProvider)
  }

  #createDataflow(storageProvider) {
    const dataflow = genericFullAccountDataflow(storageProvider.getWriter().id)
    dataflow.steps.splice(1, 0, storageProvider.getReader())
    dataflow.steps.splice(7, 0, storageProvider.getWriter())
    return dataflow
  }
}

export default FullAccount
