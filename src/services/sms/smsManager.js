import Sms from './sms'
import ZipManager from '../zip/zipManager'

class SmsManager {
  #zipManager

  constructor(credentials) {
    this.smsService = new Sms(credentials.userKey, credentials.secret)
    this.#zipManager = new ZipManager()
  }

  async export(site) {
    const smsTemplatesResponse = await this.#exportAllTemplates(site)
    if (smsTemplatesResponse.errorCode !== 0) {
      return Promise.reject(smsTemplatesResponse)
    }
    return this.#zipManager.createZipArchive()
  }

  async #exportAllTemplates(site) {
    const smsTemplatesResponse = await this.smsService.getSiteSms(site)
    if (smsTemplatesResponse.errorCode === 0) {
      this.#exportTfaTemplates(smsTemplatesResponse)
      this.#exportOtpTemplates(smsTemplatesResponse)
    }
    return smsTemplatesResponse
  }

  #exportTfaTemplates(smsTemplatesResponse) {
    this.#exportTemplates(smsTemplatesResponse, "tfa")
  }

  #exportOtpTemplates(smsTemplatesResponse) {
    this.#exportTemplates(smsTemplatesResponse, "otp")
  }

  #exportTemplates(smsTemplatesResponse, type) {
    const globalTemplatesObj = smsTemplatesResponse.templates[type].globalTemplates.templates
    for(const language in globalTemplatesObj) {
      this.#zipManager.createFile(type + "/globalTemplates", language, globalTemplatesObj[language])
    }

    const templatesPerCountryCodeObj = smsTemplatesResponse.templates[type].templatesPerCountryCode
    for(const countryCode in templatesPerCountryCodeObj) {
      const countryCodeObj = templatesPerCountryCodeObj[countryCode].templates
      for(const language in countryCodeObj) {
        this.#zipManager.createFile(`${type}/templatesPerCountryCode/${countryCode}`, language, countryCodeObj[language])
      }
    }
  }
}

export default SmsManager
