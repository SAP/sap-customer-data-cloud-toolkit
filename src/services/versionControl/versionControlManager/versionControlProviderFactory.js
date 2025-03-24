/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { Octokit } from '@octokit/rest'

class VersionControlProviderFactory {
  static getVersionControlProviderFactory(versionControl, currentGitToken) {
    if (versionControl === 'github') {
      return new Octokit({ auth: currentGitToken })
    }

    throw new Error('Invalid Version Control')
  }
}
export default VersionControlProviderFactory
