import Info from './info/info'
import Schema from './schema/schema'
import Social from './social/social'
import SmsConfiguration from './sms/smsConfiguration'
import SiteConfigurator from '../configurator/siteConfigurator'
import ConfigOptions from './configOptions'
import SchemaOptions from './schema/schemaOptions'
import SmsOptions from './sms/smsOptions'
import SocialOptions from './social/socialOptions'
import EmailConfiguration from './emails/emailConfiguration'
import EmailOptions from './emails/emailOptions'
import WebSdkOptions from './websdk/webSdkOptions'
import WebSdk from './websdk/websdk'
import ScreenSetOptions from './screenset/screensetOptions'
import ScreenSet from './screenset/screenset'

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

  async copy(targetApiKeys, options) {
    //console.log(`options=${JSON.stringify(options)}`)
    try {
      const responses = []
      await this.#init()
      for (const targetApiKey of targetApiKeys) {
        responses.push(this.#copyConfigurations(targetApiKey, options))
      }
      return (await Promise.all(responses)).flat()
    } catch (error) {
      return Promise.reject([error])
    }
  }

  async #copyConfigurations(targetApiKey, options) {
    const responses = []
    try {
      const targetSiteConfiguration = await this.getSiteInformation(targetApiKey)
      const configurationsToCopy = this.#getConfigurationsToCopy(options)
      for (const config of configurationsToCopy) {
        try {
          responses.push(config.getConfiguration().copy(targetApiKey, targetSiteConfiguration, config.getOptions()))
        } catch (error) {
          responses.push(error)
        }
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
      const config = await info.get()
      this.#setScreenSetOptions(config)
      return config
    } catch (error) {
      return Promise.reject(Array.isArray(error) ? error : [error])
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
    this.#configurations.push(new SchemaOptions(new Schema(this.#credentials, this.#originApiKey, originDataCenter)))
    this.#configurations.push(new ScreenSetOptions(new ScreenSet(this.#credentials, this.#originApiKey, originDataCenter)))
    this.#configurations.push(new SocialOptions(new Social(this.#credentials, this.#originApiKey, originDataCenter)))
    this.#configurations.push(new EmailOptions(new EmailConfiguration(this.#credentials, this.#originApiKey, originDataCenter)))
    this.#configurations.push(new SmsOptions(new SmsConfiguration(this.#credentials, this.#originApiKey, originDataCenter)))
    this.#configurations.push(new WebSdkOptions(new WebSdk(this.#credentials, this.#originApiKey, originDataCenter)))
  }

  #getConfigurationsToCopy(options) {
    const filteredConfigurations = []
    const configOptions = new ConfigOptions(options)
    for (const configuration of this.#configurations) {
      if (configOptions.shouldBeCopied(configuration)) {
        filteredConfigurations.push(configuration)
      }
    }
    return filteredConfigurations
  }

  #setScreenSetOptions(options) {
    const screenSetOptionsIndex = 1
    const screenSetOptions = options.find((config) => config.id === 'screenSets')
    if (screenSetOptions) {
      this.#configurations[screenSetOptionsIndex].setOptions(JSON.parse(JSON.stringify(screenSetOptions)))
      this.#configurations[screenSetOptionsIndex].enableAllOptions()
    }
  }
}

export default ConfigManager
