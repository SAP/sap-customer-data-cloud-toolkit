/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

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

  getCommits(apiKey) {
    throw new Error('Method not implemented.')
  }

  storeCdcDataInVersionControl(commitMessage, configs, apiKey) {
    throw new Error('Method not implemented.')
  }

  validateVersionControlCredentials() {
    throw new Error('Method not implemented.')
  }
}
export default VersionControlManager
