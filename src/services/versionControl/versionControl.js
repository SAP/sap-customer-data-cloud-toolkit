/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
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

import {
  createBranch,
  updateFilesInSingleCommit,
  getFile,
  getCommitFiles,
  fetchFileContent,
  getCommits,
  updateGitFileContent,
  storeCdcDataInGit,
  applyCommitConfig,
} from './githubUtils'

import { getCdcData, fetchCDCConfigs } from './cdcUtils'
import { setPolicies, setWebSDK, setSMS, setExtension, setSchema, setScreenSets, setRBA, setEmailTemplates } from './setters'

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

    // Bind context to ensure correct `this`
    this.createBranch = createBranch.bind(this)
    this.updateFilesInSingleCommit = updateFilesInSingleCommit.bind(this)
    this.getFile = getFile.bind(this)
    this.getCommitFiles = getCommitFiles.bind(this)
    this.fetchFileContent = fetchFileContent.bind(this)
    this.getCommits = getCommits.bind(this)
    this.getCdcData = getCdcData.bind(this)
    this.fetchCDCConfigs = fetchCDCConfigs.bind(this)
    this.updateGitFileContent = updateGitFileContent.bind(this)
    this.storeCdcDataInGit = storeCdcDataInGit.bind(this)
    this.applyCommitConfig = applyCommitConfig.bind(this)
    this.setPolicies = setPolicies.bind(this)
    this.setWebSDK = setWebSDK.bind(this)
    this.setSMS = setSMS.bind(this)
    this.setExtension = setExtension.bind(this)
    this.setSchema = setSchema.bind(this)
    this.setScreenSets = setScreenSets.bind(this)
    this.setRBA = setRBA.bind(this)
    this.setEmailTemplates = setEmailTemplates.bind(this)
  }
}

export default VersionControl
