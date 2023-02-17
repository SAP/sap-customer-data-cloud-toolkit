import Email from '../../emails/email'
import { stringToJson } from '../objectHelper'
import EmailTemplateNameTranslator from '../../emails/emailTemplateNameTranslator'

class EmailConfiguration {
  #credentials
  #site
  #dataCenter
  #email
  #emailTemplatesInternalPath

  constructor(credentials, site, dataCenter) {
    this.#credentials = credentials
    this.#site = site
    this.#dataCenter = dataCenter
    this.#email = new Email(credentials.userKey, credentials.secret)

    this.#emailTemplatesInternalPath = new Map([
      ['magicLink', 'magicLink'],
      ['codeVerification', 'codeVerification'],
      ['emailVerification', 'emailVerification'],
      ['welcomeEmailTemplates', 'emailNotifications.welcomeEmailTemplates'],
      ['accountDeletedEmailTemplates', 'emailNotifications.accountDeletedEmailTemplates'],
      ['preferencesCenter', 'preferencesCenter'],
      ['doubleOptIn', 'doubleOptIn'],
      ['passwordReset', 'passwordReset'],
      ['twoFactorAuth', 'twoFactorAuth'],
      ['impossibleTraveler', 'impossibleTraveler'],
      ['confirmationEmailTemplates', 'emailNotifications.confirmationEmailTemplates'],
    ])
  }

  async get() {
    return await this.getEmail().getSiteEmailsWithDataCenter(this.#site, this.#dataCenter)
  }

  async copy(destinationSite, destinationSiteConfiguration, options) {
    let response = await this.get()
    if (response.errorCode === 0) {
      response = await this.#copyEmailTemplates(destinationSite, destinationSiteConfiguration.dataCenter, response, options)
    }
    stringToJson(response, 'context')
    return Array.isArray(response) ? response : [response]
  }

  getEmail() {
    return this.#email
  }

  async #copyEmailTemplates(destinationSite, dataCenter, response, options) {
    const promises = []
    for (const templateInfo of options.branches) {
      if (templateInfo.value) {
        promises.push(this.#copyEmailTemplate(destinationSite, options.branches[0].name, dataCenter, response))
      }
    }
    return Promise.all(promises)
  }

  #copyEmailTemplate(destinationSite, templateName, dataCenter, response) {
    const emailTranslator = new EmailTemplateNameTranslator()
    const internalTemplateName = emailTranslator.translateExternalName(templateName)
    const templatePath = this.#emailTemplatesInternalPath.get(internalTemplateName)
    const template = this.#getTemplate(response, templatePath)
    return this.getEmail().setSiteEmailsWithDataCenter(destinationSite, internalTemplateName, template, dataCenter)
  }

  #getTemplate(response, templatePath) {
    const tokens = templatePath.split('.')
    if (tokens.length === 1) {
      return response[tokens[0]]
    } else if (tokens.length === 2) {
      return response[tokens[0]][tokens[1]]
    }
    throw new Error(`Unexpected template path ${templatePath}`)
  }
}

export default EmailConfiguration
