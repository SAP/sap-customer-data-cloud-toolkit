import axios from 'axios'
import { credentials, expectedGigyaResponseInvalidAPI, expectedGigyaResponseOk } from '../../servicesDataTest'
import SmsConfiguration from './smsConfiguration'
import { getSmsExpectedResponse } from '../../sms/dataTest'

jest.mock('axios')

describe('Sms Configuration test suite', () => {
  const apiKey = 'apiKey'
  const dataCenter = 'eu1'
  const smsConfiguration = new SmsConfiguration(credentials, apiKey, dataCenter)
  const responseId = 'smsTemplates'

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('copy successfully', async () => {
    let spy = jest.spyOn(smsConfiguration.getSms(), 'set')
    const expectCallArgument = getSmsExpectedResponse.templates
    axios.mockResolvedValueOnce({ data: getSmsExpectedResponse }).mockResolvedValueOnce({ data: expectedGigyaResponseOk })
    const response = await smsConfiguration.copy(apiKey, { dataCenter })
    expect(response).toEqual(expectedGigyaResponseOk)
    expect(response.id).toEqual(`${responseId}`)
    expect(response.targetApiKey).toEqual(`${apiKey}`)

    expect(spy.mock.calls.length).toBe(1)
    expect(spy).toHaveBeenCalledWith(apiKey, dataCenter, expectCallArgument)
  })

  test('copy unsuccessfully - error on get', async () => {
    const mockedResponse = { data: expectedGigyaResponseInvalidAPI }
    axios.mockResolvedValueOnce(mockedResponse)

    const response = await smsConfiguration.copy(apiKey, { dataCenter })
    expect(response).toEqual(mockedResponse.data)
    expect(response.id).toEqual(`${responseId}`)
    expect(response.targetApiKey).toEqual(`${apiKey}`)
  })

  test('copy unsuccessfully - error on set', async () => {
    const mockedResponse = { data: expectedGigyaResponseInvalidAPI }
    axios.mockResolvedValueOnce({ data: getSmsExpectedResponse }).mockResolvedValueOnce(mockedResponse)

    const response = await smsConfiguration.copy(apiKey, { dataCenter })
    expect(response).toEqual(mockedResponse.data)
    expect(response.id).toEqual(`${responseId}`)
    expect(response.targetApiKey).toEqual(`${apiKey}`)
  })
})
