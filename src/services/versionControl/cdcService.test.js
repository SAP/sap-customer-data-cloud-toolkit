import CdcService from './cdcService'
import * as githubUtils from './githubUtils'
import * as setters from './setters'

jest.mock('./githubUtils', () => ({
  getCommitFiles: jest.fn(),
}))

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

describe('CdcService', () => {
  let versionControl
  let cdcService

  beforeEach(() => {
    versionControl = {
      webSdk: { get: jest.fn() },
      dataflow: { search: jest.fn() },
      emails: { get: jest.fn() },
      extension: { get: jest.fn() },
      policies: { get: jest.fn() },
      rba: { get: jest.fn() },
      riskAssessment: { get: jest.fn() },
      schema: { get: jest.fn() },
      screenSets: { get: jest.fn() },
      sms: { get: jest.fn() },
      channel: { get: jest.fn() },
    }
    cdcService = new CdcService(versionControl)
  })

  describe('getCdcData', () => {
    it('should return an array of promises', () => {
      const responses = cdcService.getCdcData()
      expect(Array.isArray(responses)).toBe(true)
      expect(responses.length).toBe(11)
      responses.forEach((response) => {
        expect(response).toHaveProperty('name')
        expect(response).toHaveProperty('promise')
      })
    })
  })

  describe('fetchCDCConfigs', () => {
    it('should fetch all CDC configs', async () => {
      const mockData = { key: 'value' }
      versionControl.webSdk.get.mockResolvedValue(mockData)
      versionControl.dataflow.search.mockResolvedValue(mockData)
      versionControl.emails.get.mockResolvedValue(mockData)
      versionControl.extension.get.mockResolvedValue(mockData)
      versionControl.policies.get.mockResolvedValue(mockData)
      versionControl.rba.get.mockResolvedValue(mockData)
      versionControl.riskAssessment.get.mockResolvedValue(mockData)
      versionControl.schema.get.mockResolvedValue(mockData)
      versionControl.screenSets.get.mockResolvedValue(mockData)
      versionControl.sms.get.mockResolvedValue(mockData)
      versionControl.channel.get.mockResolvedValue(mockData)

      const configs = await cdcService.fetchCDCConfigs()
      expect(configs).toEqual({
        webSdk: mockData,
        dataflow: mockData,
        emails: mockData,
        extension: mockData,
        policies: mockData,
        rba: mockData,
        riskAssessment: mockData,
        schema: mockData,
        screenSets: mockData,
        sms: mockData,
        channel: mockData,
      })
    })

    it('should handle errors when fetching CDC configs', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      versionControl.webSdk.get.mockRejectedValue(new Error('Error fetching webSdk'))
      versionControl.dataflow.search.mockResolvedValue({ key: 'value' })
      versionControl.emails.get.mockRejectedValue(new Error('Error fetching emails'))
      versionControl.extension.get.mockRejectedValue(new Error('Error fetching extension'))
      versionControl.policies.get.mockRejectedValue(new Error('Error fetching policies'))
      versionControl.rba.get.mockRejectedValue(new Error('Error fetching rba'))
      versionControl.riskAssessment.get.mockRejectedValue(new Error('Error fetching riskAssessment'))
      versionControl.schema.get.mockRejectedValue(new Error('Error fetching schema'))
      versionControl.screenSets.get.mockRejectedValue(new Error('Error fetching screenSets'))
      versionControl.sms.get.mockRejectedValue(new Error('Error fetching sms'))
      versionControl.channel.get.mockRejectedValue(new Error('Error fetching channel'))

      const configs = await cdcService.fetchCDCConfigs()
      expect(configs).toEqual({
        webSdk: undefined,
        dataflow: { key: 'value' },
        emails: undefined,
        extension: undefined,
        policies: undefined,
        rba: undefined,
        riskAssessment: undefined,
        schema: undefined,
        screenSets: undefined,
        sms: undefined,
        channel: undefined,
      })

      consoleErrorSpy.mockRestore()
    })
  })

  describe('applyCommitConfig', () => {
    it('should apply commit config correctly', async () => {
      const mockFiles = [
        { filename: 'src/versionControl/webSdk.json', content: { key: 'value' } },
        { filename: 'src/versionControl/emails.json', content: { key: 'value' } },
        { filename: 'src/versionControl/extension.json', content: { key: 'value' } },
        { filename: 'src/versionControl/policies.json', content: { key: 'value' } },
        { filename: 'src/versionControl/rba.json', content: { key: 'value' } },
        { filename: 'src/versionControl/schema.json', content: { key: 'value' } },
        { filename: 'src/versionControl/screenSets.json', content: { key: 'value' } },
        { filename: 'src/versionControl/sms.json', content: { key: 'value' } },
      ]
      githubUtils.getCommitFiles.mockResolvedValue(mockFiles)

      await cdcService.applyCommitConfig('mockSha')

      expect(setters.setWebSDK).toHaveBeenCalledWith({ key: 'value' })
      expect(setters.setEmailTemplates).toHaveBeenCalledWith({ key: 'value' })
      expect(setters.setExtension).toHaveBeenCalledWith({ key: 'value' })
      expect(setters.setPolicies).toHaveBeenCalledWith({ key: 'value' })
      expect(setters.setRBA).toHaveBeenCalledWith({ key: 'value' })
      expect(setters.setSchema).toHaveBeenCalledWith({ key: 'value' })
      expect(setters.setScreenSets).toHaveBeenCalledWith({ key: 'value' })
      expect(setters.setSMS).toHaveBeenCalledWith({ key: 'value' })
    })

    it('should handle unknown file types', async () => {
      const mockFiles = [{ filename: 'src/versionControl/unknown.json', content: { key: 'value' } }]
      githubUtils.getCommitFiles.mockResolvedValue(mockFiles)

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

      await cdcService.applyCommitConfig('mockSha')

      expect(consoleWarnSpy).toHaveBeenCalledWith('Unknown file type: unknown')
      consoleWarnSpy.mockRestore()
    })
  })
})
