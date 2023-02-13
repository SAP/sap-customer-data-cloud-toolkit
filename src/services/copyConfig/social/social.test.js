import axios from 'axios'
import * as SocialsTestData from './dataTest'
import Social from './social'
import * as CommonTestData from '../../servicesDataTest'
import {getExpectedSetSocialsProvidersResponseWithContext} from "./dataTest";

jest.mock('axios')
jest.setTimeout(10000)

describe('Socials test suite', () => {
  const social = new Social(CommonTestData.credentials.userKey, CommonTestData.credentials.secret, 'apiKey', 'us1')

  const targetDataCenter = 'us1'
  const targetApiKey = 'targetApiKey'
  const socialsKeys = 'APP KEY'
  const responseId = 'socialIdentities'

  test('copy socials successfully', async () => {
    axios.mockResolvedValueOnce({ data: SocialsTestData.getSocialsProviders(socialsKeys) }).mockResolvedValueOnce({ data: SocialsTestData.getExpectedSetSocialsProvidersResponseWithContext(targetApiKey) })
    const response = await social.copy(targetApiKey, targetDataCenter)
    CommonTestData.verifyResponseIsOk(response)
    expect(response.context.id).toEqual(`${responseId}`)
    expect(response.context.targetApiKey).toEqual(`${targetApiKey}`)
  })
  test('copy socials - invalid target api', async () => {
    const mockRes = CommonTestData.expectedGigyaResponseInvalidAPI
    mockRes.context = { id: responseId, targetApiKey: targetApiKey }
    axios.mockResolvedValueOnce({ data: SocialsTestData.getSocialsProviders(socialsKeys) }).mockResolvedValueOnce({ data: mockRes })

    const response = await social.copy(targetApiKey, targetDataCenter)
    expect(response).toEqual(mockRes)
    expect(response.context.id).toEqual(`${responseId}`)
    expect(response.context.targetApiKey).toEqual(`${targetApiKey}`)
  })

  test('copy socials - invalid user key', async () => {
    const mockRes = CommonTestData.expectedGigyaInvalidUserKey
    mockRes.context = { id: responseId, targetApiKey: targetApiKey }
    axios.mockResolvedValueOnce({ data: SocialsTestData.getSocialsProviders(socialsKeys) }).mockResolvedValueOnce({ data: mockRes })

    const response = await social.copy(targetApiKey, targetDataCenter)
    expect(response).toEqual(mockRes)
    expect(response.context.id).toEqual(`${responseId}`)
    expect(response.context.targetApiKey).toEqual(`${targetApiKey}`)
  })

  test('copy unsuccessfully - error on get', async () => {
    const mockRes = CommonTestData.expectedGigyaResponseInvalidAPI
    mockRes.context = { id: responseId, targetApiKey: targetApiKey }
    axios.mockResolvedValueOnce({ data: mockRes })

    const response = await social.copy(targetApiKey, targetDataCenter)
    expect(response).toEqual(mockRes)
    expect(response.context.id).toEqual(`${responseId}`)
    expect(response.context.targetApiKey).toEqual(`${targetApiKey}`)
  })
})
