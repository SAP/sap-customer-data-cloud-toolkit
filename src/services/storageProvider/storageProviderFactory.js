import AzureStorageProvider from './azureStorageProvider'

class StorageProviderFactory {
  static getStorageProvider(option) {
    switch (option) {
      case 'azure':
        return new AzureStorageProvider()
      default:
        throw new Error(`Unknown storage provider: ${option}`)
    }
  }
}
export default StorageProviderFactory
