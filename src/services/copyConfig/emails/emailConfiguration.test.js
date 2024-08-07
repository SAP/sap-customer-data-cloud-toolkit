/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import axios from 'axios'
import { credentials, expectedGigyaResponseInvalidAPI, expectedGigyaResponseOk } from '../../servicesDataTest.js'
import EmailConfiguration from './emailConfiguration.js'
import { getEmailsExpectedResponse, getEmailsExpectedResponseWithNoTemplates } from '../../emails/dataTest.js'
import { getExpectedResponseWithContext, getResponseWithContext, emailTemplatesId } from '../dataTest.js'
import EmailTemplateNameTranslator from '../../emails/emailTemplateNameTranslator.js'
import Options from '../options.js'

jest.mock('axios')

describe('Email Configuration test suite', () => {
  const apiKey = 'apiKey'
  const dataCenter = 'eu1'
  const emailConfiguration = new EmailConfiguration(credentials, apiKey, dataCenter)

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('copy successfully MagicLink', async () => {
    await executeTest('magicLink')
  })

  test('copy successfully CodeVerification', async () => {
    await executeTest('codeVerification')
  })

  test('copy successfully EmailVerification', async () => {
    await executeTest('emailVerification')
  })

  test('copy successfully NewUserWelcome', async () => {
    await executeTest('welcomeEmailTemplates', 'emailNotifications')
  })

  test('copy successfully AccountDeletionConfirmation', async () => {
    await executeTest('accountDeletedEmailTemplates', 'emailNotifications')
  })

  test('copy successfully LitePreferencesCenter', async () => {
    await executeTest('preferencesCenter')
  })

  test('copy successfully DoubleOptInConfirmation', async () => {
    await executeTest('doubleOptIn')
  })

  test('copy successfully PasswordReset', async () => {
    await executeTest('passwordReset')
  })

  test('copy successfully TfaEmailVerification', async () => {
    await executeTest('twoFactorAuth')
  })

  test('copy successfully ImpossibleTraveler', async () => {
    await executeTest('impossibleTraveler')
  })

  test('copy successfully PasswordResetConfirmation', async () => {
    await executeTest('confirmationEmailTemplates', 'emailNotifications')
  })

  test.each([true, false])('copy successfully links url', async (linkValue) => {
    const templateName = 'preferencesCenter'
    const options = {
      id: 'emailTemplates',
      name: 'emailTemplates',
      value: true,
      branches: [
        {
          id: templateName,
          name: 'LitePreferencesCenter',
          value: true,
          branches: [
            {
              id: `Lite${templateName}-Link`,
              name: 'Include Lite Preferences Center URL',
              link: `${templateName}.redirectURL`,
              value: linkValue,
            },
          ],
        },
      ],
    }

    const mockedResponse = getEmailsExpectedResponseWithNoTemplates()
    mockedResponse[templateName] = getEmailsExpectedResponse[templateName]
    axios.mockResolvedValueOnce({ data: mockedResponse }).mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })

    let spy = jest.spyOn(emailConfiguration.getEmail(), 'setSiteEmailsWithDataCenter')
    await executeCopy(getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey), options)

    expect(spy.mock.calls.length).toBe(1)
    const expectedTemplate = JSON.parse(JSON.stringify(getEmailsExpectedResponse[templateName]))
    if (!linkValue) {
      delete expectedTemplate['redirectURL']
    }
    const expectedTemplateName = templateName
    expect(spy).toHaveBeenCalledWith(apiKey, expectedTemplateName, expectedTemplate, dataCenter)
  })

  test('copy preferencesCenter links url only', async () => {
    const templateName = 'preferencesCenter'
    const options = {
      id: 'emailTemplates',
      name: 'emailTemplates',
      value: false,
      branches: [
        {
          id: templateName,
          name: 'LitePreferencesCenter',
          value: false,
          branches: [
            {
              id: `Lite${templateName}-Link`,
              name: 'Include Lite Preferences Center URL',
              link: `${templateName}.redirectURL`,
              value: true,
            },
          ],
        },
      ],
    }

    const mockedResponse = getEmailsExpectedResponseWithNoTemplates()
    mockedResponse[templateName] = getEmailsExpectedResponse[templateName]
    axios.mockResolvedValueOnce({ data: mockedResponse }).mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })

    let spy = jest.spyOn(emailConfiguration.getEmail(), 'setSiteEmailsWithDataCenter')
    await executeCopy(getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey), options)

    expect(spy.mock.calls.length).toBe(1)
    const expectedTemplate = {}
    expectedTemplate['redirectURL'] = getEmailsExpectedResponse[templateName].redirectURL
    const expectedTemplateName = templateName
    expect(spy).toHaveBeenCalledWith(apiKey, expectedTemplateName, expectedTemplate, dataCenter)
  })

  test('copy unsuccessfully - error on get', async () => {
    const mockedResponse = getResponseWithContext(expectedGigyaResponseInvalidAPI, emailTemplatesId, apiKey)
    axios.mockResolvedValueOnce({ data: mockedResponse })

    await executeCopy(mockedResponse, getEmailTemplatesInfoForTemplate('MagicLink'))
  })

  test('copy unsuccessfully - error on set', async () => {
    const templateName = 'magicLink'
    const mockedEmailsResponse = getEmailsExpectedResponseWithNoTemplates()
    mockedEmailsResponse[templateName] = getEmailsExpectedResponse[templateName]
    const mockedResponse = getResponseWithContext(expectedGigyaResponseInvalidAPI, emailTemplatesId, apiKey)
    axios.mockResolvedValueOnce({ data: mockedEmailsResponse }).mockResolvedValueOnce({ data: mockedResponse })

    await executeCopy(mockedResponse, getEmailTemplatesInfoForTemplate('MagicLink'))
  })

  async function executeCopy(expectedResponse, emailOptions) {
    const responses = await emailConfiguration.copy(apiKey, { dataCenter }, new Options(emailOptions))
    expect(responses.length).toBe(1)
    expect(responses[0]).toEqual(getExpectedResponseWithContext(expectedResponse, emailTemplatesId, apiKey))
    expect(responses[0].context.id).toEqual(`${emailTemplatesId}`)
    expect(responses[0].context.targetApiKey).toEqual(`${apiKey}`)
  }

  async function executeTest(templateName, parentName = undefined) {
    let spy = jest.spyOn(emailConfiguration.getEmail(), 'setSiteEmailsWithDataCenter')
    const mockedResponse = getEmailsExpectedResponseWithNoTemplates()
    if (parentName) {
      mockedResponse[parentName] = {}
      mockedResponse[parentName] = getEmailsExpectedResponse[parentName]
    } else {
      mockedResponse[templateName] = getEmailsExpectedResponse[templateName]
    }
    axios.mockResolvedValueOnce({ data: mockedResponse }).mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })

    const emailTranslator = new EmailTemplateNameTranslator()
    const externalTemplateName = emailTranslator.translateInternalName(templateName)

    await executeCopy(getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey), getEmailTemplatesInfoForTemplate(externalTemplateName))

    expect(spy.mock.calls.length).toBe(1)
    let expectedTemplate
    if (parentName) {
      expectedTemplate = JSON.parse(JSON.stringify(getEmailsExpectedResponse))
      removeOtherTemplates(expectedTemplate, templateName)
      expectedTemplate = expectedTemplate[parentName]
    } else {
      expectedTemplate = getEmailsExpectedResponse[templateName]
      if (templateName === 'doubleOptIn') {
        delete expectedTemplate.nextURL
        delete expectedTemplate.nextExpiredURL
      }
      if (templateName === 'emailVerification') {
        delete expectedTemplate.nextURL
      }
    }
    const expectedTemplateName = parentName ? `${parentName}.${templateName}` : templateName
    expect(spy).toHaveBeenCalledWith(apiKey, expectedTemplateName, expectedTemplate, dataCenter)
  }

  function removeOtherTemplates(response, templateName) {
    const idx = templateName.indexOf('Templates')
    const prefix = templateName.substring(0, idx)
    const emailNotificationsObj = response['emailNotifications']
    const modifiedEmailNotificationsObj = Object.keys(emailNotificationsObj)
      .filter((key) => key.startsWith(prefix))
      .reduce((obj, key) => {
        obj[key] = emailNotificationsObj[key]
        return obj
      }, {})
    response['emailNotifications'] = modifiedEmailNotificationsObj
  }

  function getEmailTemplatesInfoForTemplate(templateName) {
    return {
      id: 'emailTemplates',
      name: 'emailTemplates',
      value: false,
      branches: [
        {
          id: templateName,
          name: templateName,
          value: true,
        },
      ],
    }
  }
})
