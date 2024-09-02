/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */ 

import axios from 'axios'
import RecaptchaConfiguration from './recaptchaConfiguration.js'

jest.mock('axios')

describe('RecaptchaConfiguration test suite ', () => {
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

    try {
      await recaptchaConfig.get()
    } catch (error) {
      expect(error.message).toBe('Error fetching reCAPTCHA policies: Internal server error')
    }
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

    try {
      await recaptchaConfig.setRecaptchaConfig(site, dataCenter, { test: 'config' })
    } catch (error) {
      expect(error.message).toBe('Error setting reCAPTCHA configuration: Internal server error')
    }
  })

  test('setPolicies throws error when current config fetch fails', async () => {
    const mockErrorResponse = {
      errorCode: 500,
      errorMessage: 'Failed to fetch policies',
    }

    axios.mockResolvedValueOnce({ data: mockErrorResponse })

    try {
      await recaptchaConfig.setPolicies(site, { riskAssessmentWithReCaptchaV3: true }, { requireCaptcha: true })
    } catch (error) {
      expect(error.message).toBe('Error fetching current policies: Failed to fetch policies')
    }
  })

  test('setRiskProvidersConfig throws error when response has non-zero errorCode', async () => {
    const mockErrorResponse = {
      errorCode: 500,
      errorMessage: 'Failed to set risk providers',
    }

    axios.mockResolvedValueOnce({ data: mockErrorResponse })

    try {
      await recaptchaConfig.setRiskProvidersConfig(site, dataCenter, { provider: 'testProvider' })
    } catch (error) {
      expect(error.message).toBe('Error setting Risk Providers configuration: Failed to set risk providers')
    }
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

    try {
      await recaptchaConfig.copy('targetSite', 'eu1')
    } catch (error) {
      expect(error.message).toBe('Recaptcha config is invalid or undefined.')
    }
  })
})
