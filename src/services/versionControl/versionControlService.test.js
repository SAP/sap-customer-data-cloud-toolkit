/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { handleGetServices, handleCommitListRequestServices, handleCommitRevertServices } from './versionControlService'
import VersionControl from './versionControl'
import Cookies from 'js-cookie'

jest.mock('./versionControl', () => {
  const actualModule = jest.requireActual('./versionControl')
  class MockVersionControl extends actualModule.default {
    constructor(...args) {
      super(...args)
      this.branchExists = jest.fn()
      this.getCommits = jest.fn()
      this.createBranch = jest.fn()
      this.storeCdcDataInGit = jest.fn()
      this.applyCommitConfig = jest.fn()
    }
  }
  return {
    __esModule: true,
    ...actualModule,
    default: MockVersionControl,
  }
})

jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
}))

describe('versionControlService', () => {
  const credentials = { userKey: 'testUserKey', secret: 'testSecret', gigyaConsole: 'testConsole' } // Ensure names are correct
  const apiKey = 'testApiKey'
  const currentSite = { dataCenter: 'testDataCenter' }
  let versionControl

  beforeEach(() => {
    jest.clearAllMocks()
    Cookies.get.mockReturnValue('testGitToken')
    versionControl = new VersionControl(credentials, apiKey, currentSite)

    // Define mocks after instantiation
    versionControl.branchExists.mockResolvedValue(true)
    versionControl.getCommits.mockResolvedValue([{ sha: 'abc', commit: { message: 'test', committer: { date: '2023-01-01T12:34:56' } } }])
    versionControl.createBranch.mockResolvedValue()
    versionControl.storeCdcDataInGit.mockResolvedValue()
    versionControl.applyCommitConfig.mockResolvedValue()
  })

  test('handleCommitListRequestServices fetches commit list successfully', async () => {
    const commitList = await handleCommitListRequestServices(versionControl, apiKey)
    expect(commitList).toEqual([{ sha: 'abc', commit: { message: 'test', committer: { date: '2023-01-01T12:34:56' } } }])
  })

  test('handleCommitListRequestServices returns empty list if branch does not exist', async () => {
    versionControl.branchExists.mockResolvedValueOnce(false)
    const commitList = await handleCommitListRequestServices(versionControl, apiKey)
    expect(commitList).toEqual([])
  })

  test('handleCommitListRequestServices handles errors gracefully', async () => {
    const error = new Error('Error fetching commits')
    versionControl.branchExists.mockRejectedValueOnce(error)
    console.error = jest.fn()
    const commitList = await handleCommitListRequestServices(versionControl, apiKey)
    expect(commitList).toEqual([])
    expect(console.error).toHaveBeenCalledWith('Error fetching commits:', error)
  })

  test('handleGetServices creates branch and stores data in Git', async () => {
    const commits = [{ sha: 'abc', commit: { message: 'test', committer: { date: '2023-01-01T12:34:56' } } }]
    versionControl.branchExists.mockResolvedValue(true)
    versionControl.getCommits.mockResolvedValue(commits)
    global.alert = jest.fn()
    const commitList = await handleGetServices(versionControl, apiKey)
    expect(commitList).toEqual(commits)
    expect(global.alert).toHaveBeenCalledWith('Backup created successfully!')
  })

  test('handleGetServices handles errors gracefully', async () => {
    versionControl.createBranch.mockRejectedValue(new Error('Creation failed'))
    global.alert = jest.fn()
    const commitList = await handleGetServices(versionControl, apiKey)
    expect(commitList).toBeUndefined()
    expect(global.alert).toHaveBeenCalledWith('Failed to create backup. Please try again.')
  })

  test('handleCommitRevertServices applies commit configuration by SHA', async () => {
    await handleCommitRevertServices(versionControl, 'fake-sha')
    expect(versionControl.applyCommitConfig).toHaveBeenCalledWith('fake-sha')
  })
})
