/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import GitHubClient from './client'
import generateErrorResponse from '../errors/generateErrorResponse'
import { VERSION } from '../../constants'

class GitHubManager {
  static ERROR_MSG_RELEASE = 'Error accessing release information on git hub'
  #protocol = 'https'
  #github = 'api.github.com'

  constructor() {
    this.gitHubClient = new GitHubClient(`${this.#protocol}://${this.#github}`, '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') // repo_deployment permission only
  }

  async getNewReleaseAvailable() {
    const latestReleaseInformation = await this.gitHubClient.getLatestReleaseInformation().catch(function (error) {
      return Promise.reject(generateErrorResponse(error, GitHubManager.ERROR_MSG_RELEASE).data)
    })
    const latestReleaseVersion = latestReleaseInformation.data.tag_name
    const currentReleaseVersion = VERSION
    return {
      isNewReleaseAvailable: latestReleaseVersion > currentReleaseVersion,
      latestReleaseVersion: latestReleaseVersion,
      latestReleaseUrl: latestReleaseInformation.data.html_url
    }
  }
}

export default GitHubManager
