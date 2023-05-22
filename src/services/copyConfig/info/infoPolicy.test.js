/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import Info from './info'
import * as CommonTestData from '../../servicesDataTest'
import { getInfoExpectedResponse } from './dataTest'
import axios from 'axios'
import { expectedSchemaResponse } from '../schema/dataTest'
import { getSocialsProviders } from '../social/dataTest'
import { getSmsExpectedResponse } from '../../sms/dataTest'
import { getSiteConfig } from '../websdk/dataTest'
import { getPolicyConfig } from '../policies/dataTest'
import { getEmailsExpectedResponse } from '../../emails/dataTest'
import { getExpectedScreenSetResponse } from '../screenset/dataTest'
import { getConsentStatementExpectedResponse } from '../consent/dataTest'
import { channelsExpectedResponse } from '../communication/dataTest'
import { getExpectedWebhookResponse } from '../webhook/dataTest'
import { getExpectedListExtensionResponse } from '../extension/dataTest'
import { getEmptyDataflowResponse, getSearchDataflowsExpectedResponse } from '../dataflow/dataTest'
jest.mock('axios')

describe('Info Policy test suite', () => {
  const apiKey = 'apiKey'
  const socialsKeys = 'APP KEY'
  const info = new Info(CommonTestData.credentials, apiKey, 'eu1')
  let expectedResponse

  beforeEach(() => {
    expectedResponse = JSON.parse(JSON.stringify(getInfoExpectedResponse(false)))
  })
  test('get policy info successfully except Account Options', async () => {
    await executeInfoPolicyTest('accountOptions', 0)
  })
  test('get policy info successfully except code Verification', async () => {
    await executeInfoPolicyTest('codeVerification', 1)
  })
  test('get policy info successfully except email notification', async () => {
    await executeInfoPolicyTest('emailNotifications', 2)
  })
  test('get policy info successfully except email Verification', async () => {
    await executeInfoPolicyTest('emailVerification', 3)
  })
  test('get policy info successfully except federation', async () => {
    await executeInfoPolicyTest('federation', 4)
  })

  test('get policy info successfully except password Complexity', async () => {
    await executeInfoPolicyTest('passwordComplexity', 5)
  })
  test('get policy info successfully except webSdk', async () => {
    await executeInfoPolicyTest('gigyaPlugins', 6)
  })
  test('get policy info successfully except password Reset', async () => {
    await executeInfoPolicyTest('passwordReset', 7)
  })
  test('get policy info successfully except profile Photo', async () => {
    await executeInfoPolicyTest('profilePhoto', 8)
  })
  test('get policy info successfully except Registration', async () => {
    await executeInfoPolicyTest('registration', 9)
  })
  test('get policy info successfully except security', async () => {
    await executeInfoPolicyTest('security', 10)
  })
  test('get policy info successfully except two Factor Authentication', async () => {
    await executeInfoPolicyTest('twoFactorAuth', 11)
  })

  test('get policy info successfully except authentication', async () => {
    await executeInfoPolicyTest('authentication', 12)
  })

  test('get policy info successfully except doubleOptIn', async () => {
    await executeInfoPolicyTest('doubleOptIn', 13)
  })

  test('get policy info successfully except preferencesCenter', async () => {
    await executeInfoPolicyTest('preferencesCenter', 14)
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
