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
import { refactorData } from './refactorData'
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

    //Fazer os sets individualmente todos
    this.octokit = new Octokit({
      auth: process.env.REACT_APP_GITHUB_ACCESS_TOKEN,
    })
    this.owner = 'iamGaspar'
    this.repo = 'CDCVersionControl'
    this.path = 'src/testData.json'
    this.branch = 'CDCRepo'
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

  async createBranch(branchName) {
    const response = await this.octokit.rest.repos.listBranches({
      owner: this.owner,
      repo: this.repo,
    })
    const branchExists = response.data.find((branch) => branch.name === branchName)

    if (!branchExists) {
      const mainBranch = await this.octokit.rest.repos.getBranch({
        owner: this.owner,
        repo: this.repo,
        branch: 'main', // or your default branch
      })
      await this.octokit.rest.git.createRef({
        owner: this.owner,
        repo: this.repo,
        ref: `refs/heads/${branchName}`,
        sha: mainBranch.data.commit.sha,
      })
    }
  }

  async readFile() {
    const fileName = this.getFileName()
    console.log('fileName', fileName) // Log file names

    for (const file of fileName) {
      const filePath = `src/versionControl/${file.name}.json`
      console.log('Processing file:', filePath) // Log each file path

      try {
        let fileContent = await this.getFileSHA(filePath)
        console.log('File content fetched:', fileContent) // Log file content fetched

        if (!fileContent || !fileContent.content) {
          throw new Error('File content is invalid')
        }

        const decodedContent = Base64.decode(fileContent.content)
        console.log('Decoded content:', decodedContent) // Log decoded content

        const filteredResponse = JSON.parse(decodedContent)
        console.log('filteredResponse:', filteredResponse) // Log the filtered response

        switch (file.name) {
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
          case 'schema':
            await this.setSchema(filteredResponse)
            break
          case 'sms':
            await this.setSMS(filteredResponse)
            break
          case 'webSdk':
            await this.setWebSDK(filteredResponse)
            break
          default:
            console.log(`No matching case for: ${file.name}`)
        }
      } catch (error) {
        console.error('Error processing file:', filePath, error)
      }
    }
  }
  async checkIfExists(sha) {
    const { data: commit } = await this.octokit.rest.repos.getCommit({
      owner: this.owner,
      repo: this.repo,
      ref: sha,
    })

    for (const file of commit.files) {
      console.log('Processing file to be checked:', file)

      if (file.filename.startsWith('src/versionControl/')) {
        const fileContent = await this.fetchFileContent(file.contents_url)
        console.log(file.contents_url)
        return JSON.parse(fileContent)
      }
    }
  }

  async readCommit(sha) {
    if (sha) {
      try {
        const { data: commit } = await this.octokit.rest.repos.getCommit({
          owner: this.owner,
          repo: this.repo,
          ref: sha,
        })
        console.log('Commit data:', commit)

        for (const file of commit.files) {
          console.log('Processing file:', file)

          if (file.filename.startsWith('src/versionControl/')) {
            const fileContent = await this.fetchFileContent(file.contents_url)
            console.log(file.contents_url)

            if (fileContent) {
              const filteredResponse = JSON.parse(fileContent)

              // Execute set functions based on file names
              if (file.filename.includes('emails')) {
                await this.setEmailTemplates(filteredResponse)
              } else if (file.filename.includes('extension')) {
                await this.setExtension(filteredResponse)
              } else if (file.filename.includes('policies')) {
                await this.setPolicies(filteredResponse)
              } else if (file.filename.includes('schema')) {
                await this.setSchema(filteredResponse)
              } else if (file.filename.includes('webSdk')) {
                await this.setWebSDK(filteredResponse)
              }
            }
          }
        }
      } catch (error) {
        console.error('Error reading commit:', error)
      }
    }
  }

  async fetchFileContent(contents_url) {
    try {
      const { data } = await this.octokit.request(contents_url)
      console.log('File content data:', data)
      return Base64.decode(data.content)
    } catch (error) {
      console.error('Error fetching file content:', error)
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

      console.log(`Fetched data for ${filePath}:`, data)

      const decodedContent = Base64.decode(data.content)
      console.log(`Decoded content for ${filePath}:`, decodedContent)

      // Return an empty JSON if the content is empty or invalid
      if (!decodedContent.trim()) {
        return {
          content: '{}', // Return empty JSON object
          sha: data.sha,
          name: data.name,
        }
      }

      return {
        content: decodedContent,
        sha: data.sha,
        name: data.name,
      }
    } catch (error) {
      console.error(`Error fetching SHA for file ${filePath}:`, error)
      if (error.status === 404) {
        return { content: '{}', sha: undefined, name: undefined } // Return empty JSON object for non-existent file
      }
      throw error // Throw other errors
    }
  }

  // src/services/versionControl/versionControl.js
  // src/services/versionControl/versionControl.js
  async updateFile(filePath, fileContent) {
    const commitMessage = 'File updated/created'
    const encodedContent = Base64.encode(fileContent)

    let getGitFileInfo

    try {
      getGitFileInfo = await this.getFileSHA(filePath)
      const { content: rawCurrentContent } = getGitFileInfo

      // Log raw content
      console.log(`Raw current content for ${filePath}: ${rawCurrentContent}`)

      // Parse the current content safely
      let currentContent
      try {
        currentContent = JSON.parse(rawCurrentContent)
      } catch (error) {
        console.warn(`Failed to parse current content for ${filePath}. Using empty object. Error: ${error.message}`)
        currentContent = {} // Fallback to empty object
      }

      // Log new content to be compared
      console.log(`Raw new content for ${filePath}: ${fileContent}`)

      // Parse the new content safely
      let newContent
      try {
        newContent = JSON.parse(fileContent)
      } catch (error) {
        throw new Error(`Failed to parse new content for ${filePath}: ${error.message}`)
      }

      // Refactor the current and new content for comparison
      const refactoredCurrentContent = refactorData(currentContent)
      const refactoredNewContent = refactorData(newContent)

      // Compare the contents
      if (JSON.stringify(refactoredCurrentContent) !== JSON.stringify(refactoredNewContent)) {
        console.log(`Differences found, proceeding to update file: ${filePath}`)

        const updateParams = {
          owner: this.owner,
          repo: this.repo,
          path: filePath,
          message: `${getGitFileInfo.name} ${commitMessage}`,
          content: encodedContent,
          branch: this.branch,
          sha: getGitFileInfo ? getGitFileInfo.sha : undefined,
        }

        try {
          const response = await this.octokit.rest.repos.createOrUpdateFileContents(updateParams)
          console.log(`File ${filePath} created/updated:`, response.data.commit.message)
        } catch (error) {
          if (error.status === 409) {
            // Conflict error, fetch new SHA and retry
            console.warn(`Conflict detected when updating ${filePath}. Fetching latest SHA and retrying...`)
            const newGitFileInfo = await this.getFileSHA(filePath)

            if (newGitFileInfo && newGitFileInfo.sha !== getGitFileInfo.sha) {
              updateParams.sha = newGitFileInfo.sha
              const response = await this.octokit.rest.repos.createOrUpdateFileContents(updateParams)
              console.log(`File ${filePath} created/updated on retry:`, response.data.commit.message)
            } else {
              console.error(`Sha mismatch even after refetching for ${filePath}`)
              throw new Error(`Sha mismatch even after refetching for ${filePath}`)
            }
          } else {
            console.error(`Error creating/updating file ${filePath}:`, error)
            throw error
          }
        }
      } else {
        console.log(`Files ${filePath} are identical. Skipping update.`)
      }
    } catch (error) {
      console.error(`Error creating/updating file ${filePath}:`, error)
      throw error
    }
  }

  getFileName() {
    const fileNames = [
      //.
      { name: 'webSdk' },
      { name: 'dataflow' },
      { name: 'emails' },
      //
      { name: 'extension' },
      //
      { name: 'policies' },
      { name: 'rba' },
      { name: 'riskAssessment' },
      //
      { name: 'schema' },
      { name: 'sets' },
      //
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
      { name: 'sets', promise: this.screenSets.get() },
      { name: 'sms', promise: this.sms.get() },
      { name: 'channel', promise: this.channel.get() },
    ]
    return responses
  }

  async writeFile() {
    try {
      const responses = await this.getResponses()
      // console.log('responses ---->', JSON.stringify(responses, null, 2))
      const results = await Promise.all(responses.map((response) => response.promise))
      const cleanData = refactorData(results)
      console.log('cleanData: ', cleanData)

      console.log('responses map ---->', JSON.stringify(results, null, 2))

      await Promise.all(
        cleanData.map(async (result, index) => {
          const responseName = responses[index].name
          const filePath = `src/versionControl/${responseName}.json`
          const fileContent = JSON.stringify(result, null, 2)
          console.log(`fileContent [name: ${responseName}] ----->`, fileContent)
          console.log('filePath ----->', filePath)

          await this.updateFile(filePath, fileContent)
        }),
      )

      console.log('All files updated successfully')
    } catch (error) {
      console.error('Error writing file:', error)
      throw error // Ensure the error is rethrown
    }
  }

  async getCommits() {
    let allCommits = []
    let page = 1
    const per_page = 100

    try {
      while (true) {
        const { data } = await this.octokit.rest.repos.listCommits({
          owner: this.owner,
          repo: this.repo,
          sha: this.branch,
          per_page,
          page,
        })

        if (data.length === 0) {
          break
        }

        allCommits = allCommits.concat(data)

        if (data.length < per_page) {
          break
        }

        page += 1
      }

      console.log('All commits:', allCommits)
      return allCommits
    } catch (error) {
      console.error('Error listing commits:', error)
      return allCommits
    }
  }

  // **********************get commits end ***************
  async setPolicies(config) {
    this.#cleanResponse(config)
    await this.policies.set(this.#apiKey, config, this.#dataCenter)
  }
  async setWebSDK(config) {
    await this.webSdk.set(this.#apiKey, config, this.#dataCenter)
  }
  async setSMS(config) {
    await this.sms.getSms().set(this.#apiKey, this.#dataCenter, config.templates)
  }
  async setExtension(config) {
    await this.extension.set(this.#apiKey, this.#dataCenter, config.result[0])
  }
  async setSchema(config) {
    for (let key in config) {
      if (config.hasOwnProperty(key)) {
        if (key === 'dataSchema') {
          await this.schema.set(this.#apiKey, this.#dataCenter, config.dataSchema)
        }
        if (key === 'addressesSchema') {
          await this.schema.set(this.#apiKey, this.#dataCenter, config.addressesSchema)
        }
        if (key === 'internalSchema') {
          await this.schema.set(this.#apiKey, this.#dataCenter, config.internalSchema)
        }
        if (key === 'profileSchema') {
          await this.schema.set(this.#apiKey, this.#dataCenter, config.profileSchema)
        }
        if (key === 'subscriptionsSchema') {
          await this.schema.set(this.#apiKey, this.#dataCenter, config.subscriptionsSchema)
        }
      }
    }
  }
  async setScreenSets(config) {
    for (const screenSet of config.screenSets) {
      console.log('screen-SET', screenSet)
    }
  }
  // async setChannel(config) {
  //   for (const channel of config.screenSets) {
  //     console.log('screen-SET', channel)
  //   }
  // }
  async setRBA(response) {
    if (response[0]) {
      const result = await this.rba.setAccountTakeoverProtection(this.#apiKey, response[0])
    }
    if (response[1]) {
      const result = await this.rba.setUnknownLocationNotification(this.#apiKey, this.#siteInfo, response[1])
    }
    if (response[2]) {
      const result = await this.rba.setRbaRulesAndSettings(this.#apiKey, this.#siteInfo, response[2])
    }
  }
  async setEmailTemplates(response) {
    this.#cleanEmailResponse(response)
    for (let key in response) {
      if (key !== 'errorCode') {
        const result = await this.emails.getEmail().setSiteEmailsWithDataCenter(this.#apiKey, key, response[key], this.#dataCenter)
        console.log('resultEmails', result)
      }
    }
  }
  #cleanEmailResponse(response) {
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

  #getScreenSet(screenSetID, response) {
    return response.screenSets.find((obj) => obj.screenSetID === screenSetID)
  }
}
export default VersionControl
