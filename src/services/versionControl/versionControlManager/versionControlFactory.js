/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { Octokit } from '@octokit/rest'
import GitHub from './github'

class VersionControlFactory {
  static getVersionControlFactory(versionControl, currentGitToken, currentOwner, currentRepo) {
    switch (versionControl) {
      case 'github':
        return new GitHub(new Octokit({ auth: currentGitToken }), currentOwner, currentRepo)
      case 'other':
        return new GitHub(new Octokit(), 'no owner', 'no repo')
      default:
        throw new Error('Invalid Version Control')
    }
  }
}
export default VersionControlFactory
