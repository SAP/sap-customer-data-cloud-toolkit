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
    // Get base (latest) tree SHA
    const { data: refData } = await this.octokit.rest.git.getRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${this.defaultBranch}`,
    })

    const baseTreeSha = refData.object.sha

    // Create blobs for each file
    const blobs = await Promise.all(
      files.map(async (file) => {
        const { data } = await this.octokit.rest.git.createBlob({
          owner: this.owner,
          repo: this.repo,
          content: Base64.encode(file.content),
          encoding: 'base64',
        })
        return {
          path: file.path,
          mode: '100644', // regular file
          type: 'blob',
          sha: data.sha,
        }
      }),
    )

    // Create a new tree
    const { data: newTree } = await this.octokit.rest.git.createTree({
      owner: this.owner,
      repo: this.repo,
      tree: blobs,
      base_tree: baseTreeSha,
    })

    // Create a new commit
    const { data: newCommit } = await this.octokit.rest.git.createCommit({
      owner: this.owner,
      repo: this.repo,
      message: commitMessage,
      tree: newTree.sha,
      parents: [baseTreeSha],
    })

    // Update reference to point to the new commit
    await this.octokit.rest.git.updateRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${this.defaultBranch}`,
      sha: newCommit.sha,
    })
  }

  async getFile(path) {
    try {
      const file = await this.octokit.rest.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
        ref: this.defaultBranch,
      })
      return file.data
    } catch (error) {
      if (error.status === 404) return null
      throw error
    }
  }

  async getCommitFiles(sha) {
    const commitData = await this.octokit.rest.repos.getCommit({
      owner: this.owner,
      repo: this.repo,
      ref: sha,
    })
    const files = commitData.data.files.map((file) => ({
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
    const response = await this.octokit.request(contents_url)
    const { content } = response.data
    return content
  }

  async getCommits() {
    const commits = await this.octokit.rest.repos.listCommits({
      owner: this.owner,
      repo: this.repo,
    })
    return commits.data
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

  async storeCdcDataInGit(commitMessage) {
    const configs = await this.fetchCDCConfigs()
    const files = Object.keys(configs).map((key) => ({
      path: `src/versionControl/${key}.json`,
      content: JSON.stringify(configs[key], null, 2),
    }))

    await this.updateFilesInSingleCommit(commitMessage, files)
  }

  async applyCommitConfig(commitSha) {
    const files = await this.getCommitFiles(commitSha)
    for (let file of files) {
      const fileType = this.getFileTypeFromFileName(file.filename)
      switch (fileType) {
        case 'webSdk':
          await this.webSdk.apply(file.content)
          break
        case 'dataflow':
          await this.dataflow.apply(file.content)
          break
        case 'emails':
          await this.emails.apply(file.content)
          break
        case 'extension':
          await this.extension.apply(file.content)
          break
        case 'policies':
          await this.policies.apply(file.content)
          break
        case 'rba':
          await this.rba.apply(file.content)
          break
        case 'riskAssessment':
          await this.riskAssessment.apply(file.content)
          break
        case 'schema':
          await this.schema.apply(file.content)
          break
        case 'sets':
          await this.screenSets.apply(file.content)
          break
        case 'sms':
          await this.sms.apply(file.content)
          break
        case 'channel':
          await this.channel.apply(file.content)
          break
        default:
          break
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
}

export default VersionControl
