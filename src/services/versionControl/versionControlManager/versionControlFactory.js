import { Octokit } from '@octokit/rest'
import GitHub from './github'

class VersionControlFactory {
  static getVersionControlFactory(versionControl, currentGitToken, currentOwner) {
    switch (versionControl) {
      case 'github':
        return new GitHub(new Octokit({ auth: currentGitToken }), currentOwner, 'CDCVersionControl')
      default:
        throw new Error('Invalid Version Control')
    }
  }
}
export default VersionControlFactory
