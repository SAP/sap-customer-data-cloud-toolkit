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
    try {
      const responses = []
      await this.#init()
      for (const targetApiKey of targetApiKeys) {
        responses.push(this.#copyConfigurations(targetApiKey, configOptions))
      }
      return (await Promise.all(responses)).flat()
    } catch (error) {
      return Promise.reject([error])
    }
  }

  async #copyConfigurations(targetApiKey, configOptions) {
    const responses = []
    try {
      const targetSiteConfiguration = await this.getSiteInformation(targetApiKey)
      const configurationsToCopy = this.#getConfigurationsToCopy(configOptions)
      for (const config of configurationsToCopy) {
        responses.push(config.copy(targetApiKey, targetSiteConfiguration))
      }
    } catch (error) {
      responses.push(error)
    }
    return (await Promise.all(responses)).flat()
  }

  async getConfiguration() {
    try {
      await this.#init()
      const info = new Info(this.#credentials, this.#originApiKey, this.#originSiteConfiguration.dataCenter)
      return info.get()
    } catch (error) {
      return Promise.reject([error])
    }
  }

  async #init() {
    if (this.#originSiteConfiguration === undefined) {
      this.#originSiteConfiguration = await this.getSiteInformation(this.#originApiKey)
      this.#initConfigurations()
    }
  }

  async getSiteInformation(apiKey) {
    const response = await this.#siteConfigurator.getSiteConfig(apiKey, 'us1')
    response.context = { id: 'admin.getSiteConfig', targetApiKey: apiKey }
    return response.errorCode === 0 ? Promise.resolve(response) : Promise.reject(response)
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
