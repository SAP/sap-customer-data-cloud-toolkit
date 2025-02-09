/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import * as githubUtils from './githubUtils'
import CdcService from './cdcService'

class VersionControl {
  #credentials
  #apiKey
  #currentSite
  #gitToken
  #owner
  #repo
  #versionControl
  constructor(credentials, apiKey, currentSite, gitToken, owner, versionControl) {
    this.credentials = credentials
    this.apiKey = apiKey
    this.currentSite = currentSite
    this.gitToken = gitToken
    this.owner = owner || 'defaultOwner'
    this.repo = 'CDCVersionControl'
    this.defaultBranch = apiKey
    this.cdcService = new CdcService(this)
    this.#versionControl = versionControl
  }

  handleGetServices = async (credentials, apiKey, dataCenter, commitMessage) => {
    try {
      const cdcService = new CdcService(credentials, apiKey, dataCenter)
      //replace this functions with the versionControl interface funtion
      await githubUtils.createBranch(versionControl, apiKey)
      await cdcService.fetchCDCConfigs() // Ensures configurations are fetched, even if not directly used.
      await githubUtils.storeCdcDataInGit(versionControl, commitMessage || 'Backup created')
      return t('VERSION_CONTROL.BACKUP.SUCCESS.MESSAGE')
    } catch (error) {
      throw new Error(error)
    }
  }

  handleCommitListRequestServices = async (versionControl, apiKey) => {
    try {
      const hasBranch = await githubUtils.branchExists(versionControl, apiKey)
      if (hasBranch) {
        const { data: commitList } = await githubUtils.getCommits(versionControl)
        return { commitList, totalCommits: commitList.length }
      } else {
        return { commitList: [], totalCommits: 0 }
      }
    } catch (error) {
      console.error('Error fetching commits:', error)
      return { commitList: [], totalCommits: 0 }
    }
  }

  handleCommitRevertServices = async (versionControl, sha, t) => {
    try {
      const cdcService = new CdcService(versionControl)
      await cdcService.applyCommitConfig(sha)
      return t('VERSION_CONTROL.REVERT.SUCCESS.MESSAGE')
    } catch (error) {
      console.error('Error reverting configurations:', error)
      throw new Error(t('VERSION_CONTROL.REVERT.FAILURE.MESSAGE'))
    }
  }
}

export default VersionControl
