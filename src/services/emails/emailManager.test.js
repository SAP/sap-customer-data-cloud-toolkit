import axios from 'axios'
import * as EmailsTestData from './data_test'
import Email from './email'
import * as CommonTestData from '../servicesData_test'
import * as ConfiguratorTestData from '../configurator/data_test'
import EmailManager from './emailManager'
import EmailTemplateNameTranslator from '../gigya/emailTemplateNameTranslator'

jest.mock('axios')
jest.setTimeout(10000)

describe('Emails Manager test suite', () => {
  const emailManager = new EmailManager(EmailsTestData.credentials)

  test('get template names', () => {
    const expectedEmailTemplateNames = [
      'magicLink',
      'codeVerification',
      'emailVerification',
      'welcomeEmailTemplates',
      'accountDeletedEmailTemplates',
      'confirmationEmailTemplates',
      'preferencesCenter',
      'doubleOptIn',
      'passwordReset',
      'twoFactorAuth',
      'impossibleTraveler',
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
      EmailsTestData.getEmailsExpectedResponse.emailNotifications.confirmationEmailTemplates,
      EmailsTestData.getEmailsExpectedResponse.preferencesCenter,
      EmailsTestData.getEmailsExpectedResponse.doubleOptIn,
      EmailsTestData.getEmailsExpectedResponse.passwordReset,
      EmailsTestData.getEmailsExpectedResponse.twoFactorAuth,
      EmailsTestData.getEmailsExpectedResponse.impossibleTraveler,
      //EmailsTestData.getEmailsExpectedResponse.unknownLocationNotification,
      //EmailsTestData.getEmailsExpectedResponse.passwordResetNotification,
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

  //   test('get template names', async () => {
  //     const expectedEmailTemplateNames = [
  //       'MagicLink',
  //       'CodeVerification',
  //       'EmailVerification',
  //       'NewUserWelcome',
  //       'AccountDeletionConfirmation',
  //       'LitePreferencesCenter',
  //       'DoubleOptInConfirmation',
  //       'PasswordReset',
  //       'TFAEmailVerification',
  //       'ImpossibleTraveler',
  //       'UnknownLocationNotification',
  //       'PasswordResetConfirmation',
  //     ]
  //     const emailTemplateNames = emailManager.getEmailTemplateNames(EmailsTestData.getEmailsExpectedResponse)
  //     console.log(`test.response=${emailTemplateNames}`)
  //     expect(emailTemplateNames).toEqual(expectedEmailTemplateNames)
  //   })

  test('traverse', async () => {
    //traverse(EmailsTestData.getEmailsExpectedResponse, process)
    //console.log(EmailManager.propertiesToArray(EmailsTestData.getEmailsExpectedResponse))
    //EmailManager.getEmailTemplateNames3(EmailsTestData.getEmailsExpectedResponse)
    const mockedResponse = { data: EmailsTestData.getEmailsExpectedResponse }
    axios.mockResolvedValue(mockedResponse)

    //const emailTemplates = EmailManager.getEmailTemplateNames3(EmailsTestData.getEmailsExpectedResponse)
    const emailTemplates = await emailManager.export('apiKey')
    console.log(`test.response=${JSON.stringify(emailTemplates)}`)
    expect(emailTemplates).toEqual(EmailsTestData.expectedExportConfigurationFileContent)
  })
})

//called with every property and its value
function process(key, value) {
  console.log(key + ' : ' + value)
}

function traverse(o, func) {
  for (var i in o) {
    func.apply(this, [i, o[i]])
    if (o[i] !== null && typeof o[i] == 'object') {
      //going one step down in the object tree!!
      traverse(o[i], func)
    }
  }
}

//that's all... no magic, no bloated framework
//traverse(o,process);
