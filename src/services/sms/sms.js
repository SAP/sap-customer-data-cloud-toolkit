import client from '../gigya/client'
import UrlBuilder from '../gigya/urlBuilder'
import generateErrorResponse from '../errors/generateErrorResponse'
import GigyaManager from '../gigya/gigyaManager'

class Sms {
  static #ERROR_MSG_GET_CONFIG = 'Error getting sms templates'
  static #ERROR_MSG_SET_CONFIG = 'Error setting sms templates'
  static #NAMESPACE = 'accounts'

  constructor(userKey, secret) {
    this.userKey = userKey
    this.secret = secret
    this.gigyaManager = new GigyaManager(this.userKey, this.secret)
  }

  async getSiteSms(site) {
    const dataCenterResponse = await this.gigyaManager.getDataCenterFromSite(site)
    if (dataCenterResponse.errorCode !== 0) {
      return dataCenterResponse
    }

    const url = UrlBuilder.buildUrl(Sms.#NAMESPACE, dataCenterResponse.dataCenter, Sms.getGetSmsTemplatesEndpoint())
    const res = await client.post(url, this.#getSmsTemplatesParameters(site)).catch(function (error) {
      //console.log(`error=${error}`)
      return generateErrorResponse(error, Sms.#ERROR_MSG_GET_CONFIG)
    })

    return res.data
  }

  async setSiteSms(site, templates) {
    const dataCenterResponse = await this.gigyaManager.getDataCenterFromSite(site)
    if (dataCenterResponse.errorCode !== 0) {
      return dataCenterResponse
    }

    const url = UrlBuilder.buildUrl(Sms.#NAMESPACE, dataCenterResponse.dataCenter, Sms.getSetSmsTemplatesEndpoint())
    const res = await client.post(url, this.#setSmsTemplatesParameters(site, templates)).catch(function (error) {
      //console.log(`error=${error}`)
      return generateErrorResponse(error, Sms.#ERROR_MSG_SET_CONFIG)
    })

    return res.data
  }

  #getSmsTemplatesParameters(apiKey) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.userKey

    return parameters
  }

  #setSmsTemplatesParameters(apiKey, templates) {
    const parameters = Object.assign(templates, this.#getSmsTemplatesParameters(apiKey))
    parameters.secret = this.secret

    return parameters
  }

  static getGetSmsTemplatesEndpoint() {
    return `${Sms.#NAMESPACE}.sms.templates.get`
  }

  static getSetSmsTemplatesEndpoint() {
    return `${Sms.#NAMESPACE}.sms.templates.set`
  }
}

export default Sms