import VersionControl from './versionControl'
import { Octokit } from '@octokit/rest'
import { Base64 } from 'js-base64'

import {
  createBranch,
  updateFilesInSingleCommit,
  getFile,
  getCommitFiles,
  fetchFileContent,
  getCommits,
  updateGitFileContent,
  storeCdcDataInGit,
  applyCommitConfig,
} from './githubUtils'
import { getCdcData, fetchCDCConfigs } from './cdcUtils'
import { setPolicies, setWebSDK, setSMS, setExtension, setSchema, setScreenSets, setRBA, setEmailTemplates } from './setters'

jest.mock('@octokit/rest')
jest.mock('./githubUtils')
jest.mock('./cdcUtils')
jest.mock('./setters')
jest.mock('../copyConfig/websdk/websdk')
jest.mock('../copyConfig/dataflow/dataflow')
jest.mock('../copyConfig/emails/emailConfiguration')
jest.mock('../copyConfig/extension/extension')
jest.mock('../copyConfig/policies/policies')
jest.mock('../copyConfig/rba/rba')
jest.mock('../copyConfig/rba/riskAssessment')
jest.mock('../copyConfig/schema/schema')
jest.mock('../copyConfig/screenset/screenset')
jest.mock('../copyConfig/sms/smsConfiguration')
jest.mock('../copyConfig/communication/channel')

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

  test('fetchFileContent correctly fetches and decodes file content', async () => {
    const testContent = JSON.stringify({ someProp: 'someValue' })
    const encodedContent = Base64.encode(testContent)
    fetchFileContent.mockResolvedValueOnce(encodedContent)

    const result = await versionControl.fetchFileContent('test-url')

    expect(fetchFileContent).toHaveBeenCalledWith('test-url')
    expect(result).toEqual(encodedContent)
  })

  test('getCommits returns the list of commits', async () => {
    const commits = [{ sha: 'commit1' }, { sha: 'commit2' }]
    getCommits.mockResolvedValueOnce(commits)

    const result = await versionControl.getCommits()

    expect(result).toEqual(commits)
  })
  // ********************** Test beggin **********************
  test('applyCommitConfig processes commits and sets data correctly', async () => {
    // 3d9c02d9be43c2bb4f96bc5c6cd655b711f7f338

    let sha = '3d9c02d9be43c2bb4f96bc5c6cd655b711f7f338'
   applyCommitConfig(sha)

    // console.log('================test====================')
    // console.log(JSON.stringify(test))
    // console.log('====================================')
  })
  // ********************** Test End **********************
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

    expect(result).toEqual({
      path: 'testPath',
      content: JSON.stringify({ someProp: 'someValue' }),
      sha: fakeSha,
    })
  })
})
