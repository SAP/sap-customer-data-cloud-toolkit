import { Octokit } from 'octokit'
import { Base64 } from 'js-base64'
import Info from '../copyConfig/info/info'
import WebSdk from '../copyConfig/websdk/websdk'
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
      auth: process.env.GITHUB_ACCESS_TOKEN,
    })
    this.owner = 'SAP'
    this.repo = 'sap-customer-data-cloud-toolkit'
    this.path = 'src/version_control.json'
    this.branch = 'feature/CDCTOOLBOX-441'
    this.webSdk = new WebSdk(this.#credentials, this.#apiKey, this.#dataCenter)
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
  async disableBranchProtection() {
    try {
      await this.octokit.rest.repos.updateBranchProtection({
        owner: this.owner,
        repo: this.repo,
        branch: this.branch,
        required_status_checks: null,
        required_pull_request_reviews: null,
        restrictions: null,
        enforce_admins: false,
      })
      console.log('Branch protection disabled.')
    } catch (error) {
      console.error('Error disabling branch protection:', error)
    }
  }

  async updateFile(content, sha) {
    try {
      const encodedContent = Base64.encode(JSON.stringify(content, null, 2))

      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path: this.path,
        message: 'Updating version_control.json',
        content: encodedContent,
        sha,
        branch: this.branch,
      })

      console.log('File updated successfully')
    } catch (error) {
      console.error('Error updating file:', error)
    }
  }
  async writeFile(credentials, apiKey, siteInfo) {
    try {
      const info = new Info(credentials, apiKey, siteInfo)
      //   const content = await webSdk.get()
      console.log('asdasdasdasdas', await this.getResponseContent())
      const content = await this.getResponseContent()
      console.log('info-get', content)
      const { data } = await this.octokit.rest.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: this.path,
        ref: this.branch,
      })
      //   await this.disableBranchProtection()
      await this.updateFile(content, data.sha)

      //   await this.getCommits()
      console.log('File updated successfully')
      console.log('file data', Base64.decode(data.content))
    } catch (error) {
      console.error('Error writing file:', error)
    }
  }
  async getCommits() {
    try {
      const data = await this.octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', {
        owner: this.owner,
        repo: this.repo,
        ref: this.branch,
      })

      console.log('List of commits:', data)
      return data
    } catch (error) {
      console.error('Error listing commits:', error)
    }
  }

  async getResponseContent() {
    const responses = []
    responses.push(this.webSdk.get())
    return (await Promise.all(responses)).flat()
  }
}
export default VersionControl
