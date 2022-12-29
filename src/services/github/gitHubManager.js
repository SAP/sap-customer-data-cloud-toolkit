import GitHubClient from './client'
import generateErrorResponse from '../errors/generateErrorResponse'
import { version } from '../../../package.json'

class GitHubManager {
  static ERROR_MSG_RELEASE = 'Error accessing release information on git hub'

  constructor() {
    this.gitHubClient = new GitHubClient('https://github.tools.sap/api/v3', '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') // repo_deployment permission only
  }

  async isNewReleaseAvailable() {
    const latestReleaseInformation = await this.gitHubClient.getLatestReleaseInformation().catch(function (error) {
      return Promise.reject(generateErrorResponse(error, GitHubManager.ERROR_MSG_RELEASE).data)
    })
    this.latestReleaseInformation = latestReleaseInformation.data
    const latestReleaseVersion = latestReleaseInformation.data.tag_name
    const currentReleaseVersion = version
    return latestReleaseVersion > currentReleaseVersion
  }
}

export default GitHubManager
