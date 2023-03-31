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
import ConsentConfiguration from '../consent/consentConfiguration'
import ConsentOptions from '../consent/consentOptions'
import Communication from '../communication/communication'
import CommunicationOptions from '../communication/communicationOptions'

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
      this.#getConsents(),
      this.#getCommunicationTopics(),
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
      if (!WebSdk.hasWebSdk(response)) {
        webSdkOptions.removeWebSdk(info)
      }
      return Promise.resolve(info)
    } else {
      stringToJson(response, 'context')
      return Promise.reject([response])
    }
  }

  async #getConsents() {
    const consentOptions = new ConsentOptions(new ConsentConfiguration(this.#credentials, this.#site, this.#dataCenter))
    const response = await consentOptions.getConfiguration().get()
    if (response.errorCode === 0) {
      const info = JSON.parse(JSON.stringify(consentOptions.getOptionsDisabled()))
      if (!ConsentConfiguration.hasConsents(response)) {
        consentOptions.removeConsent(info)
      }
      return Promise.resolve(info)
    } else if (this.#consentsNotMigrated(response)) {
      const info = JSON.parse(JSON.stringify(consentOptions.getOptionsDisabled()))
      consentOptions.removeConsent(info)
      return Promise.resolve(info)
    } else {
      stringToJson(response, 'context')
      return Promise.reject([response])
    }
  }

  #consentsNotMigrated(response) {
    return response.errorCode === 400096 && response.errorDetails.includes("has not migrated it's consent data")
  }

  async #getSchema() {
    const schemaOptions = new SchemaOptions(new Schema(this.#credentials, this.#site, this.#dataCenter))
    const response = await schemaOptions.getConfiguration().get()
    if (response.errorCode === 0) {
      const info = JSON.parse(JSON.stringify(schemaOptions.getOptionsDisabled()))
      if (!Schema.hasDataSchema(response)) {
        schemaOptions.removeDataSchema(info)
      }
      if (!Schema.hasProfileSchema(response)) {
        schemaOptions.removeProfileSchema(info)
      }
      //if (!response.subscriptionsSchema || Object.keys(response.subscriptionsSchema.fields).length === 0) {
      if (!Schema.hasSubscriptionsSchema(response)) {
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
      screenSetOptions.addCollection(response)
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
      if (!Social.hasSocialProviders(response)) {
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
      emailOptions.addEmails(response)
      const info = JSON.parse(JSON.stringify(emailOptions.getOptionsDisabled()))
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
      if (!SmsConfiguration.hasSmsTemplates(response)) {
        smsOptions.removeSmsTemplates(info)
      }
      return Promise.resolve(info)
    } else {
      stringToJson(response, 'context')
      return Promise.reject([response])
    }
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

  #removeUnsupportedPolicies(response, info, policyOptions) {
    if (!response.accountOptions) {
      policyOptions.removeAccountOptions(info)
    }
    if (!response.authentication) {
      policyOptions.removeAuthentication(info)
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
    if (!response.doubleOptIn) {
      policyOptions.removeDoubleOptIn(info)
    }
    if (!response.preferencesCenter) {
      policyOptions.removePreferencesCenter(info)
    }
  }

  async #getCommunicationTopics() {
    const communicationOptions = new CommunicationOptions(new Communication(this.#credentials, this.#site, this.#dataCenter))
    const response = await communicationOptions.getConfiguration().get()
    if (response.errorCode === 0) {
      const info = JSON.parse(JSON.stringify(communicationOptions.getOptionsDisabled()))
      if (!Communication.hasCommunicationTopics(response)) {
        communicationOptions.removeCommunication(info)
      }
      return Promise.resolve(info)
    } else {
      stringToJson(response, 'context')
      return Promise.reject([response])
    }
  }
}

export default Info
