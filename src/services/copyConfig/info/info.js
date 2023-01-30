import Schema from '../schema/schema'

class Info {
  constructor(credentials, site, dataCenter) {
    this.credentials = credentials
    this.site = site
    this.dataCenter = dataCenter
  }

  async get() {
    return Promise.all([
      this.#getSchema(),
      this.#getScreenSets(),
      this.#getPolicies(),
      this.#getSocialIdentities(),
      this.#getEmailTemplates(),
      this.#getSmsTemplates(),
      this.#getDataflows(),
    ])
  }

  async #getSchema() {
    const schema = new Schema(this.credentials, this.site, this.dataCenter)
    const response = await schema.get()
    return response.errorCode !== 0
      ? Promise.reject(response)
      : Promise.resolve({
          id: 'schema',
          name: 'schema',
          value: [
            {
              id: 'dataSchema',
              name: 'dataSchema',
              value: false,
            },
            {
              id: 'profileSchema',
              name: 'profileSchema',
              value: false,
            },
          ],
        })
  }

  async #getScreenSets() {
    return Promise.resolve({
      screenSets: {
        default: {
          defaultLinkAccounts: false,
          defaultLiteRegistration: false,
        },
        custom: {
          customLinkAccounts: false,
          customLiteRegistration: false,
        },
      },
    })
  }

  async #getPolicies() {
    return Promise.resolve({
      policies: {
        accountOptions: false,
        codeVerification: false,
        emailNotifications: false,
        emailVerification: false,
        federation: false,
        webSdk: false,
        passwordComplexity: false,
        passwordReset: false,
        defaultProfilePhotoDimensions: false,
        registration: false,
        security: false,
        twoFactorAuthenticationProviders: false,
      },
    })
  }

  #getSocialIdentities() {
    return Promise.resolve({
      socialIdentities: false,
    })
  }

  #getEmailTemplates() {
    return Promise.resolve({
      emailTemplates: {
        magicLink: false,
        codeVerification: false,
        emailVerification: false,
        newUserWelcome: false,
        accountDeletionConfirmation: false,
        litePreferencesCenter: false,
        doubleOptInConfirmation: false,
        passwordReset: false,
        tfaEmailVerification: false,
        impossibleTraveler: false,
        passwordResetConfirmation: false,
      },
    })
  }

  #getSmsTemplates() {
    return Promise.resolve({
      smsTemplates: false,
    })
  }

  #getDataflows() {
    return Promise.resolve({
      dataflows: false,
    })
  }
}

export default Info
