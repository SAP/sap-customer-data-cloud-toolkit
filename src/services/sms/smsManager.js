import Sms from './sms'
import ZipManager from '../zip/zipManager'
import _ from 'lodash'
import { EXPORT_SMS_TEMPLATES_FILE_NAME } from '../../constants'

class SmsManager {
  static TEMPLATE_FILE_EXTENSION = '.txt'
  static TEMPLATE_DEFAULT_LANGUAGE_PLACEHOLDER = '.default'
  static TEMPLATE_TYPE_TFA = 'tfa'
  static TEMPLATE_TYPE_OTP = 'otp'
  #zipManager

  constructor(credentials) {
    this.smsService = new Sms(credentials.userKey, credentials.secret)
    this.#zipManager = new ZipManager()
  }

  async export(site) {
    const smsTemplatesResponse = await this.smsService.getSiteSms(site)
    if (smsTemplatesResponse.errorCode === 0) {
      this.#exportTfaTemplates(smsTemplatesResponse)
      this.#exportOtpTemplates(smsTemplatesResponse)
      return this.#zipManager.createZipArchive()
    } else {
      return Promise.reject(smsTemplatesResponse)
    }
  }

  async import(site, zipContent) {
    const zipContentMap = await this.#zipManager.read(zipContent)
    this.#removeNotRelatedContent(zipContentMap)
    const smsTemplatesResponse = await this.#importTemplates(site, zipContentMap)
    return smsTemplatesResponse.errorCode === 0 ? smsTemplatesResponse : Promise.reject(smsTemplatesResponse)
  }

  #removeNotRelatedContent(zipContentMap) {
    for (const entry of zipContentMap) {
      if (!this.#isTemplateFile(entry[0])) {
        zipContentMap.delete(entry[0])
      }
    }
  }

  #isTemplateFile(file) {
    return (
      file.endsWith(SmsManager.TEMPLATE_FILE_EXTENSION) &&
      (file.startsWith(`${EXPORT_SMS_TEMPLATES_FILE_NAME}/${SmsManager.TEMPLATE_TYPE_TFA}`) || file.startsWith(`${EXPORT_SMS_TEMPLATES_FILE_NAME}/${SmsManager.TEMPLATE_TYPE_OTP}`))
    )
  }

  async #importTemplates(site, zipContentMap) {
    const templates = this.#buildTemplatesFromZipContent(zipContentMap)
    return this.smsService.setSiteSms(site, templates)
  }

  #buildTemplatesFromZipContent(zipContentMap) {
    let template = {}
    for (let [filePath, newTemplate] of zipContentMap) {
      _.merge(template, this.#createTemplateObject(filePath, newTemplate))
    }
    return template
  }

  #createTemplateObject(zipEntry, newTemplate) {
    const template = {}
    let pointer = template
    const tokens = zipEntry.split('/')
    if (tokens.length > 3) {
      let i
      for (i = 1; i < tokens.length - 1; ++i) { // i=1 to ignore the root folder token
        pointer[tokens[i]] = {}
        pointer = pointer[tokens[i]]
      }
      pointer['templates'] = {}
      const languageIndex = tokens[i].lastIndexOf(SmsManager.TEMPLATE_FILE_EXTENSION)
      if (languageIndex !== -1) {
        let separatorIndex = languageIndex
        if (this.#isDefaultLanguage(tokens[i])) {
          separatorIndex = tokens[i].lastIndexOf(SmsManager.TEMPLATE_DEFAULT_LANGUAGE_PLACEHOLDER)
          pointer['defaultLanguage'] = tokens[i].slice(0, separatorIndex)
        }
        pointer = pointer.templates
        pointer[tokens[i].slice(0, separatorIndex)] = newTemplate
      }
    }
    return template
  }

  #isDefaultLanguage(filename) {
    return filename.includes(SmsManager.TEMPLATE_DEFAULT_LANGUAGE_PLACEHOLDER + SmsManager.TEMPLATE_FILE_EXTENSION)
  }

  #exportTfaTemplates(smsTemplatesResponse) {
    this.#exportTemplates(smsTemplatesResponse, SmsManager.TEMPLATE_TYPE_TFA)
  }

  #exportOtpTemplates(smsTemplatesResponse) {
    this.#exportTemplates(smsTemplatesResponse, SmsManager.TEMPLATE_TYPE_OTP)
  }

  #exportTemplates(smsTemplatesResponse, type) {
    this.#exportGlobalTemplates(smsTemplatesResponse, type)
    this.#exportTemplatesPerCountryCode(smsTemplatesResponse, type)
  }

  #exportGlobalTemplates(smsTemplatesResponse, type) {
    const folder = `${EXPORT_SMS_TEMPLATES_FILE_NAME}/${type}/globalTemplates`
    const globalTemplatesObj = smsTemplatesResponse.templates[type].globalTemplates.templates
    const globalTemplatesDefaultLanguage = smsTemplatesResponse.templates[type].globalTemplates.defaultLanguage
    for (const language in globalTemplatesObj) {
      const filename = globalTemplatesDefaultLanguage === language ? `${language}${SmsManager.TEMPLATE_DEFAULT_LANGUAGE_PLACEHOLDER}` : `${language}`
      this.#zipManager.createFile(folder, `${filename}${SmsManager.TEMPLATE_FILE_EXTENSION}`, globalTemplatesObj[language])
    }
    if (globalTemplatesObj === undefined || Object.keys(globalTemplatesObj).length === 0) {
      this.#zipManager.createFolder(folder)
    }
  }

  #exportTemplatesPerCountryCode(smsTemplatesResponse, type) {
    const folder = `${EXPORT_SMS_TEMPLATES_FILE_NAME}/${type}/templatesPerCountryCode`
    const templatesPerCountryCodeObj = smsTemplatesResponse.templates[type].templatesPerCountryCode
    for (const countryCode in templatesPerCountryCodeObj) {
      const countryCodeObj = templatesPerCountryCodeObj[countryCode].templates
      const templatesPerCountryCodeDefaultLanguage = templatesPerCountryCodeObj[countryCode].defaultLanguage
      for (const language in countryCodeObj) {
        const filename = templatesPerCountryCodeDefaultLanguage === language ? `${language}${SmsManager.TEMPLATE_DEFAULT_LANGUAGE_PLACEHOLDER}` : `${language}`
        this.#zipManager.createFile(`${folder}/${countryCode}`, `${filename}${SmsManager.TEMPLATE_FILE_EXTENSION}`, countryCodeObj[language])
      }
    }
    if (templatesPerCountryCodeObj === undefined || Object.keys(templatesPerCountryCodeObj).length === 0) {
      this.#zipManager.createFolder(folder)
    }
  }
}

export default SmsManager
