/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

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

  const getMockContext = () => ({
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
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('setPolicies', () => {
    it('should set policies correctly', async () => {
      const context = getMockContext()
      const config = { key: 'value' }
      await setters.setPolicies.call(context, config)
      expect(cleanResponse).toHaveBeenCalledWith(config)
      expect(context.policies.set).toHaveBeenCalledWith(mockApiKey, config, mockDataCenter)
    })
  })

  describe('setWebSDK', () => {
    it('should set web SDK correctly', async () => {
      const context = getMockContext()
      const config = { key: 'value' }
      await setters.setWebSDK.call(context, config)
      expect(context.webSdk.set).toHaveBeenCalledWith(mockApiKey, config, mockDataCenter)
    })
  })

  describe('setSMS', () => {
    it('should set SMS correctly', async () => {
      const context = getMockContext()
      const config = { templates: 'value' }
      await setters.setSMS.call(context, config)
      expect(context.sms.getSms().set).toHaveBeenCalledWith(mockApiKey, mockDataCenter, config.templates)
    })
  })

  describe('setExtension', () => {
    it('should set extension correctly when result is not empty', async () => {
      const context = getMockContext()
      const config = { result: ['value'] }
      await setters.setExtension.call(context, config)
      expect(context.extension.set).toHaveBeenCalledWith(mockApiKey, mockDataCenter, config.result[0])
    })

    it('should not set extension when result is empty', async () => {
      const context = getMockContext()
      const config = { result: [] }
      await setters.setExtension.call(context, config)
      expect(context.extension.set).not.toHaveBeenCalled()
    })
  })

  describe('setSchema', () => {
    it('should set schema correctly', async () => {
      const context = getMockContext()
      const config = { dataSchema: 'value' }
      await setters.setSchema.call(context, config)
      expect(context.schema.set).toHaveBeenCalledWith(mockApiKey, mockDataCenter, config.dataSchema)
    })
  })

  describe('setScreenSets', () => {
    it('should set screen sets correctly', async () => {
      const context = getMockContext()
      const config = { screenSets: ['value'] }
      await setters.setScreenSets.call(context, config)
    })
  })

  describe('setRBA', () => {
    it('should set RBA correctly when all responses are provided', async () => {
      const context = getMockContext()
      const response = ['value1', 'value2', 'value3']
      await setters.setRBA.call(context, response)
      expect(context.rba.setAccountTakeoverProtection).toHaveBeenCalledWith(mockApiKey, response[0])
      expect(context.rba.setUnknownLocationNotification).toHaveBeenCalledWith(mockApiKey, mockSiteInfo, response[1])
      expect(context.rba.setRbaRulesAndSettings).toHaveBeenCalledWith(mockApiKey, mockSiteInfo, response[2])
    })

    it('should set RBA correctly when some responses are missing', async () => {
      const context = getMockContext()
      const response = ['value1', null, 'value3']
      await setters.setRBA.call(context, response)
      expect(context.rba.setAccountTakeoverProtection).toHaveBeenCalledWith(mockApiKey, response[0])
      expect(context.rba.setUnknownLocationNotification).not.toHaveBeenCalled()
      expect(context.rba.setRbaRulesAndSettings).toHaveBeenCalledWith(mockApiKey, mockSiteInfo, response[2])
    })
  })

  describe('setEmailTemplates', () => {
    it('should set email templates correctly', async () => {
      const context = getMockContext()
      const response = { key: 'value' }
      await setters.setEmailTemplates.call(context, response)
      expect(cleanEmailResponse).toHaveBeenCalledWith(response)
      expect(context.emails.getEmail().setSiteEmailsWithDataCenter).toHaveBeenCalledWith(mockApiKey, 'key', response.key, mockDataCenter)
    })

    it('should not set email templates for errorCode key', async () => {
      const context = getMockContext()
      const response = { errorCode: 'error', key: 'value' }
      await setters.setEmailTemplates.call(context, response)
      expect(cleanEmailResponse).toHaveBeenCalledWith(response)
      // Correctly verify setSiteEmailsWithDataCenter is not called for 'errorCode'
      expect(context.emails.getEmail().setSiteEmailsWithDataCenter).not.toHaveBeenCalledWith(mockApiKey, 'errorCode', 'error', mockDataCenter)
    })
  })
})
