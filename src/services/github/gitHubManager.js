/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import GitHubClient from './client'
import generateErrorResponse from '../errors/generateErrorResponse'
import { VERSION } from '../../constants'

class GitHubManager {
  static ERROR_MSG_RELEASE = 'Error accessing release information on git hub'
  #protocol = 'https'
  #github = 'github.tools.sap'
  #api = 'api/v3'

  constructor() {
    this.gitHubClient = new GitHubClient(`${this.#protocol}://${this.#github}/${this.#api}`, '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') // repo_deployment permission only
  }

  async getNewReleaseAvailable() {
    const latestReleaseInformation = await this.gitHubClient.getLatestReleaseInformation().catch(function (error) {
      return Promise.reject(generateErrorResponse(error, GitHubManager.ERROR_MSG_RELEASE).data)
    })
    this.latestReleaseInformation = latestReleaseInformation.data
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
