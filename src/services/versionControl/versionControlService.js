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

export const handleCommitListRequestServices = async (versionControl, apiKey, page = 1, per_page = 10) => {
  try {
    const hasBranch = await githubUtils.branchExists(versionControl, apiKey)
    if (hasBranch) {
      const { data: commitList, totalCommits } = await githubUtils.getCommits(versionControl, page, per_page)
      return { commitList, totalCommits }
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

export const getPagination = (currentPage, totalPages) => {
  const maxPagesToShow = 7
  const pages = []
  totalPages = totalPages < currentPage ? currentPage : totalPages
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)
  console.log('====================================')
  console.log('currentPage: ', currentPage)
  console.log('totalPages: ', totalPages)
  console.log('startPage: ', startPage)
  console.log('endPage: ', endPage)
  console.log('====================================')
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  if (endPage < totalPages) {
    pages.push('...')
    pages.push(totalPages)
  }

  return pages
}
