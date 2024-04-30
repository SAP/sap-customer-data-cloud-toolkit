/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import Options from '../options.js'

class PolicyOptions extends Options {
  #policy
  static #twoFactorAuth = 'TwoFactorAuthenticationProviders'
  static #profilePhoto = 'defaultProfilePhotoDimensions'
  static #accountOptions = 'accountOptions'
  static #authentication = 'authentication'
  static #codeVerification = 'codeVerification'
  static #emailNotifications = 'emailNotifications'
  static #emailVerification = 'emailVerification'
  static #federation = 'federation'
  static #passwordComplexity = 'passwordComplexity'
  static #passwordReset = 'passwordReset'
  static #registration = 'registration'
  static #security = 'security'
  static #webSdk = 'Web Sdk'
  static #doubleOptIn = 'doubleOptIn'
  static #preferencesCenter = 'preferencesCenter'
  static #idPrefix = 'p'

  constructor(policy) {
    const policies = 'policies'
    super({
      id: policies,
      name: policies,
      value: true,
      tooltip: policies.toUpperCase(),
      branches: [],
    })
    this.#policy = policy
  }

  getConfiguration() {
    return this.#policy
  }

  addSupportedPolicies(response) {
    if (response.accountOptions) {
      this.options.branches.push({
        id: PolicyOptions.#accountOptions,
        name: PolicyOptions.#accountOptions,
        propertyName: PolicyOptions.#accountOptions,
        value: true,
        tooltip: 'POLICIES_ACCOUNT_OPTIONS',
      })
    }
    if (response.authentication) {
      this.options.branches.push({
        id: PolicyOptions.#authentication,
        name: PolicyOptions.#authentication,
        propertyName: PolicyOptions.#authentication,
        value: true,
        tooltip: 'POLICIES_AUTHENTICATION',
      })
    }
    if (response.codeVerification) {
      this.options.branches.push({
        id: `${PolicyOptions.#idPrefix}${PolicyOptions.#codeVerification}`,
        name: PolicyOptions.#codeVerification,
        propertyName: PolicyOptions.#codeVerification,
        value: true,
        tooltip: 'CODE_VERIFICATION',
      })
    }
    if (response.emailNotifications) {
      this.options.branches.push({
        id: PolicyOptions.#emailNotifications,
        name: PolicyOptions.#emailNotifications,
        propertyName: PolicyOptions.#emailNotifications,
        value: true,

        tooltip: 'POLICIES_EMAIL_NOTIFICATIONS',
      })
    }
    if (response.emailVerification) {
      const evOption = {
        id: `${PolicyOptions.#idPrefix}${PolicyOptions.#emailVerification}`,
        name: PolicyOptions.#emailVerification,
        propertyName: PolicyOptions.#emailVerification,
        value: true,
        tooltip: 'POLICIES_EMAIL_VERIFICATION',
      }
      if (response.emailVerification.nextURL) {
        evOption['branches'] = [
          {
            id: `${evOption.id}-Link`,
            name: 'Include Customize Redirection URL',
            link: `${PolicyOptions.#emailVerification}.nextURL`,
            value: true,
          },
        ]
      }
      this.options.branches.push(evOption)
    }
    if (response.federation) {
      this.options.branches.push({
        id: PolicyOptions.#federation,
        name: PolicyOptions.#federation,
        propertyName: PolicyOptions.#federation,
        value: true,

        tooltip: 'POLICIES_FEDERATION',
      })
    }
    if (response.passwordComplexity) {
      this.options.branches.push({
        id: PolicyOptions.#passwordComplexity,
        name: PolicyOptions.#passwordComplexity,
        propertyName: PolicyOptions.#passwordComplexity,
        value: true,

        tooltip: 'POLICIES_PASSWORD_COMPLEXITY',
      })
    }
    if (response.gigyaPlugins) {
      this.options.branches.push({
        id: 'gigyaPlugins',
        name: PolicyOptions.#webSdk,
        propertyName: 'gigyaPlugins',
        value: true,
        tooltip: 'POLICIES_WEBSDK',
      })
    }
    if (response.passwordReset) {
      this.options.branches.push({
        id: `${PolicyOptions.#idPrefix}${PolicyOptions.#passwordReset}`,
        name: PolicyOptions.#passwordReset,
        propertyName: PolicyOptions.#passwordReset,
        value: true,
        tooltip: 'POLICIES_PASSWORD_RESET',
      })
    }
    if (response.profilePhoto) {
      this.options.branches.push({
        id: 'profilePhoto',
        name: PolicyOptions.#profilePhoto,
        propertyName: 'profilePhoto',
        value: true,
        tooltip: 'POLICIES_DEFAULT_PROFILE_PHOTO_DIMENSIONS',
      })
    }
    if (response.registration) {
      this.options.branches.push({
        id: PolicyOptions.#registration,
        name: PolicyOptions.#registration,
        propertyName: PolicyOptions.#registration,
        value: true,
        tooltip: 'POLICIES_REGISTRATION',
      })
    }
    if (response.security) {
      this.options.branches.push({
        id: PolicyOptions.#security,
        name: PolicyOptions.#security,
        propertyName: PolicyOptions.#security,
        value: true,
        tooltip: 'POLICIES_SECURITY',
      })
    }
    if (response.twoFactorAuth) {
      this.options.branches.push({
        id: `${PolicyOptions.#idPrefix}TwoFactorAuth`,
        name: PolicyOptions.#twoFactorAuth,
        propertyName: `twoFactorAuth`,
        value: true,
        tooltip: 'POLICIES_TWO_FACTOR_AUTHENTICATION_PROVIDERS',
      })
    }
    if (response.doubleOptIn) {
      const id = `${PolicyOptions.#idPrefix}${PolicyOptions.#doubleOptIn}`
      const doiOption = {
        id: `${id}`,
        name: PolicyOptions.#doubleOptIn,
        propertyName: PolicyOptions.#doubleOptIn,
        value: true,
        tooltip: 'POLICIES_DOUBLE_OPT_IN',
      }
      doiOption.branches = []
      if (response.doubleOptIn.nextURL) {
        doiOption.branches.push({
          id: `${id}-nextUrl-Link`,
          name: 'Include Customize Redirection URL',
          link: `${PolicyOptions.#doubleOptIn}.nextURL`,
          value: true,
        })
      }
      if (response.doubleOptIn.nextExpiredURL) {
        doiOption.branches.push({
          id: `${id}-nextExpiredUrl-Link`,
          name: 'Include Customize Expired Redirection URL',
          link: `${PolicyOptions.#doubleOptIn}.nextExpiredURL`,
          value: true,
        })
      }
      if (doiOption.branches.length === 0) {
        delete doiOption.branches
      }
      this.options.branches.push(doiOption)
    }
    if (response.preferencesCenter) {
      this.options.branches.push({
        id: `${PolicyOptions.#idPrefix}${PolicyOptions.#preferencesCenter}`,
        name: PolicyOptions.#preferencesCenter,
        propertyName: PolicyOptions.#preferencesCenter,
        value: true,
        tooltip: 'POLICIES_PREFERENCES_CENTER',
      })
    }
    return this
  }
}

export default PolicyOptions
