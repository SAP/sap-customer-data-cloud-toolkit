import Info from './info'
import * as CommonTestData from '../../servicesDataTest'
import { getExpectedSchemaResponseExcept, getInfoExpectedResponse } from './dataTest'
import axios from 'axios'
import { expectedSchemaResponse } from '../schema/dataTest'
import { expectedGigyaResponseInvalidAPI } from '../../servicesDataTest'
import { getSocialsProviders } from '../social/dataTest'
import { getSmsExpectedResponse } from '../../sms/dataTest'
import { getEmailsExpectedResponse } from '../../emails/dataTest'
import { getSiteConfig } from '../websdk/dataTest'
import { getPolicyConfig } from '../policies/dataTest'
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
} from '../dataTest'
import { getExpectedScreenSetResponse } from '../screenset/dataTest'
import { getConsentStatementExpectedResponse, getConsentStatementNotMigratedResponse } from '../consent/dataTest'
import { channelsExpectedResponse, topicsExpectedResponse } from '../communication/dataTest'

jest.mock('axios')

describe('Info test suite', () => {
  const apiKey = 'apiKey'
  const socialsKeys = 'APP KEY'
  const info = new Info(CommonTestData.credentials, apiKey, 'eu1')
  test('get all info successfully', async () => {
    axios
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
      .mockResolvedValueOnce({ data: getPolicyConfig })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: getSiteConfig })
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: channelsExpectedResponse })
      .mockResolvedValueOnce({ data: topicsExpectedResponse })

    const response = await info.get()
    const expectedResponse = getInfoExpectedResponse(false)

    expect(response).toEqual(expectedResponse)
  })

  test('get all info unsuccessfully', async () => {
    axios
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, schemaId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, 'screenSet', apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, policyId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, socialIdentitiesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, smsTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, webSdkId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, consentId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, channelId, apiKey) })

    await expect(info.get()).rejects.toEqual([getExpectedResponseWithContext(expectedGigyaResponseInvalidAPI, schemaId, apiKey)])
  })

  test('get info except profileSchema successfully', async () => {
    const mockedResponse = getExpectedSchemaResponseExcept(['profileSchema'])
    axios
      .mockResolvedValueOnce({ data: mockedResponse })
      .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
      .mockResolvedValueOnce({ data: getPolicyConfig })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: getSiteConfig })
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: channelsExpectedResponse })
      .mockResolvedValueOnce({ data: topicsExpectedResponse })
    const response = await info.get()
    const expectedResponse = JSON.parse(JSON.stringify(getInfoExpectedResponse(false)))
    expectedResponse[0].branches.splice(1, 1) // remove schema.profileSchema
    expect(response).toEqual(expectedResponse)
  })

  test('get info except schema successfully', async () => {
    const mockedResponse = getExpectedSchemaResponseExcept([schemaId, profileId, subscriptionsId])
    axios
      .mockResolvedValueOnce({ data: mockedResponse })
      .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
      .mockResolvedValueOnce({ data: getPolicyConfig })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: getSiteConfig })
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: channelsExpectedResponse })
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
      .mockResolvedValueOnce({ data: mockedResponse })
      .mockResolvedValueOnce({ data: getPolicyConfig })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: getSiteConfig })
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: channelsExpectedResponse })
      .mockResolvedValueOnce({ data: topicsExpectedResponse })
    const response = await info.get()
    const expectedResponse = JSON.parse(JSON.stringify(getInfoExpectedResponse(false)))
    expectedResponse.splice(1, 1) // remove screen sets
    expect(response).toEqual(expectedResponse)
  })

  test('get info except social successfully', async () => {
    axios
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
      .mockResolvedValueOnce({ data: getPolicyConfig })
      .mockResolvedValueOnce({ data: getSocialsProviders('') })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: getSiteConfig })
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: channelsExpectedResponse })
      .mockResolvedValueOnce({ data: topicsExpectedResponse })
    const response = await info.get()
    const expectedResponse = JSON.parse(JSON.stringify(getInfoExpectedResponse(false)))
    expectedResponse.splice(3, 1) // remove social
    expect(response).toEqual(expectedResponse)
  })

  test('get info except sms successfully', async () => {
    const mockedResponse = JSON.parse(JSON.stringify(getSmsExpectedResponse))
    delete mockedResponse.templates
    axios
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
      .mockResolvedValueOnce({ data: getPolicyConfig })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: mockedResponse })
      .mockResolvedValueOnce({ data: getSiteConfig })
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: channelsExpectedResponse })
      .mockResolvedValueOnce({ data: topicsExpectedResponse })
    const response = await info.get()
    const expectedResponse = JSON.parse(JSON.stringify(getInfoExpectedResponse(false)))
    expectedResponse.splice(5, 1) // remove smsTemplates
    expect(response).toEqual(expectedResponse)
  })

  test('get info except web sdk successfully', async () => {
    const mockedResponse = JSON.parse(JSON.stringify(getSiteConfig))
    delete mockedResponse.globalConf
    axios
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
      .mockResolvedValueOnce({ data: getPolicyConfig })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: mockedResponse })
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: channelsExpectedResponse })
      .mockResolvedValueOnce({ data: topicsExpectedResponse })
    const response = await info.get()
    const expectedResponse = JSON.parse(JSON.stringify(getInfoExpectedResponse(false)))
    expectedResponse.splice(6, 1) // remove web sdk
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
      .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
      .mockResolvedValueOnce({ data: getPolicyConfig })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: getSiteConfig })
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: mockedResponse })
    const response = await info.get()
    const expectedResponse = JSON.parse(JSON.stringify(getInfoExpectedResponse(false)))
    expectedResponse.splice(8, 1) // remove communication topics
    expect(response).toEqual(expectedResponse)
  })

  async function testConsents(serverResponse) {
    const mockedResponse = JSON.parse(JSON.stringify(serverResponse))
    mockedResponse.preferences = {}
    axios
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
      .mockResolvedValueOnce({ data: getPolicyConfig })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: getSiteConfig })
      .mockResolvedValueOnce({ data: mockedResponse })
      .mockResolvedValueOnce({ data: channelsExpectedResponse })
      .mockResolvedValueOnce({ data: topicsExpectedResponse })
    const response = await info.get()
    const expectedResponse = JSON.parse(JSON.stringify(getInfoExpectedResponse(false)))
    expectedResponse.splice(7, 1) // remove consent
    expect(response).toEqual(expectedResponse)
  }
})
