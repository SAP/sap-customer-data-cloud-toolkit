/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import Email from '../../emails/email.js'
import { removePropertyPathFromObject, stringToJson } from '../objectHelper.js'
import EmailTemplateNameTranslator from '../../emails/emailTemplateNameTranslator.js'
import Options from '../options.js'

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
    this.#email = new Email(credentials.userKey, credentials.secret, credentials.gigyaConsole)

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
      ['unknownLocationNotification', 'unknownLocationNotification'],
      ['passwordResetNotification', 'passwordResetNotification'],
    ])
  }

  async get() {
    return await this.getEmail().getSiteEmailsWithDataCenter(this.#site, this.#dataCenter)
  }

  async copy(destinationSite, destinationSiteConfiguration, options) {
    let response = await this.get()
    if (response.errorCode === 0) {
      response = await this.copyEmailTemplates(destinationSite, destinationSiteConfiguration, response, options)
    }
    stringToJson(response, 'context')
    return Array.isArray(response) ? response : [response]
  }

  getEmail() {
    return this.#email
  }

  async copyEmailTemplates(destinationSite, destinationSiteConfiguration, response, options) {
    const promises = []
    for (const templateInfo of options.getOptions().branches) {
      if (Options.isOptionSelected(templateInfo)) {
        const filteredResponse = JSON.parse(JSON.stringify(response))
        this.#cleanResponse(filteredResponse)
        const responseProcessed = this.#processLinksOptions(filteredResponse, templateInfo)
        promises.push(this.#copyEmailTemplate(destinationSite, templateInfo.name, destinationSiteConfiguration, responseProcessed))
      }
    }
    return Promise.all(promises)
  }

  #cleanResponse(response) {
    // the following fields should only be copied when processing policies
    if (response.doubleOptIn) {
      delete response.doubleOptIn.nextURL
      delete response.doubleOptIn.nextExpiredURL
    }
    if (response.emailVerification) {
      delete response.emailVerification.nextURL
    }
  }

  #copyEmailTemplate(destinationSite, templateName, destinationSiteConfiguration, response) {
    const emailTranslator = new EmailTemplateNameTranslator()
    const internalTemplateName = emailTranslator.translateExternalName(templateName)
    const templatePath = this.#emailTemplatesInternalPath.get(internalTemplateName)
    const template = this.#getTemplate(response, templatePath)
    if (internalTemplateName === 'twoFactorAuth' && this.#isChildSite(destinationSiteConfiguration, destinationSite)) {
      // cannot override providers on child site
      delete template.providers
    }
    return this.getEmail().setSiteEmailsWithDataCenter(destinationSite, templatePath, template, destinationSiteConfiguration.dataCenter)
  }

  #processLinksOptions(response, option) {
    const responseClone = JSON.parse(JSON.stringify(response))
    const templateHaveLinks = option.branches?.length > 0
    if (templateHaveLinks) {
      if (option.value) {
        this.#removeLinks(responseClone, option)
      } else {
        this.#replaceTemplateWithLinksOnly(responseClone, option)
      }
    }
    return responseClone
  }

  #replaceTemplateWithLinksOnly(response, templateOption) {
    const template = {}
    let templateName
    for (const linkOption of templateOption.branches) {
      if (linkOption.value && linkOption.link) {
        const tokens = linkOption.link.split('.')
        console.assert(tokens.length === 2, 'Template link path does not contain the expected 2 tokens')
        templateName = tokens[0]
        const linkName = tokens[1]
        template[linkName] = response[templateName][linkName]
      }
    }
    if (Object.keys(template).length > 0) {
      response[templateName] = template
    }
  }

  #removeLinks(response, templateOption) {
    for (const linkOption of templateOption.branches) {
      if (!linkOption.value && linkOption.link) {
        removePropertyPathFromObject(response, linkOption.link)
      }
    }
  }

  #isChildSite(siteInfo, siteApiKey) {
    return siteInfo.siteGroupOwner !== undefined && siteInfo.siteGroupOwner !== siteApiKey
  }

  #getTemplate(response, templatePath) {
    const tokens = templatePath.split('.')
    if (tokens.length === 1) {
      return response[tokens[0]]
    } else if (tokens.length === 2) {
      const clone = JSON.parse(JSON.stringify(response))
      this.#removeOtherTemplates(clone, tokens[1])
      return clone[tokens[0]]
    }
    throw new Error(`Unexpected template path ${templatePath}`)
  }

  #removeOtherTemplates(response, templateName) {
    const idx = templateName.indexOf('Templates')
    const prefix = templateName.substring(0, idx)
    const emailNotificationsObj = response['emailNotifications']
    const modifiedEmailNotificationsObj = Object.keys(emailNotificationsObj)
      .filter((key) => key.startsWith(prefix))
      .reduce((obj, key) => {
        obj[key] = emailNotificationsObj[key]
        return obj
      }, {})
    response['emailNotifications'] = modifiedEmailNotificationsObj
  }
}

export default EmailConfiguration
