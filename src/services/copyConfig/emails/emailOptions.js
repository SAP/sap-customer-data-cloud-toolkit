/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import Options from '../options.js'
import EmailTemplateNameTranslator from '../../emails/emailTemplateNameTranslator.js'

class EmailOptions extends Options {
  #emailConfiguration

  constructor(emailConfiguration) {
    const emailTemplates = 'emailTemplates'
    super({
      id: emailTemplates,
      name: emailTemplates,
      value: true,
      branches: [],
    })
    this.#emailConfiguration = emailConfiguration
  }

  getConfiguration() {
    return this.#emailConfiguration
  }

  addUrl(response) {
    const passwordUrl = response.passwordReset.resetURL
    const preferences = response.preferencesCenter.redirectURL
    this.updateBranches('preferencesCenter', preferences, 'Lite Preferences Center')
    this.updateBranches('passwordReset', passwordUrl, 'Reset Page')
  }

  updateBranches(name, url, checkBoxName) {
    const collection = this.options.branches.find((collection) => collection.id === name)
    const optionName = `Include ${checkBoxName} URL`
    if (collection) {
      console.log('collection', collection.name)
      collection.branches = []
      this.#addLink(url, optionName, collection.branches)
    }
  }
  #addLink(url, linkName, branches) {
    if (url) {
      branches.push({
        id: `${linkName}-Email-Link`,
        name: linkName,
        formatName: false,
        value: false,
      })
    }
  }
  addEmails(response) {
    const emailTemplateNameTranslator = new EmailTemplateNameTranslator()
    if (response.magicLink) {
      const id = 'magicLink'
      this.options.branches.push({
        id: id,
        name: emailTemplateNameTranslator.translateInternalName(id),
        value: true,
      })
    }
    if (response.codeVerification) {
      const id = 'codeVerification'
      this.options.branches.push({
        id: id,
        name: emailTemplateNameTranslator.translateInternalName(id),
        value: true,
      })
    }
    if (response.emailVerification) {
      const id = 'emailVerification'
      this.options.branches.push({
        id: id,
        name: emailTemplateNameTranslator.translateInternalName(id),
        value: true,
      })
    }
    if (response.emailNotifications.welcomeEmailTemplates) {
      const id = 'welcomeEmailTemplates'
      this.options.branches.push({
        id: id,
        name: emailTemplateNameTranslator.translateInternalName(id),
        value: true,
      })
    }
    if (response.emailNotifications.accountDeletedEmailTemplates) {
      const id = 'accountDeletedEmailTemplates'
      this.options.branches.push({
        id: id,
        name: emailTemplateNameTranslator.translateInternalName(id),
        value: true,
      })
    }
    if (response.preferencesCenter) {
      const id = 'preferencesCenter'
      this.options.branches.push({
        id: id,
        name: emailTemplateNameTranslator.translateInternalName(id),
        value: true,
      })
    }
    if (response.doubleOptIn) {
      const id = 'doubleOptIn'
      this.options.branches.push({
        id: id,
        name: emailTemplateNameTranslator.translateInternalName(id),
        value: true,
      })
    }
    if (response.passwordReset) {
      const id = 'passwordReset'
      this.options.branches.push({
        id: id,
        name: emailTemplateNameTranslator.translateInternalName(id),
        value: true,
      })
    }
    if (response.twoFactorAuth) {
      const id = 'twoFactorAuth'
      this.options.branches.push({
        id: id,
        name: emailTemplateNameTranslator.translateInternalName(id),
        value: true,
      })
    }
    if (response.impossibleTraveler) {
      const id = 'impossibleTraveler'
      this.options.branches.push({
        id: id,
        name: emailTemplateNameTranslator.translateInternalName(id),
        value: true,
      })
    }
    if (response.emailNotifications.confirmationEmailTemplates) {
      const id = 'confirmationEmailTemplates'
      this.options.branches.push({
        id: id,
        name: emailTemplateNameTranslator.translateInternalName(id),
        value: true,
      })
    }
    if (response.unknownLocationNotification) {
      const id = 'unknownLocationNotification'
      this.options.branches.push({
        id: id,
        name: emailTemplateNameTranslator.translateInternalName(id),
        value: true,
      })
    }
    if (response.passwordResetNotification) {
      const id = 'passwordResetNotification'
      this.options.branches.push({
        id: id,
        name: emailTemplateNameTranslator.translateInternalName(id),
        value: true,
      })
    }
  }
}

export default EmailOptions
