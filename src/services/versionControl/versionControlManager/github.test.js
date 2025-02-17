import GitHub from './github'
import { Base64 } from 'js-base64'

jest.mock('js-base64')
jest.setTimeout(30000)

describe('GitHub Test Suit', () => {
  const owner = 'testOwner'
  const repo = 'testRepo'
  const apiKey = 'testApiKey'
  const versionControl = 'github'
  const defaultBranch = 'main'
  const shaMock = 'testSha'
  const refMock = 'testRef'
  const mockFile = 'testFile'
  const github = new GitHub(versionControl, owner, repo)

  beforeEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })
  it('should get a list of commits - getCommits', async () => {
    const getListCommits = jest.fn().mockResolvedValueOnce({ data: [{ author: owner, commit: 'testCommit', url: 'testUrl' }] })
    const getUsersMock = jest.fn().mockResolvedValueOnce({ data: { login: owner } })
    const getBranchesMock = jest.fn().mockResolvedValueOnce({ data: [{ name: defaultBranch }, { commit: shaMock }, { protected: false }] })

    console.log('test')
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
    const getCommit = await github.getCommits(defaultBranch)
    expect(getCommit).toEqual({ data: [{ author: owner, commit: 'testCommit', url: 'testUrl' }] })
  })
  it('should get an error when it does not have branches - getCommits', async () => {
    const getUsersMock = jest.fn().mockResolvedValueOnce({ data: { login: owner } })
    const getBranchesMock = jest.fn().mockRejectedValueOnce()

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
    await expect(github.getCommits(defaultBranch)).rejects.toThrow('Error')
  })
  it('should create a branch if it does not exist', async () => {
    const getBranchMock = jest.fn().mockResolvedValueOnce({ data: { commit: { sha: shaMock } } })
    const getCreateRefMock = jest.fn().mockResolvedValueOnce({ data: refMock })

    jest.spyOn(github, 'listBranches').mockResolvedValueOnce(false)
    github.versionControl = {
      rest: {
        repos: {
          getBranch: getBranchMock,
        },
        git: {
          createRef: getCreateRefMock,
        },
      },
    }

    await github.createBranch(apiKey)
    expect(github.listBranches).toHaveBeenCalledWith(apiKey)
    expect(getBranchMock).toHaveBeenCalledWith({
      owner,
      repo,
      branch: defaultBranch,
    })
  })
  it('should return false when credentials are not valid', async () => {
    const getUsersMock = jest.fn().mockRejectedValueOnce(new Error('Invalid owner'))

    github.versionControl = {
      rest: {
        users: {
          getAuthenticated: getUsersMock,
        },
      },
    }

    await expect(github.createBranch(apiKey)).rejects.toThrow('Invalid owner')
  })

  it('should throw error when apikey does not exist', async () => {
    await expect(github.createBranch()).rejects.toThrow('API key is missing')
  })

  it('should return the files in the commit', async () => {
    const getCommitMock = jest
      .fn()
      .mockResolvedValueOnce({ data: { files: [{ sha: shaMock, filename: mockFile, contents_url: '"https://versionControl.com/testRepos/owner/testRepos/contents/"' }] } })
    const getRequestMock = jest.fn().mockResolvedValueOnce({
      data: {
        name: `${mockFile}.json`,
        path: `${mockFile}Path`,
        sha: shaMock,
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

    expect(result).toEqual([{ filename: mockFile, contents_url: '"https://versionControl.com/testRepos/owner/testRepos/contents/"', content: { key: 'value1' } }])
  })

  it('should throw an error if no files are found in the commit', async () => {
    const sha = 'testSha'
    const getFailCommitMock = jest.fn().mockResolvedValueOnce({ data: {} })

    github.versionControl = {
      rest: {
        repos: {
          getCommit: getFailCommitMock,
        },
      },
    }
    await expect(github.getCommitFiles(sha)).rejects.toThrow(`No files found in commit: ${sha}`)
  })

  it('should store CDC data in version control', async () => {
    const commitMessage = 'test commit'
    const configs = { key: 'value' }
    const validUpdates = [{ path: 'path', content: 'content' }]
    const getCreateBlobMock = jest.fn().mockResolvedValueOnce({ data: { sha: shaMock } })
    const getCreateTreeMock = jest.fn().mockResolvedValueOnce({ data: { sha: shaMock } })
    const getCreateCommit = jest.fn().mockResolvedValueOnce({ data: { sha: shaMock } })
    const getRefMock = jest.fn().mockResolvedValueOnce({ data: { object: { sha: shaMock } } })
    const updateRef = jest.fn().mockResolvedValueOnce({ data: {} })
    const getBranchesMock = jest.fn().mockResolvedValueOnce({ data: [{ name: defaultBranch }, { commit: shaMock }, { protected: false }] })
    const getListCommits = jest.fn().mockResolvedValueOnce({ data: [{ author: owner, commit: 'testCommit', url: 'testUrl' }] })
    const getUsersMock = jest.fn().mockResolvedValueOnce({ data: { login: owner } })

    jest.spyOn(github, 'createBranch').mockResolvedValueOnce()
    jest.spyOn(github, 'fetchAndPrepareFiles').mockResolvedValueOnce(validUpdates)

    github.versionControl = {
      rest: {
        git: {
          getAuthenticated: getUsersMock,
          getRef: getRefMock,
          createBlob: getCreateBlobMock,
          createTree: getCreateTreeMock,
          createCommit: getCreateCommit,
          updateRef: updateRef,
        },
        repos: {
          listBranches: getBranchesMock,
          listCommits: getListCommits,
        },
      },
    }
    await github.storeCdcDataInVersionControl(commitMessage, configs, apiKey)

    expect(github.createBranch).toHaveBeenCalledWith(apiKey)
    expect(github.fetchAndPrepareFiles).toHaveBeenCalledWith(configs, apiKey)
  })

  it('should fetch and prepare files', async () => {
    jest.spyOn(github, 'listBranches').mockResolvedValueOnce(true)
    const getBlob = jest.fn().mockResolvedValueOnce({ data: { content: 'testContent' } })
    const getContentMock = jest.fn().mockResolvedValueOnce({ data: { content: 'testContent', sha: shaMock } })

    const configs = { key: 'value' }
    const result = [{ path: 'src/versionControl/key.json', content: JSON.stringify(configs.key, null, 2), sha: 'testSha' }]

    github.versionControl = {
      rest: {
        git: {
          getBlob: getBlob,
        },
        repos: {
          getContent: getContentMock,
        },
      },
    }
    const fileUpdates = await github.fetchAndPrepareFiles(configs, apiKey)

    expect(fileUpdates).toEqual(result)
  })
})
