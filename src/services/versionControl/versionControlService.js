/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import VersionControl from './versionControl'
import * as githubUtils from './githubUtils'
import CdcService from './cdcService'

export const createVersionControlInstance = (credentials, apiKey, currentSite, owner) => {
  const credentialsUpdated = {
    userKey: credentials.userKey,
    secret: credentials.secretKey,
    gigyaConsole: credentials.gigyaConsole,
  }

  return new VersionControl(credentialsUpdated, apiKey, currentSite, owner)
}

export const handleGetServices = async (versionControl, apiKey, commitMessage) => {
  try {
    const cdcService = new CdcService(versionControl)

    await githubUtils.createBranch(versionControl, apiKey)
    const result = await cdcService.fetchCDCConfigs() // Ensures configurations are fetched, even if not directly used.
    const messages = await githubUtils.storeCdcDataInGit(versionControl, commitMessage || 'Backup created')
    return messages
  } catch (error) {
    console.error('Error creating backup:', error)
    alert('Failed to create backup. Please try again.')
  }
}

export const handleCommitListRequestServices = async (versionControl, apiKey) => {
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

export const handleCommitRevertServices = async (versionControl, sha) => {
  try {
    const cdcService = new CdcService(versionControl)
    await cdcService.applyCommitConfig(sha)
    alert('Restore completed successfully!')
  } catch (error) {
    console.error('Error reverting configurations:', error)
    alert('Failed to restore configurations. Please try again.')
  }
}
