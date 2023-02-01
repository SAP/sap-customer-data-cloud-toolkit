import Info from './info'
import * as CommonTestData from '../../servicesDataTest'
import { getExpectedSchemaResponseExcept, getInfoExpectedResponse } from './dataTest'
import axios from 'axios'
import { expectedSchemaResponse } from '../schema/dataTest'
import { expectedGigyaResponseInvalidAPI } from '../../servicesDataTest'

jest.mock('axios')

describe('Info test suite', () => {
  const apiKey = 'apiKey'
  const info = new Info(CommonTestData.credentials, apiKey, 'eu1')

  test('get all info successfully', async () => {
    axios.mockResolvedValueOnce({ data: expectedSchemaResponse })
    const response = await info.get()
    const expectedResponse = getInfoExpectedResponse(false)
    expect(response).toEqual(expectedResponse)
  })

  test('get info except profileSchema successfully', async () => {
    const mockedResponse = getExpectedSchemaResponseExcept(['profileSchema'])
    axios.mockResolvedValueOnce({ data: mockedResponse })
    const response = await info.get()
    const expectedResponse = JSON.parse(JSON.stringify(getInfoExpectedResponse(false)))
    expectedResponse[0].value.splice(1, 1) // remove schema.profileSchema
    expect(response).toEqual(expectedResponse)
  })

  test('get info except schema successfully', async () => {
    const mockedResponse = getExpectedSchemaResponseExcept(['dataSchema', 'profileSchema'])
    axios.mockResolvedValueOnce({ data: mockedResponse })
    const response = await info.get()
    const expectedResponse = JSON.parse(JSON.stringify(getInfoExpectedResponse(false)))
    expectedResponse.splice(0, 1) // remove schema
    expect(response).toEqual(expectedResponse)
  })

  test('get all info unsuccessfully', async () => {
    axios.mockResolvedValueOnce({ data: expectedGigyaResponseInvalidAPI })
    await expect(info.get()).rejects.toEqual(expectedGigyaResponseInvalidAPI)
  })
})
