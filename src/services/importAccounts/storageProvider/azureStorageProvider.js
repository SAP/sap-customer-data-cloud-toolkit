import StorageProvider from './storageProvider'

class AzureStorageProvider extends StorageProvider {
  getReader(nextStep) {
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
      next: [nextStep],
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
