/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

class VersionControlManager {
  token
  owner
  repo

  constructor(token, owner, repo) {
    this.token = token
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
