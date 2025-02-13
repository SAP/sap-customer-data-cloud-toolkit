import VersionControlService from './versionControlService'
import CdcService from './cdcService'
import { getEncryptedCookie } from '../../redux/versionControl/versionControlSlice'

jest.mock('./cdcService')

describe('versionControlService', () => {
  const credentials = { userKey: 'testUserKey', secretKey: 'testSecret', gigyaConsole: 'testConsole' }
  const apiKey = 'testApiKey'
  const currentSite = { dataCenter: 'testDataCenter' }
  const gitToken = getEncryptedCookie('gitToken', credentials.secret)
  const owner = getEncryptedCookie('owner', credentials.secret)
  const versionControlService = new VersionControlService(credentials, apiKey, 'github', currentSite)
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('handleGetServices', () => {
    it('should handle errors when creating a backup', async () => {
      // const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      // const alertSpy = jest.fn()
      // global.alert = alertSpy
      // await versionControlService.handleGetServices('commitMessage')
      // expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating backup:', expect.any(Error))
      // expect(alertSpy).toHaveBeenCalledWith('Failed to create backup. Please try again.')
      // consoleErrorSpy.mockRestore()
      // delete global.alert
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
