/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import axios from 'axios'
import * as SocialsTestData from './dataTest.js'
import Social from './social.js'
import { expectedSetSocialsProvidersResponse } from './dataTest.js'
import { getExpectedResponseWithContext, getResponseWithContext, socialIdentitiesId } from '../dataTest.js'
import { expectedGigyaInvalidUserKey, expectedGigyaResponseInvalidAPI, credentials } from '../../servicesDataTest.js'

jest.mock('axios')
jest.setTimeout(10000)

describe('Socials test suite', () => {
  const social = new Social(credentials.userKey, credentials.secret, 'apiKey', 'us1')

  const targetDataCenter = 'us1'
  const targetApiKey = 'targetApiKey'
  const socialsKeys = 'APP KEY'

  test('copy socials successfully', async () => {
    axios
      .mockResolvedValueOnce({ data: SocialsTestData.getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedSetSocialsProvidersResponse, socialIdentitiesId, targetApiKey) })
    const response = await social.copy(targetApiKey, targetDataCenter)
    expect(response).toEqual(getExpectedResponseWithContext(expectedSetSocialsProvidersResponse, socialIdentitiesId, targetApiKey))
    expect(response.context.id).toEqual(`${socialIdentitiesId}`)
    expect(response.context.targetApiKey).toEqual(`${targetApiKey}`)
  })

  test('copy socials - invalid target api', async () => {
    const mockRes = getResponseWithContext(expectedGigyaResponseInvalidAPI, socialIdentitiesId, targetApiKey)
    axios.mockResolvedValueOnce({ data: SocialsTestData.getSocialsProviders(socialsKeys) }).mockResolvedValueOnce({ data: mockRes })

    const response = await social.copy(targetApiKey, targetDataCenter)
    expect(response).toEqual(getExpectedResponseWithContext(expectedGigyaResponseInvalidAPI, socialIdentitiesId, targetApiKey))
    expect(response.context.id).toEqual(`${socialIdentitiesId}`)
    expect(response.context.targetApiKey).toEqual(`${targetApiKey}`)
  })

  test('copy socials - invalid user key', async () => {
    const mockRes = getResponseWithContext(expectedGigyaInvalidUserKey, socialIdentitiesId, targetApiKey)
    axios.mockResolvedValueOnce({ data: SocialsTestData.getSocialsProviders(socialsKeys) }).mockResolvedValueOnce({ data: mockRes })

    const response = await social.copy(targetApiKey, targetDataCenter)
    expect(response).toEqual(getExpectedResponseWithContext(expectedGigyaInvalidUserKey, socialIdentitiesId, targetApiKey))
    expect(response.context.id).toEqual(`${socialIdentitiesId}`)
    expect(response.context.targetApiKey).toEqual(`${targetApiKey}`)
  })

  test('copy unsuccessfully - error on get', async () => {
    const mockRes = getResponseWithContext(expectedGigyaResponseInvalidAPI, socialIdentitiesId, targetApiKey)
    axios.mockResolvedValueOnce({ data: mockRes })

    const response = await social.copy(targetApiKey, targetDataCenter)
    expect(response).toEqual(getExpectedResponseWithContext(expectedGigyaResponseInvalidAPI, socialIdentitiesId, targetApiKey))
    expect(response.context.id).toEqual(`${socialIdentitiesId}`)
    expect(response.context.targetApiKey).toEqual(`${targetApiKey}`)
  })
})
