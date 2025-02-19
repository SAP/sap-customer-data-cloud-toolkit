/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

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
  it('should fail to fetch commits for branch - getCommits', async () => {
    const getBranchesMock = jest.fn().mockResolvedValueOnce()
    jest.spyOn(github, 'listBranches').mockResolvedValueOnce(true)

    github.versionControl = {
      rest: {
        repos: {
          listBranches: getBranchesMock,
        },
      },
    }
    await expect(github.getCommits(defaultBranch)).rejects.toThrow('Error')
  })
  it('should create a branch if it does not exist', async () => {
    const commitMessage = 'test commit'
    const configs = { key: 'value' }

    const getBranchMock = jest.fn().mockResolvedValueOnce({ data: { commit: { sha: shaMock } } })
    const getCreateRefMock = jest.fn().mockResolvedValueOnce({ data: refMock })
    const getCreateBlobMock = jest.fn().mockResolvedValueOnce({ data: { sha: shaMock } })
    const getCreateTreeMock = jest.fn().mockResolvedValueOnce({ data: { sha: shaMock } })
    const getCreateCommit = jest.fn().mockResolvedValueOnce({ data: { sha: shaMock } })
    const getRefMock = jest.fn().mockResolvedValueOnce({ data: { object: { sha: shaMock } } })
    const updateRef = jest.fn().mockResolvedValueOnce({ data: {} })
    const getListCommits = jest.fn().mockResolvedValueOnce({ data: [{ author: owner, commit: 'testCommit', url: 'testUrl' }] })
    const getUsersMock = jest.fn().mockResolvedValueOnce({ data: { login: owner } })
    const getBranchesMock = jest.fn().mockResolvedValueOnce({ data: [{ name: defaultBranch }, { commit: shaMock }, { protected: false }] })

    jest.spyOn(github, 'listBranches').mockResolvedValueOnce(false)
    github.versionControl = {
      rest: {
        repos: {
          getBranch: getBranchMock,
          listCommits: getListCommits,
          listBranches: getBranchesMock,
        },
        git: {
          createRef: getCreateRefMock,
          getAuthenticated: getUsersMock,
          getRef: getRefMock,
          createBlob: getCreateBlobMock,
          createTree: getCreateTreeMock,
          createCommit: getCreateCommit,
          updateRef: updateRef,
        },
        users: {
          getAuthenticated: getUsersMock,
        },
      },
    }

    await github.storeCdcDataInVersionControl(commitMessage, configs, apiKey)
    expect(getBranchMock).toHaveBeenCalledWith({
      owner,
      repo,
      branch: defaultBranch,
    })
  })
  it('should return false when credentials are not valid', async () => {
    const commitMessage = 'test commit'
    const configs = { key: 'value' }
    const getUsersMock = jest.fn().mockRejectedValueOnce(new Error('Invalid owner'))
    github.versionControl = {
      rest: {
        users: {
          getAuthenticated: getUsersMock,
        },
      },
    }

    await expect(github.storeCdcDataInVersionControl(commitMessage, configs, apiKey)).rejects.toThrow('Invalid owner')
  })

  it('should throw error when apikey does not exist', async () => {
    const commitMessage = 'test commit'
    const configs = { key: 'value' }
    await expect(github.storeCdcDataInVersionControl(commitMessage, configs)).rejects.toThrow('API key is missing')
  })

  it('should return the files in the commit', async () => {
    const getCommitMock = jest
      .fn()
      .mockResolvedValueOnce({ data: { files: [{ sha: shaMock, filename: mockFile, contents_url: '"https://randomVersionControl.xpto/testRepos/owner/testRepos/contents/"' }] } })
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

    expect(result).toEqual([{ filename: mockFile, contents_url: '"https://randomVersionControl.xpto/testRepos/owner/testRepos/contents/"', content: { key: 'value1' } }])
  })
  it('should return a blob when there is no response content', async () => {
    const getCommitMock = jest
      .fn()
      .mockResolvedValueOnce({ data: { files: [{ sha: shaMock, filename: mockFile, contents_url: '"https://randomVersionControl.xpto/testRepos/owner/testRepos/contents/"' }] } })
    const getRequestMock = jest.fn().mockResolvedValueOnce({
      data: {
        name: `${mockFile}.json`,
        path: `${mockFile}Path`,
        sha: shaMock,
      },
    })
    const getBlobMock = jest.fn().mockResolvedValueOnce({ data: { content: 'testContent', sha: shaMock } })

    github.versionControl = {
      rest: {
        repos: {
          getCommit: getCommitMock,
        },
        git: {
          getBlob: getBlobMock,
        },
      },
      request: getRequestMock,
    }
    Base64.decode.mockReturnValueOnce('{"key":"value1"}')

    const result = await github.getCommitFiles('testSha')

    expect(result).toEqual([{ filename: mockFile, contents_url: '"https://randomVersionControl.xpto/testRepos/owner/testRepos/contents/"', content: { key: 'value1' } }])
  })
  it('should return an error when the blob has no context', async () => {
    const url = '"https://randomVersionControl.xpto/testRepos/owner/testRepos/contents/"'
    const getCommitMock = jest
      .fn()
      .mockResolvedValueOnce({ data: { files: [{ sha: shaMock, filename: mockFile, contents_url: '"https://randomVersionControl.xpto/testRepos/owner/testRepos/contents/"' }] } })
    const getRequestMock = jest.fn().mockResolvedValueOnce({
      data: {
        name: `${mockFile}.json`,
        path: `${mockFile}Path`,
        sha: shaMock,
      },
    })
    const getBlobMock = jest.fn().mockResolvedValueOnce({ data: { sha: shaMock } })

    github.versionControl = {
      rest: {
        repos: {
          getCommit: getCommitMock,
        },
        git: {
          getBlob: getBlobMock,
        },
      },
      request: getRequestMock,
    }
    Base64.decode.mockReturnValueOnce('{"key":"value1"}')

    await expect(github.getCommitFiles('testSha')).rejects.toThrow(`Failed to fetch blob content for URL: ${url}`)
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
    const getCreateRefMock = jest.fn().mockResolvedValueOnce({ data: refMock })
    const getBranchMock = jest.fn().mockResolvedValueOnce({ data: { commit: { sha: shaMock } } })

    jest.spyOn(github, 'fetchAndPrepareFiles').mockResolvedValueOnce(validUpdates)

    github.versionControl = {
      rest: {
        git: {
          createRef: getCreateRefMock,
          getAuthenticated: getUsersMock,
          getRef: getRefMock,
          createBlob: getCreateBlobMock,
          createTree: getCreateTreeMock,
          createCommit: getCreateCommit,
          updateRef: updateRef,
        },
        repos: {
          getBranch: getBranchMock,
          listBranches: getBranchesMock,
          listCommits: getListCommits,
        },
        users: {
          getAuthenticated: getUsersMock,
        },
      },
    }
    await github.storeCdcDataInVersionControl(commitMessage, configs, apiKey)

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
  it('should return an error when there are no branches on the fetch and prepare files', async () => {
    jest.spyOn(github, 'listBranches').mockResolvedValueOnce(true)
    const getContentMock = jest.fn().mockResolvedValueOnce({ data: { content: 'testContent', sha: shaMock } })
    github.versionControl = {
      rest: {
        repos: {
          getContent: getContentMock,
        },
      },
    }
    const configs = { key: 'value' }
    Base64.decode.mockReturnValueOnce({ data: { content: 'testContent', sha: shaMock } })
    const response = await github.fetchAndPrepareFiles(configs, apiKey)
    expect(response[0].content).toEqual('"value"')
    expect(response[0].sha).toEqual('testSha')
  })

  it('should create a blob when there are no files on the fetch and prepare files', async () => {
    jest.spyOn(github, 'listBranches').mockResolvedValueOnce(true)
    const getContentMock = jest.fn().mockResolvedValueOnce({ data: { sha: shaMock } })
    const getBlobMock = jest.fn().mockResolvedValueOnce({ data: { content: 'testContent', sha: shaMock } })
    github.versionControl = {
      rest: {
        repos: {
          getContent: getContentMock,
        },
        git: {
          getBlob: getBlobMock,
        },
      },
    }
    const configs = { key: 'value' }
    Base64.decode.mockReturnValueOnce({ data: { content: 'testContent', sha: shaMock } })
    const response = await github.fetchAndPrepareFiles(configs, apiKey)
    expect(response[0].content).toEqual('"value"')
    expect(response[0].sha).toEqual('testSha')
  })
})
