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
import Schema from '../copyConfig/schema/schema'
import ScreenSet from '../copyConfig/screenset/screenset'
import SmsConfiguration from '../copyConfig/sms/smsConfiguration'
import Social from '../copyConfig/social/social'
import Webhook from '../copyConfig/webhook/webhook'
import WebSdk from '../copyConfig/websdk/websdk'
import { cleanEmailResponse, cleanResponse } from './dataSanitization'
import { createOptions } from './utils'

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
    this.social = new Social(this.credentials, apiKey, dataCenter)
    this.recaptcha = new RecaptchaConfiguration(this.credentials, apiKey, dataCenter)
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
      { name: 'consent', promise: this.consent.get() },
      { name: 'social', promise: this.social.get() },
      { name: 'recaptcha', promise: this.recaptcha.get() },
    ]
    return responses
  }

  fetchCDCConfigs = async () => {
    const cdcDataArray = await this.#getCdcData()
    if (!Array.isArray(cdcDataArray)) {
      throw new Error('getCdcData must return an array')
    }
    const cdcData = await Promise.all(
      cdcDataArray.map(async ({ name, promise }) => {
        const data = await promise.catch((err) => console.error(`Error resolving ${name}:`, err))
        return { [name]: data }
      }),
    )
    return Object.assign({}, ...cdcData)
  }

  applyCommitConfig = async (files) => {
    for (const file of files) {
      const fileType = file.filename.split('/').pop().split('.').shift()
      let filteredResponse = file.content
      let options
      switch (fileType) {
        case 'webSdk':
          await this.webSdk.set(this.apiKey, filteredResponse, this.dataCenter)
          break
        case 'emails':
          cleanEmailResponse(filteredResponse)
          for (let key in filteredResponse) {
            if (key !== 'errorCode') {
              await this.emails.getEmail().setSiteEmailsWithDataCenter(this.apiKey, key, filteredResponse[key], this.dataCenter)
            }
          }
          break
        case 'extension':
          if (filteredResponse.result.length > 0) {
            await this.extension.set(this.apiKey, this.dataCenter, filteredResponse.result[0])
          }
          break
        case 'policies':
          cleanResponse(filteredResponse)
          await this.policies.set(this.apiKey, filteredResponse, this.dataCenter)
          break
        case 'rba':
        case 'riskAssessment':
          if (filteredResponse[0]) {
            await this.rba.setAccountTakeoverProtection(this.apiKey, filteredResponse[0])
          }
          if (filteredResponse[1]) {
            await this.rba.setUnknownLocationNotification(this.apiKey, this.siteInfo, filteredResponse[1])
          }
          if (filteredResponse[2]) {
            await this.rba.setRbaRulesAndSettings(this.apiKey, this.siteInfo, filteredResponse[2])
          }
          break
        case 'schema':
          for (let key in filteredResponse) {
            if (filteredResponse.hasOwnProperty(key)) {
              if (key === 'dataSchema') {
                await this.schema.set(this.apiKey, this.dataCenter, filteredResponse.dataSchema)
              }
              if (key === 'addressesSchema') {
                await this.schema.set(this.apiKey, this.dataCenter, filteredResponse.addressesSchema)
              }
              if (key === 'internalSchema') {
                await this.schema.set(this.apiKey, this.dataCenter, filteredResponse.internalSchema)
              }
              if (key === 'profileSchema') {
                await this.schema.set(this.apiKey, this.dataCenter, filteredResponse.profileSchema)
              }
              if (key === 'subscriptionsSchema') {
                await this.schema.set(this.apiKey, this.dataCenter, filteredResponse.subscriptionsSchema)
              }
            }
          }
          break
        case 'screenSets':
          for (const screenSet of filteredResponse.screenSets) {
            await this.screenSets.set(this.apiKey, this.dataCenter, screenSet)
          }
          break
        case 'sms':
          this.sms.getSms().set(this.apiKey, this.dataCenter, filteredResponse.templates)
          break
        case 'channel':
        case 'topic':
          if (filteredResponse.Channels) {
            await this.communication.setChannels(this.apiKey, this.siteInfo, filteredResponse.Channels, 'channel')
          }
          if (filteredResponse.results) {
            await this.communication.setTopics(this.apiKey, this.siteInfo, filteredResponse.results, 'topic')
          }
          break
        case 'dataflow':
          if (filteredResponse.result) {
            options = createOptions(filteredResponse.result)
            await this.dataflow.copyDataflows(this.apiKey, this.siteInfo, filteredResponse, options)
            break
          }
          break
        case 'webhook':
          if (filteredResponse.webhooks) {
            options = createOptions(filteredResponse.webhooks)
            await this.webhook.copyWebhooks(this.apiKey, this.dataCenter, filteredResponse, options)
            break
          }
          break
        case 'consent':
          if (filteredResponse.preferences) {
            await this.consent.setFromFiles(this.apiKey, this.siteInfo, filteredResponse)
            break
          }
          break
        case 'social':
          await this.social.setFromFiles(this.apiKey, this.dataCenter, filteredResponse)
          break
        case 'recaptcha':
          await this.recaptcha.setFromFiles(this.apiKey, this.dataCenter, filteredResponse)
          break
        default:
          console.warn(`Unknown file type: ${fileType}`)
      }
    }
  }
}

export default CdcService
