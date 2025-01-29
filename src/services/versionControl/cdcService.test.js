/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
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
  setCommunicationTopics: jest.fn(),
  setDataflow: jest.fn(),
  setWebhook: jest.fn(),
  setConsent: jest.fn(),
  setSocial: jest.fn(),
  setRecaptcha: jest.fn(),
}))

describe('CdcService', () => {
  let versionControl
  let cdcService

  beforeEach(() => {
    versionControl = {
      webSdk: { get: jest.fn().mockResolvedValue({}) },
      dataflow: { search: jest.fn().mockResolvedValue({}) },
      emails: { get: jest.fn().mockResolvedValue({}) },
      extension: { get: jest.fn().mockResolvedValue({}) },
      policies: { get: jest.fn().mockResolvedValue({}) },
      rba: { get: jest.fn().mockResolvedValue({}) },
      riskAssessment: { get: jest.fn().mockResolvedValue({}) },
      schema: { get: jest.fn().mockResolvedValue({}) },
      screenSets: { get: jest.fn().mockResolvedValue({}) },
      sms: { get: jest.fn().mockResolvedValue({}) },
      communication: { get: jest.fn().mockResolvedValue({}) },
      topic: { searchTopics: jest.fn().mockResolvedValue({ key: 'value' }) }, // Ensuring mock data is not empty
      webhook: { get: jest.fn().mockResolvedValue({}) },
      consent: { get: jest.fn().mockResolvedValue({}) },
      social: { get: jest.fn().mockResolvedValue({}) },
      recaptcha: { get: jest.fn().mockResolvedValue({}) },
    }
    cdcService = new CdcService(versionControl)
  })

  describe('getCdcData', () => {
    it('should return an array of promises', () => {
      const responses = cdcService.getCdcData()
      expect(Array.isArray(responses)).toBe(true)
      expect(responses.length).toBe(16) // Ensure this matches the number of responses in getCdcData
      responses.forEach((response) => {
        expect(response).toHaveProperty('name')
        expect(response).toHaveProperty('promise')
      })
    })
  })

  describe('fetchCDCConfigs', () => {
    it('should fetch all CDC configs', async () => {
      const mockData = { key: 'value' }
      Object.keys(versionControl).forEach((key) => {
        if (versionControl[key].get) {
          versionControl[key].get.mockResolvedValue(mockData)
        } else if (versionControl[key].search) {
          versionControl[key].search.mockResolvedValue(mockData)
        }
      })

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
        channel: mockData, // Adjusted from communication to channel
        topic: mockData, // Ensuring topic returns mock data
        webhook: mockData,
        consent: mockData,
        social: mockData,
        recaptcha: mockData,
      })
    })

    it('should handle errors when fetching CDC configs', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      versionControl.webSdk.get.mockRejectedValue(new Error('Error fetching webSdk'))
      versionControl.dataflow.search.mockResolvedValue({ key: 'value' })
      Object.keys(versionControl).forEach((key) => {
        if (versionControl[key].get && key !== 'webSdk' && key !== 'dataflow') {
          versionControl[key].get.mockRejectedValue(new Error(`Error fetching ${key}`))
        }
        if (versionControl[key].search && key !== 'dataflow') {
          versionControl[key].search.mockRejectedValue(new Error(`Error fetching ${key}`))
        }
      })

      // Special case to handle the expected 'topic' result
      versionControl.topic.searchTopics.mockResolvedValue({})

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
        channel: undefined, // Adjusted from communication to channel
        topic: {}, // Ensuring topic can handle empty response
        webhook: undefined,
        consent: undefined,
        social: undefined,
        recaptcha: undefined,
      })

      consoleErrorSpy.mockRestore()
    })

    it('should throw an error if getCdcData does not return an array', async () => {
      jest.spyOn(cdcService, 'getCdcData').mockReturnValueOnce(null)
      await expect(cdcService.fetchCDCConfigs()).rejects.toThrow('getCdcData must return an array')
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
        { filename: 'src/versionControl/channel.json', content: { key: 'value' } }, // Changed from communication.json to channel.json
        { filename: 'src/versionControl/topic.json', content: { key: 'value' } },
        { filename: 'src/versionControl/webhook.json', content: { key: 'value' } },
        { filename: 'src/versionControl/consent.json', content: { key: 'value' } },
        { filename: 'src/versionControl/social.json', content: { key: 'value' } },
        { filename: 'src/versionControl/recaptcha.json', content: { key: 'value' } },
        { filename: 'src/versionControl/dataflow.json', content: { key: 'value' } },
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
      expect(setters.setCommunicationTopics).toHaveBeenCalledWith({ key: 'value' })
      expect(setters.setWebhook).toHaveBeenCalledWith({ key: 'value' })
      expect(setters.setConsent).toHaveBeenCalledWith({ key: 'value' })
      expect(setters.setSocial).toHaveBeenCalledWith({ key: 'value' })
      expect(setters.setRecaptcha).toHaveBeenCalledWith({ key: 'value' })
      expect(setters.setDataflow).toHaveBeenCalledWith({ key: 'value' })
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
