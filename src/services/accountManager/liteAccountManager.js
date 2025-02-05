import { genericLiteAccountDataflow } from '../storageProvider/dataflow/fullAccountSteps'
import AccountManager from './accountManager'

class LiteAccount extends AccountManager {
  constructor(storageProvider) {
    super(storageProvider)
    this.dataflow = this.#createDataflow(storageProvider)
  }

  #createDataflow(storageProvider) {
    const dataflow = genericLiteAccountDataflow(storageProvider.getWriter().id)
    dataflow.steps.splice(1, 0, this.storageProvider.getReader())
    dataflow.steps.splice(4, 0, this.storageProvider.getWriter())
    return dataflow
  }
}

export default LiteAccount
