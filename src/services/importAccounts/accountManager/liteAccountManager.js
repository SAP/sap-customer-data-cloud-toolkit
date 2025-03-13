import AccountManager from './accountManager'

class LiteAccount extends AccountManager {
  constructor(storageProvider, template) {
    super(storageProvider)
    this.template = template
    this.dataflow = this.#createDataflow()
  }

  #createDataflow() {
    return JSON.parse(this.template)
  }
}

export default LiteAccount
