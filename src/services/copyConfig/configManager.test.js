/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import * as CommonTestData from '../servicesDataTest.js'
import ConfigManager from './configManager.js'
import axios from 'axios'
import * as ConfiguratorTestData from '../configurator/dataTest.js'
import { getInfoExpectedResponse } from './info/dataTest.js'
import { errorCallback, verifyAllResponsesAreOk, expectedGigyaResponseOk, expectedGigyaResponseInvalidAPI } from '../servicesDataTest.js'
import { expectedSchemaResponse } from './schema/dataTest.js'
import { getSocialsProviders } from './social/dataTest.js'
import { getSiteConfig } from './websdk/dataTest.js'
import { getSmsExpectedResponse } from '../sms/dataTest.js'
import { getEmailsExpectedResponse } from '../emails/dataTest.js'
import { getExpectedScreenSetResponse } from './screenset/dataTest.js'
import { getPolicyConfig } from './policies/dataTest.js'
import {
  getResponseWithContext,
  profileId,
  schemaId,
  smsTemplatesId,
  socialIdentitiesId,
  emailTemplatesId,
  webSdkId,
  policyId,
  subscriptionsId,
  consentId,
  channelId,
  topicId,
  internalSchemaId,
  addressesSchemaId,
  rbaRiskAssessmentId,
  rbaUnknownLocationNotificationId,
  rbaPolicyId,
} from './dataTest.js'
import { getConsentStatementExpectedResponse, getNoConsentStatementExpectedResponse } from './consent/dataTest.js'
import { channelsExpectedResponse, topicsExpectedResponse } from './communication/dataTest.js'
import Sorter from './sorter.js'
import { getExpectedWebhookResponse } from './webhook/dataTest.js'
import { getExpectedListExtensionResponse } from './extension/dataTest.js'
import { getEmptyDataflowResponse, getSearchDataflowsExpectedResponse } from './dataflow/dataTest.js'
import { expectedGetRbaPolicyResponseOk, expectedGetRiskAssessmentResponseOk, expectedGetUnknownLocationNotificationResponseOk } from './rba/dataTest.js'
import { getRecaptchaExpectedResponse, getRiskProvidersResponse, getRecaptchaPoliciesResponse } from '../recaptcha/dataTest.js'

jest.mock('axios')

const apiKey = 'apiKey'
const screenSetId = 'screenSet'

describe('Config Manager test suite', () => {
  let configManager

  beforeEach(() => {
    configManager = new ConfigManager(CommonTestData.credentials, apiKey)
  })
  const socialsKeys = 'APP KEY'

  test('get configuration successfully', async () => {
    axios
      .mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) })
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: channelsExpectedResponse })
      .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
      .mockResolvedValueOnce({ data: getPolicyConfig })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: getSiteConfig })
      .mockResolvedValueOnce({ data: getSearchDataflowsExpectedResponse })
      .mockResolvedValueOnce({ data: getEmptyDataflowResponse() })
      .mockResolvedValueOnce({ data: getExpectedWebhookResponse() })
      .mockResolvedValueOnce({ data: getExpectedListExtensionResponse() })
      .mockResolvedValueOnce({ data: expectedGetRiskAssessmentResponseOk })
      .mockResolvedValueOnce({ data: expectedGetUnknownLocationNotificationResponseOk })
      .mockResolvedValueOnce({ data: expectedGetRbaPolicyResponseOk })
      .mockResolvedValueOnce({ data: getRecaptchaExpectedResponse() })
      .mockResolvedValueOnce({ data: getRecaptchaPoliciesResponse() })
      .mockResolvedValueOnce({ data: getRiskProvidersResponse() })
    const response = await configManager.getConfiguration()
    expect(response).toEqual(getInfoExpectedResponse(false))
  })

  test('get configuration error getting data center', async () => {
    const mockedResponse = ConfiguratorTestData.scExpectedGigyaResponseNotOk
    const err = {
      message: mockedResponse.errorMessage,
      code: mockedResponse.errorCode,
      details: mockedResponse.errorDetails,
    }
    axios.mockResolvedValueOnce({ data: mockedResponse })
    let errorThrown
    await configManager
      .getConfiguration()
      .then(() => {})
      .catch((error) => {
        errorThrown = error
      })
      .finally(() => {
        errorCallback(errorThrown[0], err)
        verifyAllContext(errorThrown)
      })
  })

  test('get configuration error getting schema info', async () => {
    const mockedResponse = expectedGigyaResponseInvalidAPI
    axios
      .mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, 'schema', apiKey) })
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: channelsExpectedResponse })
      .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
      .mockResolvedValueOnce({ data: getPolicyConfig })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: getSiteConfig })
      .mockResolvedValueOnce({ data: getSearchDataflowsExpectedResponse })
      .mockResolvedValueOnce({ data: getEmptyDataflowResponse() })
      .mockResolvedValueOnce({ data: getExpectedWebhookResponse() })
      .mockResolvedValueOnce({ data: getExpectedListExtensionResponse() })
    const err = {
      message: mockedResponse.errorMessage,
      code: mockedResponse.errorCode,
      details: mockedResponse.errorDetails,
    }
    let errorThrown
    await configManager
      .getConfiguration()
      .then(() => {})
      .catch((error) => {
        errorThrown = error
      })
      .finally(() => {
        errorCallback(errorThrown[0], err)
        verifyAllContext(errorThrown)
      })
  })

  test('copy all successfully', async () => {
    const mockedDataCenterResponse = ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(1)
    axios
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: mockedDataCenterResponse }) // due to ParentChildSorter()
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
      .mockResolvedValueOnce({ data: getPolicyConfig })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: getSiteConfig })
      .mockResolvedValueOnce({ data: getNoConsentStatementExpectedResponse() })
      .mockResolvedValueOnce({ data: channelsExpectedResponse })
      .mockResolvedValueOnce({ data: expectedGetRiskAssessmentResponseOk })
      .mockResolvedValueOnce({ data: expectedGetUnknownLocationNotificationResponseOk })
      .mockResolvedValueOnce({ data: expectedGetRbaPolicyResponseOk })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, policyId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, socialIdentitiesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, channelId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, channelId, apiKey) })
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, smsTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, webSdkId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, rbaRiskAssessmentId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, rbaUnknownLocationNotificationId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, rbaPolicyId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, schemaId, apiKey) })
      .mockResolvedValueOnce({ data: topicsExpectedResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, topicId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, topicId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, profileId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, subscriptionsId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, internalSchemaId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, addressesSchemaId, apiKey) })

    const infoExpectedResponse = getInfoExpectedResponse(true)
    disableFeatures(infoExpectedResponse)
    const response = await configManager.copy([apiKey], infoExpectedResponse)

    expect(response.length).toEqual(37)
    verifyAllResponsesAreOk(response)
    verifyAllContext(response)
  })

  test('copy data schema only successfully to child site', async () => {
    await testSchemaOption(schemaId, 0)
  })

  test('copy data schema only successfully to parent site', async () => {
    await testSchemaOption(schemaId, 1)
  })

  test('copy profile schema only successfully', async () => {
    await testSchemaOption(profileId, 1)
  })

  test('copy all unsuccessfully - error getting origin data center', async () => {
    const mockedResponse = ConfiguratorTestData.scExpectedGigyaResponseNotOk
    const err = {
      message: mockedResponse.errorMessage,
      code: mockedResponse.errorCode,
      details: mockedResponse.errorDetails,
    }
    axios.mockResolvedValueOnce({ data: mockedResponse })
    let errorThrown
    await configManager
      .copy([apiKey], getInfoExpectedResponse(true))
      .then(() => {})
      .catch((error) => {
        errorThrown = error
      })
      .finally(() => {
        errorCallback(errorThrown[0], err)
        verifyAllContext(errorThrown)
      })
  })

  test('copy all unsuccessfully - error getting destination data center', async () => {
    const mockedResponse = ConfiguratorTestData.scExpectedGigyaResponseNotOk
    const mockedDataCenterResponse = ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0)
    axios
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: mockedDataCenterResponse }) // due to ParentChildSorter()
      .mockResolvedValueOnce({ data: mockedResponse })
    const response = await configManager.copy([apiKey], getInfoExpectedResponse(true))
    expect(response.length).toEqual(1)
    expect(response[0]).toEqual(mockedResponse)
  })

  test('copy all unsuccessfully - error getting info', async () => {
    const mockedDataCenterResponse = ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(1)
    axios
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: mockedDataCenterResponse }) // due to ParentChildSorter()
      .mockResolvedValueOnce({ data: getResponseWithContext(ConfiguratorTestData.scExpectedGigyaResponseNotOk, schemaId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(ConfiguratorTestData.scExpectedGigyaResponseNotOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(ConfiguratorTestData.scExpectedGigyaResponseNotOk, policyId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(ConfiguratorTestData.scExpectedGigyaResponseNotOk, socialIdentitiesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(ConfiguratorTestData.scExpectedGigyaResponseNotOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(ConfiguratorTestData.scExpectedGigyaResponseNotOk, smsTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(ConfiguratorTestData.scExpectedGigyaResponseNotOk, webSdkId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(ConfiguratorTestData.scExpectedGigyaResponseNotOk, consentId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(ConfiguratorTestData.scExpectedGigyaResponseNotOk, channelId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(ConfiguratorTestData.scExpectedGigyaResponseNotOk, rbaRiskAssessmentId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(ConfiguratorTestData.scExpectedGigyaResponseNotOk, rbaUnknownLocationNotificationId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(ConfiguratorTestData.scExpectedGigyaResponseNotOk, rbaPolicyId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(ConfiguratorTestData.scExpectedGigyaResponseNotOk, topicId, apiKey) })

    await executeCopyAllUnsuccessfully(ConfiguratorTestData.scExpectedGigyaResponseNotOk, 13)
  })

  test('copy all unsuccessfully - error setting info', async () => {
    const mockedResponse = ConfiguratorTestData.scExpectedGigyaResponseNotOk
    const mockedDataCenterResponse = ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(1)
    axios
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: mockedDataCenterResponse }) // due to ParentChildSorter()
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
      .mockResolvedValueOnce({ data: getPolicyConfig })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: getSiteConfig })
      .mockResolvedValueOnce({ data: getNoConsentStatementExpectedResponse() })
      .mockResolvedValueOnce({ data: channelsExpectedResponse })
      .mockResolvedValueOnce({ data: expectedGetRiskAssessmentResponseOk })
      .mockResolvedValueOnce({ data: expectedGetUnknownLocationNotificationResponseOk })
      .mockResolvedValueOnce({ data: expectedGetRbaPolicyResponseOk })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, policyId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, socialIdentitiesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, channelId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, channelId, apiKey) })
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, smsTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, webSdkId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, rbaRiskAssessmentId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, rbaUnknownLocationNotificationId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, rbaPolicyId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, schemaId, apiKey) })
      .mockResolvedValueOnce({ data: topicsExpectedResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, topicId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, topicId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, profileId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, subscriptionsId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, internalSchemaId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, addressesSchemaId, apiKey) })

    const infoExpectedResponse = getInfoExpectedResponse(true)
    disableFeatures(infoExpectedResponse)
    await executeCopyAllUnsuccessfully(mockedResponse, 37)
  })

  test('copy all unsuccessfully - error on single copy', async () => {
    const mockedResponse = ConfiguratorTestData.scExpectedGigyaResponseNotOk
    const mockedDataCenterResponse = ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(1)
    axios
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: mockedDataCenterResponse }) // due to ParentChildSorter()
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
      .mockResolvedValueOnce({ data: getPolicyConfig })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: getSiteConfig })
      .mockResolvedValueOnce({ data: getNoConsentStatementExpectedResponse() })
      .mockResolvedValueOnce({ data: channelsExpectedResponse })
      .mockResolvedValueOnce({ data: expectedGetRiskAssessmentResponseOk })
      .mockResolvedValueOnce({ data: expectedGetUnknownLocationNotificationResponseOk })
      .mockResolvedValueOnce({ data: expectedGetRbaPolicyResponseOk })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, policyId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, socialIdentitiesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, channelId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, channelId, apiKey) })
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, smsTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, webSdkId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, rbaRiskAssessmentId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, rbaUnknownLocationNotificationId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, rbaPolicyId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, schemaId, apiKey) })
      .mockResolvedValueOnce({ data: topicsExpectedResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, topicId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, topicId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, profileId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, subscriptionsId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, internalSchemaId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, addressesSchemaId, apiKey) })

    const infoExpectedResponse = getInfoExpectedResponse(true)
    disableFeatures(infoExpectedResponse)
    const response = await configManager.copy([apiKey], infoExpectedResponse)
    expect(response.length).toEqual(37)
    const errorResponseIndex = 0
    CommonTestData.verifyResponseIsNotOk(response[errorResponseIndex], mockedResponse)
    expect(response[errorResponseIndex].context.id).toEqual(schemaId)
    expect(response[errorResponseIndex].context.targetApiKey).toEqual(apiKey)
    verifyAllResponsesAreOk(response.slice(1))
    verifyAllContext(response)
  })

  test('copy to several targets successfully, with default sorter', async () => {
    const mockedDataCenterResponse = { data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(1) }
    axios
      .mockResolvedValueOnce(mockedDataCenterResponse)
      .mockResolvedValueOnce(mockedDataCenterResponse)
      .mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, smsTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, smsTemplatesId, apiKey) })

    const options = getInfoExpectedResponse(false)
    options[5].value = true
    const response = await configManager.copy([apiKey, 'childApiKey'], options, new Sorter())

    expect(response.length).toEqual(2)
    verifyAllResponsesAreOk(response)
    verifyAllContext(response)
  })

  test('copy to several targets successfully, with ParentChild sorter', async () => {
    const mockedDataCenterResponse = { data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(1) }
    axios
      .mockResolvedValueOnce(mockedDataCenterResponse) // origin site info
      .mockResolvedValueOnce(mockedDataCenterResponse) // target site info to know if it's parent
      .mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }) // target site info to know if it's parent or child
      .mockResolvedValueOnce(mockedDataCenterResponse) // target parent site info
      .mockResolvedValueOnce({ data: getSmsExpectedResponse }) // get sms
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, smsTemplatesId, apiKey) }) // set sms
      .mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }) // target child site info
      .mockResolvedValueOnce({ data: getSmsExpectedResponse }) // get sms
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, smsTemplatesId, apiKey) }) // set sms

    const options = getInfoExpectedResponse(false)
    options[5].value = true
    const response = await configManager.copy([apiKey, 'childApiKey'], options)

    expect(response.length).toEqual(2)
    verifyAllResponsesAreOk(response)
    verifyAllContext(response)
  })

  async function executeCopyAllUnsuccessfully(mockedResponse, numberOfExpectedResponses) {
    const infoExpectedResponse = getInfoExpectedResponse(true)
    disableFeatures(infoExpectedResponse)
    const response = await configManager.copy([apiKey], infoExpectedResponse)
    expect(response.length).toEqual(numberOfExpectedResponses)
    for (const resp of response) {
      CommonTestData.verifyResponseIsNotOk(resp, mockedResponse)
    }
    verifyAllContext(response)
  }

  function verifyAllContext(responses) {
    for (const response of responses) {
      expect(response.context.id).toBeDefined()
      expect(response.context.targetApiKey).toBeDefined()
    }
  }

  async function testSchemaOption(option, numberOfChildren) {
    const schemaOption = {
      id: 'schema',
      name: 'schema',
      value: false,
      branches: [
        {
          id: schemaId,
          name: schemaId,
          value: schemaId === option,
        },
        {
          id: profileId,
          name: profileId,
          value: profileId === option,
        },
        {
          id: subscriptionsId,
          name: subscriptionsId,
          value: subscriptionsId === option,
        },
      ],
    }
    const mockedDataCenterResponse = ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(numberOfChildren)
    axios
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: mockedDataCenterResponse }) // due to ParentChildSorter()
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
    axios.mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, option, apiKey) })
    if (numberOfChildren === 0) {
      axios.mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, option, apiKey) })
    }
    const response = await configManager.copy([apiKey], [schemaOption])
    expect(response.length).toEqual(1)
    verifyAllResponsesAreOk(response)
    verifyAllContext(response)
  }
})

function disableFeatures(infoExpectedResponse) {
  disableDataflows(infoExpectedResponse)
  disableWebhooks(infoExpectedResponse)
  disableExtensions(infoExpectedResponse)
  disableRecaptcha(infoExpectedResponse)
}

function disableWebhooks(infoExpectedResponse) {
  disableFeature(infoExpectedResponse, 10)
}

function disableExtensions(infoExpectedResponse) {
  disableFeature(infoExpectedResponse, 11)
}

function disableDataflows(infoExpectedResponse) {
  disableFeature(infoExpectedResponse, 9)
}

function disableRecaptcha(infoExpectedResponse) {
  disableFeature(infoExpectedResponse, 13)
}

function disableFeature(infoExpectedResponse, featureIndex) {
  infoExpectedResponse[featureIndex].value = false
  if (infoExpectedResponse[featureIndex].branches) {
    infoExpectedResponse[featureIndex].branches[0].value = false
    infoExpectedResponse[featureIndex].branches[1].value = false
  }
  return
}
