import axios from 'axios'
import * as EmailsTestData from './data_test'
import EmailManager from './emailManager'
import ZipManager from '../file/ZipManager'

jest.mock('axios')
jest.setTimeout(30000)

describe('Emails Manager test suite', () => {
  const emailManager = new EmailManager(EmailsTestData.credentials)
  const zipManager = new ZipManager()

  afterEach(() => {
    jest.clearAllMocks()
    zipManager.clear()
  })

  test('1 - export', async () => {
    const mockedResponse = { data: EmailsTestData.getEmailsExpectedResponse }
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

    const zipContentMap = await zipManager.read(zipContent)
    expect(zipContentMap).toEqual(expectedZipEntries)
  })

  // test('2 - export with minimum templates', async () => {
  //   const mockedResponse = { data: EmailsTestData.getEmailsExpectedResponseWithMinimumTemplates() }
  //   //axios.mockResolvedValue(mockedResponse)
  //   axios.mockResolvedValueOnce(mockedResponse).mockResolvedValueOnce(mockedResponse)
  //   const expectedZipEntries = [
  //     'impexMetadata.json',
  //     'MagicLink/en.html',
  //     'MagicLink/pt.html',
  //     'CodeVerification/en.html',
  //     'NewUserWelcome/ar.html',
  //     'LitePreferencesCenter/en.html',
  //     'DoubleOptInConfirmation/ar.html',
  //     'PasswordReset/en.html',
  //     'TFAEmailVerification/en.html',
  //   ]

  //   const zipContent = await emailManager.export('apiKey')

  //   const zip = new AdmZip(zipContent, null)
  //   console.log('getzipEntries:' + getZipEntries(zip).sort())
  //   console.log('expectedZipEntries:' + expectedZipEntries.sort())
  //   expect(getZipEntries(zip).sort()).toEqual(expectedZipEntries.sort())
  //   verifyWorkDirIsDeleted()
  //   console.log(`Directory ${os.tmpdir()}/${pkg.name} exists? ${fs.existsSync(`${os.tmpdir()}/${pkg.name}`)}`)
  // })

  // test('3 - export templates', async () => {
  //   const mockedResponse = { data: EmailsTestData.getEmailsExpectedResponse }
  //   axios.mockResolvedValue(mockedResponse)

  //   const emailTemplates = await emailManager.exportTemplates('apiKey')
  //   //console.log(`test.response=${JSON.stringify(emailTemplates)}`)
  //   expect(emailTemplates).toEqual(EmailsTestData.expectedExportConfigurationFileContent)
  // })

  // test('4 - export templates with minimum templates', async () => {
  //   const mockedResponse = { data: EmailsTestData.getEmailsExpectedResponseWithMinimumTemplates() }
  //   axios.mockResolvedValue(mockedResponse)

  //   const emailTemplates = await emailManager.exportTemplates('apiKey')
  //   //console.log(`test.response=${JSON.stringify(emailTemplates)}`)
  //   expect(emailTemplates).toEqual(EmailsTestData.getExpectedExportConfigurationFileContentWithMinimumTemplates())
  // })
})

function getZipEntries(zip) {
  const entries = []
  for (const zipEntry of zip.getEntries()) {
    if (!zipEntry.isDirectory) {
      entries.push(`${zipEntry.entryName}`)
    }
  }
  console.log('entries:' + entries)
  return entries
}
