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
import { getEmailsExpectedResponse } from '../../emails/dataTest.js'
import { getSiteConfig } from '../websdk/dataTest.js'
import { getPolicyConfig } from '../policies/dataTest.js'
import { getExpectedScreenSetResponse } from '../screenset/dataTest.js'
import { getConsentStatementExpectedResponse } from '../consent/dataTest.js'
import { channelsExpectedResponse, topicsExpectedResponse } from '../communication/dataTest.js'
import { getExpectedWebhookResponse } from '../webhook/dataTest.js'
import { getExpectedListExtensionResponse } from '../extension/dataTest.js'
import { getEmptyDataflowResponse, getSearchDataflowsExpectedResponse } from '../dataflow/dataTest.js'
import { expectedGetRbaPolicyResponseOk, expectedGetRiskAssessmentResponseOk, expectedGetUnknownLocationNotificationResponseOk } from '../rba/dataTest.js'

jest.mock('axios')

describe('Info Email Templates test suite', () => {
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

  test('get emails info successfully except magicLink', async () => {
    await executeInfoEmailsTest(['magicLink'], 0)
  })

  test('get emails info successfully except codeVerification', async () => {
    await executeInfoEmailsTest(['codeVerification'], 1)
  })

  test('get emails info successfully except emailVerification', async () => {
    await executeInfoEmailsTest(['emailVerification'], 2)
  })

  test('get emails info successfully except welcomeEmailTemplates', async () => {
    await executeInfoEmailsTest(['emailNotifications.welcomeEmailTemplates'], 3)
  })

  test('get emails info successfully except accountDeletedEmailTemplates', async () => {
    await executeInfoEmailsTest(['emailNotifications.accountDeletedEmailTemplates'], 4)
  })

  test('get emails info successfully except preferencesCenter', async () => {
    await executeInfoEmailsTest(['preferencesCenter'], 5)
  })

  test('get emails info successfully except doubleOptIn', async () => {
    await executeInfoEmailsTest(['doubleOptIn'], 6)
  })

  test('get emails info successfully except passwordReset', async () => {
    await executeInfoEmailsTest(['passwordReset'], 7)
  })

  test('get emails info successfully except twoFactorAuth', async () => {
    await executeInfoEmailsTest(['twoFactorAuth'], 8)
  })

  test('get emails info successfully except impossibleTraveler', async () => {
    await executeInfoEmailsTest(['impossibleTraveler'], 9)
  })

  test('get emails info successfully except confirmationEmailTemplates', async () => {
    await executeInfoEmailsTest(['emailNotifications.confirmationEmailTemplates'], 10)
  })

  test('get emails info successfully only magicLink', async () => {
    const mockedResponse = getExpectedEmailsResponseExcept([
      'codeVerification',
      'emailVerification',
      'emailNotifications.welcomeEmailTemplates',
      'emailNotifications.accountDeletedEmailTemplates',
      'preferencesCenter',
      'doubleOptIn',
      'passwordReset',
      'twoFactorAuth',
      'impossibleTraveler',
      'emailNotifications.confirmationEmailTemplates',
      'unknownLocationNotification',
      'passwordResetNotification',
    ])
    axios
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: channelsExpectedResponse })
      .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
      .mockResolvedValueOnce({ data: getPolicyConfig })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: mockedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: getSiteConfig })
      .mockResolvedValueOnce({ data: getSearchDataflowsExpectedResponse })
      .mockResolvedValueOnce({ data: getEmptyDataflowResponse() })
      .mockResolvedValueOnce({ data: getExpectedWebhookResponse() })
      .mockResolvedValueOnce({ data: getExpectedListExtensionResponse() })
      .mockResolvedValueOnce({ data: expectedGetRiskAssessmentResponseOk })
      .mockResolvedValueOnce({ data: expectedGetUnknownLocationNotificationResponseOk })
      .mockResolvedValueOnce({ data: expectedGetRbaPolicyResponseOk })
      .mockResolvedValueOnce({ data: topicsExpectedResponse })
    const response = await info.get()
    const emailsIndex = 6
    expectedResponse[emailsIndex].branches = expectedResponse[emailsIndex].branches.splice(0, 1)
    expect(response).toEqual(expectedResponse)
  })

  async function executeInfoEmailsTest(templateNames, templateIndex) {
    const mockedResponse = getExpectedEmailsResponseExcept(templateNames)
    axios
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: channelsExpectedResponse })
      .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
      .mockResolvedValueOnce({ data: getPolicyConfig })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: mockedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: getSiteConfig })
      .mockResolvedValueOnce({ data: getSearchDataflowsExpectedResponse })
      .mockResolvedValueOnce({ data: getEmptyDataflowResponse() })
      .mockResolvedValueOnce({ data: getExpectedWebhookResponse() })
      .mockResolvedValueOnce({ data: getExpectedListExtensionResponse() })
      .mockResolvedValueOnce({ data: expectedGetRiskAssessmentResponseOk })
      .mockResolvedValueOnce({ data: expectedGetUnknownLocationNotificationResponseOk })
      .mockResolvedValueOnce({ data: expectedGetRbaPolicyResponseOk })
      .mockResolvedValueOnce({ data: topicsExpectedResponse })
    const response = await info.get()
    expectedResponse[6].branches.splice(templateIndex, 1)

    expect(response).toEqual(expectedResponse)
  }

  function getExpectedEmailsResponseExcept(exceptions) {
    const response = JSON.parse(JSON.stringify(getEmailsExpectedResponse))
    exceptions.forEach((exception) => {
      const tokens = exception.split('.')
      if (tokens.length === 2) {
        delete response[tokens[0]][tokens[1]]
      } else if (tokens.length === 1) {
        delete response[exception]
      }
    })
    return response
  }
})
