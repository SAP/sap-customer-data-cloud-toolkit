/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import Schema from '../schema/schema.js'
import Social from '../social/social.js'
import SmsConfiguration from '../sms/smsConfiguration.js'
import { stringToJson } from '../objectHelper.js'
import EmailConfiguration from '../emails/emailConfiguration.js'
import SocialOptions from '../social/socialOptions.js'
import SchemaOptions from '../schema/schemaOptions.js'
import SmsOptions from '../sms/smsOptions.js'
import EmailOptions from '../emails/emailOptions.js'
import WebSdk from '../websdk/websdk.js'
import WebSdkOptions from '../websdk/webSdkOptions.js'
import Policy from '../policies/policies.js'
import PolicyOptions from '../policies/policyOptions.js'
import ScreenSetOptions from '../screenset/screensetOptions.js'
import ScreenSet from '../screenset/screenset.js'
import ConsentConfiguration from '../consent/consentConfiguration.js'
import ConsentOptions from '../consent/consentOptions.js'
import Communication from '../communication/communication.js'
import CommunicationOptions from '../communication/communicationOptions.js'
import Webhook from '../webhook/webhook.js'
import WebhookOptions from '../webhook/webhookOptions.js'
import ExtensionOptions from '../extension/extensionOptions.js'
import Extension from '../extension/extension.js'
import DataflowOptions from '../dataflow/dataflowOptions.js'
import Dataflow from '../dataflow/dataflow.js'
import Rba from '../rba/rba.js'
import RbaOptions from '../rba/rbaOptions.js'
import RecaptchaOptions from '../recaptcha/recaptchaOptions.js'
import RecaptchaConfiguration from '../recaptcha/recaptchaConfiguration.js'

class Info {
  #credentials
  #apiKey
  #dataCenter
  #siteInfo

  constructor(credentials, apiKey, siteInfo) {
    this.#credentials = credentials
    this.#apiKey = apiKey
    this.#dataCenter = siteInfo.dataCenter
    this.#siteInfo = siteInfo
  }

  async get() {
    const response = []
    return Promise.all([
      this.#getSchema(),
      this.#getConsents(),
      this.#getCommunicationTopics(),
      this.#getScreenSets(),
      this.#getPolicies(),
      this.#getSocialIdentities(),
      this.#getEmailTemplates(),
      this.#getSmsTemplates(),
      this.#getWebSdk(),
      this.#getDataflows(),
      this.#getWebhooks(),
      this.#getExtensions(),
      this.#getRba(),
      this.#getRecaptcha(),
    ]).then((infos) => {
      infos.forEach((info) => {
        if (Info.#hasConfiguration(info)) {
          response.push(info)
        }
      })
      return response
    })
  }

  static #hasConfiguration(info) {
    return info.branches === undefined || info.branches.length > 0
  }

  async #getDataflows() {
    const dataflowOptions = new DataflowOptions(new Dataflow(this.#credentials, this.#apiKey, this.#dataCenter))
    const response = await dataflowOptions.getConfiguration().search()
    if (response.errorCode === 0) {
      dataflowOptions.add(response)
      const info = JSON.parse(JSON.stringify(dataflowOptions.getOptionsDisabled()))
      return Promise.resolve(info)
    } else {
      stringToJson(response, 'context')
      return Promise.reject([response])
    }
  }

  async #getWebSdk() {
    const webSdkOptions = new WebSdkOptions(new WebSdk(this.#credentials, this.#apiKey, this.#dataCenter))
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
    const consentOptions = new ConsentOptions(new ConsentConfiguration(this.#credentials, this.#apiKey, this.#dataCenter))
    const response = await consentOptions.getConfiguration().get()
    if (response.errorCode === 0) {
      const info = JSON.parse(JSON.stringify(consentOptions.getOptionsDisabled()))
      if (!ConsentConfiguration.hasConsents(response)) {
        consentOptions.removeConsent(info)
      }
      return Promise.resolve(info)
    } else if (Info.#consentsNotMigrated(response)) {
      const info = JSON.parse(JSON.stringify(consentOptions.getOptionsDisabled()))
      consentOptions.removeConsent(info)
      return Promise.resolve(info)
    } else {
      stringToJson(response, 'context')
      return Promise.reject([response])
    }
  }

  static #consentsNotMigrated(response) {
    return response.errorCode === 400096 && response.errorDetails.includes("has not migrated it's consent data")
  }

  async #getSchema() {
    const schemaOptions = new SchemaOptions(new Schema(this.#credentials, this.#apiKey, this.#dataCenter))
    const response = await schemaOptions.getConfiguration().get()
    if (response.errorCode === 0) {
      const info = JSON.parse(JSON.stringify(schemaOptions.getOptionsDisabled()))
      if (!Schema.hasDataSchema(response)) {
        schemaOptions.removeDataSchema(info)
      }
      if (!Schema.hasProfileSchema(response)) {
        schemaOptions.removeProfileSchema(info)
      }
      if (!Schema.hasSubscriptionsSchema(response)) {
        schemaOptions.removeSubscriptionsSchema(info)
      }
      if (!Schema.hasInternalSchema(response)) {
        schemaOptions.removeInternalSchema(info)
      }
      if (!Schema.hasAddressesSchema(response)) {
        schemaOptions.removeAddressesSchema(info)
      }
      return Promise.resolve(info)
    } else {
      stringToJson(response, 'context')
      return Promise.reject([response])
    }
  }

  async #getScreenSets() {
    const screenSetOptions = new ScreenSetOptions(new ScreenSet(this.#credentials, this.#apiKey, this.#dataCenter))
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
    const socialOptions = new SocialOptions(new Social(this.#credentials, this.#apiKey, this.#dataCenter))
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
    const emailOptions = new EmailOptions(new EmailConfiguration(this.#credentials, this.#apiKey, this.#dataCenter))
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
    const smsOptions = new SmsOptions(new SmsConfiguration(this.#credentials, this.#apiKey, this.#dataCenter))
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
    const policyOptions = new PolicyOptions(new Policy(this.#credentials, this.#apiKey, this.#dataCenter))
    const response = await policyOptions.getConfiguration().get()
    if (response.errorCode === 0) {
      policyOptions.addSupportedPolicies(response)
      const info = JSON.parse(JSON.stringify(policyOptions.getOptionsDisabled()))
      return Promise.resolve(info)
    } else {
      stringToJson(response, 'context')
      return Promise.reject([response])
    }
  }

  async #getCommunicationTopics() {
    const communicationOptions = new CommunicationOptions(new Communication(this.#credentials, this.#apiKey, this.#dataCenter))
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

  async #getWebhooks() {
    const webhookOptions = new WebhookOptions(new Webhook(this.#credentials, this.#apiKey, this.#dataCenter))
    const response = await webhookOptions.getConfiguration().get()
    if (response.errorCode === 0) {
      webhookOptions.addWebhooks(response)
      const info = JSON.parse(JSON.stringify(webhookOptions.getOptionsDisabled()))
      return Promise.resolve(info)
    } else {
      stringToJson(response, 'context')
      return Promise.reject([response])
    }
  }

  async #getExtensions() {
    const extensionOptions = new ExtensionOptions(new Extension(this.#credentials, this.#apiKey, this.#dataCenter))
    const response = await extensionOptions.getConfiguration().get()
    if (response.errorCode === 0) {
      extensionOptions.addExtensions(response)
      const info = JSON.parse(JSON.stringify(extensionOptions.getOptionsDisabled()))
      return Promise.resolve(info)
    } else {
      stringToJson(response, 'context')
      return Promise.reject([response])
    }
  }

  async #getRba() {
    const rbaOptions = new RbaOptions(new Rba(this.#credentials, this.#apiKey, this.#dataCenter))
    const responses = await rbaOptions.getConfiguration().get()
    if (responses.every((r) => r.errorCode === 0)) {
      const info = JSON.parse(JSON.stringify(rbaOptions.getOptionsDisabled()))
      if (!Rba.hasRules(responses[2])) {
        rbaOptions.removeRules(info)
      }
      if (this.#isChildSite(this.#siteInfo)) {
        rbaOptions.removeAllOptions(info)
      }
      return Promise.resolve(info)
    } else {
      return Promise.reject(responses)
    }
  }

  #isChildSite(siteInfo) {
    if (siteInfo) {
      return siteInfo.siteGroupOwner !== undefined && siteInfo.siteGroupOwner !== this.#apiKey
    }
  }
  async #getRecaptcha() {
    const recaptchaOptions = new RecaptchaOptions(new RecaptchaConfiguration(this.#credentials, this.#apiKey, this.#dataCenter))
    const response = await recaptchaOptions.getConfiguration().get()

    if (response.errorCode === 0) {
      const info = recaptchaOptions.getOptionsDisabled()
      return Promise.resolve(info)
    } else {
      stringToJson(response, 'context')
      return Promise.reject([response])
    }
  }
}

export default Info
