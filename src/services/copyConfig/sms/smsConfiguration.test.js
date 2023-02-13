import axios from 'axios'
import { credentials, errorCallback, expectedGigyaResponseInvalidAPI, expectedGigyaResponseOk } from '../../servicesDataTest'
import SmsConfiguration from './smsConfiguration'
import { getSmsExpectedResponse } from '../../sms/dataTest'
import {getResponseWithContext, smsTemplatesId} from "../dataTest";

jest.mock('axios')

describe('Sms Configuration test suite', () => {
  const apiKey = 'apiKey'
  const dataCenter = 'eu1'
  const smsConfiguration = new SmsConfiguration(credentials, apiKey, dataCenter)

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('copy successfully', async () => {
    let spy = jest.spyOn(smsConfiguration.getSms(), 'set')
    const expectCallArgument = getSmsExpectedResponse
    axios.mockResolvedValueOnce({ data: getSmsExpectedResponse }).mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, smsTemplatesId, apiKey) })
    const response = await smsConfiguration.copy(apiKey, { dataCenter })
    expect(response).toEqual(getResponseWithContext(expectedGigyaResponseOk, smsTemplatesId, apiKey))
    expect(response.context.id).toEqual(`${smsTemplatesId}`)
    expect(response.context.targetApiKey).toEqual(`${apiKey}`)

    expect(spy.mock.calls.length).toBe(1)
    expect(spy).toHaveBeenCalledWith(apiKey, dataCenter, expectCallArgument)
  })

  test('copy unsuccessfully - error on get', async () => {
    const mockedResponse = JSON.parse(JSON.stringify(expectedGigyaResponseInvalidAPI))
    mockedResponse.context = { id: smsTemplatesId, targetApiKey: apiKey }
    axios.mockResolvedValueOnce({ data: mockedResponse })

    const response = await smsConfiguration.copy(apiKey, { dataCenter })
    expect(response).toEqual(mockedResponse)
    expect(response.context.id).toEqual(`${smsTemplatesId}`)
    expect(response.context.targetApiKey).toEqual(`${apiKey}`)
  })

  test('copy unsuccessfully - error on set', async () => {
    const mockedResponse = JSON.parse(JSON.stringify(expectedGigyaResponseInvalidAPI))
    mockedResponse.context = { id: smsTemplatesId, targetApiKey: apiKey }
    axios.mockResolvedValueOnce({ data: getSmsExpectedResponse }).mockResolvedValueOnce({data: mockedResponse})

    const response = await smsConfiguration.copy(apiKey, { dataCenter })
    expect(response).toEqual(mockedResponse)
    expect(response.context.id).toEqual(`${smsTemplatesId}`)
    expect(response.context.targetApiKey).toEqual(`${apiKey}`)
  })
})
