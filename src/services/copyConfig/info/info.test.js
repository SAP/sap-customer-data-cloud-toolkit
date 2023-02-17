import Info from './info'
import * as CommonTestData from '../../servicesDataTest'
import { getExpectedSchemaResponseExcept, getInfoExpectedResponse } from './dataTest'
import axios from 'axios'
import { expectedSchemaResponse } from '../schema/dataTest'
import { expectedGigyaResponseInvalidAPI } from '../../servicesDataTest'
import { getSocialsProviders } from '../social/dataTest'
import { getSmsExpectedResponse } from '../../sms/dataTest'
import { emailTemplatesId, getExpectedResponseWithContext, getResponseWithContext, schemaId, smsTemplatesId, socialIdentitiesId } from '../dataTest'
import { getEmailsExpectedResponse } from '../../emails/dataTest'

jest.mock('axios')

describe('Info test suite', () => {
  const apiKey = 'apiKey'
  const socialsKeys = 'APP KEY'
  const info = new Info(CommonTestData.credentials, apiKey, 'eu1')

  test('get all info successfully', async () => {
    axios
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })

    const response = await info.get()
    const expectedResponse = getInfoExpectedResponse(false)
    expect(response).toEqual(expectedResponse)
  })

  test('get all info unsuccessfully', async () => {
    axios
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, schemaId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, socialIdentitiesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, smsTemplatesId, apiKey) })
    await expect(info.get()).rejects.toEqual([getExpectedResponseWithContext(expectedGigyaResponseInvalidAPI, schemaId, apiKey)])
  })

  test('get info except profileSchema successfully', async () => {
    const mockedResponse = getExpectedSchemaResponseExcept(['profileSchema'])
    axios
      .mockResolvedValueOnce({ data: mockedResponse })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
    const response = await info.get()
    const expectedResponse = JSON.parse(JSON.stringify(getInfoExpectedResponse(false)))
    expectedResponse[0].branches.splice(1, 1) // remove schema.profileSchema
    expect(response).toEqual(expectedResponse)
  })

  test('get info except schema successfully', async () => {
    const mockedResponse = getExpectedSchemaResponseExcept(['dataSchema', 'profileSchema'])
    axios
      .mockResolvedValueOnce({ data: mockedResponse })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
    const response = await info.get()
    const expectedResponse = JSON.parse(JSON.stringify(getInfoExpectedResponse(false)))
    expectedResponse.splice(0, 1) // remove schema
    expect(response).toEqual(expectedResponse)
  })

  test('get info except social successfully', async () => {
    axios
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getSocialsProviders('') })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
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
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: mockedResponse })
    const response = await info.get()
    const expectedResponse = JSON.parse(JSON.stringify(getInfoExpectedResponse(false)))
    expectedResponse.splice(5, 1) // remove schema
    expect(response).toEqual(expectedResponse)
  })
})
