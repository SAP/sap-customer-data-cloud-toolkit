import VersionControlProviderFactory from './versionControlProviderFactory'
import { Octokit } from '@octokit/rest'

jest.mock('@octokit/rest', () => {
  return {
    Octokit: jest.fn(),
  }
})

describe('VersionControlProviderFactory', () => {
  const mockGitToken = 'testGitToken'

  it('should return an Octokit instance when versionControl is "github"', () => {
    const result = VersionControlProviderFactory.getVersionControlProviderFactory('github', mockGitToken)

    expect(Octokit).toHaveBeenCalledWith({ auth: mockGitToken })
    expect(result).toBeInstanceOf(Octokit)
  })

  it('should throw an error when versionControl is invalid', () => {
    expect(() => VersionControlProviderFactory.getVersionControlProviderFactory('invalidVersionControl', mockGitToken)).toThrow('Invalid Version Control')
  })
})
