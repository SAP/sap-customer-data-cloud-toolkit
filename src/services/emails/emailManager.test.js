import axios from 'axios'
import * as EmailsTestData from './data_test'
import EmailManager from './emailManager'
import AdmZip from 'adm-zip'

jest.mock('axios')
jest.setTimeout(10000)

describe('Emails Manager test suite', () => {
  const emailManager = new EmailManager(EmailsTestData.credentials)

  test('export', async () => {
    const mockedResponse = { data: EmailsTestData.getEmailsExpectedResponse }
    axios.mockResolvedValue(mockedResponse)
    const expectedZipEntries = [
      'impexMetadata.json.html',
      'MagicLink/en.html',
      'MagicLink/pt.html',
      'CodeVerification/en.html',
      'EmailVerification/en.html',
      'NewUserWelcome/ar.html',
      'AccountDeletionConfirmation/pt-br.html',
      'PasswordResetConfirmation/pt-br.html',
      'LitePreferencesCenter/en.html',
      'DoubleOptInConfirmation/ar.html',
      'PasswordReset/en.html',
      'TFAEmailVerification/en.html',
      'ImpossibleTraveler/en.html',
    ]

    const zipContent = await emailManager.export('apiKey')

    const zip = new AdmZip(zipContent, null)
    const entries = getZipEntries(zip)
    expect(entries.sort()).toEqual(expectedZipEntries.sort())
  })

  test('export_with minimum templates', async () => {
    const mockedResponse = { data: EmailsTestData.getEmailsExpectedResponseWithMinimumTemplates() }
    axios.mockResolvedValue(mockedResponse)
    const expectedZipEntries = [
      'impexMetadata.json.html',
      'MagicLink/en.html',
      'MagicLink/pt.html',
      'CodeVerification/en.html',
      'NewUserWelcome/ar.html',
      'LitePreferencesCenter/en.html',
      'DoubleOptInConfirmation/ar.html',
      'PasswordReset/en.html',
      'TFAEmailVerification/en.html',
    ]

    const zipContent = await emailManager.export('apiKey')

    const zip = new AdmZip(zipContent, null)
    const entries = getZipEntries(zip)
    expect(entries.sort()).toEqual(expectedZipEntries.sort())
  })

  test('export templates', async () => {
    const mockedResponse = { data: EmailsTestData.getEmailsExpectedResponse }
    axios.mockResolvedValue(mockedResponse)

    const emailTemplates = await emailManager.exportTemplates('apiKey')
    //console.log(`test.response=${JSON.stringify(emailTemplates)}`)
    expect(emailTemplates).toEqual(EmailsTestData.expectedExportConfigurationFileContent)
  })

  test('export templates_with minimum templates', async () => {
    const mockedResponse = { data: EmailsTestData.getEmailsExpectedResponseWithMinimumTemplates() }
    axios.mockResolvedValue(mockedResponse)

    const emailTemplates = await emailManager.exportTemplates('apiKey')
    //console.log(`test.response=${JSON.stringify(emailTemplates)}`)
    expect(emailTemplates).toEqual(EmailsTestData.getExpectedExportConfigurationFileContentWithMinimumTemplates())
  })
})

function getZipEntries(zip) {
  const entries = []
  for (const zipEntry of zip.getEntries()) {
    if (!zipEntry.isDirectory) {
      entries.push(`${zipEntry.entryName}`)
    }
  }
  return entries
}
