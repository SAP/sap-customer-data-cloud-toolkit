/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import GitHub from './github'

class VersionControlFactory {
  static getVersionControlFactory(versionControl, currentOwner, currentRepo, currentGitToken) {
    if (versionControl === 'github') {
      return new GitHub(currentGitToken, currentOwner, currentRepo)
    }

    throw new Error('Invalid Version Control')
  }
}
export default VersionControlFactory
