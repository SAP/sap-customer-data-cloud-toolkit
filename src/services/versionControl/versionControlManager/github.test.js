import GitHub from './github'
import axios from 'axios'
import { Base64 } from 'js-base64'

jest.mock('axios')
jest.mock('js-base64')
jest.mock('../dataSanitization', () => ({
  removeIgnoredFields: jest.fn(),
}))

describe('GitHub Test Suit', () => {
  const owner = 'testOwner'
  const repo = 'testRepo'
  const apiKey = 'testApiKey'
  const versionControl = 'github'
  const defaultBranch = 'main'
  const github = new GitHub(versionControl, owner, repo)

  beforeEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  //   it('should create a branch if it does not exist', async () => {
  //     jest.spyOn(github, 'listBranches').mockResolvedValueOnce(false)
  //     const getBranchMock = jest.fn().mockResolvedValueOnce({ data: { commit: { sha: 'testSha' } } })
  //     github.versionControl = {
  //       rest: {
  //         repos: {
  //           getBranch: getBranchMock,
  //         },
  //       },
  //     }

  //     await github.createBranch(apiKey)
  //     expect(github.listBranches).toHaveBeenCalledWith(apiKey)
  //     expect(getBranchMock).toHaveBeenCalledWith({
  //       owner,
  //       repo,
  //       branch: defaultBranch,
  //     })
  //   })

  it('should return true if the branch exists', async () => {
    const getUsersMock = jest.fn().mockResolvedValueOnce({ data: { login: owner } })
    const getBranchesMock = jest.fn().mockResolvedValueOnce({ data: [{ name: defaultBranch }, { commit: 'testSha' }, { protected: false }] })

    github.versionControl = {
      rest: {
        users: {
          getAuthenticated: getUsersMock,
        },
        repos: {
          listBranches: getBranchesMock,
        },
      },
    }

    const result = await github.listBranches()

    expect(result).toBe(true)
  })

  it('should return the files in the commit', async () => {
    const getCommitMock = jest
      .fn()
      .mockResolvedValueOnce({ data: { files: [{ sha: 'testSha', filename: 'testFile', contents_url: '"https://versionControl.com/testRepos/owner/testRepos/contents/"' }] } })
    const getRequestMock = jest.fn().mockResolvedValueOnce({
      data: {
        name: 'testFile.json',
        path: 'testFilePath',
        sha: 'testSha',
        content: 'ewogICJjYWxsSWQi0=',
      },
    })

    github.versionControl = {
      rest: {
        repos: {
          getCommit: getCommitMock,
        },
      },
      request: getRequestMock,
    }
    Base64.decode.mockReturnValueOnce('{"key":"value1"}')

    const result = await github.getCommitFiles('testSha')

    expect(result).toEqual([{ filename: 'testFile', contents_url: '"https://versionControl.com/testRepos/owner/testRepos/contents/"', content: { key: 'value1' } }])
  })
  it('should get a list of commits - getCommits', async () => {
    const getUsersMock = jest.fn().mockResolvedValueOnce({ data: { login: owner } })
    const getBranchesMock = jest.fn().mockResolvedValueOnce({ data: [{ name: 'testApikey' }, { commit: 'testSha' }, { protected: false }] })
    const getListCommits = jest.fn().mockResolvedValueOnce({ data: [{ author: 'testOwner', commit: 'testCommit', url: 'testUrl' }] })

    github.versionControl = {
      rest: {
        users: {
          getAuthenticated: getUsersMock,
        },
        repos: {
          listBranches: getBranchesMock,
          listCommits: getListCommits,
        },
      },
    }
    const getCommit = await github.getCommits('testApikey')
    expect(getCommit).toEqual({ data: [{ author: 'testOwner', commit: 'testCommit', url: 'testUrl' }] })
  })

  it('should throw an error if no files are found in the commit', async () => {
    const sha = 'testSha'
    const getCommitMock = jest.fn().mockResolvedValueOnce({ data: {} })

    github.versionControl = {
      rest: {
        repos: {
          getCommit: getCommitMock,
        },
      },
    }
    await expect(github.getCommitFiles(sha)).rejects.toThrow(`No files found in commit: ${sha}`)
  })

  //   it('should store CDC data in version control', async () => {
  //     const commitMessage = 'test commit'
  //     const configs = { key: 'value' }
  //     const validUpdates = [{ path: 'path', content: 'content' }]
  //     const getRefMock = jest.fn().mockResolvedValueOnce({ data: {} })

  //     jest.spyOn(github, 'createBranch').mockResolvedValueOnce()
  //     jest.spyOn(github, 'fetchAndPrepareFiles').mockResolvedValueOnce(validUpdates)
  //     github.versionControl = {
  //       rest: {
  //         git: {
  //           getAuthenticated: getUsersMock,
  //         },
  //         repos: {
  //           listBranches: getBranchesMock,
  //           listCommits: getListCommits,
  //         },
  //       },
  //     }
  //     await github.storeCdcDataInVersionControl(commitMessage, configs, apiKey)

  //     expect(github.createBranch).toHaveBeenCalledWith(apiKey)
  //     expect(github.fetchAndPrepareFiles).toHaveBeenCalledWith(configs, apiKey)
  //   })
  //-------------------------------
  //   it('should fetch and prepare files', async () => {
  //     const configs = { key: 'value' }
  //     const files = [{ path: 'src/versionControl/key.json', content: JSON.stringify(configs.key, null, 2) }]
  //     const result = [{ path: 'src/versionControl/key.json', content: JSON.stringify(configs.key, null, 2), sha: undefined }]

  //     jest.spyOn(github, '#updateGitFileContent').mockResolvedValueOnce(result[0])

  //     const fileUpdates = await github.fetchAndPrepareFiles(configs, apiKey)

  //     expect(fileUpdates).toEqual(result)
  //   })
})
