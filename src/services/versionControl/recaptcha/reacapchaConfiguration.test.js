import axios from 'axios'
import RecaptchaConfigurationManager from './recaptchConfigurationVersionControl'
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
    recaptchaConfig = new RecaptchaConfigurationManager(credentials, site, dataCenter)
    jest.resetAllMocks()
  })

  describe('RecaptchaConfiguration setFromFiles tests', () => {

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
