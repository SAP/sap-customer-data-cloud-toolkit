class Info {
  constructor(credentials, site, dataCenter) {
    this.credentials = credentials
    this.site = site
    this.dataCenter = dataCenter
  }

  async get() {
    const info = {}
    this.#getSchema(info)
    this.#getScreenSets(info)
    this.#getPolicies(info)
    this.#getSocialIdentities(info)
    this.#getEmailTemplates(info)
    this.#getSmsTemplates(info)
    this.#getDataflows(info)
    return info
  }

  #getSchema(info) {
    info.schema = {
      data: true,
      profile: true,
    }
  }

  #getScreenSets(info) {
    info.screenSets = {
      default: {
        defaultLinkAccounts: true,
        defaultLiteRegistration: true,
      },
      custom: {
        customLinkAccounts: true,
        customLiteRegistration: true,
      },
    }
  }

  #getPolicies(info) {
    info.policies = {
      accountOptions: true,
      codeVerification: true,
      emailNotifications: true,
      emailVerification: true,
      federation: true,
      webSdk: true,
      passwordComplexity: true,
      passwordReset: true,
      defaultProfilePhotoDimensions: true,
      registration: true,
      security: true,
      twoFactorAuthenticationProviders: true,
    }
  }

  #getSocialIdentities(info) {
    info.socialIdentities = true
  }

  #getEmailTemplates(info) {
    info.emailTemplates = {
      magicLink: true,
      codeVerification: true,
      emailVerification: true,
      newUserWelcome: true,
      accountDeletionConfirmation: true,
      litePreferencesCenter: true,
      doubleOptInConfirmation: true,
      passwordReset: true,
      tfaEmailVerification: true,
      impossibleTraveler: true,
      passwordResetConfirmation: true,
    }
  }

  #getSmsTemplates(info) {
    info.smsTemplates = true
  }

  #getDataflows(info) {
    info.dataflows = true
  }
}

export default Info
