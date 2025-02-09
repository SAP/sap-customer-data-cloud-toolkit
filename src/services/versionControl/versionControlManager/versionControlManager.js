class VersionControlManager {
  versionControl
  owner
  repo

  constructor(versionControl, owner, repo) {
    this.versionControl = versionControl
    this.owner = owner
    this.repo = repo
  }
  getFile() {
    throw new Error('Method not implemented.')
  }
  getBlob() {
    throw new Error('Method not implemented.')
  }
  getCommit() {
    throw new Error('Method not implemented.')
  }
  createBranch() {
    throw new Error('Method not implemented.')
  }
}
export default VersionControlManager
