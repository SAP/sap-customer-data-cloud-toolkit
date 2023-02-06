import Sms from '../../sms/sms'

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

  async copy(destinationSite, destinationSiteConfiguration) {
    let response = await this.get()
    if (response.errorCode === 0) {
      response = await this.getSms().set(destinationSite, destinationSiteConfiguration.dataCenter, response.templates)
    }
    response['id'] = `${this.constructor.name};${destinationSite}`
    return response.errorCode === 0 ? Promise.resolve(response) : Promise.reject(response)
  }

  getSms() {
    return this.#sms
  }
}

export default SmsConfiguration
