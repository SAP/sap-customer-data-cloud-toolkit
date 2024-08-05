import Rba from './rba.js'
import Policy from './policy.js'
import { credentials, expectedGigyaResponseInvalidAPI, expectedGigyaResponseOk } from '../../servicesDataTest.js'
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
    console.log('====================================')
    console.log('Responses[0] = ' + JSON.stringify(responses[0]))
    console.log('Responses[1] = ' + JSON.stringify(responses[1]))
    // console.log('Responses[2] = ' + JSON.stringify(responses[2]))
    console.log('====================================')

    console.log('====================================')
    console.log('expectedGetRiskAssessmentResponseOk= ' + JSON.stringify(expectedGetRiskAssessmentResponseOk))
    console.log('expectedGetUnknownLocationNotificationResponseOk= ' + JSON.stringify(expectedGetUnknownLocationNotificationResponseOk))
    // console.log('expectedGetRbaPolicyResponseOk= ' + JSON.stringify(expectedGetRbaPolicyResponseOk))
    console.log('====================================')

    expect(responses[0]).toBe(expectedGetRiskAssessmentResponseOk)
    expect(responses[1]).toBe(expectedGetUnknownLocationNotificationResponseOk)
    expect(responses[2]).toBe(expectedGetRbaPolicyResponseOk)
  })

  test('copy successfully with merge', async () => {
    // Extract policy lengths
    const initialOriginPolicyLength = expectedGetRbaPolicyResponseOk.policy.commonRules.length
    const initialDestinationPolicyLength = expectedGetDestinationRbaPolicyResponseOk.policy.commonRules.length

    axios
      .mockResolvedValueOnce({ data: expectedGetRiskAssessmentResponseOk })
      .mockResolvedValueOnce({ data: expectedGetUnknownLocationNotificationResponseOk })
      .mockResolvedValueOnce({ data: expectedGetRbaPolicyResponseOk })
      .mockResolvedValueOnce({ data: getExpectedResponseWithContext(expectedGigyaResponseOk, RiskAssessment.CONTEXT_ID, apiKey) })
      .mockResolvedValueOnce({ data: getExpectedResponseWithContextAsString(expectedGigyaResponseOk, Rba.UNKNOWN_LOCATION_NOTIFICATION_CONTEXT_ID, apiKey) })
      .mockResolvedValueOnce({ data: expectedGetDestinationRbaPolicyResponseOk }) // Mock for initial destination policy response
      .mockResolvedValueOnce({ data: getExpectedResponseWithContextAsString(expectedGigyaResponseOk, Policy.CONTEXT_ID, apiKey) })

    const spy = jest.spyOn(rba, 'mergeCommonRules')

    const responses = await rba.copy(apiKey, { dataCenter }, options)

    expect(responses[0]).toStrictEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, RiskAssessment.CONTEXT_ID, apiKey))
    expect(responses[1]).toStrictEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, Rba.UNKNOWN_LOCATION_NOTIFICATION_CONTEXT_ID, apiKey))
    expect(responses[2]).toStrictEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, Policy.CONTEXT_ID, apiKey))
    // console.log(spy.toHaveBeenCaled() === true ? 'Spy has been called' : 'Spy has not been called')
    expect(spy).toHaveBeenCalled()

    //expected result of the poilicy length
    const finalMergedPolicyLength = spy.mock.calls[0][1].length

    // Debugging: Actual parameters
    console.log('Actual parameters:', JSON.stringify(spy.mock.calls[0], null, 2))

    // Log the initial lengths
    console.log('Initial Origin Policy Length:', initialOriginPolicyLength)
    console.log('Initial Destination Policy Length:', initialDestinationPolicyLength)
    console.log('Final Merged Policy Length:', finalMergedPolicyLength)

    // Verify if the final merged response has more policies
    expect(finalMergedPolicyLength).toBeGreaterThan(initialDestinationPolicyLength)

    // Debugging: log the actual final merged response
    console.log('Final merged response:', JSON.stringify(spy.mock.calls[0][1], null, 2))
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

  test('copy unsuccessfully', async () => {
    axios
      .mockResolvedValueOnce({ data: expectedGetRiskAssessmentResponseOk })
      .mockResolvedValueOnce({ data: expectedGetUnknownLocationNotificationResponseOk })
      .mockResolvedValueOnce({ data: expectedGetRbaPolicyResponseOk })
      .mockResolvedValueOnce({ data: getExpectedResponseWithContext(expectedGigyaResponseInvalidAPI, RiskAssessment.CONTEXT_ID, apiKey) })
      .mockResolvedValueOnce({ data: getExpectedResponseWithContextAsString(expectedGigyaResponseOk, Rba.UNKNOWN_LOCATION_NOTIFICATION_CONTEXT_ID, apiKey) })
      .mockResolvedValueOnce({ data: expectedGetDestinationRbaPolicyResponseOk }) // Mock for initial destination policy response
      .mockResolvedValueOnce({ data: getExpectedResponseWithContextAsString(expectedGigyaResponseOk, Policy.CONTEXT_ID, apiKey) })

    const responses = await rba.copy(apiKey, { dataCenter }, options)
    expect(responses[0]).toStrictEqual(getExpectedResponseWithContext(expectedGigyaResponseInvalidAPI, RiskAssessment.CONTEXT_ID, apiKey))
    expect(responses[1]).toStrictEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, Rba.UNKNOWN_LOCATION_NOTIFICATION_CONTEXT_ID, apiKey))
    expect(responses[2]).toStrictEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, Policy.CONTEXT_ID, apiKey))
  })
})
