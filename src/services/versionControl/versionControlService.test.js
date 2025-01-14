import * as versionControlService from './versionControlService'
import VersionControl from './versionControl'
import * as githubUtils from './githubUtils'
import CdcService from './cdcService'

jest.mock('./versionControl')
jest.mock('./githubUtils')
jest.mock('./cdcService')

describe('versionControlService', () => {
  const credentials = { userKey: 'testUserKey', secretKey: 'testSecret', gigyaConsole: 'testConsole' }
  const apiKey = 'testApiKey'
  const currentSite = { dataCenter: 'testDataCenter' }
  let versionControlInstance

  beforeEach(() => {
    jest.clearAllMocks()
    VersionControl.mockImplementation(function () {
      this.credentials = credentials
      this.apiKey = apiKey
      this.dataCenter = currentSite.dataCenter
    })
    versionControlInstance = new VersionControl(credentials, apiKey, currentSite)
  })

  describe('createVersionControlInstance', () => {
    it('should create a new VersionControl instance', () => {
      const instance = versionControlService.createVersionControlInstance(credentials, apiKey, currentSite)
      expect(instance).toBeInstanceOf(VersionControl)
      expect(instance.credentials).toEqual(credentials)
      expect(instance.apiKey).toEqual(apiKey)
      expect(instance.dataCenter).toEqual(currentSite.dataCenter)
    })
  })

  describe('handleGetServices', () => {
    // it('should create a backup and return commit list', async () => {
    //   const mockCommitList = [{ sha: 'commit1' }, { sha: 'commit2' }]
    //   const mockCdcService = new CdcService(versionControlInstance)
    //   mockCdcService.fetchCDCConfigs = jest.fn().mockResolvedValue()
    //   githubUtils.createBranch.mockResolvedValue()
    //   githubUtils.storeCdcDataInGit.mockResolvedValue()
    //   githubUtils.getCommits.mockResolvedValue(mockCommitList)
    //   CdcService.mockImplementation(() => mockCdcService)

    //   const result = await versionControlService.handleGetServices(versionControlInstance, apiKey, 'commitMessage')
    //   console.log('Result:', result)
    //   console.log('Expected:', mockCommitList)
    //   console.log('createBranch calls:', githubUtils.createBranch.mock.calls)
    //   console.log('storeCdcDataInGit calls:', githubUtils.storeCdcDataInGit.mock.calls)
    //   console.log('getCommits calls:', githubUtils.getCommits.mock.calls)
    //   expect(result).toEqual(mockCommitList)
    //   expect(githubUtils.createBranch).toHaveBeenCalledWith(versionControlInstance, apiKey)
    //   expect(githubUtils.storeCdcDataInGit).toHaveBeenCalledWith(versionControlInstance, 'commitMessage')
    //   expect(githubUtils.getCommits).toHaveBeenCalledWith(versionControlInstance, 1, 10)
    // })

    it('should handle errors when creating a backup', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      const alertSpy = jest.fn()
      global.alert = alertSpy
      githubUtils.createBranch.mockRejectedValue(new Error('Error creating branch'))

      await versionControlService.handleGetServices(versionControlInstance, apiKey, 'commitMessage')
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating backup:', expect.any(Error))
      expect(alertSpy).toHaveBeenCalledWith('Failed to create backup. Please try again.')
      consoleErrorSpy.mockRestore()
      delete global.alert
    })
  })

  describe('handleCommitListRequestServices', () => {
    it('should fetch commit list if branch exists', async () => {
      const mockCommitList = { commitList: [{ sha: 'commit1' }, { sha: 'commit2' }], totalCommits: 2 }
      githubUtils.branchExists.mockResolvedValue(true)
      githubUtils.getCommits.mockResolvedValue({ data: mockCommitList.commitList })

      const result = await versionControlService.handleCommitListRequestServices(versionControlInstance, apiKey)
      expect(result).toEqual(mockCommitList)
      expect(githubUtils.branchExists).toHaveBeenCalledWith(versionControlInstance, apiKey)
      expect(githubUtils.getCommits).toHaveBeenCalledWith(versionControlInstance)
    })

    it('should return an empty array if branch does not exist', async () => {
      githubUtils.branchExists.mockResolvedValue(false)

      const result = await versionControlService.handleCommitListRequestServices(versionControlInstance, apiKey)
      expect(result).toEqual({ commitList: [], totalCommits: 0 })
      expect(githubUtils.branchExists).toHaveBeenCalledWith(versionControlInstance, apiKey)
      expect(githubUtils.getCommits).not.toHaveBeenCalled()
    })

    it('should handle errors when fetching commit list', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      githubUtils.branchExists.mockRejectedValue(new Error('Error checking branch existence'))

      const result = await versionControlService.handleCommitListRequestServices(versionControlInstance, apiKey)
      expect(result).toEqual({ commitList: [], totalCommits: 0 })
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching commits:', expect.any(Error))
      consoleErrorSpy.mockRestore()
    })
  })

  describe('handleCommitRevertServices', () => {
    it('should revert commit and show success alert', async () => {
      const mockCdcService = new CdcService(versionControlInstance)
      mockCdcService.applyCommitConfig = jest.fn().mockResolvedValue()
      CdcService.mockImplementation(() => mockCdcService)

      const alertSpy = jest.fn()
      global.alert = alertSpy

      await versionControlService.handleCommitRevertServices(versionControlInstance, 'mockSha')
      expect(mockCdcService.applyCommitConfig).toHaveBeenCalledWith('mockSha')
      expect(alertSpy).toHaveBeenCalledWith('Restore completed successfully!')

      delete global.alert
    })

    it('should handle errors when reverting commit', async () => {
      const mockCdcService = new CdcService(versionControlInstance)
      mockCdcService.applyCommitConfig = jest.fn().mockRejectedValue(new Error('Error reverting commit'))
      CdcService.mockImplementation(() => mockCdcService)

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      const alertSpy = jest.fn()
      global.alert = alertSpy

      await versionControlService.handleCommitRevertServices(versionControlInstance, 'mockSha')
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error reverting configurations:', expect.any(Error))
      expect(alertSpy).toHaveBeenCalledWith('Failed to restore configurations. Please try again.')

      consoleErrorSpy.mockRestore()
      delete global.alert
    })
  })
})
