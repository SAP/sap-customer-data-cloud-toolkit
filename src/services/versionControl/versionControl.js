import { Octokit } from '@octokit/rest'
import { Base64 } from 'js-base64'

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

class VersionControl {
  #apiKey
  #dataCenter
  #siteInfo

  constructor(credentials, apiKey, siteInfo) {
    if (!credentials.userKey || !credentials.secret) {
      throw new Error('GitHub credentials are required')
    }

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
  }

  async createBranch(branchName) {
    const branches = await this.octokit.rest.repos.listBranches({
      owner: this.owner,
      repo: this.repo,
    })

    const branchExists = branches.data.some((branch) => branch.name === branchName)

    if (!branchExists) {
      const mainBranch = await this.octokit.rest.repos.getBranch({
        owner: this.owner,
        repo: this.repo,
        branch: this.defaultBranch,
      })

      await this.octokit.rest.git.createRef({
        owner: this.owner,
        repo: this.repo,
        ref: `refs/heads/${branchName}`,
        sha: mainBranch.data.commit.sha,
      })
    }
  }

  async updateFilesInSingleCommit(commitMessage, files) {
    const { data: refData } = await this.octokit.rest.git.getRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${this.defaultBranch}`,
    })

    const baseTreeSha = refData.object.sha

    const blobs = await Promise.all(
      files.map(async (file) => {
        const { data } = await this.octokit.rest.git.createBlob({
          owner: this.owner,
          repo: this.repo,
          content: file.content,
          encoding: 'utf-8', // Set content to 'utf-8' instead of Base64
        })
        return {
          path: file.path,
          mode: '100644',
          type: 'blob',
          sha: data.sha,
        }
      }),
    )

    const { data: newTree } = await this.octokit.rest.git.createTree({
      owner: this.owner,
      repo: this.repo,
      tree: blobs,
      base_tree: baseTreeSha,
    })

    const { data: newCommit } = await this.octokit.rest.git.createCommit({
      owner: this.owner,
      repo: this.repo,
      message: commitMessage,
      tree: newTree.sha,
      parents: [baseTreeSha],
    })

    await this.octokit.rest.git.updateRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${this.defaultBranch}`,
      sha: newCommit.sha,
    })
  }

  async getFile(path) {
    const { data: file } = await this.octokit.rest.repos.getContent({
      owner: this.owner,
      repo: this.repo,
      path,
      ref: this.defaultBranch,
    })

    // If content is not provided in the response, fetch it via the Blob API
    if (!file.content || file.size > 100 * 1024) {
      // 100 KB
      console.log(`Fetching content for large file: ${path}`)
      const { data: blobData } = await this.octokit.rest.git.getBlob({
        owner: this.owner,
        repo: this.repo,
        file_sha: file.sha,
      })
      file.content = blobData.content
    }

    if (!file.content) {
      throw new Error(`Failed to retrieve content for path: ${path}`)
    }

    return file
  }

  async getCommitFiles(sha) {
    const { data: commitData } = await this.octokit.rest.repos.getCommit({
      owner: this.owner,
      repo: this.repo,
      ref: sha,
    })

    if (!commitData.files) {
      throw new Error(`No files found in commit: ${sha}`)
    }

    const files = commitData.files.map((file) => ({
      filename: file.filename,
      contents_url: file.contents_url,
    }))

    const fileContentsPromises = files.map(async (file) => {
      const content = await this.fetchFileContent(file.contents_url)
      return { ...file, content: JSON.parse(Base64.decode(content)) }
    })

    return Promise.all(fileContentsPromises)
  }

  async fetchFileContent(contents_url) {
    const { data: response } = await this.octokit.request(contents_url)
    if (!response || !response.content) {
      const { sha } = response
      console.warn(`Large file detected. Fetching via blob API with SHA: ${sha}`)
      const { data: blobData } = await this.octokit.rest.git.getBlob({
        owner: this.owner,
        repo: this.repo,
        file_sha: sha,
      })
      if (!blobData || !blobData.content) {
        throw new Error(`Failed to fetch blob content for URL: ${contents_url}`)
      }
      return blobData.content
    }
    return response.content
  }

  async getCommits() {
    let allCommits = []
    let page = 1
    const per_page = 100

    while (true) {
      const { data } = await this.octokit.rest.repos.listCommits({
        owner: this.owner,
        repo: this.repo,
        sha: this.defaultBranch,
        per_page,
        page,
      })

      if (data.length === 0) break

      allCommits = allCommits.concat(data)

      if (data.length < per_page) break

      page += 1
    }

    return allCommits
  }

  getCdcData() {
    const responses = [
      { name: 'webSdk', promise: this.webSdk.get() },
      { name: 'dataflow', promise: this.dataflow.search() },
      { name: 'emails', promise: this.emails.get() },
      { name: 'extension', promise: this.extension.get() },
      { name: 'policies', promise: this.policies.get() },
      { name: 'rba', promise: this.rba.get() },
      { name: 'riskAssessment', promise: this.riskAssessment.get() },
      { name: 'schema', promise: this.schema.get() },
      { name: 'sets', promise: this.screenSets.get() },
      { name: 'sms', promise: this.sms.get() },
      { name: 'channel', promise: this.channel.get() },
    ]
    return responses
  }

  async fetchCDCConfigs() {
    const cdcDataArray = this.getCdcData()
    if (!Array.isArray(cdcDataArray)) {
      throw new Error('getCdcData must return an array')
    }
    const cdcData = await Promise.all(
      cdcDataArray.map(async ({ name, promise }) => {
        const data = await promise
        return { [name]: data }
      }),
    )
    return Object.assign({}, ...cdcData)
  }

  removeIgnoredFields(obj) {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.removeIgnoredFields(item))
    } else if (obj && typeof obj === 'object') {
      const newObj = {}
      for (let key in obj) {
        if (obj.hasOwnProperty(key) && key !== 'callId' && key !== 'time') {
          newObj[key] = this.removeIgnoredFields(obj[key])
        }
      }
      return newObj
    }
    return obj
  }

  async updateGitFileContent(filePath, cdcFileContent) {
    // Don't encode content in Base64, keep it as plain text.
    const plainCdcContent = cdcFileContent
    if (filePath === 'src/versionControl/webSdk.json') {
      debugger
    }
    let getGitFileInfo

    getGitFileInfo = await this.getFile(filePath)

    if (!getGitFileInfo) {
      console.log(`Creating new file: ${filePath}`)
      getGitFileInfo = { content: '{}', sha: undefined }
    }

    const rawGitContent = getGitFileInfo.content
    let currentGitContent
    let refactoredCurrentContent
    const currentGitContentDecoded = Base64.decode(rawGitContent)
    if (currentGitContentDecoded) {
      try {
        currentGitContent = JSON.parse(currentGitContentDecoded)
        currentGitContent = this.removeIgnoredFields(currentGitContent)
      } catch {
        currentGitContent = {}
      }
    }

    let newContent

    newContent = JSON.parse(cdcFileContent)
    newContent = this.removeIgnoredFields(newContent)

    refactoredCurrentContent = JSON.stringify(currentGitContent)
    const refactoredNewContent = JSON.stringify(newContent)

    if (refactoredCurrentContent !== refactoredNewContent) {
      console.log(`Differences found, proceeding to update file: ${filePath}`)
      return {
        path: filePath,
        content: plainCdcContent, // Set plain text content
        sha: getGitFileInfo.sha,
      }
    } else {
      console.log(`Files ${filePath} are identical. Skipping update.`)
      return null
    }
  }

  async storeCdcDataInGit(commitMessage) {
    const configs = await this.fetchCDCConfigs()
    const files = Object.keys(configs).map((key) => ({
      path: `src/versionControl/${key}.json`,
      content: JSON.stringify(configs[key], null, 2),
    }))

    const fileUpdates = await Promise.all(
      files.map(async (file) => {
        const updateFile = await this.updateGitFileContent(file.path, file.content)
        if (file.path === 'src/versionControl/webSdk.json') {
          console.log('==================updateFile==================')
          console.log(updateFile)
          console.log('====================================')
        }
        return updateFile
      }),
    )

    const validUpdates = fileUpdates.filter((update) => update !== null)

    if (validUpdates.length > 0) {
      await this.updateFilesInSingleCommit(commitMessage, validUpdates)
    } else {
      console.log('No files to update. Skipping commit.')
    }
  }

  async applyCommitConfig(commitSha) {
    const files = await this.getCommitFiles(commitSha)
    for (let file of files) {
      const fileType = this.getFileTypeFromFileName(file.filename)
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

  getFileTypeFromFileName(filename) {
    const mapping = {
      'webSdk.json': 'webSdk',
      'dataflow.json': 'dataflow',
      'emails.json': 'emails',
      'extension.json': 'extension',
      'policies.json': 'policies',
      'rba.json': 'rba',
      'riskAssessment.json': 'riskAssessment',
      'schema.json': 'schema',
      'sets.json': 'sets',
      'sms.json': 'sms',
      'channel.json': 'channel',
    }

    return mapping[Object.keys(mapping).find((key) => filename.includes(key))]
  }

  async setPolicies(config) {
    this.cleanResponse(config)
    await this.policies.set(this.apiKey, config, this.dataCenter)
  }

  async setWebSDK(config) {
    await this.webSdk.set(this.apiKey, config, this.dataCenter)
  }

  async setSMS(config) {
    await this.sms.getSms().set(this.apiKey, this.dataCenter, config.templates)
  }

  async setExtension(config) {
    await this.extension.set(this.apiKey, this.dataCenter, config.result[0])
  }

  async setSchema(config) {
    for (let key in config) {
      if (config.hasOwnProperty(key)) {
        if (key === 'dataSchema') {
          await this.schema.set(this.apiKey, this.dataCenter, config.dataSchema)
        }
        if (key === 'addressesSchema') {
          await this.schema.set(this.apiKey, this.dataCenter, config.addressesSchema)
        }
        if (key === 'internalSchema') {
          await this.schema.set(this.apiKey, this.dataCenter, config.internalSchema)
        }
        if (key === 'profileSchema') {
          await this.schema.set(this.apiKey, this.dataCenter, config.profileSchema)
        }
        if (key === 'subscriptionsSchema') {
          await this.schema.set(this.apiKey, this.dataCenter, config.subscriptionsSchema)
        }
      }
    }
  }

  async setScreenSets(config) {
    for (const screenSet of config.screenSets) {
      console.log('ScreenSet:', screenSet)
    }
  }

  async setRBA(response) {
    if (response[0]) {
      await this.rba.setAccountTakeoverProtection(this.apiKey, response[0])
    }
    if (response[1]) {
      await this.rba.setUnknownLocationNotification(this.apiKey, this.siteInfo, response[1])
    }
    if (response[2]) {
      await this.rba.setRbaRulesAndSettings(this.apiKey, this.siteInfo, response[2])
    }
  }

  async setEmailTemplates(response) {
    this.cleanEmailResponse(response)
    for (let key in response) {
      if (key !== 'errorCode') {
        const result = await this.emails.getEmail().setSiteEmailsWithDataCenter(this.apiKey, key, response[key], this.dataCenter)
        console.log('resultEmails', result)
      }
    }
  }

  cleanEmailResponse(response) {
    if (response.doubleOptIn) {
      delete response.doubleOptIn.nextURL
      delete response.doubleOptIn.nextExpiredURL
    }
    if (response.emailVerification) {
      delete response.emailVerification.nextURL
    }
    if (response.callId) {
      delete response.callId
    }
    if (response.context) {
      delete response.context
    }
    if (response.errorCode) {
      delete response.errorCode
    }
    delete response.statusCode
    delete response.statusReason
    delete response.time
    delete response.apiVersion
  }

  cleanResponse(response) {
    delete response.rba
    if (response.security) {
      delete response.security.accountLockout
      delete response.security.captcha
      delete response.security.ipLockout
    }
    if (response.passwordReset) {
      delete response.passwordReset.resetURL
    }
    if (response.preferencesCenter) {
      delete response.preferencesCenter.redirectURL
    }
  }
}

export default VersionControl
