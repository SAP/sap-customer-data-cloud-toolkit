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
import { getCommitFiles } from './githubUtils'
import {
  setPolicies,
  setWebSDK,
  setSMS,
  setExtension,
  setSchema,
  setScreenSets,
  setRBA,
  setEmailTemplates,
  setCommunicationTopics,
  setDataflow,
  setWebhook,
  setConsent,
  setSocial,
  setRecaptcha,
} from './setters'

class CdcService {
  constructor(credentials, apiKey, dataCenter) {
    this.credentials = credentials
    this.apiKey = apiKey
    this.dataCenter = dataCenter
    this.webSdk = new WebSdk(credentials, apiKey, dataCenter)
    this.dataflow = new Dataflow(credentials, apiKey, dataCenter)
    this.emails = new EmailConfiguration(credentials, apiKey, dataCenter)
    this.extension = new Extension(credentials, apiKey, dataCenter)
    this.policies = new Policy(credentials, apiKey, dataCenter)
    this.rba = new Rba(credentials, apiKey, dataCenter)
    this.riskAssessment = new RiskAssessment(credentials, apiKey, dataCenter)
    this.schema = new Schema(credentials, apiKey, dataCenter)
    this.screenSets = new ScreenSet(credentials, apiKey, dataCenter)
    this.sms = new SmsConfiguration(credentials, apiKey, dataCenter)
    this.communication = new Communication(credentials, apiKey, dataCenter)
    this.topic = new Topic(credentials, apiKey, dataCenter)
    this.webhook = new Webhook(credentials, apiKey, dataCenter)
    this.consent = new ConsentConfiguration(credentials, apiKey, dataCenter)
    this.social = new Social(credentials, apiKey, dataCenter)
    this.recaptcha = new RecaptchaConfiguration(credentials, apiKey, dataCenter)
  }

  getCdcData = () => {
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
    const cdcDataArray = this.getCdcData()
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

  applyCommitConfig = async (commitSha) => {
    const files = await getCommitFiles(this.versionControl, commitSha)
    for (const file of files) {
      // Strip the 'src/versionControl/' prefix and '.json' suffix, match file type correctly
      const fileType = file.filename.split('/').pop().split('.').shift()

      let filteredResponse = file.content
      switch (fileType) {
        case 'webSdk':
          await setWebSDK.call(this.versionControl, filteredResponse)
          break
        case 'emails':
          await setEmailTemplates.call(this.versionControl, filteredResponse)
          break
        case 'extension':
          await setExtension.call(this.versionControl, filteredResponse)
          break
        case 'policies':
          await setPolicies.call(this.versionControl, filteredResponse)
          break
        case 'rba':
          await setRBA.call(this.versionControl, filteredResponse)
          break
        case 'schema':
          await setSchema.call(this.versionControl, filteredResponse)
          break
        case 'screenSets':
          await setScreenSets.call(this.versionControl, filteredResponse)
          break
        case 'sms':
          await setSMS.call(this.versionControl, filteredResponse)
          break
        case 'channel':
          await setCommunicationTopics.call(this.versionControl, filteredResponse)
          break
        case 'topic':
          await setCommunicationTopics.call(this.versionControl, filteredResponse)
          break
        case 'dataflow':
          await setDataflow.call(this.versionControl, filteredResponse)
          break
        case 'webhook':
          await setWebhook.call(this.versionControl, filteredResponse)
          break
        case 'consent':
          await setConsent.call(this.versionControl, filteredResponse)
          break
        case 'social':
          await setSocial.call(this.versionControl, filteredResponse)
          break
        case 'recaptcha':
          await setRecaptcha.call(this.versionControl, filteredResponse)
          break
        default:
          console.warn(`Unknown file type: ${fileType}`)
      }
    }
  }
}

export default CdcService
