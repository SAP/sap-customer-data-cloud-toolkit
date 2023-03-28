import Options from '../options'

class PolicyOptions extends Options {
  #policy
  static #twoFactorAuth = 'TwoFactorAuthenticationProviders'
  static #profilePhoto = 'defaultProfilePhotoDimensions'
  static #accountOptions = 'accountOptions'
  //static #authentication = 'authentication'
  static #codeVerification = 'codeVerification'
  static #emailNotifications = 'emailNotifications'
  static #emailVerification = 'emailVerification'
  static #federation = 'federation'
  static #passwordComplexity = 'passwordComplexity'
  static #passwordReset = 'passwordReset'
  static #registration = 'registration'
  static #security = 'security'
  static #webSdk = 'Web Sdk'

  constructor(policy) {
    super({
      id: 'policies',
      name: 'policies',
      value: true,
      tooltip: 'POLICIES',
      branches: [
        {
          id: PolicyOptions.#accountOptions,
          name: PolicyOptions.#accountOptions,
          value: true,
          tooltip: 'POLICIES_ACCOUNT_OPTIONS',
        },
        // {
        //   id: PolicyOptions.#authentication,
        //   name: PolicyOptions.#authentication,
        //   value: true,
        //   tooltip: 'POLICIES_AUTHENTICATION',
        // },
        {
          id: `p${PolicyOptions.#codeVerification}`,
          name: PolicyOptions.#codeVerification,
          value: true,
          tooltip: 'CODE_VERIFICATION',
        },
        {
          id: PolicyOptions.#emailNotifications,
          name: PolicyOptions.#emailNotifications,
          value: true,

          tooltip: 'POLICIES_EMAIL_NOTIFICATIONS',
        },
        {
          id: `p${PolicyOptions.#emailVerification}`,
          name: PolicyOptions.#emailVerification,
          value: true,

          tooltip: 'POLICIES_EMAIL_VERIFICATION',
        },
        {
          id: PolicyOptions.#federation,
          name: PolicyOptions.#federation,
          value: true,

          tooltip: 'POLICIES_FEDERATION',
        },

        {
          id: PolicyOptions.#passwordComplexity,
          name: PolicyOptions.#passwordComplexity,
          value: true,

          tooltip: 'POLICIES_PASSWORD_COMPLEXITY',
        },
        {
          id: 'gigyaPlugins',
          name: PolicyOptions.#webSdk,
          value: true,

          tooltip: 'POLICIES_WEBSDK',
        },
        {
          id: `p${PolicyOptions.#passwordReset}`,
          name: PolicyOptions.#passwordReset,
          value: true,
          tooltip: 'POLICIES_PASSWORD_RESET',
        },
        {
          id: 'profilePhoto',
          name: PolicyOptions.#profilePhoto,
          value: true,
          tooltip: 'POLICIES_DEFAULT_PROFILE_PHOTO_DIMENSIONS',
        },
        {
          id: PolicyOptions.#registration,
          name: PolicyOptions.#registration,
          value: true,
          tooltip: 'POLICIES_REGISTRATION',
        },
        {
          id: PolicyOptions.#security,
          name: PolicyOptions.#security,
          value: true,
          tooltip: 'POLICIES_SECURITY',
        },
        {
          id: 'pTwoFactorAuth',
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
    return this.removeInfo(PolicyOptions.#accountOptions, info)
  }
  removeCodeVerification(info) {
    return this.removeInfo(PolicyOptions.#codeVerification, info)
  }

  removeEmailNotification(info) {
    return this.removeInfo(PolicyOptions.#emailNotifications, info)
  }

  removeEmailVerification(info) {
    return this.removeInfo(PolicyOptions.#emailVerification, info)
  }

  removeFederation(info) {
    return this.removeInfo(PolicyOptions.#federation, info)
  }
  removePasswordComplexity(info) {
    return this.removeInfo(PolicyOptions.#passwordComplexity, info)
  }
  removePasswordReset(info) {
    return this.removeInfo(PolicyOptions.#passwordReset, info)
  }
  removeProfilePhoto(info) {
    return this.removeInfo(PolicyOptions.#profilePhoto, info)
  }
  removeRegistration(info) {
    return this.removeInfo(PolicyOptions.#registration, info)
  }
  removeSecurity(info) {
    return this.removeInfo(PolicyOptions.#security, info)
  }
  removeTwoFactorAuth(info) {
    return this.removeInfo(PolicyOptions.#twoFactorAuth, info)
  }
  removeWebSdk(info) {
    return this.removeInfo(PolicyOptions.#webSdk, info)
  }
}

export default PolicyOptions
