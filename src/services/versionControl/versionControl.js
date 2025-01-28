import { Octokit } from '@octokit/rest'
import WebSdk from '../copyConfig/websdk/websdk'
import Dataflow from '../copyConfig/dataflow/dataflow'
import EmailConfiguration from '../copyConfig/emails/emailConfiguration'
import Extension from '../copyConfig/extension/extension'
import Policy from '../copyConfig/policies/policies'
import Rba from '../copyConfig/rba/rba'
import RiskAssessment from '../copyConfig/rba/riskAssessment'
import Schema from '../copyConfig/schema/schema'
import ScreenSet from '../copyConfig/screenset/screenset'
import SmsConfiguration from '../copyConfig/sms/smsConfiguration'
import Cookies from 'js-cookie'
import CdcService from './cdcService'
import Communication from '../copyConfig/communication/communication'
import Topic from '../copyConfig/communication/topic'
import Webhook from '../copyConfig/webhook/webhook'
import ConsentConfiguration from '../copyConfig/consent/consentConfiguration'
import Social from '../copyConfig/social/social'
import RecaptchaConfiguration from '../copyConfig/recaptcha/recaptchaConfiguration'
import { decryptData } from '../../redux/encryptionUtils'
class VersionControl {
  constructor(credentials, apiKey, siteInfo, gitToken, owner) {

    this.octokit = new Octokit({ auth: gitToken })
    this.gitToken = gitToken
    this.owner = owner || 'defaultOwner'
    this.repo = 'CDCVersionControl'
    this.defaultBranch = apiKey
    const { dataCenter } = siteInfo
    this.credentials = credentials
    this.apiKey = apiKey
    this.dataCenter = dataCenter
    this.siteInfo = siteInfo

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

    this.cdcService = new CdcService(this) // Initialize CdcService with this instance
  }
  decryptToken(encryptedToken) {
    try {
      const decryptedToken = decryptData(encryptedToken, this.secretKey)
      return decryptedToken
    } catch (error) {
      return undefined
    }
  }
}

export default VersionControl
