import axios from 'axios'
import RecaptchaConfiguration from './recaptchaConfiguration'
import { getRecaptchaExpectedResponse, getRecaptchaPoliciesResponse, getRiskProvidersResponse } from '../../recaptcha/dataTest'
jest.mock('axios')

describe('RecaptchaConfiguration test suite', () => {
  const credentials = {
    userKey: 'testUserKey',
    secret: 'testSecret',
    gigyaConsole: 'testGigyaConsole',
  }
  const site = 'testSite'
  const dataCenter = 'eu1'
  let recaptchaConfig

  beforeEach(() => {
      recaptchaConfig = new RecaptchaConfiguration(credentials, site, dataCenter)
      jest.resetAllMocks()
  })

  describe('Tests that reset data', () => {
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

      const response = await recaptchaConfig.copy('targetSite', {
        dataCenter: 'eu1',
      })

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

      await expect(recaptchaConfig.setPolicies(site, 'eu1', { riskAssessmentWithReCaptchaV3: true }, { requireCaptcha: true })).rejects.toThrow(
        'Error fetching current policies: Failed to fetch policies',
      )
    })

    test('setRiskProvidersConfig throws error when response has non-zero errorCode', async () => {
      const mockErrorResponse = {
        errorCode: 500,
        errorMessage: 'Failed to set risk providers',
      }

      axios.mockResolvedValueOnce({ data: mockErrorResponse })

      await expect(
        recaptchaConfig.setRiskProvidersConfig(site, dataCenter, {
          provider: 'testProvider',
        }),
      ).rejects.toThrow('Error setting Risk Providers configuration: Failed to set risk providers')
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
      const mockSetRecaptchaError = {
        errorCode: 500,
        errorMessage: 'Failed to set recaptcha config',
      }

      axios
        .mockResolvedValueOnce({ data: mockRecaptchaResponse })
        .mockResolvedValueOnce({ data: mockPoliciesResponse })
        .mockResolvedValueOnce({ data: mockRiskProvidersResponse })
        .mockResolvedValueOnce({ data: mockSetRecaptchaError })

      await expect(recaptchaConfig.copy('targetSite', { dataCenter: 'eu1' })).rejects.toThrow('Error setting reCAPTCHA configuration: Failed to set recaptcha config')
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
  })

describe('RecaptchaConfiguration setFromFiles tests', () => {

  const recaptchaConfig = new RecaptchaConfiguration(credentials, site, dataCenter)

  test('setFromFiles sets configurations successfully', async () => {
    const config = {
      recaptchaConfig: { test: 'recaptchaConfig' },
      securityPolicies: { riskAssessmentWithReCaptchaV3: true },
      registrationPolicies: { requireCaptcha: true },
      riskProvidersConfig: { provider: 'testProvider' },
    }

    const expectedGigyaResponseOk = {
      errorCode: 0,
    }

    axios
      .mockResolvedValueOnce({ data: expectedGigyaResponseOk }) // setRecaptchaConfig
      .mockResolvedValueOnce({ data: expectedGigyaResponseOk }) // setPolicies
      .mockResolvedValueOnce({ data: expectedGigyaResponseOk }) // setRiskProvidersConfig

    const response = await recaptchaConfig.setFromFiles(site, dataCenter, config)

    expect(response).toEqual(config)

    // Mock the correct sequences of calls
    expect(axios).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        url: expect.stringContaining('admin.captcha.setConfig'),
      }),
    )
    expect(axios).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        url: expect.stringContaining('accounts.setPolicies'),
      }),
    )
    expect(axios).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        url: expect.stringContaining('admin.riskProviders.setConfig'),
      }),
    )
  })

  test('setFromFiles fails when recaptcha config is missing', async () => {
    const config = {
      securityPolicies: { riskAssessmentWithReCaptchaV3: true },
      registrationPolicies: { requireCaptcha: true },
      riskProvidersConfig: { provider: 'testProvider' },
    }

    await expect(recaptchaConfig.setFromFiles(site, dataCenter, config)).rejects.toThrow('Recaptcha config is invalid or undefined.')
  })

  test('setFromFiles fails when policies are missing', async () => {
    const config = {
      recaptchaConfig: { test: 'recaptchaConfig' },
      riskProvidersConfig: { provider: 'testProvider' },
    }

    // Mock the setRecaptchaConfig axios response
    axios.mockResolvedValueOnce({ data: { errorCode: 0 } })

    await expect(recaptchaConfig.setFromFiles(site, dataCenter, config)).rejects.toThrow('Policies are invalid or undefined.')
  })

  test('setFromFiles fails when setting recaptcha config fails', async () => {
    const config = {
      recaptchaConfig: { test: 'recaptchaConfig' },
      securityPolicies: { riskAssessmentWithReCaptchaV3: true },
      registrationPolicies: { requireCaptcha: true },
      riskProvidersConfig: { provider: 'testProvider' },
    }
    const mockErrorResponse = {
      errorCode: 500,
      errorMessage: 'Internal server error',
    }

    axios.mockResolvedValueOnce({ data: mockErrorResponse }) // setRecaptchaConfig

    await expect(recaptchaConfig.setFromFiles(site, dataCenter, config)).rejects.toThrow('Error setting reCAPTCHA configuration: Internal server error')
  })

  test('setFromFiles fails when setting policies fails', async () => {
    const config = {
      recaptchaConfig: { test: 'recaptchaConfig' },
      securityPolicies: { riskAssessmentWithReCaptchaV3: true },
      registrationPolicies: { requireCaptcha: true },
      riskProvidersConfig: { provider: 'testProvider' },
    }
    const expectedGigyaResponseOk = {
      errorCode: 0,
    }

    axios
      .mockResolvedValueOnce({ data: expectedGigyaResponseOk }) // setRecaptchaConfig
      .mockResolvedValueOnce({
        data: { errorCode: 500, errorMessage: 'Internal server error' },
      }) // setPolicies

    await expect(recaptchaConfig.setFromFiles(site, dataCenter, config)).rejects.toThrow('Error fetching current policies: Internal server error')

    // Verify that the correct API calls were made
    expect(axios).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        url: expect.stringContaining('admin.captcha.setConfig'),
      }),
    )
    expect(axios).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        url: expect.stringContaining('accounts.setPolicies'),
      }),
    )
  })

  test('setFromFiles fails when setting risk providers config fails', async () => {
    const config = {
      recaptchaConfig: { test: 'recaptchaConfig' },
      securityPolicies: { riskAssessmentWithReCaptchaV3: true },
      registrationPolicies: { requireCaptcha: true },
      riskProvidersConfig: { provider: 'testProvider' },
    }
    const expectedGigyaResponseOk = {
      errorCode: 0,
    }

    axios
      .mockResolvedValueOnce({ data: expectedGigyaResponseOk }) // setRecaptchaConfig
      .mockResolvedValueOnce({ data: expectedGigyaResponseOk }) // setPolicies
      .mockResolvedValueOnce({
        data: { errorCode: 500, errorMessage: 'Internal server error' },
      }) // setRiskProvidersConfig

    await expect(recaptchaConfig.setFromFiles(site, dataCenter, config)).rejects.toThrow('Error setting Risk Providers configuration: Internal server error')

    // Verify that the correct API calls were made
    expect(axios).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        url: expect.stringContaining('admin.captcha.setConfig'),
      }),
    )
    expect(axios).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        url: expect.stringContaining('accounts.setPolicies'),
      }),
    )
    expect(axios).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        url: expect.stringContaining('admin.riskProviders.setConfig'),
      }),
    )
  })

  test('setFromFiles handles missing risk providers config gracefully', async () => {
    const config = {
      recaptchaConfig: { test: 'recaptchaConfig' },
      securityPolicies: { riskAssessmentWithReCaptchaV3: true },
      registrationPolicies: { requireCaptcha: true },
    }
    const expectedGigyaResponseOk = {
      errorCode: 0,
    }

    axios
      .mockResolvedValueOnce({ data: expectedGigyaResponseOk }) // setRecaptchaConfig
      .mockResolvedValueOnce({ data: expectedGigyaResponseOk }) // setPolicies

    const response = await recaptchaConfig.setFromFiles(site, dataCenter, config)

    expect(response).toEqual(config)
  })
})
})
