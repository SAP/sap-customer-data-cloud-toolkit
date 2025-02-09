import { Octokit } from '@octokit/rest'

class VersionControlFactory {
  static getVersionControlFactory(versionControl) {
    switch (versionControl) {
      case 'github':
        return new Octokit()
      default:
        throw new Error('Invalid Version Control')
    }
  }
}
export default VersionControlFactory
