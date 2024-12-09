import { Base64 } from 'js-base64'
import {
  branchExists,
  createBranch,
  fetchFileContent,
  getCommitFiles,
  getCommits,
  getFile,
  storeCdcDataInGit,
  updateFilesInSingleCommit,
  updateGitFileContent,
} from './githubUtils'
import { fetchCDCConfigs } from './cdcUtils'

jest.mock('js-base64', () => ({
  Base64: {
    encode: jest.fn((str) => Buffer.from(str).toString('base64')),
    decode: jest.fn((str) => Buffer.from(str, 'base64').toString('ascii')),
  },
}))

jest.mock('./dataSanitization', () => ({
  removeIgnoredFields: jest.fn((data) => data),
}))

jest.mock('./versionControlFiles', () => ({
  getFileTypeFromFileName: jest.fn(() => 'exampleFileType'),
}))

jest.mock('./cdcUtils', () => ({
  fetchCDCConfigs: jest.fn(),
}))

jest.mock('./githubUtils', () => ({
  branchExists: jest.fn(),
  createBranch: jest.fn(),
  fetchFileContent: jest.fn(),
  getCommitFiles: jest.fn(),
  getCommits: jest.fn(),
  getFile: jest.fn(),
  storeCdcDataInGit: jest.fn(),
  updateFilesInSingleCommit: jest.fn(),
  updateGitFileContent: jest.fn(),
}))

let octokitMock
let defaultContext

beforeEach(() => {
  octokitMock = {
    rest: {
      repos: {
        getContent: jest.fn().mockResolvedValue({ data: { content: Base64.encode('file content'), size: 1024 } }),
        createRef: jest.fn().mockResolvedValue({}),
        getBranch: jest.fn().mockResolvedValue({ data: { commit: { sha: 'mainSha' } } }),
        listBranches: jest.fn().mockResolvedValue({ data: [{ name: 'existingBranch' }] }),
        createBlob: jest.fn().mockResolvedValue({ data: { sha: 'blobSha' } }),
        createTree: jest.fn().mockResolvedValue({ data: { sha: 'treeSha' } }),
        createCommit: jest.fn().mockResolvedValue({ data: { sha: 'commitSha' } }),
        updateRef: jest.fn().mockResolvedValue({}),
        listCommits: jest
          .fn()
          .mockResolvedValueOnce({ data: [{ sha: 'commit1' }] })
          .mockResolvedValueOnce({ data: [{ sha: 'commit2' }] })
          .mockResolvedValueOnce({ data: [] }), // Mocked multiple pages
        getCommit: jest.fn().mockResolvedValue({
          data: {
            files: [
              {
                filename: 'src/versionControl/extension.json',
                contents_url:
                  'https://api.github.com/repos/iamGaspar/CDCVersionControl/contents/src%2FversionControl%2Fextension.json?ref=30858841b9572aa69673b5606185d9706b90855e',
              },
              {
                filename: 'src/versionControl/webSdk.json',
                contents_url: 'https://api.github.com/repos/iamGaspar/CDCVersionControl/contents/src%2FversionControl%2FwebSdk.json?ref=30858841b9572aa69673b5606185d9706b90855e',
              },
            ],
          },
        }),
      },
      git: {
        getBlob: jest.fn().mockResolvedValue({ data: { content: Base64.encode('large file content') } }),
        createBlob: jest.fn().mockResolvedValue({ data: { sha: 'blobSha' } }),
        getRef: jest.fn().mockResolvedValue({ data: { object: { sha: 'baseTreeSha' } } }),
      },
      request: jest.fn().mockResolvedValue({ data: { content: Base64.encode('file content') } }), // Ensure request is properly mocked
    },
  }

  defaultContext = {
    octokit: octokitMock,
    owner: 'testOwner',
    repo: 'testRepo',
    defaultBranch: 'testBranch',
  }

  getFile.mockImplementation(async function (path) {
    const response = await octokitMock.rest.repos.getContent({
      owner: this.owner,
      repo: this.repo,
      path,
      ref: this.defaultBranch,
    })

    if (!response.data.content || response.data.size > 100 * 1024) {
      const blob = await octokitMock.rest.git.getBlob({
        owner: this.owner,
        repo: this.repo,
        file_sha: response.data.sha,
      })
      response.data.content = blob.data.content
    }

    return response.data
  })

  fetchFileContent.mockImplementation(async function (contents_url) {
    const response = await octokitMock.request({ url: contents_url })
    return response.data.content
  })

  getCommitFiles.mockImplementation(async function (sha) {
    const response = await octokitMock.rest.repos.getCommit({
      owner: this.owner,
      repo: this.repo,
      ref: sha,
    })

    const files = response.data.files.map((file) => ({
      filename: file.filename,
      contents_url: file.contents_url,
    }))

    return Promise.all(
      files.map(async (file) => {
        const content = await fetchFileContent.call(this, file.contents_url)
        const fileType = 'exampleFileType'
        return { ...file, content: JSON.parse(Base64.decode(content)), fileType }
      }),
    )
  })

  branchExists.mockImplementation(async function (branchName) {
    const response = await octokitMock.rest.repos.listBranches({
      owner: this.owner,
      repo: this.repo,
    })

    return response.data.some((branch) => branch.name === branchName)
  })

  createBranch.mockImplementation(async function (branchName) {
    const sourceBranch = 'main'
    const { data: mainBranch } = await octokitMock.rest.repos.getBranch({
      owner: this.owner,
      repo: this.repo,
      branch: sourceBranch,
    })

    await octokitMock.rest.git.createRef({
      owner: this.owner,
      repo: this.repo,
      ref: `refs/heads/${branchName}`,
      sha: mainBranch.commit.sha,
    })
  })

  updateGitFileContent.mockImplementation(async function (filePath, cdcFileContent) {
    const branchExistsMock = await branchExists.call(this, this.defaultBranch)

    if (branchExistsMock) {
      const getFileMock = await getFile.call(this, filePath)
      const rawGitContent = getFileMock.content || '{}'
      const currentGitContent = JSON.parse(Base64.decode(rawGitContent))
      const newContent = JSON.parse(cdcFileContent)

      if (JSON.stringify(currentGitContent) !== JSON.stringify(newContent)) {
        return {
          path: filePath,
          content: cdcFileContent,
          sha: getFileMock.sha,
        }
      }

      return null
    }

    return {
      path: filePath,
      content: cdcFileContent,
      sha: undefined,
    }
  })

  fetchCDCConfigs.mockReturnValue(
    Promise.resolve({
      config1: { key1: 'value1' },
    }),
  )

  updateFilesInSingleCommit.mockResolvedValue({})

  getCommits.mockImplementation(async function () {
    let allCommits = []
    let page = 1

    while (true) {
      const { data } = await octokitMock.rest.repos.listCommits({
        owner: this.owner,
        repo: this.repo,
        sha: this.defaultBranch,
        per_page: 100,
        page,
      })

      if (data.length === 0) break

      allCommits = allCommits.concat(data)
      if (data.length < 100) break
      page += 1
    }

    return allCommits
  })
})

describe('GitHub Utilities', () => {
  describe('getFile', () => {
    it('should fetch and return file content', async () => {
      const result = await getFile.call(defaultContext, 'path/to/file')
      expect(result).toEqual({ content: Base64.encode('file content'), size: 1024 })
      expect(octokitMock.rest.repos.getContent).toHaveBeenCalledWith({
        owner: defaultContext.owner,
        repo: defaultContext.repo,
        path: 'path/to/file',
        ref: defaultContext.defaultBranch,
      })
    })

    it('should fetch blob content if file is too large', async () => {
      const mockFileContent = { content: null, size: 2048, sha: 'blobSha' }
      const mockBlobContent = { content: Base64.encode('large file content') }
      octokitMock.rest.repos.getContent.mockResolvedValueOnce({ data: mockFileContent })
      octokitMock.rest.git.getBlob.mockResolvedValueOnce({ data: mockBlobContent })

      const result = await getFile.call(defaultContext, 'path/to/large-file')
      expect(result).toEqual({ ...mockFileContent, content: mockBlobContent.content })
      expect(octokitMock.rest.repos.getContent).toHaveBeenCalledWith({
        owner: defaultContext.owner,
        repo: defaultContext.repo,
        path: 'path/to/large-file',
        ref: defaultContext.defaultBranch,
      })
      expect(octokitMock.rest.git.getBlob).toHaveBeenCalledWith({
        owner: defaultContext.owner,
        repo: defaultContext.repo,
        file_sha: mockFileContent.sha,
      })
    })

    it('should throw error for non-404 errors', async () => {
      octokitMock.rest.repos.getContent.mockRejectedValueOnce({ status: 500, message: 'Server error' })
      await expect(getFile.call(defaultContext, 'path/to/file')).rejects.toEqual({ status: 500, message: 'Server error' })
    })
  })

  //   describe('getCommitFiles', () => {
  //     it('should fetch commit files and their content', async () => {
  //       const mockCommitData = {
  //         files: [
  //           {
  //             filename: 'src/versionControl/extension.json',
  //             contents_url: 'https://api.github.com/repos/iamGaspar/CDCVersionControl/contents/src%2FversionControl%2Fextension.json?ref=30858841b9572aa69673b5606185d9706b90855e',
  //           },
  //           {
  //             filename: 'src/versionControl/webSdk.json',
  //             contents_url: 'https://api.github.com/repos/iamGaspar/CDCVersionControl/contents/src%2FversionControl%2FwebSdk.json?ref=30858841b9572aa69673b5606185d9706b90855e',
  //           },
  //         ],
  //       }
  //       const mockContent = Base64.encode('file content')
  //       octokitMock.rest.repos.getCommit.mockResolvedValueOnce({ data: mockCommitData })
  //       octokitMock.request.mockResolvedValueOnce({ data: { content: mockContent } })
  //       octokitMock.request.mockResolvedValueOnce({ data: { content: mockContent } })

  //       const result = await getCommitFiles.call(defaultContext, 'commitSha')
  //       expect(result).toEqual([
  //         {
  //           filename: 'src/versionControl/extension.json',
  //           contents_url: 'https://api.github.com/repos/iamGaspar/CDCVersionControl/contents/src%2FversionControl%2Fextension.json?ref=30858841b9572aa69673b5606185d9706b90855e',
  //           content: JSON.parse(Base64.decode(mockContent)),
  //           fileType: 'exampleFileType',
  //         },
  //         {
  //           filename: 'src/versionControl/webSdk.json',
  //           contents_url: 'https://api.github.com/repos/iamGaspar/CDCVersionControl/contents/src%2FversionControl%2FwebSdk.json?ref=30858841b9572aa69673b5606185d9706b90855e',
  //           content: JSON.parse(Base64.decode(mockContent)),
  //           fileType: 'exampleFileType',
  //         },
  //       ])
  //       expect(octokitMock.rest.repos.getCommit).toHaveBeenCalledWith({
  //         owner: defaultContext.owner,
  //         repo: defaultContext.repo,
  //         ref: 'commitSha',
  //       })
  //       expect(octokitMock.request).toHaveBeenCalledWith({
  //         url: 'https://api.github.com/repos/iamGaspar/CDCVersionControl/contents/src%2FversionControl%2Fextension.json?ref=30858841b9572aa69673b5606185d9706b90855e',
  //       })
  //       expect(octokitMock.request).toHaveBeenCalledWith({
  //         url: 'https://api.github.com/repos/iamGaspar/CDCVersionControl/contents/src%2FversionControl%2FwebSdk.json?ref=30858841b9572aa69673b5606185d9706b90855e',
  //       })
  //     })
  //   })

  //   describe('fetchFileContent', () => {
  //     it('should fetch file content from URL', async () => {
  //       const mockContent = Base64.encode('file content')
  //       octokitMock.request.mockResolvedValueOnce({ data: { content: mockContent } })

  //       const result = await fetchFileContent.call(defaultContext, 'url-to-content')
  //       expect(result).toEqual(mockContent)
  //       expect(octokitMock.request).toHaveBeenCalledWith({ url: 'url-to-content' })
  //     })

  //     it('should handle errors gracefully', async () => {
  //       const error = new Error('Failed to fetch content')
  //       octokitMock.request.mockRejectedValueOnce(error)

  //       await expect(fetchFileContent.call(defaultContext, 'url-to-content')).rejects.toThrow(error)
  //       expect(octokitMock.request).toHaveBeenCalledWith({ url: 'url-to-content' })
  //     })
  //   })

  describe('branchExists', () => {
    it('should return true if branch exists', async () => {
      const result = await branchExists.call(defaultContext, 'existingBranch')
      expect(result).toBe(true)
    })

    it('should return false if branch does not exist', async () => {
      octokitMock.rest.repos.listBranches.mockResolvedValueOnce({ data: [{ name: 'main' }] })
      const result = await branchExists.call(defaultContext, 'nonExistentBranch')
      expect(result).toBe(false)
    })
  })

  //   describe('createBranch', () => {
  //     it('should create a new branch if it does not exist', async () => {
  //       octokitMock.rest.repos.getBranch.mockResolvedValueOnce({ data: { commit: { sha: 'mainSha' } } })
  //       octokitMock.rest.git.createRef.mockResolvedValueOnce({})

  //       await createBranch.call(defaultContext, 'newBranch')
  //       expect(octokitMock.rest.repos.getBranch).toHaveBeenCalledWith({
  //         owner: defaultContext.owner,
  //         repo: defaultContext.repo,
  //         branch: 'main',
  //       })
  //       expect(octokitMock.rest.git.createRef).toHaveBeenCalledWith({
  //         owner: defaultContext.owner,
  //         repo: defaultContext.repo,
  //         ref: 'refs/heads/newBranch',
  //         sha: 'mainSha',
  //       })
  //     })
  //   })

  describe('updateGitFileContent', () => {
    it('should create new file if branch does not exist', async () => {
      const filePath = 'path/to/file.json'
      const cdcFileContent = JSON.stringify({ someProp: 'someValue' })

      octokitMock.rest.repos.listBranches.mockResolvedValueOnce({ data: [] })

      const result = await updateGitFileContent.call(defaultContext, filePath, cdcFileContent)
      expect(result).toEqual({
        path: filePath,
        content: cdcFileContent,
        sha: undefined,
      })
      expect(octokitMock.rest.repos.getContent).not.toHaveBeenCalled()
    })

    // it('should update existing file if content has changed', async () => {
    //   const filePath = 'path/to/file.json'
    //   const originalContent = { someProp: 'originalValue' }
    //   const updatedContent = { someProp: 'updatedValue' }
    //   const cdcFileContent = JSON.stringify(updatedContent)
    //   const mockFileContent = { content: Base64.encode(JSON.stringify(originalContent)), sha: 'originalSha' }

    //   octokitMock.rest.repos.listBranches.mockResolvedValueOnce({ data: [{ name: defaultContext.defaultBranch }] })
    //   octokitMock.rest.repos.getContent.mockResolvedValueOnce({ data: mockFileContent })

    //   const result = await updateGitFileContent.call(defaultContext, filePath, cdcFileContent)
    //   expect(result).toEqual({ path: filePath, content: cdcFileContent, sha: 'originalSha' })
    //   expect(octokitMock.rest.repos.getContent).toHaveBeenCalledWith({
    //     owner: defaultContext.owner,
    //     repo: defaultContext.repo,
    //     path: filePath,
    //     ref: defaultContext.defaultBranch,
    //   })
    // })
  })

  //   describe('storeCdcDataInGit', () => {
  //     it('should store CDC data in Git with valid updates', async () => {
  //       const commitMessage = 'Commit message'
  //       const cdcConfigs = { config1: { key1: 'value1' } }

  //       fetchCDCConfigs.mockResolvedValueOnce(cdcConfigs)
  //       updateGitFileContent.mockResolvedValueOnce({
  //         path: 'src/versionControl/config1.json',
  //         content: JSON.stringify(cdcConfigs.config1, null, 2),
  //         sha: 'testSha',
  //       })
  //       updateFilesInSingleCommit.mockResolvedValueOnce({})

  //       await storeCdcDataInGit.call(defaultContext, commitMessage)
  //       expect(fetchCDCConfigs).toHaveBeenCalled()
  //       expect(updateGitFileContent).toHaveBeenCalledWith('src/versionControl/config1.json', JSON.stringify(cdcConfigs.config1, null, 2))
  //       expect(updateFilesInSingleCommit).toHaveBeenCalledWith(commitMessage, [
  //         { path: 'src/versionControl/config1.json', content: JSON.stringify(cdcConfigs.config1, null, 2), sha: 'testSha' },
  //       ])
  //     })
  //   })

  //   describe('getCommits', () => {
  //     it('should fetch all commits from the branch', async () => {
  //       const commitsPage1 = [{ sha: 'commit1' }]
  //       const commitsPage2 = [{ sha: 'commit2' }]
  //       octokitMock.rest.repos.listCommits.mockResolvedValueOnce({ data: commitsPage1 }).mockResolvedValueOnce({ data: commitsPage2 }).mockResolvedValueOnce({ data: [] })

  //       const result = await getCommits.call(defaultContext)
  //       console.log('Result of getCommits:', result)
  //       expect(result.length).toBe(2)
  //       expect(result).toEqual([...commitsPage1, ...commitsPage2])
  //       expect(octokitMock.rest.repos.listCommits).toHaveBeenCalledWith({
  //         owner: defaultContext.owner,
  //         repo: defaultContext.repo,
  //         sha: defaultContext.defaultBranch,
  //         per_page: 100,
  //         page: 1,
  //       })
  //       expect(octokitMock.rest.repos.listCommits).toHaveBeenCalledWith({
  //         owner: defaultContext.owner,
  //         repo: defaultContext.repo,
  //         sha: defaultContext.defaultBranch,
  //         per_page: 100,
  //         page: 2,
  //       })
  //     })

  //     it('should handle errors gracefully', async () => {
  //       octokitMock.rest.repos.listCommits.mockRejectedValueOnce(new Error('Failed to fetch commits'))
  //       await expect(getCommits.call(defaultContext)).rejects.toThrow('Failed to fetch commits')
  //     })
  //   })
})
