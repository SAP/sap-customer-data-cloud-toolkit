import axios from 'axios'
import * as EmailsTestData from './data_test'
import EmailManager from './emailManager'
import ZipManager from '../file/ZipManager'

jest.mock('axios')
jest.setTimeout(30000)

describe('Emails Manager test suite', () => {
  let emailManager

  beforeEach(() => {
    emailManager = new EmailManager(EmailsTestData.credentials)
    jest.clearAllMocks()
  })

  test('1 - export', async () => {
    const mockedResponse = { data: JSON.parse(JSON.stringify(EmailsTestData.getEmailsExpectedResponse)) }
    axios.mockResolvedValueOnce(mockedResponse).mockResolvedValueOnce(mockedResponse)
    const expectedZipEntries = new Map()
    expectedZipEntries.set('impexMetadata.json', JSON.stringify(EmailsTestData.expectedExportConfigurationFileContent))
    expectedZipEntries.set('MagicLink/en.html', EmailsTestData.emailTemplate)
    expectedZipEntries.set('MagicLink/pt.html', EmailsTestData.emailTemplate)
    expectedZipEntries.set('CodeVerification/en.html', EmailsTestData.emailTemplate)
    expectedZipEntries.set('EmailVerification/en.html', EmailsTestData.emailTemplate)
    expectedZipEntries.set('NewUserWelcome/ar.html', EmailsTestData.emailTemplate)
    expectedZipEntries.set('AccountDeletionConfirmation/pt-br.html', EmailsTestData.emailTemplate)
    expectedZipEntries.set('PasswordResetConfirmation/pt-br.html', EmailsTestData.emailTemplate)
    expectedZipEntries.set('LitePreferencesCenter/en.html', EmailsTestData.emailTemplate)
    expectedZipEntries.set('DoubleOptInConfirmation/ar.html', EmailsTestData.emailTemplate)
    expectedZipEntries.set('PasswordReset/en.html', EmailsTestData.emailTemplate)
    expectedZipEntries.set('TFAEmailVerification/en.html', EmailsTestData.emailTemplate)
    expectedZipEntries.set('ImpossibleTraveler/en.html', EmailsTestData.emailTemplate)

    const zipContent = await emailManager.export('apiKey')

    const zipContentMap = await new ZipManager().read(zipContent)
    expect(zipContentMap).toEqual(expectedZipEntries)
  })

  test('2 - export with minimum templates', async () => {
    const mockedResponse = { data: EmailsTestData.getEmailsExpectedResponseWithMinimumTemplates() }
    axios.mockResolvedValueOnce(mockedResponse).mockResolvedValueOnce(mockedResponse)
    const expectedZipEntries = new Map()
    expectedZipEntries.set('impexMetadata.json', JSON.stringify(EmailsTestData.getExpectedExportConfigurationFileContentWithMinimumTemplates()))
    expectedZipEntries.set('MagicLink/en.html', EmailsTestData.emailTemplate)
    expectedZipEntries.set('MagicLink/pt.html', EmailsTestData.emailTemplate)
    expectedZipEntries.set('CodeVerification/en.html', EmailsTestData.emailTemplate)
    expectedZipEntries.set('NewUserWelcome/ar.html', EmailsTestData.emailTemplate)
    expectedZipEntries.set('LitePreferencesCenter/en.html', EmailsTestData.emailTemplate)
    expectedZipEntries.set('DoubleOptInConfirmation/ar.html', EmailsTestData.emailTemplate)
    expectedZipEntries.set('PasswordReset/en.html', EmailsTestData.emailTemplate)
    expectedZipEntries.set('TFAEmailVerification/en.html', EmailsTestData.emailTemplate)

    const zipContent = await emailManager.export('apiKey')

    const zipContentMap = await new ZipManager().read(zipContent)
    expect(zipContentMap).toEqual(expectedZipEntries)
  })

  test('3 - export templates', async () => {
    const mockedResponse = { data: JSON.parse(JSON.stringify(EmailsTestData.getEmailsExpectedResponse)) }
    axios.mockResolvedValue(mockedResponse)

    const emailTemplates = await emailManager.exportTemplates('apiKey')
    expect(emailTemplates).toEqual(EmailsTestData.expectedExportConfigurationFileContent)
  })

  test('4 - export templates with minimum templates', async () => {
    const mockedResponse = { data: EmailsTestData.getEmailsExpectedResponseWithMinimumTemplates() }
    axios.mockResolvedValue(mockedResponse)

    const emailTemplates = await emailManager.exportTemplates('apiKey')
    expect(emailTemplates).toEqual(EmailsTestData.getExpectedExportConfigurationFileContentWithMinimumTemplates())
  })
})
