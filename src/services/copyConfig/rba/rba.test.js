import Rba from './rba.js'
import Policy from './policy.js'
import { credentials, expectedGigyaResponseInvalidAPI, expectedGigyaResponseOk } from '../../servicesDataTest.js'
import { expectedGetRbaPolicyResponseOk, expectedGetRiskAssessmentResponseOk, expectedGetUnknownLocationNotificationResponseOk } from './dataTest.js'
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

  test('copy successfully', async () => {
    axios
      .mockResolvedValueOnce({ data: expectedGetRiskAssessmentResponseOk })
      .mockResolvedValueOnce({ data: expectedGetUnknownLocationNotificationResponseOk })
      .mockResolvedValueOnce({ data: expectedGetRbaPolicyResponseOk })
      .mockResolvedValueOnce({ data: getExpectedResponseWithContext(expectedGigyaResponseOk, RiskAssessment.CONTEXT_ID, apiKey) })
      .mockResolvedValueOnce({ data: getExpectedResponseWithContextAsString(expectedGigyaResponseOk, Rba.UNKNOWN_LOCATION_NOTIFICATION_CONTEXT_ID, apiKey) })
      .mockResolvedValueOnce({ data: getExpectedResponseWithContextAsString(expectedGigyaResponseOk, Policy.CONTEXT_ID, apiKey) })

    const responses = await rba.copy(apiKey, { dataCenter }, options)
    expect(responses[0]).toStrictEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, RiskAssessment.CONTEXT_ID, apiKey))
    expect(responses[1]).toStrictEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, Rba.UNKNOWN_LOCATION_NOTIFICATION_CONTEXT_ID, apiKey))
    expect(responses[2]).toStrictEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, Policy.CONTEXT_ID, apiKey))
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
      .mockResolvedValueOnce({ data: getExpectedResponseWithContextAsString(expectedGigyaResponseOk, Policy.CONTEXT_ID, apiKey) })

    const responses = await rba.copy(apiKey, { dataCenter }, options)
    expect(responses[0]).toStrictEqual(getExpectedResponseWithContext(expectedGigyaResponseInvalidAPI, RiskAssessment.CONTEXT_ID, apiKey))
    expect(responses[1]).toStrictEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, Rba.UNKNOWN_LOCATION_NOTIFICATION_CONTEXT_ID, apiKey))
    expect(responses[2]).toStrictEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, Policy.CONTEXT_ID, apiKey))
  })
})
