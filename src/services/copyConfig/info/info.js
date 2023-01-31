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
      id: 'screenSets',
      name: 'screenSets',
      value: [
        {
          id: 'default',
          name: 'default',
          value: [
            {
              id: 'defaultLinkAccounts',
              name: 'defaultLinkAccounts',
              value: false,
            },
            {
              id: 'defaultLiteRegistration',
              name: 'defaultLiteRegistration',
              value: false,
            },
          ],
        },
        {
          id: 'custom',
          name: 'custom',
          value: [
            {
              id: 'customLinkAccounts',
              name: 'customLinkAccounts',
              value: false,
            },
            {
              id: 'customLiteRegistration',
              name: 'customLiteRegistration',
              value: false,
            },
          ],
        },
      ],
    })
  }

  async #getPolicies() {
    return Promise.resolve({
      id: 'policies',
      name: 'policies',
      value: [
        {
          id: 'accountOptions',
          name: 'accountOptions',
          value: false,
        },
        {
          id: 'codeVerification',
          name: 'codeVerification',
          value: false,
        },
        {
          id: 'emailNotifications',
          name: 'emailNotifications',
          value: false,
        },
        {
          id: 'emailVerification',
          name: 'emailVerification',
          value: false,
        },
        {
          id: 'federation',
          name: 'federation',
          value: false,
        },
        {
          id: 'webSdk',
          name: 'webSdk',
          value: false,
        },
        {
          id: 'passwordComplexity',
          name: 'passwordComplexity',
          value: false,
        },
        {
          id: 'passwordReset',
          name: 'passwordReset',
          value: false,
        },
        {
          id: 'defaultProfilePhotoDimensions',
          name: 'defaultProfilePhotoDimensions',
          value: false,
        },
        {
          id: 'registration',
          name: 'registration',
          value: false,
        },
        {
          id: 'security',
          name: 'security',
          value: false,
        },
        {
          id: 'twoFactorAuthenticationProviders',
          name: 'twoFactorAuthenticationProviders',
          value: false,
        },
      ],
    })
  }

  #getSocialIdentities() {
    return Promise.resolve({
      id: 'socialIdentities',
      name: 'socialIdentities',
      value: false,
    })
  }

  #getEmailTemplates() {
    return Promise.resolve({
      id: 'emailTemplates',
      name: 'emailTemplates',
      value: [
        {
          id: 'magicLink',
          name: 'magicLink',
          value: false,
        },
        {
          id: 'codeVerification',
          name: 'codeVerification',
          value: false,
        },
        {
          id: 'emailVerification',
          name: 'emailVerification',
          value: false,
        },
        {
          id: 'newUserWelcome',
          name: 'newUserWelcome',
          value: false,
        },
        {
          id: 'accountDeletionConfirmation',
          name: 'accountDeletionConfirmation',
          value: false,
        },
        {
          id: 'litePreferencesCenter',
          name: 'litePreferencesCenter',
          value: false,
        },
        {
          id: 'doubleOptInConfirmation',
          name: 'doubleOptInConfirmation',
          value: false,
        },
        {
          id: 'etPasswordReset',
          name: 'passwordReset',
          passwordReset: false,
        },
        {
          id: 'tfaEmailVerification',
          name: 'tfaEmailVerification',
          value: false,
        },
        {
          id: 'impossibleTraveler',
          name: 'impossibleTraveler',
          value: false,
        },
        {
          id: 'passwordResetConfirmation',
          name: 'passwordResetConfirmation',
          value: false,
        },
      ],
    })
  }

  #getSmsTemplates() {
    return Promise.resolve({
      id: 'smsTemplates',
      name: 'smsTemplates',
      value: false,
    })
  }

  #getDataflows() {
    return Promise.resolve({
      id: 'dataflows',
      name: 'dataflows',
      value: false,
    })
  }
}

export default Info
