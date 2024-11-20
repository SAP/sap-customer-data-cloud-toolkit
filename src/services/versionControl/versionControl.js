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

  // async readFile() {
  //   const fileName = this.getFileName()
  //   console.log('fileName', fileName)
  //   for (const file of fileName) {
  //     const filePath = `src/versionControl/${file.name}.json`
  //     //Set condition to check if the file.name is equal to a service do the each set individually
  //     try {
  //       //src/versionControl/screenSets.json
  //       let fileContent = await this.getFileSHA(filePath)

  //       //communication
  //       // if (file.name === 'communication') {
  //       //   const filteredResponse = JSON.parse(fileContent.content)
  //       //   await this.setPolicies(filteredResponse)
  //       //   console.log(`SET HAS BEEN SUCCESSFULL FOR THIS ${file}`)
  //       // }
  //       //consent
  //       // if (file.name === 'consent') {
  //       //   const filteredResponse = JSON.parse(fileContent.content)
  //       //   await this.setPolicies(filteredResponse)
  //       //   console.log(`SET HAS BEEN SUCCESSFULL FOR THIS ${file}`)
  //       // }
  //       //dataflow
  //       // if (file.name === 'dataflow') {
  //       //   const filteredResponse = JSON.parse(fileContent.content)
  //       //   await this.setPolicies(filteredResponse)
  //       //   console.log(`SET HAS BEEN SUCCESSFULL FOR THIS ${file}`)
  //       // }
  //       //emails
  //       if (file.name === 'emails') {
  //         const filteredResponse = JSON.parse(fileContent.content)
  //         await this.setEmailTemplates(filteredResponse)
  //       }
  //       //extension
  //       if (file.name === 'extension') {
  //         const filteredResponse = JSON.parse(fileContent.content)
  //         await this.setExtension(filteredResponse)
  //         console.log('filtered response....>', filteredResponse)
  //       }
  //       //info
  //       // if (file.name === 'info') {
  //       //   const filteredResponse = JSON.parse(fileContent.content)
  //       //   await this.setPolicies(filteredResponse)
  //       //   console.log(`SET HAS BEEN SUCCESSFULL FOR THIS ${file}`)
  //       // }
  //       //policies
  //       if (file.name === 'policies') {
  //         const filteredResponse = JSON.parse(fileContent.content)
  //         await this.setPolicies(filteredResponse)
  //         console.log(`SET HAS BEEN SUCCESSFULL FOR THIS ${file}`)
  //       }
  //       //rba
  //       if (file.name === 'rba') {
  //         const filteredResponse = JSON.parse(fileContent.content)
  //         await this.setRBA(filteredResponse)
  //       }
  //       //recaptcha
  //       // if (file.name === 'recaptcha') {
  //       //   const filteredResponse = JSON.parse(fileContent.content)
  //       //   await this.setPolicies(filteredResponse)
  //       //   console.log(`SET HAS BEEN SUCCESSFULL FOR THIS ${file}`)
  //       // }
  //       ///schema
  //       if (file.name === 'schema') {
  //         const filteredResponse = JSON.parse(fileContent.content)
  //         console.log('filtered response....>', filteredResponse)
  //         const config = await this.setSchema(filteredResponse)
  //         console.log(' config....>', config)
  //         const response = await this.schema.set(this.#apiKey, this.#dataCenter, filteredResponse.dataSchema)
  //         console.log(' response....>', response)
  //       }
  //       //screenset
  //       // if (file.name === 'screenset') {
  //       //   const filteredResponse = JSON.parse(fileContent.content)
  //       //   await this.setPolicies(filteredResponse)
  //       //   console.log(`SET HAS BEEN SUCCESSFULL FOR THIS ${file}`)
  //       // }
  //       //sms
  //       if (file.name === 'sms') {
  //         const filteredResponse = JSON.parse(fileContent.content)
  //         await this.setSMS(filteredResponse)
  //         console.log('filtered response....>', filteredResponse)
  //       }
  //       //social
  //       // if (file.name === 'social') {
  //       //   const filteredResponse = JSON.parse(fileContent.content)
  //       //   await this.setPolicies(filteredResponse)
  //       //   console.log(`SET HAS BEEN SUCCESSFULL FOR THIS ${file}`)
  //       // }
  //       //webhook
  //       // if (file.name === 'webhook') {
  //       //   const filteredResponse = JSON.parse(fileContent.content)
  //       //   await this.setPolicies(filteredResponse)
  //       //   console.log(`SET HAS BEEN SUCCESSFULL FOR THIS ${file}`)
  //       // }
  //       if (file.name === 'webSdk') {
  //         const filteredResponse = JSON.parse(fileContent.content)
  //         debugger
  //         await this.setWebSDK(filteredResponse)
  //         //  console.log('filtered fileContent.content....>', fileContent.content)
  //       }

  //       // if (file.name === 'channel') {
  //       //   debugger
  //       //   console.log('filtered filePath....>', filePath)
  //       //   console.log('filtered fileContent.content....>', fileContent.content)
  //       //   console.log('filtered fileContent.content....>', JSON.parse(fileContent.content))
  //       //   await this.setScreenSets(JSON.parse(fileContent.content))
  //       // }
  //     } catch (error) {
  //       console.log('error', error)
  //     }
  //   }
  // }
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

      console.log('data....>', data)
      return { content: Base64.decode(data.content), sha: data.sha, name: data.name }
    } catch (error) {
      if (error.status === 404) {
        return undefined // File does not exist, return undefined
      }
      throw error // Throw other errors
    }
  }
  async updateFile(filePath, fileContent) {
    // await this.createBranch(this.branch) // Ensure the branch exists

    let sha
    let response
    try {
      sha = await this.getFileSHA(filePath)
    } catch (error) {
      sha = undefined
    }
    console.log('sha', sha)
    const commitMessage = sha ? 'File updated' : 'File created'
    const encodedContent = Base64.encode(fileContent, null, 2)
    debugger
    if (sha === undefined) {
      response = await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path: filePath,

        message: `${sha.name} FILE UPDATED/CREATED`,
        content: encodedContent,
        branch: this.branch,
      })
      console.log('mensagem: ', response.commit.commiter.message)
    } else {
      try {
        response = await this.octokit.rest.repos.createOrUpdateFileContents({
          owner: this.owner,
          repo: this.repo,
          path: filePath,
          message: `${sha.name} FILE UPDATED/CREATED`,
          content: encodedContent,
          branch: this.branch,
          sha: sha.sha,
        })
        console.log('mensagem: ', response.commit.commiter.message)
        // console.log('File updated successfully')
        debugger
        console.log(response ? `${commitMessage} successfully` : `File created successfully`)
      } catch (error) {
        // console.log('this was the error', error)
        console.error('Error creating/updating file:', error)
      }

      console.log('File entered', filePath)
    }
  }

  //******************* Pull requests ****************************** */

  // async createPullRequest(branchName = this.branch, title) {
  //   try {
  //     const response = await this.octokit.rest.pulls.create({
  //       owner: this.owner,
  //       repo: this.repo,
  //       title,
  //       head: branchName,
  //       base: 'main', // or your default branch
  //     })
  //     console.log(`Pull request created: ${response.data.html_url}`)
  //   } catch (error) {
  //     console.log('Error creating pull request:', error)
  //   }
  // }

  // async checkAndCreatePullRequest(branchName = this.branch, title) {
  //   try {
  //     // Get all pull requests
  //     const { data: pullRequests } = await this.octokit.rest.pulls.list({
  //       owner: this.owner,
  //       repo: this.repo,
  //       state: 'open',
  //       head: `${this.owner}:${branchName}`,
  //     })

  //     console.log('pullRequest List: ', pullRequests)

  //     if (pullRequests.length > 0) {
  //       console.log(`Existing pull request found: ${pullRequests[0].html_url}`)
  //     } else {
  //       // Create a new pull request if one doesn't exist
  //       debugger
  //       await this.createPullRequest(branchName, title)
  //     }
  //   } catch (error) {
  //     console.log('Error checking/creating pull request:', error)
  //   }
  // }

  // async createPullRequestViaButton() {
  //   try {
  //     // Ensure the branch exists and files are up to date before creating a pull request
  //     await this.checkAndCreatePullRequest(this.branch, 'Automatic PR: Update from feature branch')
  //   } catch (error) {
  //     console.log('Error creating pull request from button:', error)
  //   }
  // }

  // async createPullRequest(filePath, fileContent) {

  //     try {
  //       // octokit.rest.pulls.create({
  //       //   owner,
  //       //   repo,
  //       //   head,
  //       //   base,
  //       // })
  //       response = await this.octokit.rest.pulls.create({
  //         owner: this.owner,
  //         repo: this.repo,
  //         path: filePath,
  //         message: 'FILE UPDATED/CREATED',
  //         content: encodedContent,
  //         branch: this.branch,
  //         sha: sha.sha,
  //       })
  //       debugger
  //       console.log('File updated successfully')
  //     } catch (error) {
  //       console.log('this was the error', error)
  //     }

  //     console.log('File entered')
  //   }

  //************************************ */

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
    const screenSet = await this.screenSets.get()
    console.log('dasdasda', JSON.stringify(screenSet.screenSets))
    const responses = [
      { name: 'webSdk', promise: this.webSdk.get() },
      { name: 'dataflow', promise: this.dataflow.search() },
      { name: 'emails', promise: this.emails.get() },
      { name: 'extension', promise: this.extension.get() },
      { name: 'policies', promise: this.policies.get() },
      { name: 'rba', promise: this.rba.get() },
      { name: 'riskAssessment', promise: this.riskAssessment.get() },
      { name: 'schema', promise: this.schema.get() },
      { name: 'sets', promise: JSON.stringify(screenSet.screenSets) },
      { name: 'sms', promise: this.sms.get() },
      { name: 'channel', promise: this.channel.get() },
    ]
    return responses
  }
  async writeFile() {
    try {
      const responses = await this.getResponses()
      console.log(`responses ----> ${responses}`)
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
      console.log('resonses map---->', results)

      //to be removed later and uncomment the const filePath
      let filePath = undefined
      await Promise.all(
        results.map((result, index) => {
          const responseName = responses[index].name
          // const filePath = `src/versionControl/${responseName}.json`
          filePath = `src/versionControl/${responseName}.json`
          const fileContent = JSON.stringify(result, null, 2)
          console.log('fileContent----->', fileContent)
          console.log('filePatht----->', filePath)
          return this.updateFile(filePath, fileContent)
        }),
      )

      console.log('File updated successfully: ', filePath)
    } catch (error) {
      console.error('Error writing file:', error)
    }
  }

  // *******************get commits beginning********************

  // async getCommits() {
  //   try {
  //     const branches = await this.octokit.rest.repos.listBranches({
  //       owner: this.owner,
  //       repo: this.repo,
  //       // headers: {
  //       //   'X-GitHub-Api-Version': '2024-10-01',m
  //       // },
  //     })
  //     console.log('branches', branches)
  //     const branchDetails = branches.data.find((b) => b.name === this.branch)

  //     if (!branchDetails) {
  //       throw new Error(`Branch ${this.branch} not found`)
  //     }

  //     const branchSha = branchDetails.commit.sha
  //     const result = await this.octokit.rest.repos.listCommits({
  //       owner: this.owner,
  //       repo: this.repo,
  //       sha: branchSha,
  //       per_page: 100,
  //     })
  //     console.log('List of commits:', result)
  //     return result
  //   } catch (error) {
  //     console.error('Error listing commits:', error)
  //   }
  // }

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
