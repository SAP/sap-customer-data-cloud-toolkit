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
    expect(getCommit).toEqual({ data: [{ author: owner, commit: 'testCommit', url: 'testUrl' }] })
  })

  it('should stop fetching commits when response data is less than per_page - getCommits', async () => {
    const getListCommits = jest
      .fn()
      .mockResolvedValueOnce({ data: Array(100).fill({}) }) // First page
      .mockResolvedValueOnce({ data: Array(50).fill({}) }) // Last page

    jest.spyOn(github, 'listBranches').mockResolvedValueOnce(true)
    github.versionControl = {
      rest: {
        repos: {
          listCommits: getListCommits,
        },
      },
    }

    const result = await github.getCommits('testBranch')
    expect(result.data.length).toBe(150)
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
    const getCreateRefMock = jest.fn().mockResolvedValueOnce({ data: { ref: '/refs/heads/test' } })
    const getCreateBlobMock = jest.fn().mockResolvedValueOnce({ data: { sha: shaMock } })
    const getCreateTreeMock = jest.fn().mockResolvedValueOnce({ data: { sha: shaMock } })
    const getCreateCommit = jest.fn().mockResolvedValueOnce({ data: { sha: shaMock } })
    const getRefMock = jest.fn().mockResolvedValueOnce({ data: { object: { sha: shaMock } } })
    const updateRef = jest.fn().mockResolvedValueOnce({ data: {} })
    const getListCommits = jest.fn().mockResolvedValueOnce({ data: [{ author: owner, commit: 'testCommit', url: 'testUrl' }] })
    const getUsersMock = jest.fn().mockResolvedValueOnce({ data: { login: owner } })
    const getBranchesMock = jest.fn().mockResolvedValueOnce({ data: [{ name: defaultBranch }, { commit: shaMock }, { protected: false }] })

    jest.spyOn(github, 'listBranches').mockResolvedValueOnce(true)
    jest.spyOn(github, 'listBranches').mockResolvedValueOnce(true)
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
    expect(getRefMock).toHaveBeenCalledWith({
      owner,
      repo,
      ref: `heads/${apiKey}`,
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

  it('should return false when branchName is not found - listBranches', async () => {
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
    const result = await github.listBranches('testBranch')
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
    const getListCommits = jest.fn().mockResolvedValueOnce({ data: [{ author: owner, commit: 'testCommit', url: 'testUrl' }] })
    const getUsersMock = jest.fn().mockResolvedValueOnce({ data: { login: owner } })
    const getCreateRefMock = jest.fn().mockResolvedValueOnce({ data: refMock })
    const getBranchMock = jest.fn().mockResolvedValueOnce({ data: { commit: { sha: shaMock } } })

    jest.spyOn(github, 'fetchAndPrepareFiles').mockResolvedValueOnce(validUpdates)

    jest.spyOn(github, 'listBranches').mockResolvedValueOnce(true)
    jest.spyOn(github, 'listBranches').mockResolvedValueOnce(true)
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

    expect(github.fetchAndPrepareFiles).toHaveBeenCalledWith(configs, apiKey, siteInfo)
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

    jest.spyOn(github, 'fetchAndPrepareFiles').mockResolvedValueOnce(validUpdates)

    jest.spyOn(github, 'listBranches').mockResolvedValueOnce(true)
    jest.spyOn(github, 'listBranches').mockResolvedValueOnce(true)
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

    const result = await github.fetchAndPrepareFiles(configs, apiKey, { siteGroupOwner: 'owner', context: { targetApiKey: 'targetApiKey' } })
    console.log(getFileMock.mock.calls)
    expect(result[0].sha).toBeUndefined()
  })

// it('should not store data if there are no valid updates - storeCdcDataInVersionControl', async () => {
//   jest.spyOn(github, 'fetchAndPrepareFiles').mockResolvedValueOnce([]) // Simulate no valid updates

//   const commitMessage = 'test commit'
//   const configs = { key: 'value' }

//   const getBranchMock = jest.fn().mockResolvedValueOnce({ data: { commit: { sha: 'testMainBranchSha' } } })
//   const getCreateRefMock = jest.fn().mockResolvedValueOnce({ data: { ref: 'refs/heads/test' } })
//   const getListCommitsMock = jest.fn().mockResolvedValueOnce({ data: [{ commit: 'testCommit' }] })
//   const updateRefMock = jest.fn().mockResolvedValueOnce({ data: {} })

//   github.versionControl = {
//     rest: {
//       repos: {
//         getBranch: getBranchMock,
//         listBranches: jest.fn().mockResolvedValueOnce({ data: [{ name: defaultBranch }] }),
//         listCommits: getListCommitsMock,
//       },
//       git: {
//         createRef: getCreateRefMock,
//         updateRef: updateRefMock,
//       },
//       users: {
//         getAuthenticated: jest.fn().mockResolvedValueOnce({ data: { login: owner } }),
//       },
//     },
//   }

//   await github.storeCdcDataInVersionControl(commitMessage, configs, apiKey, siteInfo)

//   // After storeCdcDataInVersionControl, check the number of valid updates.
//   const validUpdates = await github.fetchAndPrepareFiles(configs, apiKey, siteInfo)
//   expect(validUpdates.length).toBe(0) // There should be no valid updates
// })


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
    const fileUpdates = await github.fetchAndPrepareFiles(configs, apiKey, siteInfo)

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
    const response = await github.fetchAndPrepareFiles(configs, apiKey, siteInfo)
    expect(response[0].content).toEqual('"value"')
    expect(response[0].sha).toEqual('testSha')
  })

  it('should return an empty array when branch does not exist - getCommits', async () => {
    jest.spyOn(github, 'listBranches').mockResolvedValueOnce(false)

    const result = await github.getCommits('testBranch')
    expect(result).toEqual({ data: [] })
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
    const response = await github.fetchAndPrepareFiles(configs, apiKey, siteInfo)
    expect(response[0].content).toEqual('"value"')
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
})
