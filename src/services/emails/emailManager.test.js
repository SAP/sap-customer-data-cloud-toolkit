import axios from 'axios'
import * as EmailsTestData from './data_test'
import EmailManager from './emailManager'
import ZipManager from '../zip/zipManager'
import * as CommonTestData from '../servicesData_test'

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
    const expectedZipEntries = createExpectedZipEntries()
    expectedZipEntries.set('.impexMetadata.json', JSON.stringify(EmailsTestData.expectedExportConfigurationFileContent))
    expectedZipEntries.set('EmailVerification/en.html', EmailsTestData.emailTemplate)
    expectedZipEntries.set('AccountDeletionConfirmation/pt-br.html', EmailsTestData.emailTemplate)
    expectedZipEntries.set('PasswordResetConfirmation/pt-br.html', EmailsTestData.emailTemplate)
    expectedZipEntries.set('ImpossibleTraveler/en.html', EmailsTestData.emailTemplate)

    const zipContent = await emailManager.export('apiKey')

    const zipContentMap = await new ZipManager().read(zipContent)
    expect(zipContentMap).toEqual(expectedZipEntries)
  })

  test('2 - export with minimum templates', async () => {
    const mockedResponse = { data: EmailsTestData.getEmailsExpectedResponseWithMinimumTemplates() }
    axios.mockResolvedValueOnce(mockedResponse).mockResolvedValueOnce(mockedResponse)
    const expectedZipEntries = createExpectedZipEntries()
    expectedZipEntries.set('.impexMetadata.json', JSON.stringify(EmailsTestData.getExpectedExportConfigurationFileContentWithMinimumTemplates()))

    const zipContent = await emailManager.export('apiKey')

    const zipContentMap = await new ZipManager().read(zipContent)
    expect(zipContentMap).toEqual(expectedZipEntries)
  })

  test('3 - export error', async () => {
    const err = CommonTestData.createErrorObject('Error getting email templates')
    axios.mockResolvedValue({ data: EmailsTestData.expectedGigyaInvalidUserKey }).mockImplementation(() => {
      throw err
    })
    let testPassed = false
    await emailManager.export('apiKey').catch((error) => {
      if (error.errorMessage !== err.message || error.errorCode !== err.code || error.errorDetails !== err.details || error.time === undefined) {
        throw new Error('It is not the expected exception')
      } else {
        testPassed = true
      }
    })

    if (!testPassed) {
      throw new Error('Expected exception was not thrown')
    }
    //await expect(emailManager.export('apiKey')).rejects.toEqual(generateExpectedErrorResponse())
  })

  test('4 - export templates', async () => {
    const mockedResponse = { data: JSON.parse(JSON.stringify(EmailsTestData.getEmailsExpectedResponse)) }
    axios.mockResolvedValue(mockedResponse)

    const emailTemplates = await emailManager.exportTemplates('apiKey')
    expect(emailTemplates).toEqual(EmailsTestData.expectedExportConfigurationFileContent)
  })

  test('5 - export templates with minimum templates', async () => {
    const mockedResponse = { data: EmailsTestData.getEmailsExpectedResponseWithMinimumTemplates() }
    axios.mockResolvedValue(mockedResponse)

    const emailTemplates = await emailManager.exportTemplates('apiKey')
    expect(emailTemplates).toEqual(EmailsTestData.getExpectedExportConfigurationFileContentWithMinimumTemplates())
  })
})

function createExpectedZipEntries() {
  const expectedZipEntries = new Map()
  expectedZipEntries.set('MagicLink/en.html', EmailsTestData.emailTemplate)
  expectedZipEntries.set('MagicLink/pt.html', EmailsTestData.emailTemplate)
  expectedZipEntries.set('CodeVerification/en.html', EmailsTestData.emailTemplate)
  expectedZipEntries.set('NewUserWelcome/ar.html', EmailsTestData.emailTemplate)
  expectedZipEntries.set('LitePreferencesCenter/en.html', EmailsTestData.emailTemplate)
  expectedZipEntries.set('DoubleOptInConfirmation/ar.html', EmailsTestData.emailTemplate)
  expectedZipEntries.set('PasswordReset/en.html', EmailsTestData.emailTemplate)
  expectedZipEntries.set('TFAEmailVerification/en.html', EmailsTestData.emailTemplate)
  return expectedZipEntries
}
