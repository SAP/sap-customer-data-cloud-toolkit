import Rba from './rba.js'
import Policy from './policy.js'
import { credentials, expectedGigyaResponseInvalidAPI, expectedGigyaResponseOk, verifyAllResponsesAreOk } from '../../servicesDataTest.js'
import {
  expectedGetRbaPolicyResponseOk,
  expectedGetRiskAssessmentResponseOk,
  expectedGetUnknownLocationNotificationResponseOk,
  expectedGetDestinationRbaPolicyResponseOk,
} from './dataTest.js'
import axios from 'axios'
import RbaOptions from './rbaOptions.js'
import RiskAssessment from './riskAssessment.js'
import { getExpectedResponseWithContext, getExpectedResponseWithContextAsString } from '../dataTest.js'
import { ERROR_CODE_CANNOT_CHANGE_RBA_ON_CHILD_SITE } from '../../errors/generateErrorResponse'

jest.mock('axios')

describe('RBA test suite', () => {
  const apiKey = 'apiKey'
  const dataCenter = 'eu1'
  const rba = new Rba(credentials, apiKey, { dataCenter })
  const options = new RbaOptions(rba)

  test('get rba successfully', async () => {
    axios
      .mockResolvedValueOnce({ data: expectedGetRiskAssessmentResponseOk })
      .mockResolvedValueOnce({ data: expectedGetUnknownLocationNotificationResponseOk })
      .mockResolvedValueOnce({ data: expectedGetRbaPolicyResponseOk })

    const responses = await rba.get()

    expect(responses[0]).toBe(expectedGetRiskAssessmentResponseOk)
    expect(responses[1]).toBe(expectedGetUnknownLocationNotificationResponseOk)
    expect(responses[2]).toBe(expectedGetRbaPolicyResponseOk)
  })

  test('copy successfully with merge', async () => {
    const initialDestinationPolicyLength = expectedGetDestinationRbaPolicyResponseOk.policy.commonRules.length

    axios
      .mockResolvedValueOnce({ data: expectedGetRiskAssessmentResponseOk })
      .mockResolvedValueOnce({ data: expectedGetUnknownLocationNotificationResponseOk })
      .mockResolvedValueOnce({ data: expectedGetRbaPolicyResponseOk })
      .mockResolvedValueOnce({ data: getExpectedResponseWithContext(expectedGigyaResponseOk, RiskAssessment.CONTEXT_ID, apiKey) })
      .mockResolvedValueOnce({ data: getExpectedResponseWithContextAsString(expectedGigyaResponseOk, Rba.UNKNOWN_LOCATION_NOTIFICATION_CONTEXT_ID, apiKey) })
      .mockResolvedValueOnce({ data: expectedGetDestinationRbaPolicyResponseOk })
      .mockResolvedValueOnce({ data: getExpectedResponseWithContextAsString(expectedGigyaResponseOk, Policy.CONTEXT_ID, apiKey) })

    const spy = jest.spyOn(rba, 'mergeCommonRules')

    const responses = await rba.copy(apiKey, { dataCenter }, options)

    expect(responses[0]).toStrictEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, RiskAssessment.CONTEXT_ID, apiKey))
    expect(responses[1]).toStrictEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, Rba.UNKNOWN_LOCATION_NOTIFICATION_CONTEXT_ID, apiKey))
    expect(responses[2]).toStrictEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, Policy.CONTEXT_ID, apiKey))
    expect(spy).toHaveBeenCalled()

    const finalMergedPolicyLength = spy.mock.calls[0][1].length

    expect(finalMergedPolicyLength).toBeGreaterThan(initialDestinationPolicyLength)
  })

  test('copy unsuccessfully', async () => {
    axios
      .mockResolvedValueOnce({ data: expectedGetRiskAssessmentResponseOk })
      .mockResolvedValueOnce({ data: expectedGetUnknownLocationNotificationResponseOk })
      .mockResolvedValueOnce({ data: expectedGetRbaPolicyResponseOk })
      .mockResolvedValueOnce({ data: getExpectedResponseWithContext(expectedGigyaResponseInvalidAPI, RiskAssessment.CONTEXT_ID, apiKey) })
      .mockResolvedValueOnce({ data: getExpectedResponseWithContextAsString(expectedGigyaResponseOk, Rba.UNKNOWN_LOCATION_NOTIFICATION_CONTEXT_ID, apiKey) })
      .mockResolvedValueOnce({ data: expectedGetDestinationRbaPolicyResponseOk })
      .mockResolvedValueOnce({ data: getExpectedResponseWithContextAsString(expectedGigyaResponseOk, Policy.CONTEXT_ID, apiKey) })

    const responses = await rba.copy(apiKey, { dataCenter }, options)
    expect(responses[0]).toStrictEqual(getExpectedResponseWithContext(expectedGigyaResponseInvalidAPI, RiskAssessment.CONTEXT_ID, apiKey))
    expect(responses[1]).toStrictEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, Rba.UNKNOWN_LOCATION_NOTIFICATION_CONTEXT_ID, apiKey))
    expect(responses[2]).toStrictEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, Policy.CONTEXT_ID, apiKey))
  })

  test('copy successfully with replace', async () => {
    axios
      .mockResolvedValueOnce({ data: expectedGetRiskAssessmentResponseOk })
      .mockResolvedValueOnce({ data: expectedGetUnknownLocationNotificationResponseOk })
      .mockResolvedValueOnce({ data: expectedGetRbaPolicyResponseOk })
      .mockResolvedValueOnce({ data: getExpectedResponseWithContext(expectedGigyaResponseOk, RiskAssessment.CONTEXT_ID, apiKey) })
      .mockResolvedValueOnce({ data: getExpectedResponseWithContextAsString(expectedGigyaResponseOk, Rba.UNKNOWN_LOCATION_NOTIFICATION_CONTEXT_ID, apiKey) })
      .mockResolvedValueOnce({ data: getExpectedResponseWithContextAsString(expectedGigyaResponseOk, Policy.CONTEXT_ID, apiKey) })

    const spy = jest.spyOn(rba, 'setRbaRulesAndSettings')

    options.options.branches.find((branch) => branch.id === RbaOptions.RULES).operation = Rba.OPERATION.REPLACE

    const responses = await rba.copy(apiKey, { dataCenter }, options)

    verifyAllResponsesAreOk(responses)
    expect(responses.length).toBe(3)
    expect(spy).toHaveBeenCalledWith(apiKey, { dataCenter }, expectedGetRbaPolicyResponseOk, 'replace')
  })

  test('copy to child site', async () => {
    const siteConfig = {
      dataCenter: dataCenter,
      siteGroupOwner: 'anyOtherApiKey',
    }
    const responses = await rba.copy(apiKey, siteConfig, options)
    expect(responses.length).toBe(1)
    expect(responses[0].errorCode).toStrictEqual(ERROR_CODE_CANNOT_CHANGE_RBA_ON_CHILD_SITE)
  })
})
