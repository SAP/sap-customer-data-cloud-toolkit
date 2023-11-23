/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import Info from './info.js'
import * as CommonTestData from '../../servicesDataTest.js'
import { getExpectedSchemaResponseExcept, getInfoExpectedResponse } from './dataTest.js'
import axios from 'axios'
import { expectedSchemaResponse } from '../schema/dataTest.js'
import { expectedGigyaResponseInvalidAPI } from '../../servicesDataTest.js'
import { getSocialsProviders } from '../social/dataTest.js'
import { getSmsExpectedResponse } from '../../sms/dataTest.js'
import { getEmailsExpectedResponse } from '../../emails/dataTest.js'
import { getSiteConfig } from '../websdk/dataTest.js'
import { getPolicyConfig } from '../policies/dataTest.js'
import {
  getExpectedResponseWithContext,
  getResponseWithContext,
  schemaId,
  smsTemplatesId,
  socialIdentitiesId,
  emailTemplatesId,
  webSdkId,
  policyId,
  profileId,
  subscriptionsId,
  consentId,
  channelId,
  internalSchemaId,
} from '../dataTest.js'
import { getExpectedScreenSetResponse } from '../screenset/dataTest.js'
import { getConsentStatementExpectedResponse, getConsentStatementNotMigratedResponse } from '../consent/dataTest.js'
import { channelsExpectedResponse, topicsExpectedResponse } from '../communication/dataTest.js'
import { getExpectedWebhookResponse } from '../webhook/dataTest.js'
import { getExpectedListExtensionResponse } from '../extension/dataTest.js'
import { getEmptyDataflowResponse, getSearchDataflowsExpectedResponse } from '../dataflow/dataTest.js'

jest.mock('axios')

describe('Info test suite', () => {
  const apiKey = 'apiKey'
  const socialsKeys = 'APP KEY'
  const info = new Info(CommonTestData.credentials, apiKey, 'eu1')
  test('get all info successfully', async () => {
    axios
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
      .mockResolvedValueOnce({ data: topicsExpectedResponse })

    const response = await info.get()
    const expectedResponse = getInfoExpectedResponse(false)

    expect(response).toEqual(expectedResponse)
  })

  test('get all info unsuccessfully', async () => {
    axios
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, schemaId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, consentId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, channelId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, schemaId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, 'screenSet', apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, policyId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, socialIdentitiesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, smsTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, webSdkId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, 'dataflows', apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, 'dataflows', apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, 'extensions', apiKey) })

    await expect(info.get()).rejects.toEqual([getExpectedResponseWithContext(expectedGigyaResponseInvalidAPI, schemaId, apiKey)])
  })

  test('get info except profileSchema successfully', async () => {
    const mockedResponse = getExpectedSchemaResponseExcept(['profileSchema'])
    axios
      .mockResolvedValueOnce({ data: mockedResponse })
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
      .mockResolvedValueOnce({ data: topicsExpectedResponse })
    const response = await info.get()
    const expectedResponse = JSON.parse(JSON.stringify(getInfoExpectedResponse(false)))
    expectedResponse[0].branches.splice(1, 1) // remove schema.profileSchema
    expect(response).toEqual(expectedResponse)
  })

  test('get info except schema successfully', async () => {
    const mockedResponse = getExpectedSchemaResponseExcept([schemaId, profileId, subscriptionsId, internalSchemaId])
    axios
      .mockResolvedValueOnce({ data: mockedResponse })
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
      .mockResolvedValueOnce({ data: topicsExpectedResponse })

    const response = await info.get()
    const expectedResponse = JSON.parse(JSON.stringify(getInfoExpectedResponse(false)))
    expectedResponse.splice(0, 1) // remove schema
    expect(response).toEqual(expectedResponse)
  })

  test('get info except screen sets successfully', async () => {
    const mockedResponse = JSON.parse(JSON.stringify(getExpectedScreenSetResponse()))
    mockedResponse.screenSets = []
    axios
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: channelsExpectedResponse })
      .mockResolvedValueOnce({ data: mockedResponse })
      .mockResolvedValueOnce({ data: getPolicyConfig })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: getSiteConfig })
      .mockResolvedValueOnce({ data: getSearchDataflowsExpectedResponse })
      .mockResolvedValueOnce({ data: getEmptyDataflowResponse() })
      .mockResolvedValueOnce({ data: getExpectedWebhookResponse() })
      .mockResolvedValueOnce({ data: getExpectedListExtensionResponse() })
      .mockResolvedValueOnce({ data: topicsExpectedResponse })
    const response = await info.get()
    const expectedResponse = JSON.parse(JSON.stringify(getInfoExpectedResponse(false)))
    expectedResponse.splice(3, 1) // remove screen sets
    expect(response).toEqual(expectedResponse)
  })

  test('get info except social successfully', async () => {
    axios
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: channelsExpectedResponse })
      .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
      .mockResolvedValueOnce({ data: getPolicyConfig })
      .mockResolvedValueOnce({ data: getSocialsProviders('') })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: getSiteConfig })
      .mockResolvedValueOnce({ data: getSearchDataflowsExpectedResponse })
      .mockResolvedValueOnce({ data: getEmptyDataflowResponse() })
      .mockResolvedValueOnce({ data: getExpectedWebhookResponse() })
      .mockResolvedValueOnce({ data: getExpectedListExtensionResponse() })
      .mockResolvedValueOnce({ data: topicsExpectedResponse })
    const response = await info.get()
    const expectedResponse = JSON.parse(JSON.stringify(getInfoExpectedResponse(false)))
    expectedResponse.splice(5, 1) // remove social
    expect(response).toEqual(expectedResponse)
  })

  test('get info except sms successfully', async () => {
    const mockedResponse = JSON.parse(JSON.stringify(getSmsExpectedResponse))
    delete mockedResponse.templates
    axios
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: channelsExpectedResponse })
      .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
      .mockResolvedValueOnce({ data: getPolicyConfig })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: mockedResponse })
      .mockResolvedValueOnce({ data: getSiteConfig })
      .mockResolvedValueOnce({ data: getSearchDataflowsExpectedResponse })
      .mockResolvedValueOnce({ data: getEmptyDataflowResponse() })
      .mockResolvedValueOnce({ data: getExpectedWebhookResponse() })
      .mockResolvedValueOnce({ data: getExpectedListExtensionResponse() })
      .mockResolvedValueOnce({ data: topicsExpectedResponse })
    const response = await info.get()
    const expectedResponse = JSON.parse(JSON.stringify(getInfoExpectedResponse(false)))
    expectedResponse.splice(7, 1) // remove smsTemplates
    expect(response).toEqual(expectedResponse)
  })

  test('get info except web sdk successfully', async () => {
    const mockedResponse = JSON.parse(JSON.stringify(getSiteConfig))
    delete mockedResponse.globalConf
    axios
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: channelsExpectedResponse })
      .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
      .mockResolvedValueOnce({ data: getPolicyConfig })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: mockedResponse })
      .mockResolvedValueOnce({ data: getSearchDataflowsExpectedResponse })
      .mockResolvedValueOnce({ data: getEmptyDataflowResponse() })
      .mockResolvedValueOnce({ data: getExpectedWebhookResponse() })
      .mockResolvedValueOnce({ data: getExpectedListExtensionResponse() })
      .mockResolvedValueOnce({ data: topicsExpectedResponse })
    const response = await info.get()
    const expectedResponse = JSON.parse(JSON.stringify(getInfoExpectedResponse(false)))
    expectedResponse.splice(8, 1) // remove web sdk
    expect(response).toEqual(expectedResponse)
  })

  test('get info except consent successfully', async () => {
    await testConsents(getConsentStatementExpectedResponse)
  })

  test('get info except consent successfully, because not migrated', async () => {
    await testConsents(getConsentStatementNotMigratedResponse)
  })

  test('get info except communication topics successfully', async () => {
    const mockedResponse = JSON.parse(JSON.stringify(channelsExpectedResponse))
    mockedResponse.Channels = {}
    axios
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: mockedResponse })
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

    const response = await info.get()
    const expectedResponse = JSON.parse(JSON.stringify(getInfoExpectedResponse(false)))
    expectedResponse.splice(2, 1) // remove communication topics
    expect(response).toEqual(expectedResponse)
  })

  async function testConsents(serverResponse) {
    const mockedResponse = JSON.parse(JSON.stringify(serverResponse))
    mockedResponse.preferences = {}
    axios
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: mockedResponse })
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
      .mockResolvedValueOnce({ data: topicsExpectedResponse })
    const response = await info.get()
    const expectedResponse = JSON.parse(JSON.stringify(getInfoExpectedResponse(false)))
    expectedResponse.splice(1, 1) // remove consent
    expect(response).toEqual(expectedResponse)
  }
})
