/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import CdcService from './cdcService'

class VersionControlService {
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

  createBackup = async (commitMessage) => {
    try {
      const configs = await this.cdcService.fetchCDCConfigs()
      const errors = this.#extractConfigErrors(configs)
      if(errors.length > 0) {
        return Promise.reject(errors)
      }
      return await this.#versionControl.storeCdcDataInVersionControl(commitMessage || 'Backup created', configs, this.defaultBranch, this.siteInfo)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  getCommitsFromBranch = async () => {
    const commitList = await this.#versionControl.getCommits(this.defaultBranch)
    return { commitList, totalCommits: commitList.length }
  }

  revertBackup = async (sha) => {
    try {
      const files = await this.#versionControl.getCommitFiles(sha)
      await this.cdcService.applyCommitConfig(files)
      return true
    } catch (error) {
      return Promise.reject(error)
    }
  }

  getFilesForBackup = async () => {
    const configs = await this.cdcService.fetchCDCConfigs()
    const errors = this.#extractConfigErrors(configs)
    if(errors.length > 0) {
      return Promise.reject(errors)
    }
    const validUpdates = await this.#versionControl.fetchFilesAndUpdateGitContent(configs, this.apiKey, this.siteInfo)
    const formattedFiles =
      validUpdates.length > 0
        ? validUpdates.map((file) => {
            const fileName = file.path.replace('src/versionControl/', '').replace('.json', '')
            return fileName.charAt(0).toUpperCase() + fileName.slice(1)
          })
        : []
    return formattedFiles
  }

  #extractConfigErrors(configs){
    const errors = []
    configs.rba.forEach(rbaConfig => {
      if(rbaConfig.errorCode && rbaConfig.errorMessage && rbaConfig.errorCode !== 0) {
        errors.push(rbaConfig.errorMessage)
      }
    })
    Object.entries(configs).forEach(([key, value]) => {
      if(key !== 'rba' && value.errorCode && value.errorMessage && value.errorCode !== 0) {
        errors.push(value.errorMessage)
      }
    })
    return errors
  }
}

export default VersionControlService
