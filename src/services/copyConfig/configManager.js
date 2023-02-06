import Info from './info/info'
import Schema from './schema/schema'
import Social from './social/social'
import SmsConfiguration from './sms/smsConfiguration'
import SiteConfigurator from '../configurator/siteConfigurator'

class ConfigManager {
  #configurations = []
  #credentials
  #originApiKey
  #originSiteConfiguration
  #siteConfigurator

  constructor(credentials, originApiKey) {
    this.#credentials = credentials
    this.#originApiKey = originApiKey
    this.#siteConfigurator = new SiteConfigurator(credentials.userKey, credentials.secret)
    this.#originSiteConfiguration = undefined
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
    const targetSiteConfiguration = await this.getSiteConfiguration(targetApiKey)
    const configurationsToCopy = this.#getConfigurationsToCopy(configOptions)
    for (const config of configurationsToCopy) {
      responses.push(config.copy(targetApiKey, targetSiteConfiguration))
    }
    return (await Promise.all(responses)).flat()
  }

  async getConfiguration() {
    await this.#init()
    const info = new Info(this.#credentials, this.#originApiKey, this.#originSiteConfiguration.dataCenter)
    return info.get()
  }

  async #init() {
    if (this.#originSiteConfiguration === undefined) {
      this.#originSiteConfiguration = await this.getSiteConfiguration(this.#originApiKey)
      this.#initConfigurations()
    }
  }

  async getSiteConfiguration(apiKey) {
    const response = await this.#siteConfigurator.getSiteConfig(apiKey, 'us1')
    if (response.errorCode === 0) {
      return response
    } else {
      throw response
    }
  }

  #initConfigurations() {
    const originDataCenter = this.#originSiteConfiguration.dataCenter
    this.#configurations.push(new Schema(this.#credentials, this.#originApiKey, originDataCenter))
    this.#configurations.push(new Social(this.#credentials, this.#originApiKey, originDataCenter))
    this.#configurations.push(new SmsConfiguration(this.#credentials, this.#originApiKey, originDataCenter))
  }

  #getConfigurationsToCopy(configOptions) {
    return this.#configurations
  }
}

export default ConfigManager
