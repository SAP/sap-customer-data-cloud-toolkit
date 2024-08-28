import axios from 'axios'
import Recaptcha from './recaptcha.js'

jest.mock('axios')

describe('Recaptcha test suite', () => {
  const credentials = {
    userKey: 'testUserKey',
    secret: 'testSecret',
    gigyaConsole: 'testGigyaConsole',
  }
  const site = 'testSite'
  const dataCenter = 'eu1'
  const recaptcha = new Recaptcha(credentials.userKey, credentials.secret, credentials.gigyaConsole)

  test('get recaptcha configuration successfully', async () => {
    const mockResponse = {
      errorCode: 0,
      Config: [{ Type: 1 }, { Type: 2 }],
    }

    axios.mockResolvedValueOnce({ data: mockResponse })

    const response = await recaptcha.get(site, dataCenter)
    expect(response.errorCode).toBe(0)
    expect(response.Config).toEqual(mockResponse.Config)
  })

  test('get recaptcha configuration with error', async () => {
    const mockErrorResponse = {
      response: {
        data: {
          errorCode: 500,
          errorMessage: 'Internal server error',
        },
      },
    }

    axios.mockRejectedValueOnce(mockErrorResponse)

    const response = await recaptcha.get(site, dataCenter)
    expect(response).toEqual({
      data: {
        errorCode: undefined,
        errorDetails: "Cannot read properties of undefined (reading 'data')",
        errorMessage: 'Error getting Recaptcha configuration',
        time: expect.any(Number),
      },
    })
  })

  test('set recaptcha configuration successfully', async () => {
    const mockResponse = { errorCode: 0 }

    axios.mockResolvedValueOnce({ data: mockResponse })

    const response = await recaptcha.set(site, dataCenter, { test: 'config' })
    expect(response.errorCode).toBe(0)
  })

  test('set recaptcha configuration with error', async () => {
    const mockErrorResponse = {
      response: {
        data: {
          errorCode: 500,
          errorMessage: 'Internal server error',
        },
      },
    }

    axios.mockRejectedValueOnce(mockErrorResponse)

    const response = await recaptcha.set(site, dataCenter, { test: 'config' })
    expect(response).toEqual({
      data: {
        errorCode: undefined,
        errorDetails: "Cannot read properties of undefined (reading 'data')",
        errorMessage: 'Error setting reCAPTCHA configuration',
        time: expect.any(Number),
      },
    })
  })
})
