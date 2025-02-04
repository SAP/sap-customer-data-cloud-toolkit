class StorageProvider {
  getFullAccountTemplate() {
    throw new Error('Error Getting Full Account Template')
  }

  getLiteAccountTemplate() {
    throw new Error('Error Getting Lite Account Template')
  }
}

export default StorageProvider
