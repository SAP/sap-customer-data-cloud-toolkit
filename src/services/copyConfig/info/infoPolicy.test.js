/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import Info from './info.js'
import * as CommonTestData from '../../servicesDataTest.js'
import { getInfoExpectedResponse } from './dataTest.js'
import axios from 'axios'
import { expectedSchemaResponse } from '../schema/dataTest.js'
import { getSocialsProviders } from '../social/dataTest.js'
import { getSmsExpectedResponse } from '../../sms/dataTest.js'
import { getSiteConfig } from '../websdk/dataTest.js'
import { getPolicyConfig } from '../policies/dataTest.js'
import { getEmailsExpectedResponse } from '../../emails/dataTest.js'
import { getExpectedScreenSetResponse } from '../screenset/dataTest.js'
import { getConsentStatementExpectedResponse } from '../consent/dataTest.js'
import { channelsExpectedResponse } from '../communication/dataTest.js'
import { getExpectedWebhookResponse } from '../webhook/dataTest.js'
import { getExpectedListExtensionResponse } from '../extension/dataTest.js'
import { getEmptyDataflowResponse, getSearchDataflowsExpectedResponse } from '../dataflow/dataTest.js'
import { expectedGetRbaPolicyResponseOk, expectedGetRiskAssessmentResponseOk, expectedGetUnknownLocationNotificationResponseOk } from '../rba/dataTest.js'
import { getRecaptchaExpectedResponse, getRecaptchaPoliciesResponse, getRiskProvidersResponse } from '../../recaptcha/dataTest.js'

jest.mock('axios')

describe('Info Policy test suite', () => {
  const apiKey = 'apiKey'
  const socialsKeys = 'APP KEY'
  const siteInfo = {
    dataCenter: 'eu1',
  }
  const info = new Info(CommonTestData.credentials, apiKey, siteInfo)
  let expectedResponse

  beforeEach(() => {
    expectedResponse = JSON.parse(JSON.stringify(getInfoExpectedResponse(false)))
  })

  test.each([
    ['accountOptions', 0],
    ['authentication', 1],
    ['codeVerification', 2],
    ['emailNotifications', 3],
    ['emailVerification', 4],
    ['federation', 5],
    ['passwordComplexity', 6],
    ['gigyaPlugins', 7],
    ['passwordReset', 8],
    ['profilePhoto', 9],
    ['registration', 10],
    ['security', 11],
    ['twoFactorAuth', 12],
    ['doubleOptIn', 13],
    ['preferencesCenter', 14],
  ])('get policy info successfully except %s', async (property, index) => {
    await executeInfoPolicyTest(property, index)
  })

  async function executeInfoPolicyTest(templateNames, templateIndex) {
    const mockedResponse = getExpectedPolicyResponseExcept(templateNames)
    axios
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: channelsExpectedResponse })
      .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
      .mockResolvedValueOnce({ data: mockedResponse })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: getSiteConfig })
      .mockResolvedValueOnce({ data: getSearchDataflowsExpectedResponse })
      .mockResolvedValueOnce({ data: getEmptyDataflowResponse() })
      .mockResolvedValueOnce({ data: getExpectedWebhookResponse() })
      .mockResolvedValueOnce({ data: getExpectedListExtensionResponse() })
      .mockResolvedValueOnce({ data: expectedGetRiskAssessmentResponseOk })
      .mockResolvedValueOnce({ data: expectedGetUnknownLocationNotificationResponseOk })
      .mockResolvedValueOnce({ data: expectedGetRbaPolicyResponseOk })
      .mockResolvedValueOnce({ data: getRecaptchaExpectedResponse() })
      .mockResolvedValueOnce({ data: getRecaptchaPoliciesResponse() })
      .mockResolvedValueOnce({ data: getRiskProvidersResponse() })

    const response = await info.get()

    expectedResponse[4].branches.splice(templateIndex, 1)
    expect(response).toEqual(expectedResponse)
  }

  function getExpectedPolicyResponseExcept(exceptions) {
    const response = JSON.parse(JSON.stringify(getPolicyConfig))

    delete response[exceptions]

    return response
  }
})
