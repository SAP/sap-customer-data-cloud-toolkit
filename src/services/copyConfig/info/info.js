import Schema from '../schema/schema'
import Social from '../social/social'
import SmsConfiguration from '../sms/smsConfiguration'
import { stringToJson } from '../objectHelper'
import EmailConfiguration from '../emails/emailConfiguration'
import SocialOptions from '../social/socialOptions'
import SchemaOptions from '../schema/schemaOptions'
import SmsOptions from '../sms/smsOptions'
import EmailOptions from '../emails/emailOptions'
import WebSdk from '../websdk/websdk'
import WebSdkOptions from '../websdk/webSdkOptions'
import Policy from '../policies/policies'
import PolicyOptions from '../policies/policyOptions'
import ScreenSetOptions from '../screenset/screensetOptions'
import ScreenSet from '../screenset/screenset'

class Info {
  #credentials
  #site
  #dataCenter

  constructor(credentials, site, dataCenter) {
    this.#credentials = credentials
    this.#site = site
    this.#dataCenter = dataCenter
  }

  async get() {
    const response = []
    return Promise.all([
      this.#getSchema(),
      this.#getScreenSets(),
      this.#getPolicies(),
      this.#getSocialIdentities(),
      this.#getEmailTemplates(),
      this.#getSmsTemplates(),
      this.#getWebSdk(),
    ]).then((infos) => {
      infos.forEach((info) => {
        if (this.#hasConfiguration(info)) {
          response.push(info)
        }
      })
      return response
    })
  }

  #hasConfiguration(info) {
    return info.branches === undefined || (info.branches !== undefined && info.branches.length > 0)
  }

  async #getWebSdk() {
    const webSdkOptions = new WebSdkOptions(new WebSdk(this.#credentials, this.#site, this.#dataCenter))
    const response = await webSdkOptions.getConfiguration().get()
    if (response.errorCode === 0) {
      const info = JSON.parse(JSON.stringify(webSdkOptions.getOptionsDisabled()))
      if (response.globalConf === '' || response.globalConf === undefined) {
        webSdkOptions.removeWebSdk(info)
      }
      return Promise.resolve(info)
    } else {
      stringToJson(response, 'context')
      return Promise.reject([response])
    }
  }

  async #getSchema() {
    const schemaOptions = new SchemaOptions(new Schema(this.#credentials, this.#site, this.#dataCenter))
    const response = await schemaOptions.getConfiguration().get()
    if (response.errorCode === 0) {
      const info = JSON.parse(JSON.stringify(schemaOptions.getOptionsDisabled()))
      if (!response.dataSchema) {
        schemaOptions.removeDataSchema(info)
      }
      if (!response.profileSchema) {
        schemaOptions.removeProfileSchema(info)
      }
      if (!response.subscriptionsSchema || Object.keys(response.subscriptionsSchema.fields).length === 0) {
        schemaOptions.removeSubscriptionsSchema(info)
      }
      return Promise.resolve(info)
    } else {
      stringToJson(response, 'context')
      return Promise.reject([response])
    }
  }

  async #getScreenSets() {
    const screenSetOptions = new ScreenSetOptions(new ScreenSet(this.#credentials, this.#site, this.#dataCenter))
    const response = await screenSetOptions.getConfiguration().get()
    if (response.errorCode === 0) {
      screenSetOptions.addCollection(response.screenSets)
      const info = JSON.parse(JSON.stringify(screenSetOptions.getOptionsDisabled()))
      return Promise.resolve(info)
    } else {
      stringToJson(response, 'context')
      return Promise.reject([response])
    }
  }

  async #getSocialIdentities() {
    const socialOptions = new SocialOptions(new Social(this.#credentials, this.#site, this.#dataCenter))
    const response = await socialOptions.getConfiguration().get()
    if (response.errorCode === 0) {
      const info = socialOptions.getOptionsDisabled()
      if (!this.#hasSocialProviders(response.providers)) {
        socialOptions.removeSocialProviders(info)
      }
      return Promise.resolve(info)
    } else {
      stringToJson(response, 'context')
      return Promise.reject([response])
    }
  }

  async #getEmailTemplates() {
    const emailOptions = new EmailOptions(new EmailConfiguration(this.#credentials, this.#site, this.#dataCenter))
    const response = await emailOptions.getConfiguration().get()

    if (response.errorCode === 0) {
      const info = JSON.parse(JSON.stringify(emailOptions.getOptionsDisabled()))
      this.#removeUnsupportedOptions(response, info, emailOptions)
      return Promise.resolve(info)
    } else {
      stringToJson(response, 'context')
      return Promise.reject([response])
    }
  }

  async #getSmsTemplates() {
    const smsOptions = new SmsOptions(new SmsConfiguration(this.#credentials, this.#site, this.#dataCenter))
    const response = await smsOptions.getConfiguration().get()
    if (response.errorCode === 0) {
      const info = smsOptions.getOptionsDisabled()
      if (!response.templates) {
        smsOptions.removeSmsTemplates(info)
      }
      return Promise.resolve(info)
    } else {
      stringToJson(response, 'context')
      return Promise.reject([response])
    }
  }

  #hasSocialProviders(providers) {
    let atLeastOneHasConfig = false
    for (const key in providers) {
      if (!Object.values(providers[key].app).every((x) => x === '')) {
        atLeastOneHasConfig = true
        break
      }
    }
    return atLeastOneHasConfig
  }
  async #getPolicies() {
    const policyOptions = new PolicyOptions(new Policy(this.#credentials, this.#site, this.#dataCenter))
    const response = await policyOptions.getConfiguration().get()

    if (response.errorCode === 0) {
      const info = JSON.parse(JSON.stringify(policyOptions.getOptionsDisabled()))
      this.#removeUnsupportedPolicies(response, info, policyOptions)
      return Promise.resolve(info)
    } else {
      stringToJson(response, 'context')
      return Promise.reject([response])
    }
  }
  #removeUnsupportedOptions(response, info, emailOptions) {
    if (!response.emailNotifications.confirmationEmailTemplates) {
      emailOptions.removePasswordResetConfirmation(info)
    }
    if (!response.impossibleTraveler) {
      emailOptions.removeImpossibleTraveler(info)
    }
    if (!response.twoFactorAuth) {
      emailOptions.removeTFAEmailVerification(info)
    }
    if (!response.passwordReset) {
      emailOptions.removePasswordReset(info)
    }
    if (!response.doubleOptIn) {
      emailOptions.removeDoubleOptInConfirmation(info)
    }
    if (!response.preferencesCenter) {
      emailOptions.removeLitePreferencesCenter(info)
    }
    if (!response.emailNotifications.accountDeletedEmailTemplates) {
      emailOptions.removeAccountDeletionConfirmation(info)
    }
    if (!response.emailNotifications.welcomeEmailTemplates) {
      emailOptions.removeNewUserWelcome(info)
    }
    if (!response.emailVerification) {
      emailOptions.removeEmailVerification(info)
    }
    if (!response.codeVerification) {
      emailOptions.removeCodeVerification(info)
    }
    if (!response.magicLink) {
      emailOptions.removeMagicLink(info)
    }
  }

  #removeUnsupportedPolicies(response, info, policyOptions) {
    if (!response.accountOptions) {
      policyOptions.removeAccountOptions(info)
    }
    if (!response.codeVerification) {
      policyOptions.removeCodeVerification(info)
    }
    if (!response.emailNotifications) {
      policyOptions.removeEmailNotification(info)
    }
    if (!response.emailVerification) {
      policyOptions.removeEmailVerification(info)
    }
    if (!response.federation) {
      policyOptions.removeFederation(info)
    }
    if (!response.passwordComplexity) {
      policyOptions.removePasswordComplexity(info)
    }
    if (!response.gigyaPlugins) {
      policyOptions.removeWebSdk(info)
    }
    if (!response.passwordReset) {
      policyOptions.removePasswordReset(info)
    }
    if (!response.profilePhoto) {
      policyOptions.removeProfilePhoto(info)
    }
    if (!response.registration) {
      policyOptions.removeRegistration(info)
    }
    if (!response.security) {
      policyOptions.removeSecurity(info)
    }
    if (!response.twoFactorAuth) {
      policyOptions.removeTwoFactorAuth(info)
    }
  }
}

export default Info
