import { serverStructure } from './serverStructure/serverStructure'

class ServerImport {
  #credentials
  #site
  #dataCenter
  constructor(credentials, site, dataCenter) {
    this.#credentials = credentials
    this.#site = site
    this.#dataCenter = dataCenter
  }

  getStructure() {
    console.log('serverStructure--->', serverStructure)
    const structure = serverStructure
    return structure
  }
}
export default ServerImport
