import StorageProvider from './storageProvider'

class AzureStorageProvider extends StorageProvider {
  getReader() {
    return {
      id: 'azure.blob',
      type: 'datasource.read.azure.blob',
      params: {
        accountName: '{{accountName}}',
        accountKey: '{{accountKey}}',
        container: '{{container}}',
        fileNameRegex: '{{readFileNameRegex}}',
        blobPrefix: '{{blobPrefix}}',
      },
    }
  }

  getWriter() {
    return {
      id: 'Write to Azure Blobs',
      type: 'datasource.write.azure.blob',
      params: {
        accountName: '{{accountName}}',
        accountKey: '{{accountKey}}',
        container: '{{container}}',
      },
    }
  }
}
export default AzureStorageProvider
