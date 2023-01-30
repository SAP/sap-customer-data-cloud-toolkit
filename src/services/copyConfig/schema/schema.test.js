import Schema from './schema'
import * as CommonTestData from '../../servicesDataTest'
import { expectedSchemaResponse, getExpectedBody } from './dataTest'
import axios from 'axios'
import { errorCallback, expectedGigyaResponseInvalidAPI, expectedGigyaResponseOk } from '../../servicesDataTest'

jest.mock('axios')

describe('Schema test suite', () => {
  const apiKey = 'apiKey'
  const dataCenter = 'eu1'
  const schema = new Schema(CommonTestData.credentials, apiKey, dataCenter)

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('get schema successfully', async () => {
    axios.mockResolvedValueOnce({ data: expectedSchemaResponse })
    const response = await schema.get()
    //console.log('response=' + JSON.stringify(response))
    expect(response).toEqual(expectedSchemaResponse)
  })

  test('get schema unsuccessfully', async () => {
    axios.mockResolvedValueOnce({ data: expectedGigyaResponseInvalidAPI })
    const response = await schema.get()
    CommonTestData.verifyResponseIsNotOk(response, expectedGigyaResponseInvalidAPI)
  })

  test('copy successfully', async () => {
    let spy = jest.spyOn(schema, 'set')
    const expectCallArgument = getExpectedBody()
    axios.mockResolvedValueOnce({ data: expectedSchemaResponse }).mockResolvedValueOnce({ data: expectedGigyaResponseOk })
    const response = await schema.copy(apiKey, dataCenter)
    expect(response).toEqual(expectedGigyaResponseOk)
    expect(response.id).toEqual(`Schema;${apiKey}`)

    expect(spy.mock.calls.length).toBe(1)
    expect(spy).toHaveBeenCalledWith(apiKey, dataCenter, expectCallArgument)
  })

  test('copy unsuccessfully - error on get', async () => {
    const mockedResponse = { data: expectedGigyaResponseInvalidAPI }

    const err = {
      message: mockedResponse.data.errorMessage,
      code: mockedResponse.data.errorCode,
      details: mockedResponse.data.errorDetails,
    }
    axios.mockResolvedValueOnce(mockedResponse)

    await schema.copy(apiKey, dataCenter).catch((error) => {
      errorCallback(error, err)
      expect(error.id).toEqual(`Schema;${apiKey}`)
    })
  })

  test('copy unsuccessfully - error on set', async () => {
    const mockedResponse = { data: expectedGigyaResponseInvalidAPI }

    const err = {
      message: mockedResponse.data.errorMessage,
      code: mockedResponse.data.errorCode,
      details: mockedResponse.data.errorDetails,
    }
    axios.mockResolvedValueOnce({ data: expectedSchemaResponse }).mockResolvedValueOnce(mockedResponse)
    await schema.copy(apiKey, dataCenter).catch((error) => {
      errorCallback(error, err)
      expect(error.id).toEqual(`Schema;${apiKey}`)
    })
  })
})
