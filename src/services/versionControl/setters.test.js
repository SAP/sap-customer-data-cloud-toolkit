// FILE: setters.test.js

import * as setters from './setters'
import { cleanResponse, cleanEmailResponse } from './dataSanitization'

jest.mock('./dataSanitization', () => ({
  cleanResponse: jest.fn(),
  cleanEmailResponse: jest.fn(),
}))

describe('setters', () => {
  const mockApiKey = 'mockApiKey'
  const mockDataCenter = 'mockDataCenter'
  const mockSiteInfo = { siteId: 'mockSiteId' }

  const context = {
    apiKey: mockApiKey,
    dataCenter: mockDataCenter,
    siteInfo: mockSiteInfo,
    policies: { set: jest.fn() },
    webSdk: { set: jest.fn() },
    sms: { getSms: jest.fn().mockReturnValue({ set: jest.fn() }) },
    extension: { set: jest.fn() },
    schema: { set: jest.fn() },
    screenSets: { set: jest.fn() },
    rba: {
      setAccountTakeoverProtection: jest.fn(),
      setUnknownLocationNotification: jest.fn(),
      setRbaRulesAndSettings: jest.fn(),
    },
    emails: { getEmail: jest.fn().mockReturnValue({ setSiteEmailsWithDataCenter: jest.fn() }) },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  describe('setPolicies', () => {
    it('should set policies correctly', async () => {
      const config = { key: 'value' }
      await setters.setPolicies.call(context, config)
      expect(cleanResponse).toHaveBeenCalledWith(config)
      expect(context.policies.set).toHaveBeenCalledWith(mockApiKey, config, mockDataCenter)
    })
  })

  describe('setWebSDK', () => {
    it('should set web SDK correctly', async () => {
      const config = { key: 'value' }
      await setters.setWebSDK.call(context, config)
      expect(context.webSdk.set).toHaveBeenCalledWith(mockApiKey, config, mockDataCenter)
    })
  })

  describe('setSMS', () => {
    it('should set SMS correctly', async () => {
      const config = { templates: 'value' }
      await setters.setSMS.call(context, config)
      expect(context.sms.getSms().set).toHaveBeenCalledWith(mockApiKey, mockDataCenter, config.templates)
    })
  })

  describe('setExtension', () => {
    it('should set extension correctly', async () => {
      const config = { result: ['value'] }
      await setters.setExtension.call(context, config)
      expect(context.extension.set).toHaveBeenCalledWith(mockApiKey, mockDataCenter, config.result[0])
    })
  })

  describe('setSchema', () => {
    it('should set schema correctly', async () => {
      const config = { dataSchema: 'value' }
      await setters.setSchema.call(context, config)
      expect(context.schema.set).toHaveBeenCalledWith(mockApiKey, mockDataCenter, config.dataSchema)
    })
  })

  describe('setScreenSets', () => {
    it('should set screen sets correctly', async () => {
      const config = { screenSets: ['value'] }
      await setters.setScreenSets.call(context, config)
      expect(console.log).toHaveBeenCalledWith('ScreenSet:', 'value')
    })
  })

  describe('setRBA', () => {
    it('should set RBA correctly', async () => {
      const response = ['value1', 'value2', 'value3']
      await setters.setRBA.call(context, response)
      expect(context.rba.setAccountTakeoverProtection).toHaveBeenCalledWith(mockApiKey, response[0])
      expect(context.rba.setUnknownLocationNotification).toHaveBeenCalledWith(mockApiKey, mockSiteInfo, response[1])
      expect(context.rba.setRbaRulesAndSettings).toHaveBeenCalledWith(mockApiKey, mockSiteInfo, response[2])
    })
  })

  describe('setEmailTemplates', () => {
    it('should set email templates correctly', async () => {
      const response = { key: 'value' }
      await setters.setEmailTemplates.call(context, response)
      expect(cleanEmailResponse).toHaveBeenCalledWith(response)
      expect(context.emails.getEmail().setSiteEmailsWithDataCenter).toHaveBeenCalledWith(mockApiKey, 'key', response.key, mockDataCenter)
    })
  })
})
