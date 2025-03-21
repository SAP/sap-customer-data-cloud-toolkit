/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import GitHub from './github'

class VersionControlFactory {
  static getVersionControlFactory(versionControl, versionControlProvider, currentOwner, currentRepo) {
    switch (versionControl) {
      case 'github':
        return new GitHub(versionControlProvider, currentOwner, currentRepo)
      default:
        throw new Error('Invalid Version Control')
    }
  }
}
export default VersionControlFactory
