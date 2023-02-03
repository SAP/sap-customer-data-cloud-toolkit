import axios from 'axios'
import * as SocialsTestData from './dataTest'
import Social from './social'
import * as CommonTestData from '../../servicesDataTest'
import { errorCallback } from '../../servicesDataTest'

jest.mock('axios')
jest.setTimeout(10000)
describe('Socials test suite', () => {
  const social = new Social(CommonTestData.credentials.userKey, CommonTestData.credentials.secret, 'apiKey', 'us1')

  const targetDataCenter = 'us1'
  const targetApiKey = 'targetApiKey'
  const socialsKeys = 'APP KEY'

  test('copy socials successfully', async () => {
    axios.mockResolvedValueOnce({ data: SocialsTestData.getSocialsProviders(socialsKeys) }).mockResolvedValueOnce({ data: SocialsTestData.expectedSetSocialsProvidersResponse })
    const response = await social.copy(targetApiKey, targetDataCenter)
    CommonTestData.verifyResponseIsOk(response)
    expect(response.id).toEqual('Social;targetApiKey')
  })
  test('copy socials - invalid target api', async () => {
    const mockRes = { data: CommonTestData.expectedGigyaResponseInvalidAPI }
    const err = {
      message: mockRes.data.errorMessage,
      code: mockRes.data.errorCode,
      details: mockRes.data.errorDetails,
    }
    axios.mockResolvedValueOnce({ data: SocialsTestData.getSocialsProviders(socialsKeys) }).mockResolvedValueOnce(mockRes)

    await social.copy(targetApiKey, targetDataCenter).catch((error) => {
      errorCallback(error, err)
      expect(error.id).toEqual(`Social;${targetApiKey}`)
    })
  })

  test('copy socials - invalid user key', async () => {
    const mockRes = { data: CommonTestData.expectedGigyaInvalidUserKey }
    const err = {
      message: mockRes.data.errorMessage,
      code: mockRes.data.errorCode,
      details: mockRes.data.errorDetails,
    }
    axios.mockResolvedValueOnce({ data: SocialsTestData.getSocialsProviders(socialsKeys) }).mockResolvedValueOnce(mockRes)

    await social.copy(targetApiKey, targetDataCenter).catch((error) => {
      errorCallback(error, err)
      expect(error.id).toEqual(`Social;${targetApiKey}`)
    })
  })

  test('copy unsuccessfully - error on get', async () => {
    const mockRes = { data: CommonTestData.expectedGigyaResponseInvalidAPI }
    const err = {
      message: mockRes.data.errorMessage,
      code: mockRes.data.errorCode,
      details: mockRes.data.errorDetails,
    }
    axios.mockResolvedValueOnce(mockRes)

    await social.copy(targetApiKey, targetDataCenter).catch((error) => {
      errorCallback(error, err)
      expect(error.id).toEqual(`Social;${targetApiKey}`)
    })
  })
})
