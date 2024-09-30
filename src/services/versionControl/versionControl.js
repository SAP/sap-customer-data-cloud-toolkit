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

  async readFile() {
    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: this.path,
        ref: this.branch,
      })
      const content = Base64.decode(data.content)
      console.log('file content', content)
      console.log('file data', data)
    } catch (error) {
      console.log('error', error)
    }
  }

  async updateFile(filePath, fileContent) {
    const encodedContent = Base64.encode(fileContent, null, 2)
    let sha = null
    // if (filePath) {
    //   const data = await this.octokit.rest.repos.getContent({
    //     owner: this.owner,
    //     repo: this.repo,
    //     path: filePath,
    //     ref: this.branch,
    //   })
    //   console.log('data--->', data)
    //   sha = data.data.sha
    // } else {
    //   console.log(`${filePath} does not exist`)
    // }

    // if (sha) {
    //   console.log('token', process.env.REACT_APP_GITHUB_ACCESS_TOKEN)
    //   console.log('REACT_APP_USERKEY', process.env.REACT_APP_USERKEY)
    //   await this.octokit.rest.repos.createOrUpdateFileContents({
    //     owner: this.owner,
    //     repo: this.repo,        path: filePath,
    //     message: `Updating ${filePath}`,
    //     content: encodedContent,
    //     branch: this.branch,
    //     sha,
    //   })

    //   console.log('File updated successfully')
    // } else {
    const response = await this.octokit.repos.createOrUpdateFileContents({
      owner: this.owner,
      repo: this.repo,
      path: filePath,
      message: `Create ${filePath} via Octokit`,
      content: encodedContent,
      branch: this.branch,
    })
    console.log(`File ${filePath} created successfully:`, response.data)
    // }
  }
  async writeFile() {
    try {
      //   const content = await webSdk.get()
      // console.log('asdasdasdasdas', await this.getResponseContent())
      // const content = await this.getResponseContent()
      // console.log('info-get', content)
      // const { data } = await this.octokit.rest.repos.getContent({
      //   owner: this.owner,
      //   repo: this.repo,
      //   path: this.path,
      //   ref: this.branch,
      // })
      //   await this.disableBranchProtection()
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
      const results = await Promise.all(responses.map((response) => response.promise))

      await Promise.all(
        results.map((result, index) => {
          const responseName = responses[index].name
          const filePath = `src/versionControl/${responseName}.json`
          const fileContent = JSON.stringify(result, null, 2)
          return this.updateFile(filePath, fileContent)
        }),
      )

      // await this.getCommits()
      console.log('File updated successfully')
      // console.log('file data', Base64.decode(data.content))
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
      // const branchRef = await this.octokit.repos.getBranch({
      //   owner: this.owner,
      //   repo: this.repo,
      //   branch: this.branch,
      // })

      // const branchSha = branchRef.data.commit.sha
      // console.log('branchSha', branchSha)
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
  //try to call copy instead of individual get/set
  async getResponseContent() {
    // const responses = []
    // responses.push(this.webSdk.get())
    // responses.push(this.dataflow.search())
    // responses.push(this.emails.get())
    // responses.push(this.extension.get())
    // responses.push(this.policies.get())
    // responses.push(this.rba.get())
    // responses.push(this.riskAssessment.get())
    // responses.push(this.schema.get())
    // responses.push(this.screenSets.get())
    // responses.push(this.sms.get())
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
    ]
    const results = await Promise.all(responses.map((response) => response.promise))

    // await Promise.all(
    //   results.map((result, index) => {
    //     const responseName = responses[index].name
    //     const filePath = `${responseName}.json`
    //     const fileContent = JSON.stringify(result, null, 2)
    //     return
    //   }),
    // )
    return (await Promise.all(responses)).flat()
  }
}
export default VersionControl
