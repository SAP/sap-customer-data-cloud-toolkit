import axios from 'axios'
import { credentials, expectedGigyaResponseInvalidAPI, expectedGigyaResponseOk } from '../../servicesDataTest'
import { getExpectedResponseWithContext, getResponseWithContext } from '../dataTest'
import { getLegalStatementExpectedResponse } from './dataTest'
import LegalStatement from './legalStatement'

jest.mock('axios')

describe('LegalStatement test suite', () => {
  const apiKey = 'apiKey'
  const dataCenter = 'eu1'
  const legal = new LegalStatement(credentials, apiKey, dataCenter)
  const legalStatementId = 'legalStatement'

  test('copy successfully', async () => {
    axios
      .mockResolvedValueOnce({ data: getLegalStatementExpectedResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, legalStatementId, apiKey) })

    await executeTest(expectedGigyaResponseOk)
  })

  test('copy unsuccessfully - error on get', async () => {
    const mockedResponse = getResponseWithContext(expectedGigyaResponseInvalidAPI, legalStatementId, apiKey)
    axios.mockResolvedValueOnce({ data: mockedResponse })

    await executeTest(expectedGigyaResponseInvalidAPI)
  })

  test('copy unsuccessfully - error on set', async () => {
    const mockedResponse = getResponseWithContext(expectedGigyaResponseInvalidAPI, legalStatementId, apiKey)
    axios.mockResolvedValueOnce({ data: getLegalStatementExpectedResponse }).mockResolvedValueOnce({ data: mockedResponse })

    await executeTest(expectedGigyaResponseInvalidAPI)
  })

  async function executeTest(expectedResponse) {
    const response = await legal.copy(apiKey, { dataCenter })
    expect(response).toEqual(getExpectedResponseWithContext(expectedResponse, legalStatementId, apiKey))
    expect(response.context.id).toEqual(`${legalStatementId}`)
    expect(response.context.targetApiKey).toEqual(`${apiKey}`)
  }
})
