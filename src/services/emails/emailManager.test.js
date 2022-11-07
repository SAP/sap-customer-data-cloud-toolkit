import axios from 'axios'
import * as EmailsTestData from './data_test'
import Email from './email'
import * as CommonTestData from '../servicesData_test'
import * as ConfiguratorTestData from '../configurator/data_test'
import EmailManager from './emailManager'

jest.mock('axios')
jest.setTimeout(10000)

describe('Emails Manager test suite', () => {
  //const email = new Email(EmailsTestData.credentials.userKey, EmailsTestData.credentials.secret)
  const emailManager = new EmailManager(EmailsTestData.credentials)

  test('get template names', async () => {
    const expectedEmailTemplateNames = [
      'magicLink',
      'codeVerification',
      'emailVerification',
      'preferencesCenter',
      'doubleOptIn',
      'passwordReset',
      'twoFactorAuth',
      'impossibleTraveler',
      'unknownLocationNotification',
      'passwordResetNotification',
    ]
    const emailTemplateNames = emailManager.getEmailTemplateNames(EmailsTestData.getEmailsExpectedResponse)
    console.log(`test.response=${emailTemplateNames}`)
    expect(emailTemplateNames).toEqual(expectedEmailTemplateNames)
  })

  test('get templates', async () => {
    const expectedEmailTemplates = [
      EmailsTestData.getEmailsExpectedResponse.magicLink,
      EmailsTestData.getEmailsExpectedResponse.codeVerification,
      EmailsTestData.getEmailsExpectedResponse.emailVerification,
      EmailsTestData.getEmailsExpectedResponse.emailNotifications.welcomeEmailTemplates,
      EmailsTestData.getEmailsExpectedResponse.emailNotifications.accountDeletedEmailTemplates,
      EmailsTestData.getEmailsExpectedResponse.preferencesCenter,
      EmailsTestData.getEmailsExpectedResponse.doubleOptIn,
      EmailsTestData.getEmailsExpectedResponse.passwordReset,
      EmailsTestData.getEmailsExpectedResponse.twoFactorAuth,
      EmailsTestData.getEmailsExpectedResponse.impossibleTraveler,
      EmailsTestData.getEmailsExpectedResponse.unknownLocationNotification,
      EmailsTestData.getEmailsExpectedResponse.passwordResetNotification,
    ]
    const emailTemplates = emailManager.getAllTemplates(EmailsTestData.getEmailsExpectedResponse)
    console.log(`test.response=${JSON.stringify(emailTemplates)}`)
    expect(emailTemplates).toEqual(expectedEmailTemplates)
  })

  test('export', async () => {
    const mockedResponse = { data: EmailsTestData.getEmailsExpectedResponse }
    axios.mockResolvedValue(mockedResponse)

    const emailTemplates = await emailManager.export('apiKey')
    console.log(`test.response=${JSON.stringify(emailTemplates)}`)
    expect(emailTemplates).toEqual(EmailsTestData.expectedExportConfigurationFileContent)
  })
})
