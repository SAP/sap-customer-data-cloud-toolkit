import Options from '../options'

class PolicyOptions extends Options {
  #policy
  static #twoFactorAuth = 'TwoFactorAuthenticationProviders'

  constructor(policy) {
    const accountOptions = 'accountOptions'
    const codeVerification = 'codeVerification'
    const emailNotification = 'emailNotifications'
    const webSdk = 'Web Sdk'
    const emailVerification = 'emailVerification'
    const federation = 'federation'
    const passwordComplexity = 'passwordComplexity'
    const passwordReset = 'passwordReset'
    const profilePhoto = 'profilePhoto'
    const registration = 'registration'
    const security = 'security'
    super({
      id: 'policies',
      name: 'policies',
      value: true,
      tooltip: 'POLICIES',
      branches: [
        {
          id: accountOptions,
          name: 'AccountOptions',
          value: true,
          tooltip: 'POLICIES_ACCOUNT_OPTIONS',
        },
        {
          id: codeVerification,
          name: 'CodeVerification',
          value: true,
          tooltip: 'CODE_VERIFICATION',
        },
        {
          id: emailNotification,
          name: 'EmailNotifications',
          value: true,

          tooltip: 'POLICIES_EMAIL_NOTIFICATIONS',
        },
        {
          id: emailVerification,
          name: 'EmailVerification',
          value: true,

          tooltip: 'POLICIES_EMAIL_VERIFICATION',
        },
        {
          id: federation,
          name: 'Federation',
          value: true,

          tooltip: 'POLICIES_FEDERATION',
        },

        {
          id: passwordComplexity,
          name: 'PasswordComplexity',
          value: true,

          tooltip: 'POLICIES_PASSWORD_COMPLEXITY',
        },
        {
          id: `gigyaPlugins`,
          name: webSdk,
          value: true,

          tooltip: 'POLICIES_WEBSDK',
        },
        {
          id: passwordReset,
          name: 'passwordReset',
          value: true,
          tooltip: 'POLICIES_PASSWORD_RESET',
        },
        {
          id: profilePhoto,
          name: 'profilePhoto',
          value: true,
          tooltip: 'POLICIES_DEFAULT_PROFILE_PHOTO_DIMENSIONS',
        },
        {
          id: registration,
          name: 'Registration',
          value: true,
          tooltip: 'POLICIES_REGISTRATION',
        },
        {
          id: security,
          name: 'Security',
          value: true,
          tooltip: 'POLICIES_SECURITY',
        },
        {
          id: 'twoFactorAuth',
          name: PolicyOptions.#twoFactorAuth,
          value: true,
          tooltip: 'POLICIES_TWO_FACTOR_AUTHENTICATION_PROVIDERS',
        },
      ],
    })
    this.#policy = policy
  }

  getConfiguration() {
    return this.#policy
  }
  removeAccountOptions(info) {
    return this.removeInfo('AccountOptions', info)
  }
  removeCodeVerification(info) {
    return this.removeInfo('CodeVerification', info)
  }

  removeEmailNotification(info) {
    return this.removeInfo('EmailNotifications', info)
  }

  removeEmailVerification(info) {
    return this.removeInfo('EmailVerification', info)
  }

  removeFederation(info) {
    return this.removeInfo('Federation', info)
  }
  removePasswordComplexity(info) {
    return this.removeInfo('PasswordComplexity', info)
  }
  removePasswordReset(info) {
    return this.removeInfo('passwordReset', info)
  }
  removeProfilePhoto(info) {
    return this.removeInfo('profilePhoto', info)
  }
  removeRegistration(info) {
    return this.removeInfo('Registration', info)
  }
  removeSecurity(info) {
    return this.removeInfo('Security', info)
  }
  removeTwoFactorAuth(info) {
    return this.removeInfo(PolicyOptions.#twoFactorAuth, info)
  }
  removeWebSdk(info) {
    return this.removeInfo('Web Sdk', info)
  }
}

export default PolicyOptions
