/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import RecaptchaConfiguration from '../../copyConfig/recaptcha/recaptchaConfiguration.js'

class RecaptchaConfigurationManager {
  #credentials
  #site
  #dataCenter
  #recaptcha
  #policy

  constructor(credentials, site, dataCenter) {
    this.#credentials = credentials
    this.#site = site
    this.#dataCenter = dataCenter
    this.#recaptcha = new RecaptchaConfiguration(credentials, site, dataCenter)
  }

  async setFromFiles(apiKey, dataCenter, config) {
    try {
      if (config.recaptchaConfig) {
        await this.#recaptcha.setRecaptchaConfig(apiKey, dataCenter, config.recaptchaConfig)
      } else {
        throw new Error('Recaptcha config is invalid or undefined.')
      }

      if (config.securityPolicies && config.registrationPolicies) {
        await this.#recaptcha.setPolicies(apiKey, dataCenter, config.securityPolicies, config.registrationPolicies)
      } else {
        throw new Error('Policies are invalid or undefined.')
      }

      if (config.riskProvidersConfig) {
        await this.#recaptcha.setRiskProvidersConfig(apiKey, dataCenter, config.riskProvidersConfig)
      } else {
        console.warn('Risk Providers config is invalid or undefined, skipping.')
      }

      return config
    } catch (error) {
      console.error('Error setting recaptcha config from Git:', error)
      throw error
    }
  }
}

export default RecaptchaConfigurationManager
