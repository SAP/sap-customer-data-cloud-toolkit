import axios from 'axios'
import { credentials, expectedGigyaResponseInvalidAPI, expectedGigyaResponseOk } from '../../servicesDataTest'
import { getExpectedResponseWithContext, getResponseWithContext } from '../dataTest'
import { getConsentStatementExpectedResponse } from './dataTest'
import ConsentStatement from './consentStatement'

jest.mock('axios')

describe('ConsentStatement test suite', () => {
  const apiKey = 'apiKey'
  const dataCenter = 'eu1'
  const consent = new ConsentStatement(credentials, apiKey, dataCenter)
  const consentId = 'consentStatement'

  test('copy successfully', async () => {
    axios.mockResolvedValueOnce({ data: getConsentStatementExpectedResponse }).mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, consentId, apiKey) })

    await executeTest(expectedGigyaResponseOk)
  })

  test('copy unsuccessfully - error on get', async () => {
    const mockedResponse = getResponseWithContext(expectedGigyaResponseInvalidAPI, consentId, apiKey)
    axios.mockResolvedValueOnce({ data: mockedResponse })

    await executeTest(expectedGigyaResponseInvalidAPI)
  })

  test('copy unsuccessfully - error on set', async () => {
    const mockedResponse = getResponseWithContext(expectedGigyaResponseInvalidAPI, consentId, apiKey)
    axios.mockResolvedValueOnce({ data: getConsentStatementExpectedResponse }).mockResolvedValueOnce({ data: mockedResponse })

    await executeTest(expectedGigyaResponseInvalidAPI)
  })

  async function executeTest(expectedResponse) {
    const response = await consent.copy(apiKey, { dataCenter })
    expect(response).toEqual(getExpectedResponseWithContext(expectedResponse, consentId, apiKey))
    expect(response.context.id).toEqual(`${consentId}`)
    expect(response.context.targetApiKey).toEqual(`${apiKey}`)
  }
})
