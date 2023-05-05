import Options from '../options'
import EmailTemplateNameTranslator from '../../emails/emailTemplateNameTranslator'

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
  }
}

export default EmailOptions
