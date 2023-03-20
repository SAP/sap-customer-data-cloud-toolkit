import { credentials, expectedGigyaResponseOk, expectedGigyaResponseInvalidAPI, expectedGigyaInvalidUserKey } from '../../servicesDataTest'
import Policy from './policies'
import axios from 'axios'
import * as PolicyTestData from './dataTest'
import { getExpectedResponseWithContext, getResponseWithContext, policyId } from '../dataTest'

jest.mock('axios')
jest.setTimeout(10000)
describe('Policies test suite', () => {
  const targetDataCenter = 'eu1'
  const targetApiKey = 'targetApiKey'
  const policy = new Policy(credentials, 'apiKey', 'eu1')

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  const allOptions = {
    branches: [
      { id: 'registration', value: true },
      { id: 'Web Sdk', value: false },
      { id: 'accountOptions', value: true },
      { id: 'passwordComplexity', value: false },
      { id: 'security', value: false },
      { id: 'emailVerification', value: false },
      { id: 'emailNotifications', value: false },
      { id: 'passwordReset', value: false },
      { id: 'codeVerification', value: false },
      { id: 'profilePhoto', value: false },
      { id: 'federation', value: false },
      { id: 'twoFactorAuth', value: false },
      { id: 'doubleOptIn', value: false },
      { id: 'gigyaPlugins', value: false },
      { id: 'rba', value: false },
      { id: 'preferencesCenter', value: false },
    ],
  }

  test('copy policies successfully', async () => {
    axios.mockResolvedValueOnce({ data: PolicyTestData.getPolicyConfig }).mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, policyId, targetApiKey) })
    const response = await policy.copy(targetApiKey, targetDataCenter, allOptions)

    expect(response).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, policyId, targetApiKey))
    expect(response.context.id).toEqual(policyId)
    expect(response.context.targetApiKey).toEqual(`${targetApiKey}`)
  })

  test('copy policies - invalid target api', async () => {
    const mockRes = getResponseWithContext(expectedGigyaResponseInvalidAPI, policyId, targetApiKey)
    axios.mockResolvedValueOnce({ data: PolicyTestData.getPolicyConfig }).mockResolvedValueOnce({ data: mockRes })

    const response = await policy.copy(targetApiKey, targetDataCenter, allOptions)
    expect(response).toEqual(getExpectedResponseWithContext(expectedGigyaResponseInvalidAPI, policyId, targetApiKey))
    expect(response.context.id).toEqual(`${policyId}`)
    expect(response.context.targetApiKey).toEqual(`${targetApiKey}`)
  })
  test('copy policies - invalid user key', async () => {
    const mockRes = getResponseWithContext(expectedGigyaInvalidUserKey, policyId, targetApiKey)
    axios.mockResolvedValueOnce({ data: PolicyTestData.getPolicyConfig }).mockResolvedValueOnce({ data: mockRes })

    const response = await policy.copy(targetApiKey, targetDataCenter, allOptions)
    expect(response).toEqual(getExpectedResponseWithContext(expectedGigyaInvalidUserKey, policyId, targetApiKey))
    expect(response.context.id).toEqual(`${policyId}`)
    expect(response.context.targetApiKey).toEqual(`${targetApiKey}`)
  })
  test('copy unsuccessfully - error on get', async () => {
    const mockRes = getResponseWithContext(expectedGigyaResponseInvalidAPI, policyId, targetApiKey)
    axios.mockResolvedValueOnce({ data: mockRes })

    const response = await policy.copy(targetApiKey, targetDataCenter, allOptions)
    expect(response).toEqual(getExpectedResponseWithContext(expectedGigyaResponseInvalidAPI, policyId, targetApiKey))
    expect(response.context.id).toEqual(`${policyId}`)
    expect(response.context.targetApiKey).toEqual(`${targetApiKey}`)
  })

  test('copy successfully account options', async () => {
    executeTest('accountOptions')
  })
  test('copy successfully code verification', async () => {
    executeTest('codeVerification')
  })
  test('copy successfully emailNotifications', async () => {
    executeTest('emailNotifications')
  })
  test('copy successfully emailVerification', async () => {
    executeTest('emailVerification')
  })
  test('copy successfully federation', async () => {
    executeTest('federation')
  })
  test('copy successfully passwordComplexity', async () => {
    executeTest('passwordComplexity')
  })

  test('copy successfully passwordReset', async () => {
    executeTest('passwordReset')
  })
  test('copy successfully profilePhoto', async () => {
    executeTest('profilePhoto')
  })
  test('copy successfully registration', async () => {
    executeTest('registration')
  })
  test('copy successfully security', async () => {
    executeTest('security')
  })
  test('copy successfully webSdk', async () => {
    executeTest('gigyaPlugins')
  })
  test('copy successfully twoFactorAuth', async () => {
    executeTest('twoFactorAuth')
  })

  async function executeCopy(expectedResponse, optionName) {
    const response = await policy.copy(targetApiKey, targetDataCenter, optionName)
    expect(response).toEqual(getExpectedResponseWithContext(expectedResponse, policyId, targetApiKey))
    expect(response.context.id).toEqual(policyId)
    expect(response.context.targetApiKey).toEqual(targetApiKey)
  }

  async function executeTest(optionName) {
    let spy = jest.spyOn(policy, 'set')
    const mockedResponse = PolicyTestData.getPoliciesExpectedResponseWithNoObjects()
    mockedResponse[optionName] = PolicyTestData.getPolicyConfig[optionName]
    axios.mockResolvedValueOnce({ data: mockedResponse }).mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, policyId, targetApiKey) })
    await executeCopy(getResponseWithContext(expectedGigyaResponseOk, policyId, targetApiKey), getPolicyInfo(optionName))
    expect(spy.mock.calls.length).toBe(1)

    expect(spy).toHaveBeenCalledWith(targetApiKey, mockedResponse, undefined)
  }

  function getPolicyInfo(optionName) {
    return {
      id: 'policy',
      name: 'policy',
      value: false,
      branches: [
        {
          id: optionName,
          name: optionName,
          value: true,
        },
      ],
    }
  }
})
