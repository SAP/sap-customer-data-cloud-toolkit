/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import axios from 'axios'
import CdcService from './cdcService'
import * as SocialsTestData from '../copyConfig/social/dataTest'
import LegalStatement from '../copyConfig/consent/legalStatement'
import { channelsExpectedResponse, errorResponse, topicsExpectedResponse } from '../copyConfig/communication/dataTest'
import {
  filteredLegalStatementExpectedResponse,
  getConsentStatementExpectedResponse,
  getFilteredLegalStatementExpectedResponse,
  getLegalStatementExpectedResponse
} from '../copyConfig/consent/dataTest'
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
      const sanitizedSchemaResponse = { ...expectedSchemaResponse }
      delete sanitizedSchemaResponse.callId
      delete sanitizedSchemaResponse.statusCode
      delete sanitizedSchemaResponse.statusReason
      delete sanitizedSchemaResponse.errorCode
      delete sanitizedSchemaResponse.time

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

      const mockFiles = getMockFiles(sanitizedSchemaResponse)

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

    it('should fetch all CDC configs - when sms there is no global templates', async () => {
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

      mockAxiosResponses()

      const configs = await cdcService.fetchCDCConfigs()

      expect(smsExpectedResponseWithNoTemplates.templates.tfa.templatesPerCountryCode).toEqual({})
      expect(smsExpectedResponseWithNoTemplates.templates.otp.templatesPerCountryCode).toEqual({})
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

      validateConfigs(configs)
    })

    it('should log errors when applying commit config fails', async () => {
      const setSiteEmailsWithDataCenterMock = jest.fn().mockRejectedValue(new Error('emails error'))
      jest.spyOn(cdcService.emails, 'getEmail').mockReturnValue({
        setSiteEmailsWithDataCenter: setSiteEmailsWithDataCenterMock,
      })

      const mockFiles = getMockFiles()

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
    })

    it('should fetch all CDC configs', async () => {
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

      mockAxiosResponses()

      const configs = await cdcService.fetchCDCConfigs()

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

      validateConfigs(configs)
    })

    it('should capture gigya errors', async () => {
      axios
        .mockResolvedValueOnce({ data: errorResponse })
        .mockResolvedValueOnce({ data: errorResponse })
        .mockResolvedValueOnce({ data: errorResponse })
        .mockResolvedValueOnce({ data: errorResponse })
        .mockResolvedValueOnce({ data: errorResponse })
        .mockResolvedValueOnce({ data: errorResponse })
        .mockResolvedValueOnce({ data: errorResponse })
        .mockResolvedValueOnce({ data: errorResponse })
        .mockResolvedValueOnce({ data: errorResponse })
        .mockResolvedValueOnce({ data: errorResponse })
        .mockResolvedValueOnce({ data: errorResponse })
        .mockResolvedValueOnce({ data: errorResponse })
        .mockResolvedValueOnce({ data: errorResponse })
        .mockResolvedValueOnce({ data: errorResponse })
        .mockResolvedValueOnce({ data: errorResponse })
        .mockResolvedValueOnce({ data: errorResponse })
        .mockResolvedValueOnce({ data: errorResponse })
        .mockResolvedValueOnce({ data: errorResponse })
        .mockResolvedValueOnce({ data: errorResponse })
        .mockResolvedValueOnce({ data: errorResponse })
        .mockResolvedValueOnce({ data: errorResponse })
        .mockResolvedValueOnce({ data: errorResponse })
        .mockResolvedValueOnce({ data: errorResponse })


      const configs = await cdcService.fetchCDCConfigs()

      configs.rba.forEach(rbaConfig => {
        expect(rbaConfig.errorCode).toEqual(10000)
      })
      delete configs.rba
      Object.entries(configs).forEach(([key, value]) => {
          expect(value.errorCode).toEqual(10000)
      })
    })
  })
})

const mockAxiosResponses = () => {
  axios
    .mockResolvedValueOnce({ data: getSiteConfig })
    .mockResolvedValueOnce({ data: getSearchDataflowsExpectedResponse })
    .mockResolvedValueOnce({ data: getEmptyDataflowResponse() })
    .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
    .mockResolvedValueOnce({ data: getExpectedListExtensionResponse() })
    .mockResolvedValueOnce({ data: getPolicyConfig })
    .mockResolvedValueOnce({ data: expectedGetRiskAssessmentResponseOk })
    .mockResolvedValueOnce({ data: getPolicyConfig })
    .mockResolvedValueOnce({ data: expectedGetRbaPolicyResponseOk })
    .mockResolvedValueOnce({ data: expectedGetRiskAssessmentResponseOk })
    .mockResolvedValueOnce({ data: expectedSchemaResponse })
    .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
    .mockResolvedValueOnce({ data: getSmsExpectedResponse })
    .mockResolvedValueOnce({ data: channelsExpectedResponse })
    .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
    .mockResolvedValueOnce({ data: getExpectedWebhookResponse() })
    .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
    .mockResolvedValueOnce({ data: getSocialsProviders('APP KEY') })
    .mockResolvedValueOnce({ data: getRecaptchaExpectedResponse() })
    .mockResolvedValueOnce({ data: getLegalStatementExpectedResponse })
    .mockResolvedValueOnce({ data: getLegalStatementExpectedResponse })
    .mockResolvedValueOnce({ data: getLegalStatementExpectedResponse })
    .mockResolvedValueOnce({ data: getLegalStatementExpectedResponse })
    .mockResolvedValueOnce({ data: getPolicyConfig })
    .mockResolvedValueOnce({ data: getRiskProvidersResponse() })
}



const getMockFiles = (sanitizedSchemaResponse) => {
  return [
    { filename: 'src/versionControl/webSdk.json', content: getSiteConfig },
    { filename: 'src/versionControl/emails.json', content: getEmailsExpectedResponseWithMinimumTemplates() },
    { filename: 'src/versionControl/extension.json', content: { result: [{ key: 'value' }] } },
    { filename: 'src/versionControl/policies.json', content: { key: 'value' } },
    { filename: 'src/versionControl/rba.json', content: expectedGetRbaPolicyResponseOk },
    { filename: 'src/versionControl/schema.json', content: sanitizedSchemaResponse ? sanitizedSchemaResponse: expectedSchemaResponse },
    { filename: 'src/versionControl/screenSets.json', content: { screenSets: [{ key: 'value' }] } },
    { filename: 'src/versionControl/sms.json', content: { templates: { key: 'value' } } },
    { filename: 'src/versionControl/channel.json', content: channelsExpectedResponse },
    { filename: 'src/versionControl/topic.json', content: topicsExpectedResponse },
    { filename: 'src/versionControl/consent.json', content: { key: 'value' } },
    { filename: 'src/versionControl/social.json', content: SocialsTestData.getSocialsProviders('APP KEY') },
    { filename: 'src/versionControl/dataflow.json', content: getEmptyDataflowResponse() },
  ]
}

const validateConfigs = (configs) => {
  expect(configs.webSdk.globalConf).toBeDefined()

  expect(configs.dataflow.resultCount).toEqual(0)

  expect(configs.schema.profileSchema).toBeDefined()
  expect(configs.schema.dataSchema).toBeDefined()
  expect(configs.schema.subscriptionsSchema).toBeDefined()
  expect(configs.schema.internalSchema).toBeDefined()
  expect(configs.schema.addressesSchema).toBeDefined()

  expect(configs.emails.magicLink).toBeDefined()
  expect(configs.emails.codeVerification).toBeDefined()
  expect(configs.emails.emailVerification).toBeDefined()
  expect(configs.emails.emailNotifications).toBeDefined()
  expect(configs.emails.preferencesCenter).toBeDefined()
  expect(configs.emails.doubleOptIn).toBeDefined()
  expect(configs.emails.passwordReset).toBeDefined()
  expect(configs.emails.twoFactorAuth).toBeDefined()
  expect(configs.emails.impossibleTraveler).toBeDefined()
  expect(configs.emails.unknownLocationNotification).toBeDefined()
  expect(configs.emails.passwordResetNotification).toBeDefined()

  expect(configs.extension.result.length).toEqual(2)

  expect(configs.policies.registration).toBeDefined()
  expect(configs.policies.gigyaPlugins).toBeDefined()
  expect(configs.policies.accountOptions).toBeDefined()
  expect(configs.policies.passwordComplexity).toBeDefined()
  expect(configs.policies.security).toBeDefined()
  expect(configs.policies.emailVerification).toBeDefined()
  expect(configs.policies.authentication).toBeDefined()
  expect(configs.policies.doubleOptIn).toBeDefined()
  expect(configs.policies.emailNotifications).toBeDefined()
  expect(configs.policies.passwordReset).toBeDefined()
  expect(configs.policies.profilePhoto).toBeDefined()
  expect(configs.policies.federation).toBeDefined()
  expect(configs.policies.twoFactorAuth).toBeDefined()
  expect(configs.policies.rba).toBeDefined()
  expect(configs.policies.preferencesCenter).toBeDefined()
  expect(configs.policies.codeVerification).toBeDefined()

  expect(configs.rba.length).toEqual(3)

  expect(configs.riskAssessment).toBeDefined()

  expect(configs.screenSets.screenSets.length).toEqual(8)

  expect(configs.sms.templates.tfa).toBeDefined()
  expect(configs.sms.templates.otp).toBeDefined()

  expect(configs.channel.Channels.SMS).toBeDefined()
  expect(configs.channel.Channels.WiFi).toBeDefined()

  expect(configs.topic.resultCount).toEqual(0)

  expect(configs.webhook.webhooks.length).toEqual(2)

  expect(configs.consent.preferences).toBeDefined()

  expect(configs.social.capabilities).toBeDefined()
  expect(configs.social.settings).toBeDefined()
  expect(configs.social.providers).toBeDefined()

  expect(configs.recaptcha.recaptchaConfig.length).toEqual(4)
}