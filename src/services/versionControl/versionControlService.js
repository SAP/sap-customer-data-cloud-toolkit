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
  constructor(credentials, apiKey, versionControl, dataCenter, siteInfo) {
    this.credentials = credentials
    this.apiKey = apiKey
    this.defaultBranch = apiKey
    this.dataCenter = dataCenter
    this.siteInfo = siteInfo
    this.cdcService = new CdcService(credentials, apiKey, dataCenter, siteInfo)
    this.#versionControl = versionControl
  }

  handleGetServices = async (commitMessage) => {
    try {
      const configs = await this.cdcService.fetchCDCConfigs()
      await this.#versionControl.storeCdcDataInVersionControl(commitMessage || 'Backup created', configs, this.defaultBranch, this.siteInfo)
      return true
    } catch (error) {
      throw new Error(error)
    }
  }

  handleCommitListRequestServices = async () => {
    const { data: commitList } = await this.#versionControl.getCommits(this.defaultBranch)
    console.log('commit-list--->', commitList)
    return { commitList, totalCommits: commitList.length }
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

  prepareFilesForUpdate = async () => {
    const configs = await this.cdcService.fetchCDCConfigs()
    const validUpdates = await this.#versionControl.fetchAndPrepareFiles(configs, this.apiKey, this.siteInfo)
    const formattedFiles =
      validUpdates.length > 0
        ? validUpdates.map((file) => {
            const fileName = file.path.replace('src/versionControl/', '').replace('.json', '')
            return fileName.charAt(0).toUpperCase() + fileName.slice(1)
          })
        : []
    return formattedFiles
  }
}

export default VersionControlService
