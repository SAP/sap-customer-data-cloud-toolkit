import AzureStorageProvider from './azureStorageProvider'

class StorageProviderFactory {
  static getStorageProvider(storageProviderName) {
    switch (storageProviderName) {
      case 'azure':
        return new AzureStorageProvider()
      default:
        throw new Error(`Unknown storage provider: ${storageProviderName}`)
    }
  }
}
export default StorageProviderFactory
