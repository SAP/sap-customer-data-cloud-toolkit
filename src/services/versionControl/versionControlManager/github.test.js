/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { skipForChildSite } from '../utils'
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
  const contentUrl = '"url.com/testRepos/owner/testRepos/contents/"'
  const siteInfo = { siteGroupOwner: 'owner', context: { targetApiKey: 'targetApiKey' } }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })
  it('should get a list of commits - getCommits', async () => {
    const getListCommits = jest.fn().mockResolvedValueOnce({ data: [{ author: owner, commit: 'testCommit', url: 'testUrl' }] })
    const getUsersMock = jest.fn().mockResolvedValueOnce({ data: { login: owner } })
    const getBranchesMock = jest.fn().mockResolvedValueOnce({ data: [{ name: defaultBranch }, { commit: shaMock }, { protected: false }] })
    const getBranchMock = jest.fn().mockResolvedValueOnce({ data: { commit: { sha: shaMock } } })

    github.versionControl = {
      rest: {
        users: {
          getAuthenticated: getUsersMock,
        },
        repos: {
          listBranches: getBranchesMock,
          listCommits: getListCommits,
          getBranch: getBranchMock,
        },
      },
    }
    const getCommit = await github.getCommits(defaultBranch)
    expect(getCommit).toEqual([{ author: owner, commit: 'testCommit', url: 'testUrl' }])
  })

  it('should stop fetching commits when response data is less than per_page - getCommits', async () => {
    const getListCommits = jest
      .fn()
      .mockResolvedValueOnce({ data: Array(100).fill({}) }) // First page
      .mockResolvedValueOnce({ data: Array(50).fill({}) }) // Last page

    jest.spyOn(github, 'hasBranch').mockResolvedValueOnce(true)
    github.versionControl = {
      rest: {
        repos: {
          listCommits: getListCommits,
        },
      },
    }

    const result = await github.getCommits('testBranch')
    expect(result.length).toBe(150)
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
    jest.spyOn(github, 'hasBranch').mockResolvedValueOnce(true)

    github.versionControl = {
      rest: {
        repos: {
          listBranches: getBranchesMock,
        },
      },
    }
    await expect(github.getCommits(defaultBranch)).rejects.toThrow('Error')
  })

  it('should return true if the branch exists - hasBranch', async () => {
    const branchName = 'main'
    const getBranchesMock = jest.fn().mockResolvedValueOnce({
      data: [{ name: 'main' }, { name: 'develop' }],
    })

    github.versionControl = {
      rest: {
        repos: {
          listBranches: getBranchesMock,
        },
      },
    }

    const result = await github.hasBranch(branchName)
    expect(result).toBe(true)
    expect(getBranchesMock).toHaveBeenCalledWith({
      owner: github.owner,
      repo: github.repo,
    })
  })

  it('should return false if the branch does not exist - hasBranch', async () => {
    const branchName = 'feature-branch'
    const getBranchesMock = jest.fn().mockResolvedValueOnce({
      data: [{ name: 'main' }, { name: 'develop' }],
    })

    github.versionControl = {
      rest: {
        repos: {
          listBranches: getBranchesMock,
        },
      },
    }

    const result = await github.hasBranch(branchName)
    expect(result).toBe(false)
    expect(getBranchesMock).toHaveBeenCalledWith({
      owner: github.owner,
      repo: github.repo,
    })
  })

  it('should throw an error if hasBranch fails', async () => {
    const branchName = 'main'
    const getBranchesMock = jest.fn().mockRejectedValueOnce(new Error('API error'))

    github.versionControl = {
      rest: {
        repos: {
          listBranches: getBranchesMock,
        },
      },
    }

    await expect(github.hasBranch(branchName)).rejects.toThrow('API error')
    expect(getBranchesMock).toHaveBeenCalledWith({
      owner: github.owner,
      repo: github.repo,
    })
  })

  it('should return false when branchName is not found - hasBranch', async () => {
    const getBranchesMock = jest.fn().mockResolvedValueOnce({ data: [{ name: 'otherBranch' }] })
    const getListCommits = jest.fn().mockResolvedValueOnce({ data: [{ author: owner, commit: 'testCommit', url: 'testUrl' }] })
    const getUsersMock = jest.fn().mockResolvedValueOnce({ data: { login: owner } })
    const getBranchMock = jest.fn().mockResolvedValueOnce({ data: { commit: { sha: shaMock } } })

    github.versionControl = {
      rest: {
        users: {
          getAuthenticated: getUsersMock,
        },
        repos: {
          listBranches: getBranchesMock,
          listCommits: getListCommits,
          getBranch: getBranchMock,
        },
      },
    }
    const result = await github.hasBranch('testBranch')
    expect(result).toBe(false)
  })

  it('should throw error when apikey does not exist', async () => {
    const commitMessage = 'test commit'
    const configs = { key: 'value' }
    await expect(github.storeCdcDataInVersionControl(commitMessage, configs)).rejects.toThrow('API key is missing')
  })

  it('should return the files in the commit', async () => {
    const getCommitMock = jest.fn().mockResolvedValueOnce({ data: { files: [{ sha: shaMock, filename: mockFile, contents_url: contentUrl }] } })
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

    expect(result).toEqual([{ filename: mockFile, contents_url: contentUrl, content: { key: 'value1' } }])
  })
  it('should return a blob when there is no response content', async () => {
    const getCommitMock = jest.fn().mockResolvedValueOnce({ data: { files: [{ sha: shaMock, filename: mockFile, contents_url: contentUrl }] } })
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

    expect(result).toEqual([{ filename: mockFile, contents_url: contentUrl, content: { key: 'value1' } }])
  })
  it('should return an error when the blob has no context', async () => {
    const getCommitMock = jest.fn().mockResolvedValueOnce({ data: { files: [{ sha: shaMock, filename: mockFile, contents_url: contentUrl }] } })
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

    await expect(github.getCommitFiles('testSha')).rejects.toThrow(`Failed to fetch blob content for URL: ${contentUrl}`)
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
    const getListCommits = jest
      .fn()
      .mockResolvedValueOnce({ data: [{ author: owner, commit: 'testCommit', url: 'testUrl' }] })
      .mockResolvedValueOnce({
        data: [
          { author: owner, commit: 'testCommit', url: 'testUrl' },
          { author: owner, commit: 'testCommit', url: 'testUrl' },
        ],
      })
    const getUsersMock = jest.fn().mockResolvedValueOnce({ data: { login: owner } })
    const getCreateRefMock = jest.fn().mockResolvedValueOnce({ data: refMock })
    const getBranchMock = jest.fn().mockResolvedValueOnce({ data: { commit: { sha: shaMock } } })

    jest.spyOn(github, 'fetchFilesAndUpdateGitContent').mockResolvedValueOnce(validUpdates)

    jest.spyOn(github, 'hasBranch').mockResolvedValueOnce(true)
    jest.spyOn(github, 'hasBranch').mockResolvedValueOnce(true)
    jest.spyOn(github, 'hasBranch').mockResolvedValueOnce(true)
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
    await github.storeCdcDataInVersionControl(commitMessage, configs, apiKey, siteInfo)

    expect(github.fetchFilesAndUpdateGitContent).toHaveBeenCalledWith(configs, apiKey, siteInfo)
  })

  it('should use default content when file does not exist - updateGitFileContent', async () => {
    const getFileMock = jest.fn().mockRejectedValueOnce({ status: 404 })
    const configs = { key: 'value' }
    const validUpdates = [{ path: 'src/versionControl/key.json', content: JSON.stringify(configs.key, null, 2), sha: undefined }]
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

    jest.spyOn(github, 'fetchFilesAndUpdateGitContent').mockResolvedValueOnce(validUpdates)

    jest.spyOn(github, 'hasBranch').mockResolvedValueOnce(true)
    jest.spyOn(github, 'hasBranch').mockResolvedValueOnce(true)
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
          getContent: getFileMock,
          getBranch: getBranchMock,
          listBranches: getBranchesMock,
          listCommits: getListCommits,
        },
        users: {
          getAuthenticated: getUsersMock,
        },
      },
    }

    const result = await github.fetchFilesAndUpdateGitContent(configs, apiKey, { siteGroupOwner: 'owner', context: { targetApiKey: 'targetApiKey' } })
    expect(result[0].sha).toBeUndefined()
  })

  it('should fetch and prepare files', async () => {
    jest.spyOn(github, 'hasBranch').mockResolvedValueOnce(true)

    const getBlob = jest.fn().mockResolvedValueOnce({ data: { content: 'testContent' } })
    const getContentMock = jest.fn().mockResolvedValueOnce({
      data: { content: Base64.encode(JSON.stringify({ key: 'value' })), sha: shaMock },
    })

    const configs = { key: { nestedKey: 'value' } }
    const expectedResult = [
      {
        path: 'src/versionControl/key.json',
        content: JSON.stringify(configs.key, null, 2),
        sha: 'testSha',
      },
    ]

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

    Base64.decode.mockReturnValueOnce(JSON.stringify({ key: 'value' }))

    const fileUpdates = await github.fetchFilesAndUpdateGitContent(configs, apiKey, siteInfo)

    expect(fileUpdates).toEqual(expectedResult)
  })

  it('should return an empty array when branch does not exist - getCommits', async () => {
    jest.spyOn(github, 'hasBranch').mockResolvedValueOnce(false)

    const result = await github.getCommits('testBranch')
    expect(result).toEqual([])
  })

  it('should create a blob when there are no files on the fetch and prepare files', async () => {
    jest.spyOn(github, 'hasBranch').mockResolvedValueOnce(true)

    const getContentMock = jest.fn().mockResolvedValueOnce({ data: { sha: shaMock } })
    const getBlobMock = jest.fn().mockResolvedValueOnce({
      data: { content: Base64.encode(JSON.stringify({ key: { nestedKey: 'value' } })), sha: shaMock },
    })

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

    const configs = { key: { nestedKey: 'value' } }

    Base64.decode.mockImplementation((encodedContent) => {
      if (encodedContent === Base64.encode(JSON.stringify({ key: { nestedKey: 'value' } }))) {
        return JSON.stringify({ key: { nestedKey: 'value' } })
      }
      throw new Error(`Unexpected input to Base64.decode: ${encodedContent}`)
    })

    const response = await github.fetchFilesAndUpdateGitContent(configs, apiKey, siteInfo)

    expect(response[0].content).toEqual(JSON.stringify(configs.key, null, 2))
    expect(response[0].sha).toEqual('testSha')
  })
})

describe('skipForChildSite', () => {
  it('should return true for child site with non-copyable file', () => {
    const siteInfo = { siteGroupOwner: 'owner', context: { targetApiKey: 'targetApiKey' } }
    const getGitFileInfo = { name: 'social.json' }
    expect(skipForChildSite(getGitFileInfo, siteInfo)).toBe(false)
  })

  it('should return false for child site with copyable file', () => {
    const siteInfo = { siteGroupOwner: 'owner', context: { targetApiKey: 'targetApiKey' } }
    const getGitFileInfo = { name: 'other.json' }
    expect(skipForChildSite(getGitFileInfo, siteInfo)).toBe(true)
  })

  it('should return true for parent site', () => {
    const siteInfo = { siteGroupOwner: 'targetApiKey', context: { targetApiKey: 'targetApiKey' } }
    const getGitFileInfo = { name: 'social.json' }
    expect(skipForChildSite(getGitFileInfo, siteInfo)).toBe(true)
  })
  it('should call hasBranch once and wait for the delay', async () => {
    const owner = 'testOwner'
    const repo = 'testRepo'
    const github = new GitHub(null, owner, repo)

    const hasBranches = jest.fn().mockResolvedValueOnce(true) // Simulate branch exists
    github.hasBranch = hasBranches
  })
})

describe('GitHub - validateVersionControlCredentials', () => {
  const owner = 'testOwner'
  const repo = 'testRepo'
  const github = new GitHub(null, owner, repo)

  it('should validate credentials successfully when login matches owner and main branch exists', async () => {
    const getUsersMock = jest.fn().mockResolvedValueOnce({ data: { login: owner } })
    const getBranchMock = jest.fn().mockResolvedValueOnce({ data: { commit: { sha: 'testSha' } } })

    github.versionControl = {
      rest: {
        users: {
          getAuthenticated: getUsersMock,
        },
        repos: {
          getBranch: getBranchMock,
        },
      },
    }

    const result = await github.validateVersionControlCredentials()
    expect(result).toBe(true)
    expect(getUsersMock).toHaveBeenCalledTimes(1)
    expect(getBranchMock).toHaveBeenCalledTimes(1)
  })

  it('should return false when login does not match owner', async () => {
    const getUsersMock = jest.fn().mockResolvedValueOnce({ data: { login: 'differentOwner' } })

    github.versionControl = {
      rest: {
        users: {
          getAuthenticated: getUsersMock,
        },
      },
    }

    await expect(github.validateVersionControlCredentials()).resolves.toBe(false)
    expect(getUsersMock).toHaveBeenCalledTimes(1)
  })

  it('should throw an error when the main branch does not exist', async () => {
    const getUsersMock = jest.fn().mockResolvedValueOnce({ data: { login: owner } })
    const getBranchMock = jest.fn().mockRejectedValueOnce(new Error('There is no main branch for this repository'))

    github.versionControl = {
      rest: {
        users: {
          getAuthenticated: getUsersMock,
        },
        repos: {
          getBranch: getBranchMock,
        },
      },
    }

    await expect(github.validateVersionControlCredentials()).rejects.toThrow('There is no main branch for this repository')
    expect(getUsersMock).toHaveBeenCalledTimes(1)
    expect(getBranchMock).toHaveBeenCalledTimes(1)
  })

  it('should throw an error when API call fails', async () => {
    const getUsersMock = jest.fn().mockRejectedValueOnce(new Error('API error'))

    github.versionControl = {
      rest: {
        users: {
          getAuthenticated: getUsersMock,
        },
      },
    }

    await expect(github.validateVersionControlCredentials()).rejects.toThrow('API error')
    expect(getUsersMock).toHaveBeenCalledTimes(1)
  })
})
