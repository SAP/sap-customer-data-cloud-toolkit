import { Octokit } from 'octokit'
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
  #credentials
  #apiKey
  #dataCenter
  #siteInfo
  constructor(credentials, apiKey, siteInfo) {
    this.#credentials = credentials
    this.#apiKey = apiKey
    this.#dataCenter = siteInfo.dataCenter
    this.#siteInfo = siteInfo

    //Fazer os gets individualmente todos
    //Fazer os sets individualmente todos
    this.octokit = new Octokit({
      auth: process.env.REACT_APP_GITHUB_ACCESS_TOKEN,
    })
    this.owner = 'SAP'
    this.repo = 'sap-customer-data-cloud-toolkit'
    this.path = 'src/testData.json'
    this.branch = 'feature/CDCTOOLBOX-441'
    this.webSdk = new WebSdk(this.#credentials, this.#apiKey, this.#dataCenter)
    this.dataflow = new Dataflow(this.#credentials, this.#apiKey, this.#dataCenter)
    this.emails = new EmailConfiguration(this.#credentials, this.#apiKey, this.#dataCenter)
    this.extension = new Extension(this.#credentials, this.#apiKey, this.#dataCenter)
    this.policies = new Policy(this.#credentials, this.#apiKey, this.#dataCenter)
    this.rba = new Rba(this.#credentials, this.#apiKey, this.#dataCenter)
    this.riskAssessment = new RiskAssessment(this.#credentials, this.#apiKey, this.#dataCenter)
    this.schema = new Schema(this.#credentials, this.#apiKey, this.#dataCenter)
    this.screenSets = new ScreenSet(this.#credentials, this.#apiKey, this.#dataCenter)
    this.sms = new SmsConfiguration(this.#credentials, this.#apiKey, this.#dataCenter)
    this.channel = new Channel(this.#credentials, this.#apiKey, this.#dataCenter)
  }
  async setContent(config) {
    this.#cleanResponse(config)
    const response = await this.policies.set(this.#apiKey, config, this.#dataCenter)
    console.log('this was the response-->', response)
  }

  async readFile() {
    const fileName = this.getFileName()
    console.log('fileName', fileName)
    for (const file of fileName) {
      const filePath = `src/versionControl/${file.name}.json`
      //Set condition to check if the file.name is equal to a service do the each set individually
      try {
        let fileContent = await this.getFileSHA(filePath)
        if (file.name === 'policies') {
          const filteredResponse = JSON.parse(fileContent.content)
          await this.setContent(filteredResponse)
          console.log(`SET HAS BEEN SUCCESSFULL FOR THIS ${file}`)
        }
        const content = Base64.decode(fileContent.content)
      } catch (error) {
        console.log('error', error)
      }
    }
  }
  async getFileSHA(filePath) {
    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: filePath,
        ref: this.branch,
      })
      console.log('data....>', data)
      return { content: Base64.decode(data.content), sha: data.sha }
    } catch (error) {
      if (error.status === 404) {
        return undefined // File does not exist, return undefined
      }
      throw error // Throw other errors
    }
  }
  async updateFile(filePath, fileContent) {
    // const encodedContent = Base64.encode(fileContent, null, 2)
    let sha
    let response
    try {
      sha = await this.getFileSHA(filePath)
    } catch (error) {
      sha = undefined
    }
    console.log('sha', sha)
    const encodedContent = Base64.encode(fileContent, null, 2)
    if (sha === undefined) {
      response = await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path: filePath,
        message: 'FILE UPDATED/CREATED',
        content: encodedContent,
        branch: this.branch,
      })
    } else {
      response = await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path: filePath,
        message: 'FILE UPDATED/CREATED',
        content: encodedContent,
        branch: this.branch,
        sha: sha.sha,
      })
    }

    console.log('File updated successfully')
  }

  getFileName() {
    const fileNames = [
      { name: 'webSdk' },
      { name: 'dataflow' },
      { name: 'emails' },
      { name: 'extension' },
      { name: 'policies' },
      { name: 'rba' },
      { name: 'riskAssessment' },
      { name: 'schema' },
      { name: 'screenSets' },
      { name: 'sms' },
      { name: 'channel' },
    ]
    return fileNames
  }

  async getResponses() {
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
      { name: 'channel', promise: this.channel.get() },
    ]
    return responses
  }
  async writeFile() {
    try {
      const responses = await this.getResponses()
      // console.log(`responses ----> ${responses}`)
      // const responses = [
      //   { name: 'webSdk', promise: this.webSdk.get() },
      //   { name: 'dataflow', promise: this.dataflow.search() },
      //   { name: 'emails', promise: this.emails.get() },
      //   { name: 'extension', promise: this.extension.get() },
      //   { name: 'policies', promise: this.policies.get() },
      //   { name: 'rba', promise: this.rba.get() },
      //   { name: 'riskAssessment', promise: this.riskAssessment.get() },
      //   { name: 'schema', promise: this.schema.get() },
      //   { name: 'screenSets', promise: this.screenSets.get() },
      //   { name: 'sms', promise: this.sms.get() },
      //   { name: 'channel', promise: this.channel.get() },
      // ]
      const results = await Promise.all(responses.map((response) => response.promise))

      await Promise.all(
        results.map((result, index) => {
          const responseName = responses[index].name
          const filePath = `src/versionControl/${responseName}.json`
          const fileContent = JSON.stringify(result, null, 2)
          return this.updateFile(filePath, fileContent)
        }),
      )

      console.log('File updated successfully')
    } catch (error) {
      console.error('Error writing file:', error)
    }
  }
  async getCommits() {
    try {
      const branches = await this.octokit.request('GET /repos/{owner}/{repo}/branches', {
        owner: this.owner,
        repo: this.repo,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      })
      console.log('branches', branches)
      const branchDetails = branches.data.find((b) => b.name === this.branch)

      if (!branchDetails) {
        throw new Error(`Branch ${this.branch} not found`)
      }

      const branchSha = branchDetails.commit.sha
      const result = await this.octokit.rest.repos.listCommits({
        owner: this.owner,
        repo: this.repo,
        sha: branchSha,
        per_page: 100,
      })
      console.log('List of commits:', result)
      return result
    } catch (error) {
      console.error('Error listing commits:', error)
    }
  }
  #cleanResponse(response) {
    delete response['rba']
    if (response.security) {
      delete response.security.accountLockout
      delete response.security.captcha
      delete response.security.ipLockout
    }
    // the following fields should only be copied when processing emails
    if (response.passwordReset) {
      delete response.passwordReset.resetURL
    }
    if (response.preferencesCenter) {
      delete response.preferencesCenter.redirectURL
    }
  }
}
export default VersionControl
