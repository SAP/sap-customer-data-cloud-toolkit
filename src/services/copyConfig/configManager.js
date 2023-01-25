import GigyaManager from '../gigya/gigyaManager'
import Info from './info/info'

class ConfigManager {
  #configs
  #credentials
  #originApiKey
  #targetApiKeys
  #configOptions
  #originDataCenter
  #gigyaManager

  constructor(credentials, originApiKey, targetApiKeys, configOptions) {
    this.#credentials = credentials
    this.#originApiKey = originApiKey
    this.#targetApiKeys = targetApiKeys
    this.#configOptions = configOptions
    this.#gigyaManager = new GigyaManager(credentials.userKey, credentials.secret)
    this.#originDataCenter = undefined
  }

  async getConfiguration() {
    await this.#init()
    const info = new Info(this.#credentials, this.#originApiKey, this.#originDataCenter)
    return info.get()
  }

  async #init() {
    if (this.#originDataCenter === undefined) {
      await this.#initOriginDataCenter()
      this.#initConfigurations(this.#originDataCenter)
    }
  }

  async #initOriginDataCenter() {
    if (this.#originDataCenter === undefined) {
      const response = await this.#gigyaManager.getDataCenterFromSite(this.#originApiKey)
      if (response.errorCode === 0) {
        this.#originDataCenter = response.dataCenter
      } else {
        throw response
      }
    }
  }

  #initConfigurations(dataCenter) {
    // to be implemented
    this.#configs = [dataCenter]
  }
}

export default ConfigManager
