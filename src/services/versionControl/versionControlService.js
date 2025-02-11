/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import CdcService from './cdcService'

class VersionControlService {
  #credentials
  #apiKey
  #currentSite
  #gitToken
  #owner
  #repo
  #versionControl
  constructor(credentials, apiKey, gitToken, owner, versionControl, dataCenter, siteInfo) {
    this.credentials = credentials
    this.apiKey = apiKey
    this.gitToken = gitToken
    this.owner = owner || 'defaultOwner'
    this.repo = 'CDCVersionControl'
    this.defaultBranch = apiKey
    this.dataCenter = dataCenter
    this.siteInfo = siteInfo
    this.cdcService = new CdcService(credentials, apiKey, dataCenter, siteInfo)
    this.#versionControl = versionControl
  }

  handleGetServices = async (credentials, apiKey, dataCenter, commitMessage) => {
    try {
      await this.#versionControl.createBranch(apiKey)
      const configs = await this.cdcService.fetchCDCConfigs()
      await this.#versionControl.storeCdcDataInVersionControl(commitMessage || 'Backup created', configs, this.defaultBranch)
      return true
    } catch (error) {
      throw new Error(error)
    }
  }

  handleCommitListRequestServices = async () => {
    const hasBranch = await this.#versionControl.listBranches(this.defaultBranch)
    if (hasBranch) {
      const { data: commitList } = await this.#versionControl.getCommits(this.defaultBranch)
      return { commitList, totalCommits: commitList.length }
    } else {
      return { commitList: [], totalCommits: 0 }
    }
  }

  handleCommitRevertServices = async (sha) => {
    try {
      const files = await this.#versionControl.getCommitFiles(sha)
      await this.cdcService.applyCommitConfig(files)
      return true
    } catch (error) {
      throw new Error('Failed to revert configurations')
    }
  }

  async prepareFilesForUpdate() {
    const configs = await this.cdcService.fetchCDCConfigs()
    const validUpdates = await this.#versionControl.fetchAndPrepareFiles(configs)
    const formattedFiles = validUpdates.length > 0 ? validUpdates.map((file) => file.path.replace('src/versionControl/', '').replace('.json', '')) : ['N/A']
    return formattedFiles
  }
}

export default VersionControlService
