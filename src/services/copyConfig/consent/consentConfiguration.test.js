/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import axios from 'axios'
import { credentials, expectedGigyaResponseInvalidAPI, expectedGigyaResponseOk, verifyResponseIsNotOk, verifyResponseIsOk } from '../../servicesDataTest'
import { getResponseWithContext } from '../dataTest'
import {
  cannotChangeConsentsOnChildSite,
  getConsentStatementExpectedResponse,
  getLegalStatementExpectedResponse,
  getNoConsentStatementExpectedResponse,
  legalConsentAlreadyExists,
} from './dataTest'
import ConsentConfiguration from './consentConfiguration'
import ConsentOptions from './consentOptions'
import { ERROR_SEVERITY_ERROR, ERROR_SEVERITY_INFO, ERROR_SEVERITY_WARNING } from '../../errors/generateErrorResponse'

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

  test('copy successfully to parent site', async () => {
    axios
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'consent_consentStatement_terms.termsConsentId1', apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'consent_legalStatement_terms.consentId2_en', apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'consent_consentDefaultLanguage_terms.termsConsentId1', apiKey) })
      .mockResolvedValueOnce({ data: getLegalStatementExpectedResponse })
      .mockResolvedValueOnce({ data: getLegalStatementExpectedResponse })
      .mockResolvedValueOnce({ data: getLegalStatementExpectedResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'consent_consentStatement_terms.consentId2_en', apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'consent_legalStatement_terms.consentId2_pt', apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'consent_legalStatement_terms.termsConsentId1_en', apiKey) })

    const responses = await consentConfiguration.copy(apiKey, { dataCenter }, consentOptions.getOptions())
    expect(responses.length).toEqual(5)
    responses.forEach((response) => {
      verifyResponseIsOk(response)
      expect(response.context.targetApiKey).toEqual(`${apiKey}`)
      expect(response.context.id.startsWith('consent_')).toBeTruthy()
      expect(response.severity).toEqual(ERROR_SEVERITY_INFO)
    })
  })

  test('copy successfully to child site', async () => {
    axios
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: getNoConsentStatementExpectedResponse() })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'consent_consentStatement_terms.termsConsentId1', apiKey) })

    const responses = await consentConfiguration.copy(apiKey, { dataCenter, siteGroupOwner: apiKey + 'x' }, consentOptions.getOptions())
    expect(responses.length).toEqual(2)
    verifyResponseIsOk(responses[0])
    expect(responses[0].context.targetApiKey).toEqual(`${apiKey}`)
    expect(responses[0].context.id.startsWith('consent_')).toBeTruthy()
    expect(responses[0].severity).toEqual(ERROR_SEVERITY_INFO)
    verifyResponseIsNotOk(responses[1], cannotChangeConsentsOnChildSite)
    expect(responses[1].context.targetApiKey).toEqual(`${apiKey}`)
    expect(responses[1].context.id.startsWith('consent_')).toBeTruthy()
    expect(responses[1].severity).toEqual(ERROR_SEVERITY_WARNING)
  })

  test('copy unsuccessfully - error on get', async () => {
    const mockedResponse = getResponseWithContext(expectedGigyaResponseInvalidAPI, 'consent_consentStatement_get', apiKey)
    axios.mockResolvedValueOnce({ data: mockedResponse })

    const responses = await consentConfiguration.copy(apiKey, { dataCenter }, consentOptions.getOptions())
    expect(responses.length).toEqual(1)
    verifyResponseIsNotOk(responses[0], expectedGigyaResponseInvalidAPI)
    expect(responses[0].context.targetApiKey).toEqual(`${apiKey}`)
    expect(responses[0].context.id).toEqual('consent_consentStatement_get')
    expect(responses[0].severity).toEqual(ERROR_SEVERITY_ERROR)
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
    expect(responses[0].severity).toEqual(ERROR_SEVERITY_WARNING)
    responses.splice(1, 3).forEach((response) => {
      verifyResponseIsOk(response)
      expect(response.context.targetApiKey).toEqual(`${apiKey}`)
      expect(response.context.id.startsWith('consent_')).toBeTruthy()
      expect(response.severity).toEqual(ERROR_SEVERITY_INFO)
    })
  })

  test('copy unsuccessfully - error on first consent get legalStatement', async () => {
    const mockedResponse = getResponseWithContext(expectedGigyaResponseInvalidAPI, 'consent_legalStatement_terms.termsConsentId1_en', apiKey)
    axios
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'consent_consentStatement_terms.termsConsentId1', apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'consent_legalStatement_terms.consentId2_en', apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'consent_consentDefaultLanguage_terms.termsConsentId1', apiKey) })
      .mockResolvedValueOnce({ data: mockedResponse })
      .mockResolvedValueOnce({ data: getLegalStatementExpectedResponse })
      .mockResolvedValueOnce({ data: getLegalStatementExpectedResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'consent_legalStatement_terms.consentId2_pt', apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'consent_consentStatement_terms.consentId2_en', apiKey) })

    const responses = await consentConfiguration.copy(apiKey, { dataCenter }, consentOptions.getOptions())
    expect(responses.length).toEqual(5)
    responses.slice(0, 3).forEach((response) => {
      verifyResponseIsOk(response)
      expect(response.context.targetApiKey).toEqual(`${apiKey}`)
      expect(response.context.id.startsWith('consent_')).toBeTruthy()
      expect(response.severity).toEqual(ERROR_SEVERITY_INFO)
    })
    const errorIdx = 3
    verifyResponseIsNotOk(responses[errorIdx], expectedGigyaResponseInvalidAPI)
    expect(responses[errorIdx].context.targetApiKey).toEqual(`${apiKey}`)
    expect(responses[errorIdx].context.id).toEqual('consent_legalStatement_terms.termsConsentId1_en')
    expect(responses[errorIdx].severity).toEqual(ERROR_SEVERITY_ERROR)
    verifyResponseIsOk(responses[errorIdx + 1])
    expect(responses[errorIdx + 1].context.targetApiKey).toEqual(`${apiKey}`)
    expect(responses[errorIdx + 1].context.id.startsWith('consent_')).toBeTruthy()
    expect(responses[errorIdx + 1].severity).toEqual(ERROR_SEVERITY_INFO)
  })
})
