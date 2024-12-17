/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import VersionControl from './versionControl'
import Cookies from 'js-cookie'
import { Base64 } from 'js-base64'
import { createBranch, getFile, getCommitFiles, fetchFileContent, updateGitFileContent, storeCdcDataInGit } from './githubUtils'
import { getCdcData, fetchCDCConfigs } from './cdcUtils'
import { getFileTypeFromFileName } from './versionControlFiles'

jest.mock('@octokit/rest', () => {
  return {
    Octokit: jest.fn().mockImplementation(() => ({
      repos: {
        createRelease: jest.fn(),
        getCommit: jest.fn(),
        listBranches: jest.fn(),
        getBranch: jest.fn(),
        createRef: jest.fn(),
        getContent: jest.fn(),
        createBlob: jest.fn(),
        createTree: jest.fn(),
        createCommit: jest.fn(),
        updateRef: jest.fn(),
      },
      git: { getBlob: jest.fn() },
      request: jest.fn(),
    })),
  }
})

jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
}))

jest.mock('./githubUtils')
jest.mock('./cdcUtils')
jest.mock('./setters', () => ({
  setPolicies: jest.fn(),
  setWebSDK: jest.fn(),
  setSMS: jest.fn(),
  setExtension: jest.fn(),
  setSchema: jest.fn(),
  setScreenSets: jest.fn(),
  setRBA: jest.fn(),
  setEmailTemplates: jest.fn(),
}))
jest.mock('./versionControlFiles', () => ({
  getFileTypeFromFileName: jest.fn(),
}))

describe('VersionControl test suite', () => {
  let versionControl
  const credentials = { userKey: 'testUserKey', secret: 'testSecret' }
  const apiKey = 'testApiKey'
  const siteInfo = { dataCenter: 'testDataCenter' }

  beforeEach(() => {
    jest.clearAllMocks()
    getFileTypeFromFileName.mockReturnValue('emails')
    Cookies.get.mockReturnValue('testGitToken')
  })

  test('should throw an error if gitToken is not available in cookies', () => {
    Cookies.get.mockReturnValue(undefined)
    expect(() => new VersionControl(credentials, apiKey, siteInfo)).toThrow('Git token is not available in cookies')
  })

  test('should create VersionControl instance if gitToken is available in cookies', () => {
    versionControl = new VersionControl(credentials, apiKey, siteInfo)
    expect(versionControl).toBeInstanceOf(VersionControl)
  })

  test('createBranch creates a new branch if it does not exist', async () => {
    versionControl = new VersionControl(credentials, apiKey, siteInfo)
    createBranch.mockResolvedValueOnce()
    await versionControl.createBranch('newBranch')
    expect(createBranch).toHaveBeenCalled()
  })

  test('createBranch does not create a new branch if it exists', async () => {
    versionControl = new VersionControl(credentials, apiKey, siteInfo)
    createBranch.mockRejectedValueOnce(new Error('Branch already exists'))
    await expect(versionControl.createBranch('existingBranch')).rejects.toThrow('Branch already exists')
    expect(createBranch).toHaveBeenCalled()
  })

  test('fetchFileContent correctly fetches encoded content', async () => {
    versionControl = new VersionControl(credentials, apiKey, siteInfo)
    const testContent = JSON.stringify({ someProp: 'someValue' })
    const encodedContent = Base64.encode(testContent)
    fetchFileContent.mockResolvedValueOnce(encodedContent)

    const result = await versionControl.fetchFileContent('test-url')
    expect(fetchFileContent).toHaveBeenCalledWith('test-url')
    expect(result).toEqual(encodedContent)
  })

  test('fetchFileContent handles errors gracefully', async () => {
    versionControl = new VersionControl(credentials, apiKey, siteInfo)
    fetchFileContent.mockRejectedValueOnce(new Error('Failed to fetch content'))
    await expect(versionControl.fetchFileContent('test-url')).rejects.toThrow('Failed to fetch content')
    expect(fetchFileContent).toHaveBeenCalledWith('test-url')
  })

  test('applyCommitConfig processes commits and sets data correctly', async () => {
    versionControl = new VersionControl(credentials, apiKey, siteInfo)
    const commitData = {
      files: [
        {
          filename: 'src/versionControl/emails.json',
          contents_url: 'test-url-emails',
        },
      ],
    }

    fetchFileContent.mockImplementation(async (url) => {
      if (url === 'test-url-emails') {
        return Base64.encode(JSON.stringify({ someProp: 'someValue' }))
      }
      throw new Error(`Unknown URL: ${url}`)
    })

    getCommitFiles.mockResolvedValueOnce(
      commitData.files.map((file) => ({
        filename: file.filename,
        content: JSON.parse(Base64.decode(Base64.encode(JSON.stringify({ someProp: 'someValue' })))),
      })),
    )

    const setEmailTemplatesMock = jest.spyOn(versionControl, 'setEmailTemplates').mockResolvedValue()

    await versionControl.applyCommitConfig('testSha')

    expect(setEmailTemplatesMock).toHaveBeenCalledWith({ someProp: 'someValue' })
  })

  test('applyCommitConfig correctly sets sms configurations', async () => {
    versionControl = new VersionControl(credentials, apiKey, siteInfo)
    const commitData = {
      files: [{ filename: 'src/versionControl/sms.json', contents_url: 'test-url-sms' }],
    }

    fetchFileContent.mockImplementation(async (url) => {
      if (url === 'test-url-sms') return Base64.encode(JSON.stringify({ smsProp: 'smsValue' }))
      throw new Error(`Unknown URL: ${url}`)
    })

    getFileTypeFromFileName.mockReturnValue('sms')

    getCommitFiles.mockResolvedValueOnce(
      commitData.files.map((file) => ({
        filename: file.filename,
        content: JSON.parse(Base64.decode(Base64.encode(JSON.stringify({ smsProp: 'smsValue' })))),
        fileType: 'sms',
      })),
    )

    const setSMSMock = jest.spyOn(versionControl, 'setSMS').mockResolvedValue()

    await versionControl.applyCommitConfig('testSha')

    expect(setSMSMock).toHaveBeenCalledWith({ smsProp: 'smsValue' })
  })

  test('applyCommitConfig handles missing configurations gracefully', async () => {
    versionControl = new VersionControl(credentials, apiKey, siteInfo)
    getCommitFiles.mockResolvedValueOnce([]) // No files returned

    const setEmailTemplatesMock = jest.spyOn(versionControl, 'setEmailTemplates').mockResolvedValue()

    await versionControl.applyCommitConfig('testSha')

    expect(setEmailTemplatesMock).not.toHaveBeenCalled()
  })

  test('fetchCDCConfigs should fetch CDC configurations', async () => {
    versionControl = new VersionControl(credentials, apiKey, siteInfo)
    await versionControl.fetchCDCConfigs()
    expect(fetchCDCConfigs).toHaveBeenCalled()
  })

  test('storeCdcDataInGit stores CDC data in Git', async () => {
    versionControl = new VersionControl(credentials, apiKey, siteInfo)
    const commitMessage = 'commit message'
    await versionControl.storeCdcDataInGit(commitMessage)
    expect(storeCdcDataInGit).toHaveBeenCalledWith(commitMessage)
  })

  test('storeCdcDataInGit handles errors gracefully', async () => {
    versionControl = new VersionControl(credentials, apiKey, siteInfo)
    storeCdcDataInGit.mockRejectedValueOnce(new Error('Failed to store data'))
    const commitMessage = 'commit message'
    await expect(versionControl.storeCdcDataInGit(commitMessage)).rejects.toThrow('Failed to store data')
    expect(storeCdcDataInGit).toHaveBeenCalledWith(commitMessage)
  })

  test('getFile calls getFile', async () => {
    versionControl = new VersionControl(credentials, apiKey, siteInfo)
    const path = 'file1.json'
    await versionControl.getFile(path)
    expect(getFile).toHaveBeenCalledWith(path)
  })

  test('getCommitFiles calls getCommitFiles', async () => {
    versionControl = new VersionControl(credentials, apiKey, siteInfo)
    const sha = 'commitSha'
    const commitData = {
      files: [{ filename: 'src/versionControl/emails.json', contents_url: 'test-url-emails' }],
    }

    fetchFileContent.mockImplementation(async (url) => {
      console.log(`Attempting to fetch content for URL: ${url}`)
      if (url === 'test-url-emails') return Base64.encode(JSON.stringify({ emailProp: 'emailValue' }))
      throw new Error(`Unknown URL: ${url}`)
    })

    getFileTypeFromFileName.mockReturnValue('emails')

    const mockGetCommitFiles = async () => {
      const files = await Promise.all(
        commitData.files.map(async (file) => {
          const content = await fetchFileContent(file.contents_url)
          return {
            ...file,
            content,
          }
        }),
      )
      return files.map((file) => {
        console.log(`Processing file: ${file.filename}`)
        return {
          ...file,
          content: JSON.parse(Base64.decode(file.content)),
          fileType: 'emails',
        }
      })
    }

    getCommitFiles.mockImplementation(mockGetCommitFiles)

    const result = await versionControl.getCommitFiles(sha)

    expect(fetchFileContent).toHaveBeenCalledWith('test-url-emails')
    expect(result[0].content).toEqual({ emailProp: 'emailValue' })
    expect(result[0].fileType).toEqual('emails')
  })

  test('updateGitFileContent updates or creates a file on GitHub', async () => {
    versionControl = new VersionControl(credentials, apiKey, siteInfo)
    const fakeSha = 'fakeSha'
    const fileContentMock = {
      content: Base64.encode(JSON.stringify({ someProp: 'someValue' })),
      sha: fakeSha,
      name: 'testFile',
    }
    getFile.mockResolvedValueOnce(fileContentMock)

    const updateFilesMock = {
      path: 'testPath',
      content: JSON.stringify({ someProp: 'someValue' }),
      sha: fakeSha,
    }
    updateGitFileContent.mockResolvedValueOnce(updateFilesMock)

    const result = await versionControl.updateGitFileContent('testPath', JSON.stringify({ someProp: 'someValue' }))
    expect(updateGitFileContent).toHaveBeenCalledWith('testPath', JSON.stringify({ someProp: 'someValue' }))
    expect(result).toEqual(updateFilesMock)
  })

  test('getCdcData fetches and returns CDC data', async () => {
    versionControl = new VersionControl(credentials, apiKey, siteInfo)
    const cdcData = [{ id: 'data1' }, { id: 'data2' }]
    getCdcData.mockResolvedValueOnce(cdcData)
    const result = await versionControl.getCdcData()
    expect(result).toEqual(cdcData)
  })

  test('handles errors gracefully', async () => {
    versionControl = new VersionControl(credentials, apiKey, siteInfo)
    const errorMessage = 'Error when fetching file content'
    fetchFileContent.mockRejectedValueOnce(new Error(errorMessage))

    await expect(versionControl.fetchFileContent('test-url')).rejects.toThrow(errorMessage)
    expect(fetchFileContent).toHaveBeenCalledWith('test-url')
  })
})
