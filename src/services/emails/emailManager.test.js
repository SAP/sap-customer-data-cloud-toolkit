import axios from 'axios'
import * as EmailsTestData from './data_test'
import EmailManager from './emailManager'
import ZipManager from '../zip/zipManager'
import * as CommonTestData from '../servicesData_test'
import * as ConfiguratorTestData from '../configurator/data_test'
import JSZip from 'jszip'
import fs from 'fs'

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
    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockResolvedValueOnce(mockedResponse)
    const expectedZipEntries = createExpectedZipEntries()
    expectedZipEntries.set('.impexMetadata.json', JSON.stringify(EmailsTestData.expectedExportConfigurationFileContent))
    expectedZipEntries.set('EmailVerification/en.html', EmailsTestData.emailTemplate)
    expectedZipEntries.set('AccountDeletionConfirmation/pt-br.html', EmailsTestData.emailTemplate)
    expectedZipEntries.set('PasswordResetConfirmation/pt-br.html', EmailsTestData.emailTemplate)
    expectedZipEntries.set('ImpossibleTraveler/en.html', EmailsTestData.emailTemplate)
    expectedZipEntries.set('NewUserWelcome/ar.html', EmailsTestData.emailTemplate)

    const zipContent = await emailManager.export('apiKey')

    const zipContentMap = await new ZipManager().read(zipContent)
    expect(zipContentMap).toEqual(expectedZipEntries)
  })

  test('2 - export with minimum templates', async () => {
    const mockedResponse = { data: EmailsTestData.getEmailsExpectedResponseWithMinimumTemplates() }
    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockResolvedValueOnce(mockedResponse)
    const expectedZipEntries = createExpectedZipEntries()
    expectedZipEntries.set('.impexMetadata.json', JSON.stringify(EmailsTestData.getExpectedExportConfigurationFileContentWithMinimumTemplates()))

    const zipContent = await emailManager.export('apiKey')

    const zipContentMap = await new ZipManager().read(zipContent)
    expect(zipContentMap).toEqual(expectedZipEntries)
  })

  test('3 - export error getting email templates', async () => {
    const err = CommonTestData.createErrorObject('Error getting email templates')
    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockImplementation(() => {
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

  test('4 - export error getting data center', async () => {
    const err = CommonTestData.createErrorObject('Error configuring site')
    axios.mockImplementation(() => {
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
  })

  test('5 - export templates', async () => {
    const mockedResponse = { data: JSON.parse(JSON.stringify(EmailsTestData.getEmailsExpectedResponse)) }
    axios.mockResolvedValue(mockedResponse)

    const emailTemplates = await emailManager.exportTemplates('apiKey')
    expect(emailTemplates).toEqual(EmailsTestData.expectedExportConfigurationFileContent)
  })

  test('6 - export templates with minimum templates', async () => {
    const mockedResponse = { data: EmailsTestData.getEmailsExpectedResponseWithMinimumTemplates() }
    axios.mockResolvedValue(mockedResponse)

    const emailTemplates = await emailManager.exportTemplates('apiKey')
    expect(emailTemplates).toEqual(EmailsTestData.getExpectedExportConfigurationFileContentWithMinimumTemplates())
  })

  test('7 - import', async () => {
    let spy = await jest.spyOn(emailManager.emailService, 'setSiteEmails')

    // read zip file while there's no UI code passing its contents
    //const zipContent = await readZipFile('unitTest.zip')
    const zipContent = await createZipFullContent()

    const mockedResponse = { data: CommonTestData.expectedGigyaResponseOk }
    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockResolvedValue(mockedResponse)

    // const expectedZipEntries = createExpectedZipEntries()
    // expectedZipEntries.set('.impexMetadata.json', JSON.stringify(EmailsTestData.expectedExportConfigurationFileContent))
    // expectedZipEntries.set('EmailVerification/en.html', EmailsTestData.emailTemplate)
    // expectedZipEntries.set('AccountDeletionConfirmation/pt-br.html', EmailsTestData.emailTemplate)
    // expectedZipEntries.set('PasswordResetConfirmation/pt-br.html', EmailsTestData.emailTemplate)
    // expectedZipEntries.set('ImpossibleTraveler/en.html', EmailsTestData.emailTemplate)
    // expectedZipEntries.set('NewUserWelcome/ar.html', EmailsTestData.emailTemplate)

    // const zipContentMap = await new ZipManager().read(zipContent)
    // expect([...zipContentMap.keys()].sort()).toEqual([...expectedZipEntries.keys()].sort())

    const response = await emailManager.import('apiKey', zipContent)
    console.log('response=' + JSON.stringify(response))
    response.map((resp) => CommonTestData.verifyResponseIsOk(resp))
    expect(spy.mock.calls.length).toBe(9)
  })

  test('8 - error missing metadata file', async () => {
    const zipContent = await createZipContentEmpty()

    //await emailManager.import('apiKey', zipContent)
    //await expect(emailManager.import('apiKey', zipContent)).rejects.toContain('Error on template file')
    let testPassed = false
    await emailManager.import('apiKey', zipContent).catch((error) => {
      if (error[0].errorDetails.startsWith('Zip file does not contains the metadata file')) {
        testPassed = true
      }
    })

    if (!testPassed) {
      throw new Error('Expected exception was not thrown')
    }
  })

  test('9 - error validating html template', async () => {
    const zipContent = await createZipContentWithTemplateError()

    //await emailManager.import('apiKey', zipContent)
    //await expect(emailManager.import('apiKey', zipContent)).rejects.toContain('Error on template file')
    let testPassed = false
    await emailManager.import('apiKey', zipContent).catch((error) => {
      if (error[0].errorDetails.startsWith('Error on template file')) {
        testPassed = true
      }
    })

    if (!testPassed) {
      throw new Error('Expected exception was not thrown')
    }
  })
})

function createExpectedZipEntries() {
  const expectedZipEntries = new Map()
  expectedZipEntries.set('MagicLink/en.html', EmailsTestData.emailTemplate)
  expectedZipEntries.set('MagicLink/pt.html', EmailsTestData.emailTemplate)
  expectedZipEntries.set('CodeVerification/en.html', EmailsTestData.emailTemplate)
  expectedZipEntries.set('LitePreferencesCenter/en.html', EmailsTestData.emailTemplate)
  expectedZipEntries.set('DoubleOptInConfirmation/ar.html', EmailsTestData.emailTemplate)
  expectedZipEntries.set('PasswordReset/en.html', EmailsTestData.emailTemplate)
  expectedZipEntries.set('TFAEmailVerification/en.html', EmailsTestData.emailTemplate)
  return expectedZipEntries
}

async function readZipFile(name) {
  return new JSZip.external.Promise(function (resolve, reject) {
    fs.readFile(name, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

function createZipFullContent() {
  const jszip = new JSZip()
  jszip.file('MagicLink/en.html', Buffer.from(EmailsTestData.emailTemplate, 'utf8'))
  jszip.file('MagicLink/pt.html', Buffer.from(EmailsTestData.emailTemplate, 'utf8'))
  jszip.file('CodeVerification/en.html', Buffer.from(EmailsTestData.emailTemplate, 'utf8'))
  jszip.file('LitePreferencesCenter/en.html', Buffer.from(EmailsTestData.emailTemplate, 'utf8'))
  jszip.file('DoubleOptInConfirmation/ar.html', Buffer.from(EmailsTestData.emailTemplate, 'utf8'))
  jszip.file('PasswordReset/en.html', Buffer.from(EmailsTestData.emailTemplate, 'utf8'))
  jszip.file('TFAEmailVerification/en.html', Buffer.from(EmailsTestData.emailTemplate, 'utf8'))
  jszip.file('.impexMetadata.json', Buffer.from(JSON.stringify(EmailsTestData.expectedExportConfigurationFileContent), 'utf8'))
  jszip.file('EmailVerification/en.html', Buffer.from(EmailsTestData.emailTemplate, 'utf8'))
  jszip.file('AccountDeletionConfirmation/pt-br.html', Buffer.from(EmailsTestData.emailTemplate, 'utf8'))
  jszip.file('PasswordResetConfirmation/pt-br.html', Buffer.from(EmailsTestData.emailTemplate, 'utf8'))
  jszip.file('ImpossibleTraveler/en.html', Buffer.from(EmailsTestData.emailTemplate, 'utf8'))
  jszip.file('NewUserWelcome/ar.html', Buffer.from(EmailsTestData.emailTemplate, 'utf8'))
  return jszip.generateAsync({ type: 'arraybuffer' })
}

function createZipContentWithTemplateError() {
  const jszip = new JSZip()
  jszip.file('.impexMetadata.json', Buffer.from(JSON.stringify(EmailsTestData.expectedExportConfigurationFileContent), 'utf8'))
  jszip.file('MagicLink/en.html', Buffer.from(EmailsTestData.emailTemplate + 'x', 'utf8'))
  return jszip.generateAsync({ type: 'arraybuffer' })
}

function createZipContentEmpty() {
  const jszip = new JSZip()
  return jszip.generateAsync({ type: 'arraybuffer' })
}
