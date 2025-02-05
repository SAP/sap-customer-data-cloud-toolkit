class StorageProvider {
  getReader() {
    throw new Error('Error Getting Full Account Template')
  }

  getWriter() {
    throw new Error('Error Getting Lite Account Template')
  }
}

export default StorageProvider
