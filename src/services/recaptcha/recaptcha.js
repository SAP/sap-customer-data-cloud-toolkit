import client from '../gigya/client.js'
import UrlBuilder from '../gigya/urlBuilder.js'
import generateErrorResponse from '../errors/generateErrorResponse.js'
import SiteConfigurator from '../configurator/siteConfigurator.js'

class Recaptcha {
  static #ERROR_MSG_GET_CONFIG = 'Error getting Recaptcha configuration'
  static #ERROR_MSG_SET_CONFIG = 'Error setting reCAPTCHA configuration'
  static #NAMESPACE = 'admin'

  constructor(userKey, secret, gigyaConsole) {
    this.userKey = userKey
    this.secret = secret
    this.gigyaConsole = gigyaConsole
    this.siteConfigurator = new SiteConfigurator(userKey, secret, gigyaConsole)
  }

  async get(site, dataCenter) {
    console.log('Fetching reCAPTCHA config for site:', site)
    const url = UrlBuilder.buildUrl(Recaptcha.#NAMESPACE, dataCenter, Recaptcha.getGetRecaptchaEndpoint(), this.gigyaConsole)
    try {
      const res = await client.post(url, this.#getRecaptchaParameters(site))
      console.log('Recaptcha response data:', res.data) 
      return res.data
    } catch (error) {
      return generateErrorResponse(error, Recaptcha.#ERROR_MSG_GET_CONFIG)
    }
  }

  async getRecaptcha(site) {
    const dataCenterResponse = await this.siteConfigurator.getSiteConfig(site)

    const dataCenter = dataCenterResponse.dataCenter
    if (!dataCenter || typeof dataCenter !== 'string') {
      throw new Error('Invalid dataCenter: expected a string but got: ' + typeof dataCenter)
    }

    return this.get(site, dataCenter)
  }

  // Método para configurar o reCAPTCHA
  async set(site, dataCenter, Config) {
    console.log('Setting reCAPTCHA config for site:', site, Config)
    const url = UrlBuilder.buildUrl(Recaptcha.#NAMESPACE, dataCenter, Recaptcha.getSetRecaptchaEndpoint(), this.gigyaConsole)

    console.log('Built URL:', url)

    try {
      const params = await client.post(url, this.#setRecaptchaParameters(site, Config))
      return params.data
    } catch (error) {
      return generateErrorResponse(error, Recaptcha.#ERROR_MSG_SET_CONFIG)
    }
  }

  #getRecaptchaParameters(apiKey) {
    return {
      apiKey,
      userKey: this.userKey,
      secret: this.secret,
      context: JSON.stringify({ id: 'recaptcha', targetApiKey: apiKey }),
    }
  }

  #setRecaptchaParameters(apiKey, Config) {
    return {
      ...this.#getRecaptchaParameters(apiKey),
      Config: JSON.stringify(Config),
    }
  }

  static getGetRecaptchaEndpoint() {
    return `${Recaptcha.#NAMESPACE}.captcha.getConfig`
  }

  static getSetRecaptchaEndpoint() {
    return `${Recaptcha.#NAMESPACE}.captcha.setConfig`
  }
}

export default Recaptcha
