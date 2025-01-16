import * as setters from './setters'
import { cleanResponse, cleanEmailResponse } from './dataSanitization'
import Options from '../copyConfig/options'

jest.mock('./dataSanitization', () => ({
  cleanResponse: jest.fn(),
  cleanEmailResponse: jest.fn(),
}))

jest.mock('../copyConfig/options', () => {
  return jest.fn().mockImplementation(function (optionsData) {
    this.getOptions = jest.fn().mockReturnValue({
      id: optionsData.id,
      name: optionsData.name,
      value: false,
      formatName: true,
      branches: optionsData.branches
        ? optionsData.branches.map((branch) => ({
            id: branch.name,
            name: branch.name,
            value: true,
            formatName: false,
          }))
        : [],
    })
  })
})

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
    communication: { set: jest.fn(), setFromFiles: jest.fn(), copyFromGit: jest.fn() },
    dataflow: { copyDataflows: jest.fn() },
    webhook: { copyWebhooks: jest.fn() },
    consent: { copyFromGit: jest.fn(), setFromFiles: jest.fn() },
    social: { copyFromGit: jest.fn(), setFromFiles: jest.fn() },
    recaptcha: { copyFromGit: jest.fn(), setFromFiles: jest.fn() },
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
    it('should set all schema types correctly', async () => {
      const context = getMockContext()
      const config = {
        dataSchema: 'dataValue',
        addressesSchema: 'addressesValue',
        internalSchema: 'internalValue',
        profileSchema: 'profileValue',
        subscriptionsSchema: 'subscriptionsValue',
      }
      await setters.setSchema.call(context, config)
      expect(context.schema.set).toHaveBeenCalledWith(mockApiKey, mockDataCenter, 'dataValue')
      expect(context.schema.set).toHaveBeenCalledWith(mockApiKey, mockDataCenter, 'addressesValue')
      expect(context.schema.set).toHaveBeenCalledWith(mockApiKey, mockDataCenter, 'internalValue')
      expect(context.schema.set).toHaveBeenCalledWith(mockApiKey, mockDataCenter, 'profileValue')
      expect(context.schema.set).toHaveBeenCalledWith(mockApiKey, mockDataCenter, 'subscriptionsValue')
    })

    it('should set dataSchema correctly', async () => {
      const context = getMockContext()
      const config = { dataSchema: 'value' }
      await setters.setSchema.call(context, config)
      expect(context.schema.set).toHaveBeenCalledWith(mockApiKey, mockDataCenter, config.dataSchema)
    })

    it('should set addressesSchema correctly', async () => {
      const context = getMockContext()
      const config = { addressesSchema: 'value' }
      await setters.setSchema.call(context, config)
      expect(context.schema.set).toHaveBeenCalledWith(mockApiKey, mockDataCenter, config.addressesSchema)
    })

    it('should set internalSchema correctly', async () => {
      const context = getMockContext()
      const config = { internalSchema: 'value' }
      await setters.setSchema.call(context, config)
      expect(context.schema.set).toHaveBeenCalledWith(mockApiKey, mockDataCenter, config.internalSchema)
    })

    it('should set profileSchema correctly', async () => {
      const context = getMockContext()
      const config = { profileSchema: 'value' }
      await setters.setSchema.call(context, config)
      expect(context.schema.set).toHaveBeenCalledWith(mockApiKey, mockDataCenter, config.profileSchema)
    })

    it('should set subscriptionsSchema correctly', async () => {
      const context = getMockContext()
      const config = { subscriptionsSchema: 'value' }
      await setters.setSchema.call(context, config)
      expect(context.schema.set).toHaveBeenCalledWith(mockApiKey, mockDataCenter, config.subscriptionsSchema)
    })
  })

  describe('setScreenSets', () => {
    it('should set screen sets correctly', async () => {
      const context = getMockContext()
      const config = { screenSets: ['value'] }
      await setters.setScreenSets.call(context, config)
      expect(context.screenSets.set).toHaveBeenCalledWith(mockApiKey, mockDataCenter, 'value')
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

    it('should not set RBA if all responses are missing', async () => {
      const context = getMockContext()
      const response = [null, null, null]
      await setters.setRBA.call(context, response)
      expect(context.rba.setAccountTakeoverProtection).not.toHaveBeenCalled()
      expect(context.rba.setUnknownLocationNotification).not.toHaveBeenCalled()
      expect(context.rba.setRbaRulesAndSettings).not.toHaveBeenCalled()
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
      expect(context.emails.getEmail().setSiteEmailsWithDataCenter).toHaveBeenCalledWith(mockApiKey, 'key', response.key, mockDataCenter)
      expect(context.emails.getEmail().setSiteEmailsWithDataCenter).not.toHaveBeenCalledWith(mockApiKey, 'errorCode', 'error', mockDataCenter)
    })
  })

  describe('setChannel', () => {
    it('should set communication topics correctly', async () => {
      const context = getMockContext()
      const config = { Channels: ['channel1', 'channel2'] }
      await setters.setChannel.call(context, config)
      expect(context.communication.set).toHaveBeenCalledWith(mockApiKey, mockDataCenter, 'channel1')
      expect(context.communication.set).toHaveBeenCalledWith(mockApiKey, mockDataCenter, 'channel2')
    })
  })

  describe('setCommunicationTopics', () => {
    it('should set communication topics from files correctly', async () => {
      const context = getMockContext()
      const config = { Channels: ['channel1', 'channel2'], results: ['topic1', 'topic2'] }
      await setters.setCommunicationTopics.call(context, config)
      expect(context.communication.setFromFiles).toHaveBeenCalledWith(mockApiKey, mockDataCenter, ['channel1', 'channel2'], 'channel')
      expect(context.communication.setFromFiles).toHaveBeenCalledWith(mockApiKey, mockDataCenter, ['topic1', 'topic2'], 'topic')
    })
  })

  describe('createOptions', () => {
    it('should create options correctly for array input', () => {
      const items = [{ name: 'item1' }, { name: 'item2' }]
      const options = setters.createOptions('type', items)
      expect(options).toBeInstanceOf(Options)
      expect(options.getOptions()).toEqual({
        id: 'type',
        name: 'type',
        value: false,
        formatName: true,
        branches: [
          { id: 'item1', name: 'item1', value: true, formatName: false },
          { id: 'item2', name: 'item2', value: true, formatName: false },
        ],
      })
    })

    it('should create options correctly for object input', () => {
      const items = { key1: { name: 'item1' }, key2: { name: 'item2' } }
      const options = setters.createOptions('type', items)
      expect(options).toBeInstanceOf(Options)
      expect(options.getOptions()).toEqual({
        id: 'type',
        name: 'type',
        value: false,
        formatName: true,
        branches: [
          { id: 'item1', name: 'item1', value: true, formatName: false },
          { id: 'item2', name: 'item2', value: true, formatName: false },
        ],
      })
    })

    it('should throw an error for invalid input', () => {
      expect(() => setters.createOptions('type', 'invalid')).toThrow('Expected an array or object for items, but got string')
    })
  })

  describe('setDataflow', () => {
    it('should set dataflow correctly', async () => {
      const context = getMockContext()
      const config = { result: ['dataflow1', 'dataflow2'] }
      await setters.setDataflow.call(context, config)
      expect(context.dataflow.copyDataflows).toHaveBeenCalledWith(mockApiKey, mockSiteInfo, config, expect.any(Options))
    })
  })

  describe('setWebhook', () => {
    it('should set webhook correctly', async () => {
      const context = getMockContext()
      const config = { webhooks: ['webhook1', 'webhook2'] }
      await setters.setWebhook.call(context, config)
      expect(context.webhook.copyWebhooks).toHaveBeenCalledWith(mockApiKey, mockDataCenter, config, expect.any(Options))
    })
  })

  describe('setConsent', () => {
    it('should set consent correctly', async () => {
      const context = getMockContext()
      const config = { preferences: ['consent1', 'consent2'] }
      await setters.setConsent.call(context, config)
      expect(context.consent.setFromFiles).toHaveBeenCalledWith(mockApiKey, mockDataCenter, config, expect.any(Options))
    })
  })

  describe('setSocial', () => {
    it('should set social correctly', async () => {
      const context = getMockContext()
      const config = { key: 'value' }
      await setters.setSocial.call(context, config)
      expect(context.social.setFromFiles).toHaveBeenCalledWith(mockApiKey, mockDataCenter, config)
    })
  })

  describe('setRecaptcha', () => {
    it('should set recaptcha correctly', async () => {
      const context = getMockContext()
      const config = { key: 'value' }
      await setters.setRecaptcha.call(context, config)
      expect(context.recaptcha.setFromFiles).toHaveBeenCalledWith(mockApiKey, mockDataCenter, config)
    })
  })
})
