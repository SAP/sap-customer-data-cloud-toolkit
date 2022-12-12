import axios from 'axios'
import * as EmailsTestData from './data_test'
import Email from './email'
import * as CommonTestData from '../servicesData_test'
import * as ConfiguratorTestData from '../configurator/data_test'

jest.mock('axios')
jest.setTimeout(10000)

describe('Emails test suite', () => {
  const credentials = {
    userKey: 'userKey',
    secret: 'secret',
  }

  test('get emails successfully - multiple emails templates', async () => {
    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockResolvedValueOnce({ data: EmailsTestData.getEmailsExpectedResponse })

    const email = new Email(credentials.userKey, credentials.secret)
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

    const email = new Email(credentials.userKey, credentials.secret)
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
    const err = CommonTestData.createErrorObject('Error getting email templates')
    axios.mockResolvedValue({ data: EmailsTestData.expectedGigyaInvalidUserKey }).mockImplementation(() => {
      throw err
    })
    const email = new Email('', credentials.secret)
    const response = await email.getSiteEmails('apiKey')

    expect(response.errorMessage).toEqual(err.message)
    expect(response.errorCode).toEqual(err.code)
    expect(response.errorDetails).toEqual(err.details)
    expect(response.time).toBeDefined()
  })

  test('get emails unsuccessfully - invalid apiKey', async () => {
    const err = CommonTestData.createErrorObject('Error getting email templates')
    axios.mockResolvedValueOnce({ data: EmailsTestData.expectedGigyaResponseInvalidAPI }).mockImplementation(() => {
      throw err
    })
    const email = new Email(credentials.userKey, credentials.secret)
    const response = await email.getSiteEmails('apiKey')

    expect(response.errorMessage).toEqual(err.message)
    expect(response.errorCode).toEqual(err.code)
    expect(response.errorDetails).toEqual(err.details)
    expect(response.time).toBeDefined()
  })

  test('set emails successfully - multiple emails templates', async () => {
    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockResolvedValueOnce({ data: CommonTestData.expectedGigyaResponseOk })

    const email = new Email(credentials.userKey, credentials.secret)
    const response = await email.setSiteEmails('apiKey', EmailsTestData.getEmailsExpectedResponse.magicLink)
    //console.log('response=' + JSON.stringify(response))

    CommonTestData.verifyResponseIsOk(response)
  })

  test('set emails unsuccessfully - invalid secret', async () => {
    const err = CommonTestData.createErrorObject('Error setting email templates')
    axios.mockResolvedValueOnce({ data: EmailsTestData.expectedGigyaInvalidSecret }).mockImplementation(() => {
      throw err
    })
    const email = new Email(credentials.userKey, '')
    const response = await email.setSiteEmails('apiKey', EmailsTestData.getEmailsExpectedResponse.magicLink)

    expect(response.errorMessage).toEqual(err.message)
    expect(response.errorCode).toEqual(err.code)
    expect(response.errorDetails).toEqual(err.details)
    expect(response.time).toBeDefined()
  })
})
