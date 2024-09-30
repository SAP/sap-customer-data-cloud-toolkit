/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import * as CommonTestData from '../../servicesDataTest.js'
import ConfigManager from '../configManager.js'
import axios from 'axios'
import * as ConfiguratorTestData from '../../configurator/dataTest.js'
import { getInfoExpectedResponse, getInfoExpectedResponseChild } from './dataTest.js'
import { expectedSchemaResponse } from '../schema/dataTest.js'
import { getSocialsProviders } from '../social/dataTest.js'
import { getSiteConfig } from '../websdk/dataTest.js'
import { getSmsExpectedResponse } from '../../sms/dataTest.js'
import { getEmailsExpectedResponse } from '../../emails/dataTest.js'
import { getExpectedScreenSetResponse } from '../screenset/dataTest.js'
import { getPolicyConfig } from '../policies/dataTest.js'
import { getConsentStatementExpectedResponse } from '../consent/dataTest.js'
import { channelsExpectedResponse } from '../communication/dataTest.js'
import { getExpectedWebhookResponse } from '../webhook/dataTest.js'
import { getExpectedListExtensionResponse } from '../extension/dataTest.js'
import { getEmptyDataflowResponse, getSearchDataflowsExpectedResponse } from '../dataflow/dataTest.js'
import { expectedGetRbaPolicyResponseOk, expectedGetRiskAssessmentResponseOk, expectedGetUnknownLocationNotificationResponseOk } from '../rba/dataTest.js'
import { getRecaptchaExpectedResponse, getRecaptchaPoliciesResponse, getRiskProvidersResponse } from '../../recaptcha/dataTest.js'

jest.mock('axios')

const parentApiKey = 'parentApiKey'
const childApiKey = 'childApiKey'

describe('Config Manager test suite', () => {
  let configManager

  beforeEach(() => {
    axios.mockClear()
  })

  const socialsKeys = 'APP KEY'

  test('get configuration successfully for parentApiKey', async () => {
    configManager = new ConfigManager(CommonTestData.credentials, parentApiKey)

    axios
      .mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }) // Parent site configuration
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: channelsExpectedResponse })
      .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
      .mockResolvedValueOnce({ data: getPolicyConfig })
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

    const response = await configManager.getConfiguration()
    expect(response).toEqual(getInfoExpectedResponse(false))
  })

  test('get configuration successfully for childApiKey', async () => {
    configManager = new ConfigManager(CommonTestData.credentials, childApiKey)

    axios
      .mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }) 
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: channelsExpectedResponse })
      .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
      .mockResolvedValueOnce({ data: getPolicyConfig })
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

    const response = await configManager.getConfiguration()

    // Compare the response for the child API key scenario
    expect(response).toEqual(getInfoExpectedResponseChild(false))
  })
})
