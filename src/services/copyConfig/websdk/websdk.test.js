import axios from 'axios'
import * as WebSDKTestData from './dataTest'
import { getExpectedResponseWithContext, getResponseWithContext, webSdkId } from '../dataTest'
import { expectedGigyaInvalidUserKey, expectedGigyaResponseInvalidAPI, credentials, expectedGigyaResponseOk } from '../../servicesDataTest'
import WebSdk from './websdk'

jest.mock('axios')
jest.setTimeout(10000)

describe('Web SDK test suite', () => {
  const targetDataCenter = 'us1'
  const targetApiKey = 'targetApiKey'

  const webSdk = new WebSdk(credentials, targetApiKey, 'us1')

  test('copy web sdk successfully', async () => {
    axios.mockResolvedValueOnce({ data: WebSDKTestData.getSiteConfig }).mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, webSdkId, targetApiKey) })
    const response = await webSdk.copy(targetApiKey, targetDataCenter)
    expect(response).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, webSdkId, targetApiKey))
    expect(response.context.id).toEqual(`${webSdkId}`)
    expect(response.context.targetApiKey).toEqual(`${targetApiKey}`)
  })

  test('copy web sdk - invalid target api', async () => {
    const mockRes = getResponseWithContext(expectedGigyaResponseInvalidAPI, webSdkId, targetApiKey)
    axios.mockResolvedValueOnce({ data: WebSDKTestData.getSiteConfig }).mockResolvedValueOnce({ data: mockRes })

    const response = await webSdk.copy(targetApiKey, targetDataCenter)
    expect(response).toEqual(getExpectedResponseWithContext(expectedGigyaResponseInvalidAPI, webSdkId, targetApiKey))
    expect(response.context.id).toEqual(`${webSdkId}`)
    expect(response.context.targetApiKey).toEqual(`${targetApiKey}`)
  })

  test('copy web sdk - invalid user key', async () => {
    const mockRes = getResponseWithContext(expectedGigyaInvalidUserKey, webSdkId, targetApiKey)
    axios.mockResolvedValueOnce({ data: WebSDKTestData.getSiteConfig }).mockResolvedValueOnce({ data: mockRes })

    const response = await webSdk.copy(targetApiKey, targetDataCenter)
    expect(response).toEqual(getExpectedResponseWithContext(expectedGigyaInvalidUserKey, webSdkId, targetApiKey))
    expect(response.context.id).toEqual(`${webSdkId}`)
    expect(response.context.targetApiKey).toEqual(`${targetApiKey}`)
  })

  test('copy unsuccessfully - error on get', async () => {
    const mockRes = getResponseWithContext(expectedGigyaResponseInvalidAPI, webSdkId, targetApiKey)
    axios.mockResolvedValueOnce({ data: mockRes })

    const response = await webSdk.copy(targetApiKey, targetDataCenter)
    expect(response).toEqual(getExpectedResponseWithContext(expectedGigyaResponseInvalidAPI, webSdkId, targetApiKey))
    expect(response.context.id).toEqual(`${webSdkId}`)
    expect(response.context.targetApiKey).toEqual(`${targetApiKey}`)
  })
})
