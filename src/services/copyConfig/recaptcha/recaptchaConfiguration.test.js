/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import axios from 'axios'
import RecaptchaConfiguration from './recaptchaConfiguration.js'
import { getRecaptchaExpectedResponse, getRecaptchaPoliciesResponse, getRiskProvidersResponse } from '../../recaptcha/dataTest.js'
jest.mock('axios')

describe('RecaptchaConfiguration test suite', () => {
  const credentials = {
    userKey: 'testUserKey',
    secret: 'testSecret',
    gigyaConsole: 'testGigyaConsole',
  }
  const site = 'testSite'
  const dataCenter = 'eu1'
  const recaptchaConfig = new RecaptchaConfiguration(credentials, site, dataCenter)

  test('get recaptcha configuration successfully', async () => {
    const mockRecaptchaResponse = {
      errorCode: 0,
      Config: [{ Type: 1 }, { Type: 2 }],
    }
    const mockPoliciesResponse = {
      errorCode: 0,
      security: { policy: 'testPolicy' },
      registration: { requireCaptcha: false },
    }
    const mockRiskProvidersResponse = {
      errorCode: 0,
      config: { provider: 'testProvider' },
    }

    axios.mockResolvedValueOnce({ data: mockRecaptchaResponse }).mockResolvedValueOnce({ data: mockPoliciesResponse }).mockResolvedValueOnce({ data: mockRiskProvidersResponse })

    const response = await recaptchaConfig.get()

    expect(response.errorCode).toBe(0)
    expect(response.recaptchaConfig).toEqual(mockRecaptchaResponse.Config)
    expect(response.securityPolicies).toEqual(mockPoliciesResponse.security)
    expect(response.registrationPolicies).toEqual(mockPoliciesResponse.registration)
    expect(response.riskProvidersConfig).toEqual(mockRiskProvidersResponse.config)
  })

  test('get recaptcha configuration with error', async () => {
    const mockErrorResponse = {
      errorCode: 500,
      errorMessage: 'Internal server error',
    }

    axios.mockResolvedValueOnce({ data: mockErrorResponse })

    await expect(recaptchaConfig.get()).rejects.toThrow('Error fetching reCAPTCHA policies: Internal server error')
  })

  test('set recaptcha configuration successfully', async () => {
    const mockResponse = { errorCode: 0 }

    axios.mockResolvedValueOnce({ data: mockResponse })

    const response = await recaptchaConfig.setRecaptchaConfig(site, dataCenter, { test: 'config' })

    expect(response.errorCode).toBe(0)
  })

  test('set recaptcha configuration with error', async () => {
    const mockErrorResponse = {
      errorCode: 500,
      errorMessage: 'Internal server error',
    }

    axios.mockResolvedValueOnce({ data: mockErrorResponse })

    await expect(recaptchaConfig.setRecaptchaConfig(site, dataCenter, { test: 'config' })).rejects.toThrow('Error setting reCAPTCHA configuration: Internal server error')
  })

  test('setPolicies throws error when current config fetch fails', async () => {
    const mockErrorResponse = {
      errorCode: 500,
      errorMessage: 'Failed to fetch policies',
    }

    axios.mockResolvedValueOnce({ data: mockErrorResponse })

    await expect(recaptchaConfig.setPolicies(site, { riskAssessmentWithReCaptchaV3: true }, { requireCaptcha: true })).rejects.toThrow(
      'Error fetching current policies: Failed to fetch policies',
    )
  })

  test('setRiskProvidersConfig throws error when response has non-zero errorCode', async () => {
    const mockErrorResponse = {
      errorCode: 500,
      errorMessage: 'Failed to set risk providers',
    }

    axios.mockResolvedValueOnce({ data: mockErrorResponse })

    await expect(recaptchaConfig.setRiskProvidersConfig(site, dataCenter, { provider: 'testProvider' })).rejects.toThrow(
      'Error setting Risk Providers configuration: Failed to set risk providers',
    )
  })

  test('copy configurations should handle missing configurations gracefully', async () => {
    const mockRecaptchaResponse = {
      errorCode: 0,
      Config: null,
    }
    const mockPoliciesResponse = {
      errorCode: 0,
      security: null,
      registration: null,
    }
    const mockRiskProvidersResponse = {
      errorCode: 0,
      config: null,
    }

    axios.mockResolvedValueOnce({ data: mockRecaptchaResponse }).mockResolvedValueOnce({ data: mockPoliciesResponse }).mockResolvedValueOnce({ data: mockRiskProvidersResponse })

    await expect(recaptchaConfig.copy('targetSite', 'eu1')).rejects.toThrow('Recaptcha config is invalid or undefined.')
  })

  test('copy fails when setRecaptchaConfig fails', async () => {
    const mockRecaptchaResponse = getRecaptchaExpectedResponse()
    const mockPoliciesResponse = getRecaptchaPoliciesResponse()
    const mockRiskProvidersResponse = getRiskProvidersResponse()
    const mockSetRecaptchaError = { errorCode: 500, errorMessage: 'Failed to set recaptcha config' }

    axios
      .mockResolvedValueOnce({ data: mockRecaptchaResponse })
      .mockResolvedValueOnce({ data: mockPoliciesResponse })
      .mockResolvedValueOnce({ data: mockRiskProvidersResponse })
      .mockResolvedValueOnce({ data: mockSetRecaptchaError })

    await expect(recaptchaConfig.copy('targetSite', 'eu1')).rejects.toThrow('Error setting reCAPTCHA configuration: Failed to set recaptcha config')
  })
  test('get recaptcha configuration with invalid risk providers', async () => {
    const mockRecaptchaResponse = getRecaptchaExpectedResponse()
    const mockPoliciesResponse = getRecaptchaPoliciesResponse()
    const mockRiskProvidersResponse = { errorCode: 0, config: null }

    axios.mockResolvedValueOnce({ data: mockRecaptchaResponse }).mockResolvedValueOnce({ data: mockPoliciesResponse }).mockResolvedValueOnce({ data: mockRiskProvidersResponse })

    const response = await recaptchaConfig.get()

    expect(response.recaptchaConfig).toEqual(mockRecaptchaResponse.Config)
    expect(response.securityPolicies).toEqual(mockPoliciesResponse.security)
    expect(response.registrationPolicies).toEqual(mockPoliciesResponse.registration)
    expect(response.riskProvidersConfig).toBe(null)
  })

  test('copy configurations successfully', async () => {
    const mockRecaptchaResponse = getRecaptchaExpectedResponse()
    const mockPoliciesResponse = getRecaptchaPoliciesResponse()
    const mockRiskProvidersResponse = getRiskProvidersResponse()
    const expectedGigyaResponseOk = {
      statusCode: 200,
      errorCode: 0,
      statusReason: 'OK',
      callId: 'callId',
      apiVersion: 2,
      time: Date.now(),
    }

    axios
      .mockResolvedValueOnce({ data: mockRecaptchaResponse })
      .mockResolvedValueOnce({ data: mockPoliciesResponse })
      .mockResolvedValueOnce({ data: mockRiskProvidersResponse })
      .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: expectedGigyaResponseOk })

    const response = await recaptchaConfig.copy('targetSite', 'eu1')

    axios.mock.calls.forEach((call, index) => {})

    expect(response.recaptchaConfig).toEqual(mockRecaptchaResponse.Config)
    expect(response.securityPolicies).toEqual(mockPoliciesResponse.security)
    expect(response.registrationPolicies).toEqual(mockPoliciesResponse.registration)
    expect(response.riskProvidersConfig).toEqual(mockRiskProvidersResponse.config)

    expect(axios).toHaveBeenCalledTimes(6)

    expect(axios).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        method: 'POST',
        url: expect.stringContaining('admin.captcha.setConfig'),
        data: expect.any(URLSearchParams),
      }),
    )

    expect(axios).toHaveBeenNthCalledWith(
      5,
      expect.objectContaining({
        method: 'POST',
        url: expect.stringContaining('accounts.setPolicies'),
        data: expect.any(URLSearchParams),
      }),
    )

    expect(axios).toHaveBeenNthCalledWith(
      6,
      expect.objectContaining({
        method: 'POST',
        url: expect.stringContaining('admin.riskProviders.setConfig'),
        data: expect.any(URLSearchParams),
      }),
    )
  })
})
