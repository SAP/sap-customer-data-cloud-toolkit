/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import axios from 'axios'
import * as EmailsTestData from './dataTest.js'
import Email from './email.js'
import * as CommonTestData from '../servicesDataTest.js'
import * as ConfiguratorTestData from '../configurator/dataTest.js'
import * as ServiceDataTest from '../servicesDataTest.js'

jest.mock('axios')
jest.setTimeout(10000)

describe('Emails test suite', () => {
  const email = new Email(CommonTestData.credentials.userKey, CommonTestData.credentials.secret)
  const templateName = 'magicLink'

  test('get emails successfully - multiple emails templates', async () => {
    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockResolvedValueOnce({ data: EmailsTestData.getEmailsExpectedResponse })

    const response = await email.getSiteEmails('apiKey')
    //console.log('response=' + JSON.stringify(response))

    CommonTestData.verifyResponseIsOk(response)
    // Email template with 2 lang
    expect(response.magicLink.emailTemplates.en).toBeDefined()
    expect(response.magicLink.emailTemplates.pt).toBeDefined()
    expect(response.magicLink.defaultLanguage).toBeDefined()

    // Email template with just 1 lang
    expect(response.emailVerification).toBeDefined()
    expect(response.emailVerification.emailTemplates.en).toBeDefined()
  })

  test('get emails successfully - emailNotifications - no templates', async () => {
    axios
      .mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) })
      .mockResolvedValueOnce({ data: EmailsTestData.getEmailsExpectedResponseWithMinimumTemplates() })

    const response = await email.getSiteEmails('apiKey')
    //console.log('response=' + JSON.stringify(response))

    CommonTestData.verifyResponseIsOk(response)
    // No Password Reset Confirmation template
    expect(response.emailNotifications.confirmationEmailTemplates).toBeUndefined()
    expect(response.emailNotifications.confirmationEmailDefaultLanguage).toBeDefined()

    // No Account Deletion Confirmation template
    expect(response.emailNotifications.accountDeletedEmailTemplates).toBeUndefined()
    expect(response.emailNotifications.accountDeletedEmailDefaultLanguage).toBeDefined()
  })

  test('get emails unsuccessfully - invalid user key', async () => {
    axios.mockResolvedValueOnce({ data: ServiceDataTest.expectedGigyaInvalidUserKey })
    const email = new Email('', CommonTestData.credentials.secret)
    const response = await email.getSiteEmails('apiKey')
    CommonTestData.verifyResponseIsNotOk(response, ServiceDataTest.expectedGigyaInvalidUserKey)
  })

  test('get emails unsuccessfully - invalid apiKey', async () => {
    axios.mockResolvedValueOnce({ data: CommonTestData.expectedGigyaResponseInvalidAPI })

    const response = await email.getSiteEmails('apiKey')
    CommonTestData.verifyResponseIsNotOk(response, CommonTestData.expectedGigyaResponseInvalidAPI)
  })

  test('set emails successfully - multiple emails templates', async () => {
    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockResolvedValueOnce({ data: CommonTestData.expectedGigyaResponseOk })

    const response = await email.setSiteEmails('apiKey', templateName, EmailsTestData.getEmailsExpectedResponse.magicLink)
    //console.log('response=' + JSON.stringify(response))

    CommonTestData.verifyResponseIsOk(response)
  })

  test('set emails with data center successfully', async () => {
    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockResolvedValueOnce({ data: CommonTestData.expectedGigyaResponseOk })

    const response = await email.setSiteEmailsWithDataCenter('apiKey', templateName, EmailsTestData.getEmailsExpectedResponse.magicLink, 'us1')
    //console.log('response=' + JSON.stringify(response))

    CommonTestData.verifyResponseIsOk(response)
  })

  test('invalid secret - set emails unsuccessfully', async () => {
    axios.mockResolvedValueOnce({ data: EmailsTestData.expectedGigyaInvalidSecret })
    const email = new Email(CommonTestData.credentials.userKey, '')
    const response = await email.setSiteEmails('apiKey', templateName, EmailsTestData.getEmailsExpectedResponse.magicLink)
    CommonTestData.verifyResponseIsNotOk(response, EmailsTestData.expectedGigyaInvalidSecret)
  })

  test('invalid data center - set emails unsuccessfully', async () => {
    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.scExpectedGigyaResponseNotOk })
    const response = await email.setSiteEmails('apiKey', templateName, EmailsTestData.getEmailsExpectedResponse.magicLink)
    CommonTestData.verifyResponseIsNotOk(response, ConfiguratorTestData.scExpectedGigyaResponseNotOk)
  })
})
