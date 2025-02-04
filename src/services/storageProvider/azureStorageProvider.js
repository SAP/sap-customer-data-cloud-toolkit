import { readAzureStep, writeAzure } from './dataflow/commonData'
import { genericFullAccountDataflow, genericLiteAccountDataflow } from './dataflow/fullAccountSteps'
import StorageProvider from './storageProvider'

class AzureStorageProvider extends StorageProvider {
  static #WRITE_TO_AZURE_BLOBS = 'Write to Azure Blobs'
  getFullAccountTemplate() {
    return this.#addFullAccountAzureStorageSteps()
  }

  getLiteAccountTemplate() {
    return this.#addLiteAccountAzureStorageSteps()
  }

  #addFullAccountAzureStorageSteps() {
    const dataflow = genericFullAccountDataflow(AzureStorageProvider.#WRITE_TO_AZURE_BLOBS)
    dataflow.steps.splice(1, 0, ...readAzureStep)
    dataflow.steps.splice(7, 0, ...writeAzure)
    return dataflow
  }

  #addLiteAccountAzureStorageSteps() {
    const dataflow = genericLiteAccountDataflow(AzureStorageProvider.#WRITE_TO_AZURE_BLOBS)
    dataflow.steps.splice(1, 0, ...readAzureStep)
    dataflow.steps.splice(4, 0, ...writeAzure)
    return dataflow
  }
}
export default AzureStorageProvider
