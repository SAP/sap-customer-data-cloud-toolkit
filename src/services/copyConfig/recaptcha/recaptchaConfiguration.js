/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import Recaptcha from '../../recaptcha/recaptcha.js'
import Policy from '../policies/policies.js'
import RiskProviders from '../../recaptcha/riskProviders.js'

class RecaptchaConfiguration {
  #credentials
  #site
  #dataCenter
  #recaptcha
  #policy
  #riskProviders

  constructor(credentials, site, dataCenter) {
    this.#credentials = credentials
    this.#site = site
    this.#dataCenter = dataCenter
    this.#recaptcha = new Recaptcha(credentials.userKey, credentials.secret, credentials.gigyaConsole)
    this.#policy = new Policy(credentials, site, dataCenter)
    this.#riskProviders = new RiskProviders(credentials.userKey, credentials.secret, credentials.gigyaConsole)
  }

  async get() {
    try {
      const recaptchaResponse = await this.getRecaptcha().get(this.#site, this.#dataCenter)
      if (recaptchaResponse.errorCode !== 0) {
        throw new Error(`Error fetching reCAPTCHA policies: ${recaptchaResponse.errorMessage}`)
      }

      const policiesResponse = await this.#policy.get()
      if (policiesResponse.errorCode !== 0) {
        throw new Error(`Error fetching security and registration policies: ${policiesResponse.errorMessage}`)
      }

      const riskProvidersResponse = await this.#riskProviders.get(this.#site, this.#dataCenter)
      if (riskProvidersResponse.errorCode !== 0) {
        throw new Error(`Error fetching Risk Providers configuration: ${riskProvidersResponse.errorMessage}`)
      }

      return {
        errorCode: recaptchaResponse.errorCode,
        recaptchaConfig: recaptchaResponse.Config,
        securityPolicies: policiesResponse.security,
        registrationPolicies: policiesResponse.registration,
        riskProvidersConfig: riskProvidersResponse.config,
      }
    } catch (error) {
      console.error(`Error in RecaptchaConfiguration.get: ${error}`)
      throw error
    }
  }

  async setRecaptchaConfig(site, dataCenter, recaptchaConfig) {
    try {
      const response = await this.getRecaptcha().set(site, dataCenter, recaptchaConfig)
      if (response.errorCode === 0) {
        return response
      } else {
        throw new Error(`Error setting reCAPTCHA configuration: ${response.errorMessage}`)
      }
    } catch (error) {
      console.error('Error in setRecaptchaConfig:', error.message || error)
      throw error
    }
  }

  async setPolicies(targetSite, securityPolicies, registrationPolicies) {
    try {
      const newSecurityConfig = {
        riskAssessmentWithReCaptchaV3: securityPolicies.riskAssessmentWithReCaptchaV3,
        riskAssessmentWithTransUnion: securityPolicies.riskAssessmentWithTransUnion,
      }

      const newConfig = {
        security: newSecurityConfig,
        registration: {
          requireCaptcha: registrationPolicies.requireCaptcha,
          requireSecurityQuestion: registrationPolicies.requireSecurityQuestion,
          requireLoginID: registrationPolicies.requireLoginID,
          enforceCoppa: registrationPolicies.enforceCoppa,
        },
      }

      const response = await this.#policy.set(targetSite, newConfig, this.#dataCenter)
      if (response.errorCode === 0) {
        return response
      } else {
        throw new Error(`Error fetching current policies: ${response.errorMessage}`)
      }
    } catch (error) {
      console.error(`Error in setPolicies: ${error.message || error}`)
      throw error
    }
  }

  async setRiskProvidersConfig(site, dataCenter, riskProvidersConfig) {
    try {
      const response = await this.#riskProviders.set(site, dataCenter, riskProvidersConfig)
      if (response.errorCode === 0) {
        return response
      } else {
        throw new Error(`Error setting Risk Providers configuration: ${response.errorMessage}`)
      }
    } catch (error) {
      console.error('Error in setRiskProvidersConfig:', error.message || error)
      throw error
    }
  }

  async copy(targetSite, targetDataCenter) {
    try {
      const config = await this.get()
      const dataCenter = targetDataCenter.dataCenter || targetDataCenter

      if (config.recaptchaConfig) {
        await this.setRecaptchaConfig(targetSite, dataCenter, config.recaptchaConfig)
      } else {
        throw new Error('Recaptcha config is invalid or undefined.')
      }

      if (config.securityPolicies && config.registrationPolicies) {
        await this.setPolicies(targetSite, config.securityPolicies, config.registrationPolicies)
      } else {
        throw new Error('Policies are invalid or undefined.')
      }

      if (config.riskProvidersConfig) {
        await this.setRiskProvidersConfig(targetSite, dataCenter, config.riskProvidersConfig)
      } else {
        console.warn('Risk Providers config is invalid or undefined, skipping.')
      }

      return config
    } catch (error) {
      console.error('Error during copyAllConfigs:', error.message || error)
      throw error
    }
  }
  async setFromFiles(apiKey, dataCenter, config) {
    try {
      if (config.recaptchaConfig) {
        await this.setRecaptchaConfig(apiKey, dataCenter, config.recaptchaConfig)
      } else {
        throw new Error('Recaptcha config is invalid or undefined.')
      }

      if (config.securityPolicies && config.registrationPolicies) {
        await this.setPolicies(apiKey, dataCenter, config.securityPolicies, config.registrationPolicies)
      } else {
        throw new Error('Policies are invalid or undefined.')
      }

      if (config.riskProvidersConfig) {
        await this.setRiskProvidersConfig(apiKey, dataCenter, config.riskProvidersConfig)
      } else {
        console.warn('Risk Providers config is invalid or undefined, skipping.')
      }

      console.log('Recaptcha config set from Git:', config)
      return config
    } catch (error) {
      console.error('Error setting recaptcha config from Git:', error)
      throw error
    }
  }
  getRecaptcha() {
    return this.#recaptcha
  }

  static hasRecaptchaPolicies(response) {
    return response && response.Config && Array.isArray(response.Config) && response.Config.length > 0
  }
}

export default RecaptchaConfiguration
