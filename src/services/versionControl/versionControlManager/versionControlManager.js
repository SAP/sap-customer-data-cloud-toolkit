class VersionControlManager {
  versionControl
  owner
  repo

  constructor(versionControl, owner, repo) {
    this.versionControl = versionControl
    this.owner = owner
    this.repo = repo
  }

  getCommitFiles(sha) {
    throw new Error('Method not implemented.')
  }
  listBranches(defaultBranch) {
    throw new Error('Method not implemented.')
  }

  createBranch(apiKey) {
    throw new Error('Method not implemented.')
  }

  getCommits(apiKey) {
    throw new Error('Method not implemented.')
  }

  prepareFilesForUpdate() {
    throw new Error('Method not implemented.')
  }

  storeCdcDataInVersionControl(commitMessage, configs, apiKey) {
    throw new Error('Method not implemented.')
  }
}
export default VersionControlManager
