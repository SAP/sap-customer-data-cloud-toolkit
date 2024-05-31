/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { credentials, expectedGigyaResponseOk, expectedGigyaResponseInvalidAPI, expectedGigyaInvalidUserKey } from '../../servicesDataTest.js'
import Policy from './policies.js'
import axios from 'axios'
import * as PolicyTestData from './dataTest.js'
import { getExpectedResponseWithContext, getResponseWithContext, policyId } from '../dataTest.js'
import PolicyOptions from './policyOptions.js'

jest.mock('axios')
jest.setTimeout(10000)
describe('Policies test suite', () => {
  const targetDataCenter = 'eu1'
  const targetApiKey = 'targetApiKey'
  const policy = new Policy(credentials, 'apiKey', 'eu1')

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  const allOptions = new PolicyOptions(policy).addSupportedPolicies(PolicyTestData.getPolicyConfig).getOptions()

  test('copy policies successfully', async () => {
    axios.mockResolvedValueOnce({ data: PolicyTestData.getPolicyConfig }).mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, policyId, targetApiKey) })
    const response = await policy.copy(targetApiKey, targetDataCenter, allOptions)

    expect(response).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, policyId, targetApiKey))
    expect(response.context.id).toEqual(policyId)
    expect(response.context.targetApiKey).toEqual(`${targetApiKey}`)
  })

  test.each([
    ['emailVerification', true],
    ['emailVerification', false],
    ['doubleOptIn', true],
    ['doubleOptIn', false],
  ])('copy successfully links url %s', async (policyName, linkValue) => {
    const options = new PolicyOptions(policy).addSupportedPolicies(PolicyTestData.getPolicyConfig).getOptionsDisabled()
    const policyOption = options.branches.find((opt) => opt.propertyName === policyName)
    policyOption.value = true
    policyOption.branches.map((opt) => (opt.value = linkValue))

    axios.mockResolvedValueOnce({ data: PolicyTestData.getPolicyConfig }).mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, policyId, targetApiKey) })
    let spy = jest.spyOn(policy, 'set')
    const response = await policy.copy(targetApiKey, { dataCenter: targetDataCenter }, options)

    expect(response).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, policyId, targetApiKey))
    expect(response.context.id).toEqual(policyId)
    expect(response.context.targetApiKey).toEqual(`${targetApiKey}`)

    expect(spy.mock.calls.length).toBe(1)
    let expectedTemplate = PolicyTestData.getPoliciesExpectedResponseWithNoObjects()
    expectedTemplate = Object.assign(expectedTemplate, { [policyName]: JSON.parse(JSON.stringify(PolicyTestData.getPolicyConfig[policyName])) })
    if (!linkValue) {
      delete expectedTemplate[policyName]['nextURL']
      delete expectedTemplate[policyName]['nextExpiredURL']
    }
    expect(spy).toHaveBeenCalledWith(targetApiKey, expectedTemplate, targetDataCenter)
  })

  test.each([
    ['emailVerification', true],
    ['doubleOptIn', true],
  ])('copy successfully only links url %s', async (policyName, linkValue) => {
    const options = new PolicyOptions(policy).addSupportedPolicies(PolicyTestData.getPolicyConfig).getOptionsDisabled()
    const policyOption = options.branches.find((opt) => opt.propertyName === policyName)
    policyOption.branches.map((opt) => (opt.value = linkValue))

    axios.mockResolvedValueOnce({ data: PolicyTestData.getPolicyConfig }).mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, policyId, targetApiKey) })
    let spy = jest.spyOn(policy, 'set')
    const response = await policy.copy(targetApiKey, { dataCenter: targetDataCenter }, options)

    expect(response).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, policyId, targetApiKey))
    expect(response.context.id).toEqual(policyId)
    expect(response.context.targetApiKey).toEqual(`${targetApiKey}`)

    expect(spy.mock.calls.length).toBe(1)
    let expectedTemplate = PolicyTestData.getPoliciesExpectedResponseWithNoObjects()
    expectedTemplate = Object.assign(expectedTemplate, { [policyName]: {} })
    Object.assign(expectedTemplate[policyName], { ['nextURL']: PolicyTestData.getPolicyConfig[policyName]['nextURL'] })
    if (PolicyTestData.getPolicyConfig[policyName]['nextExpiredURL']) {
      Object.assign(expectedTemplate[policyName], { ['nextExpiredURL']: PolicyTestData.getPolicyConfig[policyName]['nextExpiredURL'] })
    }
    expect(spy).toHaveBeenCalledWith(targetApiKey, expectedTemplate, targetDataCenter)
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

  test.each([
    'accountOptions',
    'codeVerification',
    'emailNotifications',
    'emailVerification',
    'federation',
    'passwordComplexity',
    'passwordReset',
    'profilePhoto',
    'registration',
    'security',
    'gigyaPlugins',
    'twoFactorAuth',
    'preferencesCenter',
    'authentication',
    'doubleOptIn',
  ])('copy successfully profile %s', async (property) => {
    executeTest(property)
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
    deleteResponseFields(mockedResponse, optionName)
    expect(spy).toHaveBeenCalledWith(targetApiKey, mockedResponse, undefined)
  }

  function deleteResponseFields(response, field) {
    if (field === 'security') {
      delete response.security.accountLockout
      delete response.security.captcha
      delete response.security.ipLockout
    }
    // the following fields should only be copied when processing emails
    if (field === 'passwordReset') {
      delete response.passwordReset.resetURL
    }
    if (field === 'preferencesCenter') {
      delete response.preferencesCenter.redirectURL
    }
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
