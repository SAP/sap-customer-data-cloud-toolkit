import axios from 'axios'
import * as SocialsTestData from './dataTest'
import Social from './social'
import * as CommonTestData from '../../servicesDataTest'

jest.mock('axios')
jest.setTimeout(10000)

describe('Socials test suite', () => {
  const social = new Social(CommonTestData.credentials.userKey, CommonTestData.credentials.secret, 'apiKey', 'us1')

  const targetDataCenter = 'us1'
  const targetApiKey = 'targetApiKey'
  const socialsKeys = 'APP KEY'
  const responseId = 'socialIdentities'

  test('copy socials successfully', async () => {
    axios.mockResolvedValueOnce({ data: SocialsTestData.getSocialsProviders(socialsKeys) }).mockResolvedValueOnce({ data: SocialsTestData.expectedSetSocialsProvidersResponse })
    const response = await social.copy(targetApiKey, targetDataCenter)
    CommonTestData.verifyResponseIsOk(response)
    expect(response.id).toEqual(`${responseId}`)
    expect(response.targetApiKey).toEqual(`${targetApiKey}`)
  })
  test('copy socials - invalid target api', async () => {
    const mockRes = CommonTestData.expectedGigyaResponseInvalidAPI
    axios.mockResolvedValueOnce({ data: SocialsTestData.getSocialsProviders(socialsKeys) }).mockResolvedValueOnce({ data: mockRes })

    const response = await social.copy(targetApiKey, targetDataCenter)
    expect(response).toEqual(mockRes)
    expect(response.id).toEqual(`${responseId}`)
    expect(response.targetApiKey).toEqual(`${targetApiKey}`)
  })

  test('copy socials - invalid user key', async () => {
    const mockRes = CommonTestData.expectedGigyaInvalidUserKey
    axios.mockResolvedValueOnce({ data: SocialsTestData.getSocialsProviders(socialsKeys) }).mockResolvedValueOnce({ data: mockRes })

    const response = await social.copy(targetApiKey, targetDataCenter)
    expect(response).toEqual(mockRes)
    expect(response.id).toEqual(`${responseId}`)
    expect(response.targetApiKey).toEqual(`${targetApiKey}`)
  })

  test('copy unsuccessfully - error on get', async () => {
    const mockRes = CommonTestData.expectedGigyaResponseInvalidAPI
    axios.mockResolvedValueOnce({ data: mockRes })

    const response = await social.copy(targetApiKey, targetDataCenter)
    expect(response).toEqual(mockRes)
    expect(response.id).toEqual(`${responseId}`)
    expect(response.targetApiKey).toEqual(`${targetApiKey}`)
  })
})
