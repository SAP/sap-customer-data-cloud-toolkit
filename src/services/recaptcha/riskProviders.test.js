/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import axios from 'axios'
import RiskProviders from './riskProviders.js'

jest.mock('axios')

describe('RiskProviders test suite', () => {
  const credentials = {
    userKey: 'testUserKey',
    secret: 'testSecret',
    gigyaConsole: 'testGigyaConsole',
  }
  const site = 'testSite'
  const dataCenter = 'eu1'
  const riskProviders = new RiskProviders(credentials.userKey, credentials.secret, credentials.gigyaConsole)

  test('get risk providers configuration successfully', async () => {
    const mockResponse = {
      errorCode: 0,
      config: { provider: 'testProvider' },
    }

    axios.mockResolvedValueOnce({ data: mockResponse })

    const response = await riskProviders.get(site, dataCenter)

    expect(response.errorCode).toBe(0)
    expect(response.config).toEqual(mockResponse.config)
  })

  test('get risk providers configuration with error', async () => {
    const mockErrorResponse = {
      data: {
        errorCode: 500,
        errorDetails: 'Internal server error',
        errorMessage: 'Error setting Risk Providers configuration',
      },
    }

    axios.mockResolvedValueOnce(mockErrorResponse)

    const response = await riskProviders.get(site, dataCenter)
    expect(response).toEqual({
      errorCode: 500,
      errorDetails: 'Internal server error',
      errorMessage: 'Error setting Risk Providers configuration',
    })
  })

  test('set risk providers configuration successfully', async () => {
    const mockResponse = { errorCode: 0 }

    axios.mockResolvedValueOnce({ data: mockResponse })

    const response = await riskProviders.set(site, dataCenter, { provider: 'testProvider' })

    expect(response.errorCode).toBe(0)
  })

  test('set risk providers configuration with error', async () => {
    const mockErrorResponse = {
      data: {
        errorCode: 500,
        errorDetails: 'Internal server error',
        errorMessage: 'Error setting Risk Providers configuration',
      },
    }

    axios.mockResolvedValueOnce(mockErrorResponse)

    const response = await riskProviders.set(site, dataCenter, { provider: 'testProvider' })
    expect(response).toEqual({
      errorCode: 500,
      errorDetails: 'Internal server error',
      errorMessage: 'Error setting Risk Providers configuration',
    })
  })
})
