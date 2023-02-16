import Sms from '../../sms/sms'
import { stringToJson } from '../objectHelper'

class SmsConfiguration {
  #credentials
  #site
  #dataCenter
  #sms

  constructor(credentials, site, dataCenter) {
    this.#credentials = credentials
    this.#site = site
    this.#dataCenter = dataCenter
    this.#sms = new Sms(credentials.userKey, credentials.secret)
  }

  async get() {
    return await this.getSms().get(this.#site, this.#dataCenter)
  }

  async copy(destinationSite, destinationSiteConfiguration, option= []) {
    let response = await this.get()
    if (response.errorCode === 0) {
      response = await this.getSms().set(destinationSite, destinationSiteConfiguration.dataCenter, response)
    }
    stringToJson(response, 'context')
    return response
  }

  getSms() {
    return this.#sms
  }
}

export default SmsConfiguration
