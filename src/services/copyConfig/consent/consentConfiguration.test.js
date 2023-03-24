import axios from 'axios'
import { credentials, expectedGigyaResponseInvalidAPI, expectedGigyaResponseOk, verifyResponseIsNotOk, verifyResponseIsOk } from '../../servicesDataTest'
import { getResponseWithContext } from '../dataTest'
import { getConsentStatementExpectedResponse, getLegalStatementExpectedResponse, legalConsentAlreadyExists } from './dataTest'
import ConsentConfiguration from './consentConfiguration'
import ConsentOptions from './consentOptions'

jest.mock('axios')

describe('ConsentConfiguration test suite', () => {
  const apiKey = 'apiKey'
  const dataCenter = 'eu1'
  const consentConfiguration = new ConsentConfiguration(credentials, apiKey, dataCenter)
  const consentOptions = new ConsentOptions()

  test('nothing to copy', async () => {
    const responses = await consentConfiguration.copy(apiKey, { dataCenter }, consentOptions.getOptionsDisabled())
    expect(responses.length).toEqual(0)
  })

  test('copy successfully', async () => {
    axios
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'consent_consentStatement_terms.termsConsentId1', apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'consent_legalStatement_terms.consentId2_en', apiKey) })
      .mockResolvedValueOnce({ data: getLegalStatementExpectedResponse })
      .mockResolvedValueOnce({ data: getLegalStatementExpectedResponse })
      .mockResolvedValueOnce({ data: getLegalStatementExpectedResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'consent_legalStatement_terms.consentId2_pt', apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'consent_consentStatement_terms.consentId2_en', apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'consent_legalStatement_terms.termsConsentId1_en', apiKey) })

    const responses = await consentConfiguration.copy(apiKey, { dataCenter }, consentOptions.getOptions())
    expect(responses.length).toEqual(5)
    responses.forEach((response) => {
      verifyResponseIsOk(response)
      expect(response.context.targetApiKey).toEqual(`${apiKey}`)
      expect(response.context.id.startsWith('consent_')).toBeTruthy()
      expect(response.severity).toEqual('info')
    })
  })

  test('copy unsuccessfully - error on get', async () => {
    const mockedResponse = getResponseWithContext(expectedGigyaResponseInvalidAPI, 'consent_consentStatement_get', apiKey)
    axios.mockResolvedValueOnce({ data: mockedResponse })

    const responses = await consentConfiguration.copy(apiKey, { dataCenter }, consentOptions.getOptions())
    expect(responses.length).toEqual(1)
    verifyResponseIsNotOk(responses[0], expectedGigyaResponseInvalidAPI)
    expect(responses[0].context.targetApiKey).toEqual(`${apiKey}`)
    expect(responses[0].context.id).toEqual('consent_consentStatement_get')
    expect(responses[0].severity).toEqual('error')
  })

  test('copy unsuccessfully - error on first consent set', async () => {
    const mockedResponse = getResponseWithContext(legalConsentAlreadyExists, 'consent_consentStatement_get', apiKey)
    axios
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: mockedResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'consent_legalStatement_terms.consentId2_en', apiKey) })
      .mockResolvedValueOnce({ data: getLegalStatementExpectedResponse })
      .mockResolvedValueOnce({ data: getLegalStatementExpectedResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'consent_legalStatement_terms.consentId2_pt', apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'consent_consentStatement_terms.consentId2_en', apiKey) })

    const responses = await consentConfiguration.copy(apiKey, { dataCenter }, consentOptions.getOptions())
    expect(responses.length).toEqual(4)
    verifyResponseIsNotOk(responses[0], legalConsentAlreadyExists)
    expect(responses[0].context.targetApiKey).toEqual(`${apiKey}`)
    expect(responses[0].context.id).toEqual('consent_consentStatement_get')
    expect(responses[0].severity).toEqual('warning')
    responses.splice(1, 3).forEach((response) => {
      verifyResponseIsOk(response)
      expect(response.context.targetApiKey).toEqual(`${apiKey}`)
      expect(response.context.id.startsWith('consent_')).toBeTruthy()
      expect(response.severity).toEqual('info')
    })
  })

  test('copy unsuccessfully - error on first consent get legalStatement', async () => {
    const mockedResponse = getResponseWithContext(expectedGigyaResponseInvalidAPI, 'consent_legalStatement_terms.termsConsentId1_en', apiKey)
    axios
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'consent_consentStatement_terms.termsConsentId1', apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'consent_legalStatement_terms.consentId2_en', apiKey) })
      .mockResolvedValueOnce({ data: mockedResponse })
      .mockResolvedValueOnce({ data: getLegalStatementExpectedResponse })
      .mockResolvedValueOnce({ data: getLegalStatementExpectedResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'consent_legalStatement_terms.consentId2_pt', apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'consent_consentStatement_terms.consentId2_en', apiKey) })

    const responses = await consentConfiguration.copy(apiKey, { dataCenter }, consentOptions.getOptions())
    expect(responses.length).toEqual(5)
    verifyResponseIsOk(responses[0])
    expect(responses[0].context.targetApiKey).toEqual(`${apiKey}`)
    expect(responses[0].context.id.startsWith('consent_')).toBeTruthy()
    expect(responses[0].severity).toEqual('info')
    verifyResponseIsNotOk(responses[1], expectedGigyaResponseInvalidAPI)
    expect(responses[1].context.targetApiKey).toEqual(`${apiKey}`)
    expect(responses[1].context.id).toEqual('consent_legalStatement_terms.termsConsentId1_en')
    expect(responses[1].severity).toEqual('error')
    responses.splice(2, 3).forEach((response) => {
      verifyResponseIsOk(response)
      expect(response.context.targetApiKey).toEqual(`${apiKey}`)
      expect(response.context.id.startsWith('consent_')).toBeTruthy()
      expect(response.severity).toEqual('info')
    })
  })
})
