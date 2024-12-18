/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import VersionControl from './versionControl'

export const createVersionControlInstance = (credentials, apiKey, currentSite) => {
  const credentialsUpdated = {
    userKey: credentials.userKey,
    secret: credentials.secretKey,
    gigyaConsole: credentials.gigyaConsole,
  }

  return new VersionControl(credentialsUpdated, apiKey, currentSite)
}

export const handleGetServices = async (versionControl, apiKey, commitMessage) => {
  try {
    await versionControl.createBranch(apiKey)
    await versionControl.storeCdcDataInGit(commitMessage || 'Backup created')
    alert('Backup created successfully!')
    return await handleCommitListRequestServices(versionControl, apiKey)
  } catch (error) {
    console.error('Error creating backup:', error)
    alert('Failed to create backup. Please try again.')
  }
}

export const handleCommitListRequestServices = async (versionControl, apiKey) => {
  try {
    const hasBranch = await versionControl.branchExists(apiKey)
    if (hasBranch) {
      const commitList = await versionControl.getCommits()
      return commitList.length > 0 ? commitList : []
    } else {
      return []
    }
  } catch (error) {
    console.error('Error fetching commits:', error)
    return []
  }
}

export const handleCommitRevertServices = async (versionControl, sha) => {
  try {
    await versionControl.applyCommitConfig(sha)
    alert('Restore completed successfully!')
  } catch (error) {
    console.error('Error reverting configurations:', error)
    alert('Failed to restore configurations. Please try again.')
  }
}
