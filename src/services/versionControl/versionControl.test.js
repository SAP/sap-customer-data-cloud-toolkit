import VersionControl from './versionControl'
import { Octokit } from '@octokit/rest'
import { Base64 } from 'js-base64'

import { createBranch, updateFilesInSingleCommit, getFile, getCommitFiles, fetchFileContent, getCommits, updateGitFileContent, storeCdcDataInGit } from './githubUtils'
import { getCdcData, fetchCDCConfigs } from './cdcUtils'
import { getFileTypeFromFileName } from './versionControlFiles'

jest.mock('@octokit/rest', () => {
  return {
    Octokit: jest.fn().mockImplementation(() => ({
      repos: { createRelease: jest.fn() },
    })),
  }
})
jest.mock('./githubUtils')
jest.mock('./cdcUtils')
jest.mock('./setters')
jest.mock('./versionControlFiles', () => ({
  getFileTypeFromFileName: jest.fn().mockReturnValue('emails'),
}))

describe('VersionControl test suite', () => {
  let versionControl
  const credentials = { userKey: 'testUserKey', secret: 'testSecret' }
  const apiKey = 'testApiKey'
  const siteInfo = { dataCenter: 'testDataCenter' }

  beforeEach(() => {
    versionControl = new VersionControl(credentials, apiKey, siteInfo)
    jest.clearAllMocks()
  })

  test('createBranch creates a new branch if it does not exist', async () => {
    createBranch.mockResolvedValueOnce()
    await versionControl.createBranch('newBranch')
    expect(createBranch).toHaveBeenCalled()
  })

  test('fetchFileContent correctly fetches encoded content', async () => {
    const testContent = JSON.stringify({ someProp: 'someValue' })
    const encodedContent = Base64.encode(testContent)
    fetchFileContent.mockResolvedValueOnce(encodedContent)

    const result = await versionControl.fetchFileContent('test-url')
    expect(fetchFileContent).toHaveBeenCalledWith('test-url')
    expect(result).toEqual(encodedContent)
  })

  test('getCommitFiles properly decodes file content', async () => {
    const encodedContent = Base64.encode(JSON.stringify({ someProp: 'someValue' }))
    const commitData = {
      files: [{ filename: 'src/versionControl/emails.json', contents_url: 'test-url-emails' }],
    }

    fetchFileContent.mockResolvedValueOnce(encodedContent)

    getCommitFiles.mockImplementationOnce(async (sha) => {
      return Promise.all(
        commitData.files.map(async (file) => {
          const content = await fetchFileContent(file.contents_url)
          const decodedContent = JSON.parse(Base64.decode(content))
          const fileType = getFileTypeFromFileName(file.filename)
          return { ...file, content: decodedContent, fileType }
        }),
      )
    })

    const sha = 'commitSha'
    const result = await versionControl.getCommitFiles(sha)

    expect(fetchFileContent).toHaveBeenCalledWith('test-url-emails')
    expect(result[0].content).toEqual({ someProp: 'someValue' })
    expect(result[0].fileType).toEqual('emails')
  })

  test('getCommits returns the list of commits', async () => {
    const commits = [{ sha: 'commit1' }, { sha: 'commit2' }]
    getCommits.mockResolvedValueOnce(commits)
    const result = await versionControl.getCommits()
    expect(result).toEqual(commits)
  })

  test('applyCommitConfig processes commits and sets data correctly', async () => {
    const commitData = {
      files: [{ filename: 'src/versionControl/emails.json', contents_url: 'test-url-emails' }],
    }
    fetchFileContent.mockResolvedValue(Base64.encode(JSON.stringify({ someProp: 'someValue' })))
    getCommitFiles.mockResolvedValue(
      commitData.files.map((file) => ({
        filename: file.filename,
        content: JSON.parse(Base64.decode(Base64.encode(JSON.stringify({ someProp: 'someValue' })))),
      })),
    )

    const setEmailTemplatesMock = jest.spyOn(versionControl, 'setEmailTemplates').mockResolvedValue()

    await versionControl.applyCommitConfig('testSha')

    expect(setEmailTemplatesMock).toHaveBeenCalledWith({ someProp: 'someValue' })
  })

  test('fetchCDCConfigs should fetch CDC configurations', async () => {
    await versionControl.fetchCDCConfigs()
    expect(fetchCDCConfigs).toHaveBeenCalled()
  })

  test('storeCdcDataInGit stores CDC data in Git', async () => {
    const commitMessage = 'commit message'
    await versionControl.storeCdcDataInGit(commitMessage)
    expect(storeCdcDataInGit).toHaveBeenCalledWith(commitMessage)
  })

  test('getFile calls getFile', async () => {
    const path = 'file1.json'
    await versionControl.getFile(path)
    expect(getFile).toHaveBeenCalledWith(path)
  })

  test('getCommitFiles calls getCommitFiles', async () => {
    const sha = 'commitSha'
    await versionControl.getCommitFiles(sha)
    expect(getCommitFiles).toHaveBeenCalledWith(sha)
  })

  test('updateGitFileContent updates or creates a file on GitHub', async () => {
    const fakeSha = 'fakeSha'
    const fileContentMock = { content: Base64.encode(JSON.stringify({ someProp: 'someValue' })), sha: fakeSha, name: 'testFile' }
    getFile.mockResolvedValueOnce(fileContentMock)

    const updateFilesMock = { path: 'testPath', content: JSON.stringify({ someProp: 'someValue' }), sha: fakeSha }
    updateGitFileContent.mockResolvedValueOnce(updateFilesMock)

    const result = await versionControl.updateGitFileContent('testPath', JSON.stringify({ someProp: 'someValue' }))
    expect(updateGitFileContent).toHaveBeenCalledWith('testPath', JSON.stringify({ someProp: 'someValue' }))
    expect(result).toEqual(updateFilesMock)
  })

  test('getCdcData fetches and returns CDC data', async () => {
    const cdcData = [{ id: 'data1' }, { id: 'data2' }]
    getCdcData.mockResolvedValueOnce(cdcData)
    const result = await versionControl.getCdcData()
    expect(result).toEqual(cdcData)
  })

  test('handles errors', async () => {
    const errorMessage = 'Error when fetching file content'
    fetchFileContent.mockRejectedValueOnce(new Error(errorMessage))

    await expect(versionControl.fetchFileContent('test-url')).rejects.toThrow(errorMessage)
    expect(fetchFileContent).toHaveBeenCalledWith('test-url')
  })
})
