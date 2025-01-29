/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { Base64 } from 'js-base64'
import * as githubUtils from './githubUtils'
import { removeIgnoredFields } from './dataSanitization'
import CdcService from './cdcService'

jest.mock('./dataSanitization', () => ({
  removeIgnoredFields: jest.fn(),
}))

jest.mock('./cdcService', () =>
  jest.fn().mockImplementation(() => ({
    fetchCDCConfigs: jest.fn().mockResolvedValue({
      webSdk: { key: 'value' },
      dataflow: { key: 'value' },
    }),
  })),
)

describe('githubUtils', () => {
  const octokitMock = {
    rest: {
      repos: {
        getContent: jest.fn(),
        getCommit: jest.fn(),
        listBranches: jest.fn(),
        getBranch: jest.fn(),
        listCommits: jest.fn(),
      },
      git: {
        getBlob: jest.fn(),
        createBlob: jest.fn(),
        createTree: jest.fn(),
        createCommit: jest.fn(),
        updateRef: jest.fn(),
        createRef: jest.fn(),
        getRef: jest.fn(),
      },
    },
    request: jest.fn(),
  }

  const context = {
    octokit: octokitMock,
    owner: 'testOwner',
    repo: 'testRepo',
    defaultBranch: 'main',
  }

  beforeEach(() => {
    jest.clearAllMocks()

    CdcService.mockImplementation(() => {
      return {
        fetchCDCConfigs: jest.fn().mockResolvedValue({
          webSdk: { key: 'value' },
          dataflow: { key: 'value' },
        }),
      }
    })

    octokitMock.rest.git.getRef.mockResolvedValue({
      data: { object: { sha: 'mockSha' } },
    })

    octokitMock.rest.git.createBlob.mockResolvedValue({
      data: { sha: 'mockBlobSha' },
    })

    octokitMock.rest.git.createTree.mockResolvedValue({
      data: { sha: 'mockTreeSha' },
    })

    octokitMock.rest.git.createCommit.mockResolvedValue({
      data: { sha: 'mockCommitSha' },
    })

    octokitMock.rest.git.updateRef.mockResolvedValue({})
  })

  describe('getFile', () => {
    it('should fetch file content', async () => {
      const mockFile = { content: 'mockContent', size: 1024 }
      octokitMock.rest.repos.getContent.mockResolvedValue({ data: mockFile })

      const result = await githubUtils.getFile(context, 'path/to/file')
      expect(result).toEqual(mockFile)
    })

    it('should fetch large file content', async () => {
      const mockFile = { content: null, size: 200 * 1024, sha: 'mockSha' }
      const mockBlobData = { content: 'mockBlobContent' }
      octokitMock.rest.repos.getContent.mockResolvedValue({ data: mockFile })
      octokitMock.rest.git.getBlob.mockResolvedValue({ data: mockBlobData })

      const result = await githubUtils.getFile(context, 'path/to/file')
      expect(result.content).toEqual('mockBlobContent')
    })
  })

  describe('getCommitFiles', () => {
    it('should fetch commit files', async () => {
      const mockCommitData = {
        files: [
          { filename: 'file1.json', contents_url: 'url1' },
          { filename: 'file2.json', contents_url: 'url2' },
        ],
      }
      const mockFileContent = Base64.encode(JSON.stringify({ key: 'value' }))
      octokitMock.rest.repos.getCommit.mockResolvedValue({
        data: mockCommitData,
      })
      octokitMock.request.mockResolvedValue({
        data: { content: mockFileContent },
      })

      const result = await githubUtils.getCommitFiles(context, 'mockSha')
      expect(result).toEqual([
        {
          filename: 'file1.json',
          contents_url: 'url1',
          content: { key: 'value' },
        },
        {
          filename: 'file2.json',
          contents_url: 'url2',
          content: { key: 'value' },
        },
      ])
    })

    it('should throw an error if no files found in commit', async () => {
      octokitMock.rest.repos.getCommit.mockResolvedValue({
        data: { files: null },
      })

      await expect(githubUtils.getCommitFiles(context, 'mockSha')).rejects.toThrow('No files found in commit: mockSha')
    })
  })

  describe('fetchFileContent', () => {
    it('should fetch file content from contents_url', async () => {
      const mockResponse = { content: 'mockContent' }
      octokitMock.request.mockResolvedValue({ data: mockResponse })

      const result = await githubUtils.fetchFileContent(context, 'mockUrl')
      expect(result).toEqual('mockContent')
    })

    it('should fetch blob content if response content is missing', async () => {
      const mockResponse = { sha: 'mockSha' }
      const mockBlobData = { content: 'mockBlobContent' }
      octokitMock.request.mockResolvedValue({ data: mockResponse })
      octokitMock.rest.git.getBlob.mockResolvedValue({ data: mockBlobData })

      const result = await githubUtils.fetchFileContent(context, 'mockUrl')
      expect(result).toEqual('mockBlobContent')
    })

    it('should throw an error if blob content fetch fails', async () => {
      const mockResponse = { sha: 'mockSha' }
      octokitMock.request.mockResolvedValue({ data: mockResponse })
      octokitMock.rest.git.getBlob.mockResolvedValue({ data: {} })

      await expect(githubUtils.fetchFileContent(context, 'mockUrl')).rejects.toThrow('Failed to fetch blob content for URL: mockUrl')
    })
  })

  describe('branchExists', () => {
    it('should return true if branch exists', async () => {
      const mockBranches = [{ name: 'main' }, { name: 'dev' }]
      octokitMock.rest.repos.listBranches.mockResolvedValue({
        data: mockBranches,
      })

      const result = await githubUtils.branchExists(context, 'main')
      expect(result).toBe(true)
    })

    it('should return false if branch does not exist', async () => {
      const mockBranches = [{ name: 'dev' }]
      octokitMock.rest.repos.listBranches.mockResolvedValue({
        data: mockBranches,
      })

      const result = await githubUtils.branchExists(context, 'main')
      expect(result).toBe(false)
    })

    it('should throw error if branches cannot be fetched', async () => {
      octokitMock.rest.repos.listBranches.mockRejectedValue(new Error('Network Error'))

      await expect(githubUtils.branchExists(context, 'main')).rejects.toThrow('Network Error')
    })
  })

  describe('createBranch', () => {
    it('should create a new branch if it does not exist', async () => {
      octokitMock.rest.repos.listBranches.mockResolvedValue({
        data: [{ name: 'main' }],
      })
      octokitMock.rest.repos.getBranch.mockResolvedValue({
        data: { commit: { sha: 'mockSha' } },
      })

      await githubUtils.createBranch(context, 'newBranch')
      expect(octokitMock.rest.git.createRef).toHaveBeenCalledWith({
        owner: 'testOwner',
        repo: 'testRepo',
        ref: 'refs/heads/newBranch',
        sha: 'mockSha',
      })
    })

    it('should throw an error if branch name is not provided', async () => {
      await expect(githubUtils.createBranch(context)).rejects.toThrow('Branch name is required')
    })

    it('should not create a branch if it already exists', async () => {
      octokitMock.rest.repos.listBranches.mockResolvedValue({
        data: [{ name: 'newBranch' }],
      })

      await githubUtils.createBranch(context, 'newBranch')
      expect(octokitMock.rest.git.createRef).not.toHaveBeenCalled()
    })
  })

  describe('updateFilesInSingleCommit', () => {
    it('should update files in a single commit', async () => {
      const mockRefData = { object: { sha: 'baseTreeSha' } }
      const mockBlobData = { sha: 'blobSha' }
      const mockTreeData = { sha: 'treeSha' }
      const mockCommitData = { sha: 'commitSha' }

      octokitMock.rest.git.getRef.mockResolvedValue({ data: mockRefData })
      octokitMock.rest.git.createBlob.mockResolvedValue({ data: mockBlobData })
      octokitMock.rest.git.createTree.mockResolvedValue({ data: mockTreeData })
      octokitMock.rest.git.createCommit.mockResolvedValue({
        data: mockCommitData,
      })

      const files = [{ path: 'file1.json', content: 'content1' }]
      await githubUtils.updateFilesInSingleCommit(context, 'commitMessage', files)

      expect(octokitMock.rest.git.updateRef).toHaveBeenCalledWith({
        owner: 'testOwner',
        repo: 'testRepo',
        ref: 'heads/main',
        sha: 'commitSha',
        force: true,
      })
    })
  })

  describe('updateGitFileContent', () => {
    it('should update git file content if there are differences', async () => {
      const mockFile = {
        content: Base64.encode(JSON.stringify({ key: 'value' })),
        sha: 'mockSha',
      }
      octokitMock.rest.repos.getContent.mockResolvedValue({ data: mockFile })
      octokitMock.rest.repos.listBranches.mockResolvedValue({
        data: [{ name: 'main' }],
      })
      removeIgnoredFields.mockImplementation((obj) => obj)

      const result = await githubUtils.updateGitFileContent(context, 'path/to/file', JSON.stringify({ key: 'newValue' }, null, 2))
      expect(result).toEqual({
        path: 'path/to/file',
        content: JSON.stringify({ key: 'newValue' }, null, 2),
        sha: 'mockSha',
      })
    })

    it('should return null if files are identical', async () => {
      const mockFile = {
        content: Base64.encode(JSON.stringify({ key: 'value' })),
        sha: 'mockSha',
      }
      octokitMock.rest.repos.getContent.mockResolvedValue({ data: mockFile })
      octokitMock.rest.repos.listBranches.mockResolvedValue({
        data: [{ name: 'main' }],
      })
      removeIgnoredFields.mockImplementation((obj) => obj)

      const result = await githubUtils.updateGitFileContent(context, 'path/to/file', JSON.stringify({ key: 'value' }, null, 2))
      expect(result).toBeNull()
    })

    it('should handle 404 error when fetching file content', async () => {
      octokitMock.rest.repos.listBranches.mockResolvedValue({
        data: [{ name: 'main' }],
      })
      octokitMock.rest.repos.getContent.mockRejectedValue({ status: 404 })

      const result = await githubUtils.updateGitFileContent(context, 'path/to/file', JSON.stringify({ key: 'newValue' }, null, 2))
      expect(result).toEqual({
        path: 'path/to/file',
        content: JSON.stringify({ key: 'newValue' }, null, 2),
        sha: undefined,
      })
    })

    it('should handle branch does not exist error when fetching file content', async () => {
      octokitMock.rest.repos.listBranches.mockResolvedValue({ data: [] })
      octokitMock.rest.repos.getContent.mockRejectedValue(new Error('Branch does not exist'))

      const result = await githubUtils.updateGitFileContent(context, 'path/to/file', JSON.stringify({ key: 'newValue' }, null, 2))
      expect(result).toEqual({
        path: 'path/to/file',
        content: JSON.stringify({ key: 'newValue' }, null, 2),
        sha: undefined,
      })
    })

    it('should throw an error if fetching file content fails', async () => {
      octokitMock.rest.repos.listBranches.mockResolvedValue({
        data: [{ name: 'main' }],
      })
      octokitMock.rest.repos.getContent.mockRejectedValue(new Error('Some error'))

      await expect(githubUtils.updateGitFileContent(context, 'path/to/file', JSON.stringify({ key: 'newValue' }, null, 2))).rejects.toThrow('Some error')
    })

    it('should handle empty git content', async () => {
      const mockFile = { content: Base64.encode(''), sha: 'mockSha' }
      octokitMock.rest.repos.getContent.mockResolvedValue({ data: mockFile })
      octokitMock.rest.repos.listBranches.mockResolvedValue({
        data: [{ name: 'main' }],
      })
      removeIgnoredFields.mockImplementation((obj) => obj)
      octokitMock.rest.git.getBlob.mockResolvedValue({ data: { content: '' } }) // Simulate scenario where blob content is empty

      const result = await githubUtils.updateGitFileContent(context, 'path/to/file', JSON.stringify({ key: 'newValue' }, null, 2))
      expect(result).toEqual({
        path: 'path/to/file',
        content: JSON.stringify({ key: 'newValue' }, null, 2),
        sha: 'mockSha',
      })
    })

    it('should handle undefined git file info', async () => {
      octokitMock.rest.repos.listBranches.mockResolvedValue({
        data: [{ name: 'main' }],
      })
      octokitMock.rest.repos.getContent.mockRejectedValue({ status: 404 })

      const result = await githubUtils.updateGitFileContent(context, 'path/to/file', JSON.stringify({ key: 'newValue' }, null, 2))
      expect(result).toEqual({
        path: 'path/to/file',
        content: JSON.stringify({ key: 'newValue' }, null, 2),
        sha: undefined,
      })
    })

    it('should handle defined currentGitContentDecoded', async () => {
      const mockFile = { content: Base64.encode('{}'), sha: 'mockSha' }
      octokitMock.rest.repos.getContent.mockResolvedValue({ data: mockFile })
      octokitMock.rest.repos.listBranches.mockResolvedValue({
        data: [{ name: 'main' }],
      })
      removeIgnoredFields.mockImplementation((obj) => obj)

      const result = await githubUtils.updateGitFileContent(context, 'path/to/file', JSON.stringify({ key: 'newValue' }, null, 2))
      expect(result).toEqual({
        path: 'path/to/file',
        content: JSON.stringify({ key: 'newValue' }, null, 2),
        sha: 'mockSha',
      })
    })

    it('should catch errors in JSON.parse for currentGitContentDecoded', async () => {
      const mockFile = {
        content: Base64.encode('invalidJson'),
        sha: 'mockSha',
      }
      octokitMock.rest.repos.getContent.mockResolvedValue({ data: mockFile })
      octokitMock.rest.repos.listBranches.mockResolvedValue({
        data: [{ name: 'main' }],
      })
      removeIgnoredFields.mockImplementation((obj) => obj)

      const result = await githubUtils.updateGitFileContent(context, 'path/to/file', JSON.stringify({ key: 'newValue' }, null, 2))
      expect(result).toEqual({
        path: 'path/to/file',
        content: JSON.stringify({ key: 'newValue' }, null, 2),
        sha: 'mockSha',
      })
    })

    it('should handle undefined sha if getGitFileInfo is undefined or 404', async () => {
      octokitMock.rest.repos.listBranches.mockResolvedValue({
        data: [{ name: 'main' }],
      })
      octokitMock.rest.repos.getContent.mockRejectedValue({ status: 404 })

      const result = await githubUtils.updateGitFileContent(context, 'path/to/file', JSON.stringify({ key: 'newValue' }, null, 2))
      expect(result).toEqual({
        path: 'path/to/file',
        content: JSON.stringify({ key: 'newValue' }, null, 2),
        sha: undefined,
      })
    })
  })
  describe('listAllCommits', () => {
    it('should list all commits', async () => {
      const commits = [{ sha: 'commit1' }, { sha: 'commit2' }]
      octokitMock.rest.repos.listCommits.mockResolvedValue({ data: commits })

      const result = await githubUtils.getCommits(context)
      expect(result).toEqual({ data: commits })
    })

    it('should handle pagination correctly', async () => {
      const commitsPage1 = Array(100)
        .fill()
        .map((_, i) => ({ sha: `commit${i + 1}` }))
      const commitsPage2 = [{ sha: 'commit101' }]
      octokitMock.rest.repos.listCommits.mockResolvedValueOnce({ data: commitsPage1 }).mockResolvedValueOnce({ data: commitsPage2 })

      const result = await githubUtils.getCommits(context)
      expect(result).toEqual({ data: [...commitsPage1, ...commitsPage2] })
    })

    it('should throw an error if fetching commits fails', async () => {
      octokitMock.rest.repos.listCommits.mockRejectedValue(new Error('Some error'))

      await expect(githubUtils.getCommits(context)).rejects.toThrow('Some error')
    })
  })

  describe('prepareFilesForUpdate', () => {
    it('should prepare files for update', async () => {
      const mockFileContent = JSON.stringify({ key: 'value' })
      const mockFile = {
        content: Base64.encode(mockFileContent),
        sha: 'mockSha',
      }
      octokitMock.rest.repos.getContent.mockResolvedValue({ data: mockFile })
      octokitMock.rest.repos.listBranches.mockResolvedValue({
        data: [{ name: 'main' }],
      })
      removeIgnoredFields.mockImplementation((obj) => obj)

      const mockFetchCDCConfigs = jest.fn().mockResolvedValue({
        webSdk: { key: 'newValue' },
        dataflow: { key: 'newValue' },
      })
      CdcService.mockImplementation(() => ({
        fetchCDCConfigs: mockFetchCDCConfigs,
      }))

      const mockUpdateGitFileContent = jest
        .spyOn(githubUtils, 'updateGitFileContent')
        .mockResolvedValueOnce({
          path: 'src/versionControl/webSdk.json',
          content: JSON.stringify({ key: 'newValue' }, null, 2),
          sha: 'mockSha',
        })
        .mockResolvedValueOnce({
          path: 'src/versionControl/dataflow.json',
          content: JSON.stringify({ key: 'newValue' }, null, 2),
          sha: 'mockSha',
        })

      const result = await githubUtils.prepareFilesForUpdate(context)
      expect(result).toEqual(['webSdk', 'dataflow'])
      mockUpdateGitFileContent.mockRestore()
    })

    it('should return N/A if no files to update', async () => {
      const mockFileContent = JSON.stringify({ key: 'value' })
      const mockFile = {
        content: Base64.encode(mockFileContent),
        sha: 'mockSha',
      }
      octokitMock.rest.repos.getContent.mockResolvedValue({ data: mockFile })
      octokitMock.rest.repos.listBranches.mockResolvedValue({
        data: [{ name: 'main' }],
      })
      removeIgnoredFields.mockImplementation((obj) => obj)

      const mockFetchCDCConfigs = jest.fn().mockResolvedValue({
        webSdk: { key: 'value' },
        dataflow: { key: 'value' },
      })
      CdcService.mockImplementation(() => ({
        fetchCDCConfigs: mockFetchCDCConfigs,
      }))

      const mockUpdateGitFileContent = jest.spyOn(githubUtils, 'updateGitFileContent').mockResolvedValue(null)

      const result = await githubUtils.prepareFilesForUpdate(context)
      expect(result).toEqual(['N/A'])
      mockUpdateGitFileContent.mockRestore()
    })

    it('should handle errors during file preparation', async () => {
      octokitMock.rest.repos.listBranches.mockRejectedValue(new Error('Network Error'))

      await expect(githubUtils.prepareFilesForUpdate(context)).rejects.toThrow('Network Error')
    })
  })

  describe('storeCdcDataInGit', () => {
    it('should store CDC data in Git', async () => {
      const mockFileContent = JSON.stringify({ key: 'value' })
      const mockFile = {
        content: Base64.encode(mockFileContent),
        sha: 'mockSha',
      }
      octokitMock.rest.repos.getContent.mockResolvedValue({ data: mockFile })
      octokitMock.rest.repos.listBranches.mockResolvedValue({
        data: [{ name: 'main' }],
      })
      removeIgnoredFields.mockImplementation((obj) => obj)

      const mockFetchCDCConfigs = jest.fn().mockResolvedValue({
        webSdk: { key: 'newValue' },
        dataflow: { key: 'newValue' },
      })
      CdcService.mockImplementation(() => ({
        fetchCDCConfigs: mockFetchCDCConfigs,
      }))

      const mockUpdateGitFileContent = jest.spyOn(githubUtils, 'updateGitFileContent').mockResolvedValue({
        path: 'src/versionControl/webSdk.json',
        content: JSON.stringify({ key: 'newValue' }, null, 2),
        sha: 'mockSha',
      })

      await githubUtils.storeCdcDataInGit(context, 'commitMessage')
      expect(octokitMock.rest.git.updateRef).toHaveBeenCalled()
      mockUpdateGitFileContent.mockRestore()
    })

    it('should skip commit if no files to update', async () => {
      const mockFileContent = JSON.stringify({ key: 'value' })
      const mockFile = {
        content: Base64.encode(mockFileContent),
        sha: 'mockSha',
      }
      octokitMock.rest.repos.getContent.mockResolvedValue({ data: mockFile })
      octokitMock.rest.repos.listBranches.mockResolvedValue({
        data: [{ name: 'main' }],
      })
      removeIgnoredFields.mockImplementation((obj) => obj)

      const mockFetchCDCConfigs = jest.fn().mockResolvedValue({
        webSdk: { key: 'value' },
        dataflow: { key: 'value' },
      })
      CdcService.mockImplementation(() => ({
        fetchCDCConfigs: mockFetchCDCConfigs,
      }))

      const mockUpdateGitFileContent = jest.spyOn(githubUtils, 'updateGitFileContent').mockResolvedValue(null)

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
      await githubUtils.storeCdcDataInGit(context, 'commitMessage')
      expect(consoleSpy).toHaveBeenCalledWith('No files to update. Skipping commit.')
      consoleSpy.mockRestore()
      mockUpdateGitFileContent.mockRestore()
    })

    it('should handle errors during storing CDC data', async () => {
      octokitMock.rest.repos.listBranches.mockRejectedValue(new Error('Network Error'))

      await expect(githubUtils.storeCdcDataInGit(context, 'commitMessage')).rejects.toThrow('Network Error')
    })
  })
})
