import GigyaManager from '../gigya/gigyaManager'
import Info from './info/info'
import Schema from './schema/schema'

class ConfigManager {
  #configurations = []
  #credentials
  #originApiKey
  #originDataCenter
  #gigyaManager

  constructor(credentials, originApiKey) {
    this.#credentials = credentials
    this.#originApiKey = originApiKey
    this.#gigyaManager = new GigyaManager(credentials.userKey, credentials.secret)
    this.#originDataCenter = undefined
  }

  async copy(targetApiKeys, configOptions) {
    const responses = []
    await this.#init()
    for (const targetApiKey of targetApiKeys) {
      responses.push(this.#copyConfigurations(targetApiKey, configOptions))
    }
    return (await Promise.all(responses)).flat()
  }

  async #copyConfigurations(targetApiKey, configOptions) {
    const responses = []
    const targetDataCenter = await this.#getDataCenter(targetApiKey)
    const configurationsToCopy = this.#getConfigurationsToCopy(configOptions)
    for (const config of configurationsToCopy) {
      responses.push(config.copy(targetApiKey, targetDataCenter))
    }
    return (await Promise.all(responses)).flat()
  }

  async getConfiguration() {
    await this.#init()
    const info = new Info(this.#credentials, this.#originApiKey, this.#originDataCenter)
    return info.get()
  }

  async #init() {
    if (this.#originDataCenter === undefined) {
      await this.#initOriginDataCenter()
      this.#initConfigurations()
    }
  }

  async #initOriginDataCenter() {
    this.#originDataCenter = await this.#getDataCenter(this.#originApiKey)
  }

  async #getDataCenter(apiKey) {
    const response = await this.#gigyaManager.getDataCenterFromSite(apiKey)
    if (response.errorCode === 0) {
      return response.dataCenter
    } else {
      throw response
    }
  }

  #initConfigurations() {
    this.#configurations.push(new Schema(this.#credentials, this.#originApiKey, this.#originDataCenter))
  }

  #getConfigurationsToCopy(configOptions) {
    return this.#configurations
  }
}

export default ConfigManager
