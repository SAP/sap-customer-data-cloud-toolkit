/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import axios from 'axios'
import CdcService from './cdcService'
import LegalStatement from '../copyConfig/consent/legalStatement'
import { channelsExpectedResponse, topicsExpectedResponse } from '../copyConfig/communication/dataTest'
import { getConsentStatementExpectedResponse, getLegalStatementExpectedResponse } from '../copyConfig/consent/dataTest'
import { getEmptyDataflowResponse, getSearchDataflowsExpectedResponse } from '../copyConfig/dataflow/dataTest'
import { getExpectedListExtensionResponse } from '../copyConfig/extension/dataTest'
import { getPolicyConfig } from '../copyConfig/policies/dataTest'
import { expectedGetRbaPolicyResponseOk, expectedGetRiskAssessmentResponseOk, expectedGetUnknownLocationNotificationResponseOk } from '../copyConfig/rba/dataTest'
import { getExpectedScreenSetResponse } from '../copyConfig/screenset/dataTest'
import { getSocialsProviders } from '../copyConfig/social/dataTest'
import { getExpectedWebhookResponse } from '../copyConfig/webhook/dataTest'
import { getSiteConfig } from '../copyConfig/websdk/dataTest'
import { getEmailsExpectedResponse, getEmailsExpectedResponseWithMinimumTemplates } from '../emails/dataTest'
import { expectedSchemaResponse } from '../importAccounts/schemaImport/schemaDatatest'
import { getRecaptchaExpectedResponse, getRecaptchaPoliciesResponse, getRiskProvidersResponse } from '../recaptcha/dataTest'
import { expectedGigyaResponseOk } from '../servicesDataTest'
import { getSmsExpectedResponse } from '../sms/dataTest'

jest.mock('axios')
jest.mock('./versionControlManager/github')
describe('CdcService', () => {
  const credentials = { userKey: 'testUserKey', secret: 'testSecret', gigyaConsole: 'testConsole' }
  const apiKey = 'testApiKey'
  const currentSite = { dataCenter: 'testDataCenter' }
  const dataCenter = 'eu1'
  const cdcService = new CdcService(credentials, apiKey, dataCenter, currentSite)

  beforeEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  describe('fetchCDCConfigs', () => {
    it('should log errors when applying commit config fails', async () => {
      const setSiteEmailsWithDataCenterMock = jest.fn().mockRejectedValue(new Error('emails error'))
      jest.spyOn(cdcService.emails, 'getEmail').mockReturnValue({
        setSiteEmailsWithDataCenter: setSiteEmailsWithDataCenterMock,
      })

      const mockFiles = [
        { filename: 'src/versionControl/webSdk.json', content: getSiteConfig },
        { filename: 'src/versionControl/emails.json', content: getEmailsExpectedResponseWithMinimumTemplates() },
        { filename: 'src/versionControl/extension.json', content: { result: [{ key: 'value' }] } },
        { filename: 'src/versionControl/policies.json', content: { key: 'value' } },
        { filename: 'src/versionControl/rba.json', content: expectedGetRbaPolicyResponseOk },
        { filename: 'src/versionControl/schema.json', content: expectedSchemaResponse },
        { filename: 'src/versionControl/screenSets.json', content: { screenSets: [{ key: 'value' }] } },
        { filename: 'src/versionControl/sms.json', content: { templates: { key: 'value' } } },
        { filename: 'src/versionControl/channel.json', content: channelsExpectedResponse },
        { filename: 'src/versionControl/topic.json', content: topicsExpectedResponse },
        { filename: 'src/versionControl/consent.json', content: { key: 'value' } },
        { filename: 'src/versionControl/social.json', content: { key: 'value' } },
        { filename: 'src/versionControl/dataflow.json', content: getEmptyDataflowResponse() },
      ]

      const expectedGigyaResponseNotOk = {
        statusCode: 500,
        errorCode: 0,
        statusReason: 'Forbidden',
        callId: 'callId',
        apiVersion: 2,
        time: Date.now(),
      }
      axios.mockResolvedValueOnce({ data: expectedGigyaResponseNotOk })
      axios.mockResolvedValueOnce({ data: expectedGigyaResponseNotOk })
      axios.mockResolvedValueOnce({ data: expectedGigyaResponseNotOk })
      axios.mockResolvedValueOnce({ data: expectedGigyaResponseNotOk })
      axios.mockResolvedValueOnce({ data: expectedGigyaResponseNotOk })
      axios.mockResolvedValueOnce({ data: expectedGigyaResponseNotOk })
      axios.mockResolvedValueOnce({ data: expectedGigyaResponseNotOk })
      axios.mockResolvedValueOnce({ data: expectedGigyaResponseNotOk })
      axios.mockResolvedValueOnce({ data: expectedGigyaResponseNotOk })
      axios.mockResolvedValueOnce({ data: expectedGigyaResponseNotOk })
      axios.mockResolvedValueOnce({ data: expectedGigyaResponseNotOk })
      axios.mockResolvedValueOnce({ data: expectedGigyaResponseNotOk })
      axios.mockResolvedValueOnce({ data: expectedGigyaResponseNotOk })
      axios.mockResolvedValueOnce({ data: expectedGigyaResponseNotOk })

      await expect(cdcService.applyCommitConfig(mockFiles)).rejects.toThrow(expect.any(Error))
      await expect(cdcService.applyCommitConfig(mockFiles)).rejects.toThrow(expect.any(Error))
      await expect(cdcService.applyCommitConfig(mockFiles)).rejects.toThrow(expect.any(Error))
      await expect(cdcService.applyCommitConfig(mockFiles)).rejects.toThrow(expect.any(Error))
      await expect(cdcService.applyCommitConfig(mockFiles)).rejects.toThrow(expect.any(Error))
      await expect(cdcService.applyCommitConfig(mockFiles)).rejects.toThrow(expect.any(Error))
      await expect(cdcService.applyCommitConfig(mockFiles)).rejects.toThrow(expect.any(Error))
      await expect(cdcService.applyCommitConfig(mockFiles)).rejects.toThrow(expect.any(Error))
      await expect(cdcService.applyCommitConfig(mockFiles)).rejects.toThrow(expect.any(Error))
      await expect(cdcService.applyCommitConfig(mockFiles)).rejects.toThrow(expect.any(Error))
      await expect(cdcService.applyCommitConfig(mockFiles)).rejects.toThrow(expect.any(Error))
      await expect(cdcService.applyCommitConfig(mockFiles)).rejects.toThrow(expect.any(Error))
      await expect(cdcService.applyCommitConfig(mockFiles)).rejects.toThrow(expect.any(Error))
      await expect(cdcService.applyCommitConfig(mockFiles)).rejects.toThrow(expect.any(Error))
    })
    it('should fetch all CDC configs', async () => {
      jest.spyOn(cdcService.consentManager, 'getConsentsAndLegalStatements').mockResolvedValue(getConsentStatementExpectedResponse)
      jest.spyOn(LegalStatement.prototype, 'getFilteredLegalStatement').mockResolvedValue({
        callId: 'ea4861dc2cab4c01ab265ffe3eab6c71',
        errorCode: 0,
        apiVersion: 2,
        statusCode: 200,
        statusReason: 'OK',
        time: '2024-08-30T08:22:37.389Z',
        legalStatements: {
          versions: {
            2: {
              purpose: 'Updated terms',
              LegalStatementStatus: 'Published',
            },
            1: {
              purpose: 'Initial terms',
              LegalStatementStatus: 'Archived',
            },
          },
        },
      })

      const webSdkSpy = jest.spyOn(cdcService.webSdk, 'get')
      const dataflowSpy = jest.spyOn(cdcService.dataflow, 'search')
      const emailsSpy = jest.spyOn(cdcService.emails, 'get')
      const extensionSpy = jest.spyOn(cdcService.extension, 'get')
      const policiesSpy = jest.spyOn(cdcService.policies, 'get')
      const rbaSpy = jest.spyOn(cdcService.rba, 'get')
      const riskAssessmentSpy = jest.spyOn(cdcService.riskAssessment, 'get')
      const schemaSpy = jest.spyOn(cdcService.schema, 'get')
      const screenSetsSpy = jest.spyOn(cdcService.screenSets, 'get')
      const smsSpy = jest.spyOn(cdcService.sms, 'get')
      const channelSpy = jest.spyOn(cdcService.communication, 'get')
      const topicSpy = jest.spyOn(cdcService.topic, 'searchTopics')
      const webhookSpy = jest.spyOn(cdcService.webhook, 'get')
      const consentSpy = jest.spyOn(cdcService.consentManager, 'getConsentsAndLegalStatements')
      const socialSpy = jest.spyOn(cdcService.social, 'get')
      const recaptchaSpy = jest.spyOn(cdcService.recaptcha, 'get')
      axios
        .mockResolvedValueOnce({ data: channelsExpectedResponse })
        .mockResolvedValueOnce({ data: expectedSchemaResponse })
        .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
        .mockResolvedValueOnce({ data: { ...getConsentStatementExpectedResponse, preferences: getConsentStatementExpectedResponse.preferences } })
        .mockResolvedValueOnce({ data: { ...getLegalStatementExpectedResponse, legalStatements: getLegalStatementExpectedResponse.legalStatements } })
        .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
        .mockResolvedValueOnce({ data: getPolicyConfig })
        .mockResolvedValueOnce({ data: getSocialsProviders('APP KEY') })
        .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
        .mockResolvedValueOnce({ data: getSiteConfig })
        .mockResolvedValueOnce({ data: getSearchDataflowsExpectedResponse })
        .mockResolvedValueOnce({ data: getExpectedWebhookResponse() })
        .mockResolvedValueOnce({ data: getSmsExpectedResponse })
        .mockResolvedValueOnce({ data: getExpectedListExtensionResponse() })
        .mockResolvedValueOnce({ data: expectedGetRiskAssessmentResponseOk })
        .mockResolvedValueOnce({ data: expectedGetUnknownLocationNotificationResponseOk })
        .mockResolvedValueOnce({ data: expectedGetRbaPolicyResponseOk })
        .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
        .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
        .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
        .mockResolvedValueOnce({ data: getRecaptchaExpectedResponse() })
        .mockResolvedValueOnce({ data: getRecaptchaPoliciesResponse() })
        .mockResolvedValueOnce({ data: getRiskProvidersResponse() })

      const configs = await cdcService.fetchCDCConfigs()
      const objectCount = countObjects(configs)
      expect(objectCount).toBe(292)
      expect(webSdkSpy).toHaveBeenCalled()
      expect(dataflowSpy).toHaveBeenCalled()
      expect(emailsSpy).toHaveBeenCalled()
      expect(extensionSpy).toHaveBeenCalled()
      expect(policiesSpy).toHaveBeenCalled()
      expect(rbaSpy).toHaveBeenCalled()
      expect(riskAssessmentSpy).toHaveBeenCalled()
      expect(schemaSpy).toHaveBeenCalled()
      expect(smsSpy).toHaveBeenCalled()
      expect(screenSetsSpy).toHaveBeenCalled()
      expect(channelSpy).toHaveBeenCalled()
      expect(topicSpy).toHaveBeenCalled()
      expect(webhookSpy).toHaveBeenCalled()
      expect(consentSpy).toHaveBeenCalled()
      expect(socialSpy).toHaveBeenCalled()
      expect(recaptchaSpy).toHaveBeenCalled()
    })

    it('should fetch all CDC configs - when sms there is no global templates ', async () => {
      jest.spyOn(cdcService.consentManager, 'getConsentsAndLegalStatements').mockResolvedValue(getConsentStatementExpectedResponse)
      jest.spyOn(LegalStatement.prototype, 'getFilteredLegalStatement').mockResolvedValue({
        callId: 'ea4861dc2cab4c01ab265ffe3eab6c71',
        errorCode: 0,
        apiVersion: 2,
        statusCode: 200,
        statusReason: 'OK',
        time: '2024-08-30T08:22:37.389Z',
        legalStatements: {
          versions: {
            2: {
              purpose: 'Updated terms',
              LegalStatementStatus: 'Published',
            },
            1: {
              purpose: 'Initial terms',
              LegalStatementStatus: 'Archived',
            },
          },
        },
      })

      const webSdkSpy = jest.spyOn(cdcService.webSdk, 'get')
      const dataflowSpy = jest.spyOn(cdcService.dataflow, 'search')
      const emailsSpy = jest.spyOn(cdcService.emails, 'get')
      const extensionSpy = jest.spyOn(cdcService.extension, 'get')
      const policiesSpy = jest.spyOn(cdcService.policies, 'get')
      const rbaSpy = jest.spyOn(cdcService.rba, 'get')
      const riskAssessmentSpy = jest.spyOn(cdcService.riskAssessment, 'get')
      const schemaSpy = jest.spyOn(cdcService.schema, 'get')
      const screenSetsSpy = jest.spyOn(cdcService.screenSets, 'get')
      const smsSpy = jest.spyOn(cdcService.sms, 'get')
      const channelSpy = jest.spyOn(cdcService.communication, 'get')
      const topicSpy = jest.spyOn(cdcService.topic, 'searchTopics')
      const webhookSpy = jest.spyOn(cdcService.webhook, 'get')
      const consentSpy = jest.spyOn(cdcService.consentManager, 'getConsentsAndLegalStatements')
      const socialSpy = jest.spyOn(cdcService.social, 'get')
      const recaptchaSpy = jest.spyOn(cdcService.recaptcha, 'get')
      const smsExpectedResponseWithNoTemplates = { ...getSmsExpectedResponse }
      delete smsExpectedResponseWithNoTemplates.templates.tfa.templatesPerCountryCode
      axios
        .mockResolvedValueOnce({ data: channelsExpectedResponse })
        .mockResolvedValueOnce({ data: expectedSchemaResponse })
        .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
        .mockResolvedValueOnce({ data: { ...getConsentStatementExpectedResponse, preferences: getConsentStatementExpectedResponse.preferences } })
        .mockResolvedValueOnce({ data: { ...getLegalStatementExpectedResponse, legalStatements: getLegalStatementExpectedResponse.legalStatements } })
        .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
        .mockResolvedValueOnce({ data: getPolicyConfig })
        .mockResolvedValueOnce({ data: getSocialsProviders('APP KEY') })
        .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
        .mockResolvedValueOnce({ data: getSiteConfig })
        .mockResolvedValueOnce({ data: getSearchDataflowsExpectedResponse })
        .mockResolvedValueOnce({ data: getExpectedWebhookResponse() })
        .mockResolvedValueOnce({ data: smsExpectedResponseWithNoTemplates })
        .mockResolvedValueOnce({ data: getExpectedListExtensionResponse() })
        .mockResolvedValueOnce({ data: expectedGetRiskAssessmentResponseOk })
        .mockResolvedValueOnce({ data: expectedGetUnknownLocationNotificationResponseOk })
        .mockResolvedValueOnce({ data: expectedGetRbaPolicyResponseOk })
        .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
        .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
        .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
        .mockResolvedValueOnce({ data: getRecaptchaExpectedResponse() })
        .mockResolvedValueOnce({ data: getRecaptchaPoliciesResponse() })
        .mockResolvedValueOnce({ data: getRiskProvidersResponse() })

      const configs = await cdcService.fetchCDCConfigs()
      const ammountOfResponses = countObjects(configs)
      expect(smsExpectedResponseWithNoTemplates.templates.tfa.templatesPerCountryCode).toEqual({})
      expect(smsExpectedResponseWithNoTemplates.templates.otp.templatesPerCountryCode).toEqual({})
      expect(ammountOfResponses).toBe(288)
      expect(webSdkSpy).toHaveBeenCalled()
      expect(dataflowSpy).toHaveBeenCalled()
      expect(emailsSpy).toHaveBeenCalled()
      expect(extensionSpy).toHaveBeenCalled()
      expect(policiesSpy).toHaveBeenCalled()
      expect(rbaSpy).toHaveBeenCalled()
      expect(riskAssessmentSpy).toHaveBeenCalled()
      expect(schemaSpy).toHaveBeenCalled()
      expect(smsSpy).toHaveBeenCalled()
      expect(screenSetsSpy).toHaveBeenCalled()
      expect(channelSpy).toHaveBeenCalled()
      expect(topicSpy).toHaveBeenCalled()
      expect(webhookSpy).toHaveBeenCalled()
      expect(consentSpy).toHaveBeenCalled()
      expect(socialSpy).toHaveBeenCalled()
      expect(recaptchaSpy).toHaveBeenCalled()
    })

    it('should apply commit config correctly', async () => {
      const webSdkSpy = jest.spyOn(cdcService.webSdk, 'set')
      const setSiteEmailsWithDataCenterMock = jest.fn()
      jest.spyOn(cdcService.emails, 'getEmail').mockReturnValue({
        setSiteEmailsWithDataCenter: setSiteEmailsWithDataCenterMock,
      })
      const extensionSpy = jest.spyOn(cdcService.extension, 'set')
      const policiesSpy = jest.spyOn(cdcService.policies, 'set')
      const screenSetsSpy = jest.spyOn(cdcService.screenSets, 'set')
      const channelsSpy = jest.spyOn(cdcService.communication, 'setChannels')
      const topicSpy = jest.spyOn(cdcService.communication, 'setTopics')
      const schemaSpy = jest.spyOn(cdcService.schema, 'set')
      axios
        .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
        .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
        .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
        .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
        .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
        .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
        .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
        .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
        .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
        .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
        .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
        .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
        .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
        .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
        .mockResolvedValueOnce({ data: expectedGigyaResponseOk })

      const mockFiles = [
        { filename: 'src/versionControl/webSdk.json', content: getSiteConfig },
        { filename: 'src/versionControl/emails.json', content: getEmailsExpectedResponseWithMinimumTemplates() },
        { filename: 'src/versionControl/extension.json', content: { result: [{ key: 'value' }] } },
        { filename: 'src/versionControl/policies.json', content: { key: 'value' } },
        { filename: 'src/versionControl/rba.json', content: expectedGetRbaPolicyResponseOk },
        { filename: 'src/versionControl/schema.json', content: expectedSchemaResponse },
        { filename: 'src/versionControl/screenSets.json', content: { screenSets: [{ key: 'value' }] } },
        { filename: 'src/versionControl/sms.json', content: { templates: { key: 'value' } } },
        { filename: 'src/versionControl/channel.json', content: channelsExpectedResponse }, // Changed from communication.json to channel.json
        { filename: 'src/versionControl/topic.json', content: topicsExpectedResponse },
        { filename: 'src/versionControl/consent.json', content: { key: 'value' } },
        { filename: 'src/versionControl/social.json', content: { key: 'value' } },
        { filename: 'src/versionControl/dataflow.json', content: getEmptyDataflowResponse() },
      ]
      await cdcService.applyCommitConfig(mockFiles)
      expect(webSdkSpy).toHaveBeenCalled()
      expect(webSdkSpy.mock.calls.length).toBe(1)
      expect(setSiteEmailsWithDataCenterMock).toHaveBeenCalled()
      expect(setSiteEmailsWithDataCenterMock.mock.calls.length).toBe(9)
      expect(extensionSpy).toHaveBeenCalled()
      expect(extensionSpy.mock.calls.length).toBe(1)
      expect(policiesSpy).toHaveBeenCalled()
      expect(policiesSpy.mock.calls.length).toBe(1)
      expect(screenSetsSpy).toHaveBeenCalled()
      expect(screenSetsSpy.mock.calls.length).toBe(1)
      expect(channelsSpy).toHaveBeenCalled()
      expect(channelsSpy.mock.calls.length).toBe(1)
      expect(topicSpy).toHaveBeenCalled()
      expect(topicSpy.mock.calls.length).toBe(1)
      expect(schemaSpy).toHaveBeenCalled()
      expect(schemaSpy.mock.calls.length).toBe(5)
    })
  })
})

function countObjects(object) {
  let count = 0

  function recursiveCount(innerObj) {
    if (typeof innerObj === 'object' && innerObj !== null) {
      count++
      for (const key in innerObj) {
        if (innerObj.hasOwnProperty(key)) {
          recursiveCount(innerObj[key])
        }
      }
    }
  }

  recursiveCount(object)
  return count
}
