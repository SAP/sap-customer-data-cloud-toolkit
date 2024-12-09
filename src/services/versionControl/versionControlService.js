import VersionControl from './versionControl'

export const createVersionControlInstance = (credentials, apiKey, currentSite) => {
  const credentialsUpdated = {
    userKey: credentials.userKey,
    secret: credentials.secretKey,
    gigyaConsole: credentials.gigyaConsole,
  }

  return new VersionControl(credentialsUpdated, apiKey, currentSite)
}

export const handleGetServices = async (versionControl, apiKey) => {
    await versionControl.createBranch(apiKey)
    await versionControl.storeCdcDataInGit('Backup created')
    alert('Backup created successfully!')
    return await handleCommitListRequestServices(versionControl, apiKey)
}

export const handleCommitListRequestServices = async (versionControl, apiKey) => {
    const hasBranch = await versionControl.branchExists(apiKey)
    if (hasBranch) {
      const commitList = await versionControl.getCommits()
      return commitList.length > 0 ? commitList : []
    } else {
      return []
    }
}

export const handleCommitRevertServices = async (versionControl, sha) => {
 await versionControl.applyCommitConfig(sha)
 alert('Restore completed successfully!')
}
