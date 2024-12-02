// versionControl.js

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
import Channel from '../copyConfig/communication/channel'

import * as githubUtils from './githubUtils'
import { getCdcData, fetchCDCConfigs } from './cdcUtils'
import { setPolicies, setWebSDK, setSMS, setExtension, setSchema, setScreenSets, setRBA, setEmailTemplates } from './setters'
import { getFileTypeFromFileName } from './versionControlFiles'

class VersionControl {
  constructor(credentials, apiKey, siteInfo) {
    this.octokit = new Octokit({ auth: process.env.REACT_APP_GITHUB_ACCESS_TOKEN })
    this.owner = 'iamGaspar'
    this.repo = 'CDCVersionControl'
    this.defaultBranch = 'CDCRepo'

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
    this.channel = new Channel(credentials, apiKey, dataCenter)

    this.createBranch = githubUtils.createBranch.bind(this)
    this.updateFilesInSingleCommit = githubUtils.updateFilesInSingleCommit.bind(this)
    this.getFile = githubUtils.getFile.bind(this)
    this.getCommitFiles = githubUtils.getCommitFiles.bind(this)
    this.fetchFileContent = githubUtils.fetchFileContent.bind(this)
    this.getCommits = githubUtils.getCommits.bind(this)
    this.getCdcData = getCdcData.bind(this)
    this.fetchCDCConfigs = fetchCDCConfigs.bind(this)
    this.updateGitFileContent = githubUtils.updateGitFileContent.bind(this)
    this.storeCdcDataInGit = githubUtils.storeCdcDataInGit.bind(this)
    this.applyCommitConfig = this.applyCommitConfig.bind(this)
    this.setPolicies = setPolicies.bind(this)
    this.setWebSDK = setWebSDK.bind(this)
    this.setSMS = setSMS.bind(this)
    this.setExtension = setExtension.bind(this)
    this.setSchema = setSchema.bind(this)
    this.setScreenSets = setScreenSets.bind(this)
    this.setRBA = setRBA.bind(this)
    this.setEmailTemplates = setEmailTemplates.bind(this)
  }

  async applyCommitConfig(commitSha) {
    const files = await this.getCommitFiles(commitSha)
    for (const file of files) {
      const fileType = getFileTypeFromFileName(file.filename)
      const filteredResponse = file.content

      switch (fileType) {
        case 'webSdk':
          await this.setWebSDK(filteredResponse)
          break
        case 'dataflow':
          await this.setDataflow(filteredResponse)
          break
        case 'emails':
          await this.setEmailTemplates(filteredResponse)
          break
        case 'extension':
          await this.setExtension(filteredResponse)
          break
        case 'policies':
          await this.setPolicies(filteredResponse)
          break
        case 'rba':
          await this.setRBA(filteredResponse)
          break
        case 'riskAssessment':
          await this.setRiskAssessment(filteredResponse)
          break
        case 'schema':
          await this.setSchema(filteredResponse)
          break
        case 'sets':
          await this.setScreenSets(filteredResponse)
          break
        case 'sms':
          await this.setSMS(filteredResponse)
          break
        case 'channel':
          await this.setChannel(filteredResponse)
          break
        default:
          console.warn(`Unknown file type: ${fileType}`)
      }
    }
  }
}

export default VersionControl
