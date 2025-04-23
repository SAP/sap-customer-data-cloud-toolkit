/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import Communication from '../copyConfig/communication/communication'
import Topic from '../copyConfig/communication/topic'
import ConsentConfiguration from '../copyConfig/consent/consentConfiguration'
import Dataflow from '../copyConfig/dataflow/dataflow'
import EmailConfiguration from '../copyConfig/emails/emailConfiguration'
import Extension from '../copyConfig/extension/extension'
import Policy from '../copyConfig/policies/policies'
import Rba from '../copyConfig/rba/rba'
import RiskAssessment from '../copyConfig/rba/riskAssessment'
import RecaptchaConfiguration from '../copyConfig/recaptcha/recaptchaConfiguration'
import RecaptchaConfigurationManager from './recaptcha/recaptchConfigurationVersionControl'
import Schema from '../copyConfig/schema/schema'
import ScreenSet from '../copyConfig/screenset/screenset'
import SmsConfiguration from '../copyConfig/sms/smsConfiguration'
import Social from '../copyConfig/social/social'
import Webhook from '../copyConfig/webhook/webhook'
import WebSdk from '../copyConfig/websdk/websdk'
import { cleanEmailResponse, cleanResponse, removeIgnoredFields } from './dataSanitization'
import { createOptions } from './utils'
import ConsentConfigurationManager from './consent/consentConfigurationVersionControl'
import SocialManager from './social/socialManager'

class CdcService {
  constructor(credentials, apiKey, dataCenter, siteInfo) {
    this.credentials = credentials
    this.apiKey = apiKey
    this.dataCenter = dataCenter
    this.siteInfo = siteInfo
    this.webSdk = new WebSdk(this.credentials, apiKey, dataCenter)
    this.dataflow = new Dataflow(this.credentials, apiKey, dataCenter)
    this.emails = new EmailConfiguration(this.credentials, apiKey, dataCenter)
    this.extension = new Extension(this.credentials, apiKey, dataCenter)
    this.policies = new Policy(this.credentials, apiKey, dataCenter)
    this.rba = new Rba(this.credentials, apiKey, dataCenter)
    this.riskAssessment = new RiskAssessment(this.credentials, apiKey, dataCenter)
    this.schema = new Schema(this.credentials, apiKey, dataCenter)
    this.screenSets = new ScreenSet(this.credentials, apiKey, dataCenter)
    this.sms = new SmsConfiguration(this.credentials, apiKey, dataCenter)
    this.communication = new Communication(this.credentials, apiKey, dataCenter)
    this.topic = new Topic(this.credentials, apiKey, dataCenter)
    this.webhook = new Webhook(this.credentials, apiKey, dataCenter)
    this.consent = new ConsentConfiguration(this.credentials, apiKey, dataCenter)
    this.consentManager = new ConsentConfigurationManager(this.credentials, apiKey, dataCenter)
    this.social = new Social(this.credentials, apiKey, dataCenter)
    this.recaptcha = new RecaptchaConfiguration(this.credentials, apiKey, dataCenter)
    this.recaptchaManager = new RecaptchaConfigurationManager(this.credentials, apiKey, dataCenter)
    this.socialManager = new SocialManager(this.credentials, apiKey, dataCenter)
  }

  #getCdcData = () => {
    const responses = [
      { name: 'webSdk', promise: this.webSdk.get() },
      { name: 'dataflow', promise: this.dataflow.search() },
      { name: 'emails', promise: this.emails.get() },
      { name: 'extension', promise: this.extension.get() },
      { name: 'policies', promise: this.policies.get() },
      { name: 'rba', promise: this.rba.get() },
      { name: 'riskAssessment', promise: this.riskAssessment.get() },
      { name: 'schema', promise: this.schema.get() },
      { name: 'screenSets', promise: this.screenSets.get() },
      { name: 'sms', promise: this.sms.get() },
      { name: 'channel', promise: this.communication.get() },
      { name: 'topic', promise: this.topic.searchTopics() },
      { name: 'webhook', promise: this.webhook.get() },
      { name: 'consent', promise: this.consentManager.getConsentsAndLegalStatements() },
      { name: 'social', promise: this.social.get() },
      { name: 'recaptcha', promise: this.recaptcha.get() },
    ]
    return responses
  }

  fetchCDCConfigs = async () => {
    const fieldsToBeIgnored = ['callId', 'time', 'lastModified', 'version', 'context', 'errorCode', 'apiVersion', 'statusCode', 'statusReason',
      'jwtKeyVersion', 'baseDomain', 'trustedSiteURLs', 'trustedShareURLs', 'CNAME', 'shortURLDomain', 'shortURLRedirMethod', 'encryptPII',
      'siteGroupConfig', 'customAPIDomainPrefix', 'enableHSTS', 'dataCenter', 'tags', 'captchaProvider', 'enableDataSharing', 'isCDP',
      'invisibleRecaptcha', 'recaptchaV2', 'funCaptcha']

    try {
      const cdcDataArray = this.#getCdcData()
      if (!Array.isArray(cdcDataArray)) {
        throw new Error('getCdcData must return an array')
      }
      const cdcData = await Promise.all(
        cdcDataArray.map(async ({ name, promise }) => {
          const data = await promise
          if (name === 'sms') {
            SmsConfiguration.addSmsTemplatesPerCountryCode(data)
          }
          const result = removeIgnoredFields(data, fieldsToBeIgnored)
          return { [name]: result }
        }),
      )
      return Object.assign({}, ...cdcData)
    } catch (error) {
      throw new Error(error)
    }
  }

  applyCommitConfig = async (files) => {
    const configHandlers = {
      webSdk: async (filteredResponse) => {
        await this.webSdk.set(this.apiKey, filteredResponse, this.dataCenter)
      },
      emails: async (filteredResponse) => {
        await this.applyEmailsConfig(filteredResponse)
      },
      extension: async (filteredResponse) => {
        if (filteredResponse.result.length > 0) {
          await this.extension.set(this.apiKey, this.dataCenter, filteredResponse.result[0])
        }
      },
      policies: async (filteredResponse) => {
        cleanResponse(filteredResponse)
        await this.policies.set(this.apiKey, filteredResponse, this.dataCenter)
      },
      rba: async (filteredResponse) => {
        await this.applyRbaConfig(filteredResponse)
      },
      riskAssessment: async (filteredResponse) => {
        await this.applyRbaConfig(filteredResponse)
      },
      schema: async (filteredResponse) => {
        await this.applySchemaConfig(filteredResponse)
      },
      screenSets: async (filteredResponse) => {
        for (const screenSet of filteredResponse.screenSets) {
          await this.screenSets.set(this.apiKey, this.dataCenter, screenSet)
        }
      },
      sms: async (filteredResponse) => {
        this.sms.getSms().set(this.apiKey, this.dataCenter, filteredResponse.templates)
      },
      channel: async (filteredResponse) => {
        await this.applyCommunicationConfig(filteredResponse)
      },
      topic: async (filteredResponse) => {
        await this.applyCommunicationConfig(filteredResponse)
      },
      dataflow: async (filteredResponse) => {
        await this.applyDataflowConfig(filteredResponse)
      },
      webhook: async (filteredResponse) => {
        await this.applyWebhookConfig(filteredResponse)
      },
      consent: async (filteredResponse) => {
        if (filteredResponse.preferences) {
          await this.consentManager.setConsentsAndLegalStatements(this.apiKey, this.siteInfo, filteredResponse)
        }
      },
      social: async (filteredResponse) => {
        await this.socialManager.setFromFiles(this.apiKey, this.dataCenter, filteredResponse)
      },
      recaptcha: async (filteredResponse) => {
        await this.recaptchaManager.setFromFiles(this.apiKey, this.dataCenter, filteredResponse)
      },
    }

    for (const file of files) {
      const fileType = file.filename.split('/').pop().split('.').shift()
      const filteredResponse = file.content

      if (configHandlers[fileType]) {
        try {
          await configHandlers[fileType](filteredResponse)
        } catch (error) {
          throw new Error(`Error applying config for file type ${fileType}: ${error.message}`)
        }
      } else {
        throw new Error(`Unknown file type: ${fileType}`)
      }
    }
  }

  async applyEmailsConfig(filteredResponse) {
    cleanEmailResponse(filteredResponse)
    for (let key in filteredResponse) {
      if (key !== 'errorCode') {
        await this.emails.getEmail().setSiteEmailsWithDataCenter(this.apiKey, key, filteredResponse[key], this.dataCenter)
      }
    }
  }

  async applySchemaConfig(filteredResponse) {
    for (let key in filteredResponse) {
      if (filteredResponse.hasOwnProperty(key)) {
        if (key === 'dataSchema') {
          await this.schema.set(this.apiKey, this.dataCenter, { dataSchema: filteredResponse.dataSchema })
        }
        if (key === 'addressesSchema') {
          await this.schema.set(this.apiKey, this.dataCenter, { addressesSchema: filteredResponse.addressesSchema })
        }
        if (key === 'internalSchema') {
          await this.schema.set(this.apiKey, this.dataCenter, { internalSchema: filteredResponse.internalSchema })
        }
        if (key === 'profileSchema') {
          await this.schema.set(this.apiKey, this.dataCenter, { profileSchema: filteredResponse.profileSchema })
        }
        if (key === 'subscriptionsSchema') {
          await this.schema.set(this.apiKey, this.dataCenter, { subscriptionsSchema: filteredResponse.subscriptionsSchema })
        }
      }
    }
  }

  async applyRbaConfig(filteredResponse) {
    if (filteredResponse[0]) {
      await this.rba.setAccountTakeoverProtection(this.apiKey, filteredResponse[0])
    }
    if (filteredResponse[1]) {
      await this.rba.setUnknownLocationNotification(this.apiKey, this.siteInfo, filteredResponse[1])
    }
    if (filteredResponse[2]) {
      await this.rba.setRbaRulesAndSettings(this.apiKey, this.siteInfo, filteredResponse[2])
    }
  }

  async applyCommunicationConfig(filteredResponse) {
    if (filteredResponse.Channels) {
      await this.communication.setChannels(this.apiKey, this.siteInfo, filteredResponse.Channels)
    }
    if (filteredResponse.results) {
      await this.communication.setTopics(this.apiKey, this.siteInfo, filteredResponse.results)
    }
  }

  async applyDataflowConfig(filteredResponse) {
    if (filteredResponse.result) {
      const options = createOptions(filteredResponse.result)
      await this.dataflow.copyDataflows(this.apiKey, this.siteInfo, filteredResponse, options)
    }
  }

  async applyWebhookConfig(filteredResponse) {
    if (filteredResponse.webhooks) {
      const options = createOptions(filteredResponse.webhooks)
      await this.webhook.copyWebhooks(this.apiKey, this.dataCenter, filteredResponse, options)
    }
  }
}

export default CdcService
