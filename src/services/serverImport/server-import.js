import { serverStructure } from './serverStructure/serverStructure'

class ServerImport {
  constructor(userKey, secret, gigyaConsole) {
    this.userKey = userKey
    this.secret = secret
    this.gigyaConsole = gigyaConsole
  }

  getStructure(site, dataCenter) {
    return serverStructure()
  }
}
