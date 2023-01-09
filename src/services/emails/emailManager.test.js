/* eslint-disable no-undef */
import axios from 'axios'
import * as EmailsTestData from './data_test'
import EmailManager from './emailManager'
import ZipManager from '../zip/zipManager'
import * as CommonTestData from '../servicesData_test'
import * as ConfiguratorTestData from '../configurator/data_test'
import JSZip from 'jszip'

jest.mock('axios')
jest.setTimeout(30000)

const apiKey = 'apiKey'
const methodNameToSpy = 'setSiteEmailsWithDataCenter'
const magicLinkTemplateName = 'magicLink'
const emailTemplateBuffer = Buffer.from(EmailsTestData.emailTemplate, 'utf8')

describe('Emails Manager test suite', () => {
  let emailManager

  beforeEach(() => {
    emailManager = new EmailManager(CommonTestData.credentials)
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

    const zipContent = await emailManager.export(apiKey)

    const zipContentMap = await new ZipManager().read(zipContent)
    expect(zipContentMap).toEqual(expectedZipEntries)
  })

  test('2 - export with minimum templates', async () => {
    const mockedResponse = { data: EmailsTestData.getEmailsExpectedResponseWithMinimumTemplates() }
    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockResolvedValueOnce(mockedResponse)
    const expectedZipEntries = createExpectedZipEntries()
    expectedZipEntries.set('.impexMetadata.json', JSON.stringify(EmailsTestData.getExpectedExportConfigurationFileContentWithMinimumTemplates()))

    const zipContent = await emailManager.export(apiKey)

    const zipContentMap = await new ZipManager().read(zipContent)
    expect(zipContentMap).toEqual(expectedZipEntries)
  })

  test('3 - export error getting email templates', async () => {
    const err = CommonTestData.createErrorObject('Error getting email templates')
    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockImplementation(() => {
      throw err
    })
    let testPassed = false
    await emailManager.export(apiKey).catch((error) => {
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

  test('Import email templates', async () => {
    const emailManager = new EmailManager({
      userKey: '',

      secret: '',

      partnerID: '',
    })

    const zipContent = await readZipFile('/Users/I561459/OneDrive - SAP SE/Desktop/cdc_example_file/.impexMetadata.json')

    const response = await emailManager.import('4_xn7trEL9hK3fN1CX9-7aHA', zipContent)

    console.log(response)
  })

  test('4 - export error getting data center', async () => {
    const err = CommonTestData.createErrorObject('Error configuring site')
    axios.mockImplementation(() => {
      throw err
    })
    let testPassed = false
    await emailManager.export(apiKey).catch((error) => {
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

    const emailTemplates = await emailManager.exportTemplates(apiKey)
    expect(emailTemplates).toEqual(EmailsTestData.expectedExportConfigurationFileContent)
  })

  test('6 - export templates with minimum templates', async () => {
    const mockedResponse = { data: EmailsTestData.getEmailsExpectedResponseWithMinimumTemplates() }
    axios.mockResolvedValue(mockedResponse)

    const emailTemplates = await emailManager.exportTemplates(apiKey)
    expect(emailTemplates).toEqual(EmailsTestData.getExpectedExportConfigurationFileContentWithMinimumTemplates())
  })

  test('7 - import', async () => {
    let spy = jest.spyOn(emailManager.emailService, 'setSiteEmails')
    const zipContent = await createZipFullContent()

    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockResolvedValue({ data: CommonTestData.expectedGigyaResponseOk })

    const response = await emailManager.import(apiKey, zipContent)
    //console.log('response=' + JSON.stringify(response))
    response.map((resp) => CommonTestData.verifyResponseIsOk(resp))
    expect(spy.mock.calls.length).toBe(9)
  })

  test('7.1 - import with email validation', async () => {
    let spy = jest.spyOn(emailManager.emailService, methodNameToSpy)
    const zipContent = await createZipFullContent()
    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockResolvedValue({ data: CommonTestData.expectedGigyaResponseOk })

    const validEmailsResponse = await emailManager.validateEmailTemplates(zipContent)
    expect(validEmailsResponse.length).toBe(1)
    expect(validEmailsResponse[0].errorCode).toBe(0)

    const response = await emailManager.import(apiKey, zipContent)
    //console.log('response=' + JSON.stringify(response))
    response.map((resp) => CommonTestData.verifyResponseIsOk(resp))
    expect(spy.mock.calls.length).toBe(9)
  })

  test('8 - import new template', async () => {
    let spy = jest.spyOn(emailManager.emailService, 'setSiteEmails')
    const expectCallArgument = {
      welcomeEmailTemplates: {
        ar: EmailsTestData.emailTemplate,
      },
      apiKey: apiKey,
      secret: CommonTestData.credentials.secret,
      userKey: CommonTestData.credentials.userKey,
    }

    const zipContent = await createZipContentWithNewTemplate()

    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockResolvedValue({ data: CommonTestData.expectedGigyaResponseOk })

    const response = await emailManager.import(apiKey, zipContent)
    //console.log('response=' + JSON.stringify(response))
    response.map((resp) => CommonTestData.verifyResponseIsOk(resp))
    expect(spy.mock.calls.length).toBe(1)
    expect(spy).toHaveBeenCalledWith(apiKey, expectCallArgument)
  })

  test('9 - delete template language', async () => {
    let spy = jest.spyOn(emailManager.emailService, 'setSiteEmails')
    const expectCallArgument = {
      defaultLanguage: 'en',
      urlPlaceHolder: '$url',
      emailTemplates: {
        en: EmailsTestData.emailTemplate,
        pt: null,
      },
      apiKey: 'apiKey',
      secret: CommonTestData.credentials.secret,
      userKey: CommonTestData.credentials.userKey,
    }
    const zipContent = await createZipContentWithTemplateLanguageRemoved()

    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockResolvedValueOnce({ data: CommonTestData.expectedGigyaResponseOk })

    const response = await emailManager.import(apiKey, zipContent)
    //console.log('response=' + JSON.stringify(response))
    response.map((resp) => CommonTestData.verifyResponseIsOk(resp))
    expect(spy.mock.calls.length).toBe(1)
    expect(spy).toHaveBeenCalledWith(apiKey, expectCallArgument)
  })

  test('9.1 - import error getting data center', async () => {
    const err = CommonTestData.createErrorObject('Error configuring site')
    axios.mockImplementation(() => {
      throw err
    })
    const zipContent = await createZipFullContent()
    let testPassed = false
    await emailManager.import(apiKey, zipContent).catch((error) => {
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

  test('10 - add template language', async () => {
    let spy = jest.spyOn(emailManager.emailService, 'setSiteEmails')
    const expectCallArgument = {
      defaultLanguage: 'en',
      urlPlaceHolder: '$url',
      emailTemplates: {
        en: EmailsTestData.emailTemplate,
        pt: EmailsTestData.emailTemplate,
        fr: EmailsTestData.emailTemplate,
      },
      apiKey: apiKey,
      secret: CommonTestData.credentials.secret,
      userKey: CommonTestData.credentials.userKey,
    }

    const zipContent = await createZipContentWithTemplateLanguageAdded()

    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockResolvedValueOnce({ data: CommonTestData.expectedGigyaResponseOk })

    const response = await emailManager.import(apiKey, zipContent)
    //console.log('response=' + JSON.stringify(response))
    response.map((resp) => CommonTestData.verifyResponseIsOk(resp))
    expect(spy.mock.calls.length).toBe(1)
    expect(spy).toHaveBeenCalledWith(apiKey, expectCallArgument)
  })

  test('20 - error missing metadata file', async () => {
    const zipContent = await createZipContentEmpty()
    await executeErrorTestCase(zipContent, 'Zip file does not contains the metadata file')
  })

  test('21 - error validating html template', async () => {
    const zipContent = await createZipContentWithTemplateError(EmailsTestData.emailTemplate + 'x')
    let testPassed = false
    await emailManager.validateEmailTemplates(zipContent).catch((error) => {
      if (error.length === 1 && error[0].errorDetails.startsWith('Error on template file')) {
        testPassed = true
      }
    })

    if (!testPassed) {
      throw new Error('Expected exception was not thrown')
    }
  })

  test('22 - error template without meta subject', async () => {
    let spy = jest.spyOn(emailManager.emailService, 'setSiteEmails')
    const template = '<a>test</a>'
    const expectCallArgument = {
      defaultLanguage: 'en',
      urlPlaceHolder: '$url',
      emailTemplates: {
        en: template,
        pt: EmailsTestData.emailTemplate,
      },
      apiKey: apiKey,
      secret: CommonTestData.credentials.secret,
      userKey: CommonTestData.credentials.userKey,
    }
    const zipContent = await createZipContentWithTemplateError(template)
    axios
      .mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) })
      .mockResolvedValueOnce({ data: EmailsTestData.expectedGigyaImportTemplateWithoutMetaSubject })

    const response = await emailManager.import(apiKey, zipContent)
    //console.log('response=' + JSON.stringify(response[0]))
    response.map((resp) => CommonTestData.verifyResponseIsNotOk(resp, EmailsTestData.expectedGigyaImportTemplateWithoutMetaSubject))
    expect(spy.mock.calls.length).toBe(1)
    expect(spy).toHaveBeenCalledWith(apiKey, expectCallArgument)
  })

  test('23 - import cleaning dispensable files', async () => {
    let spy = jest.spyOn(emailManager.emailService, methodNameToSpy)
    const zipContent = await createZipFullContentWithDispensableFiles()

    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockResolvedValue({ data: CommonTestData.expectedGigyaResponseOk })

    const response = await emailManager.import(apiKey, zipContent)
    //console.log('response=' + JSON.stringify(response))
    response.map((resp) => CommonTestData.verifyResponseIsOk(resp))
    expect(spy.mock.calls.length).toBe(9)
  })

  async function executeErrorTestCase(zipContent, expectedErrorMessage) {
    let testPassed = false
    await emailManager.import(apiKey, zipContent).catch((error) => {
      if (error[0].errorDetails.startsWith(expectedErrorMessage)) {
        testPassed = true
      }
    })

    if (!testPassed) {
      throw new Error('Expected exception was not thrown')
    }
  }
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

function createZipFullContent() {
  const jszip = new JSZip()
  jszip.file('MagicLink/en.html', emailTemplateBuffer)
  jszip.file('MagicLink/pt.html', emailTemplateBuffer)
  jszip.file('CodeVerification/en.html', emailTemplateBuffer)
  jszip.file('LitePreferencesCenter/en.html', emailTemplateBuffer)
  jszip.file('DoubleOptInConfirmation/ar.html', emailTemplateBuffer)
  jszip.file('PasswordReset/en.html', emailTemplateBuffer)
  jszip.file('TFAEmailVerification/en.html', emailTemplateBuffer)
  jszip.file('.impexMetadata.json', Buffer.from(JSON.stringify(EmailsTestData.expectedExportConfigurationFileContent), 'utf8'))
  jszip.file('EmailVerification/en.html', emailTemplateBuffer)
  jszip.file('AccountDeletionConfirmation/pt-br.html', emailTemplateBuffer)
  jszip.file('PasswordResetConfirmation/pt-br.html', emailTemplateBuffer)
  jszip.file('ImpossibleTraveler/en.html', emailTemplateBuffer)
  jszip.file('NewUserWelcome/ar.html', emailTemplateBuffer)
  return jszip.generateAsync({ type: 'arraybuffer' })
}

function createZipFullContentWithDispensableFiles() {
  const jszip = new JSZip()
  jszip.file('MagicLink/en.html', emailTemplateBuffer)
  jszip.file('MagicLink/pt.html', emailTemplateBuffer)
  jszip.file('CodeVerification/en.html', emailTemplateBuffer)
  jszip.file('/__MACOSX/', emailTemplateBuffer)
  jszip.file('.DS_Store', emailTemplateBuffer)
  jszip.file('dymmy.txt', emailTemplateBuffer)
  jszip.file('.impexMetadata.json', Buffer.from(JSON.stringify(EmailsTestData.expectedExportConfigurationFileContent), 'utf8'))

  return jszip.generateAsync({ type: 'arraybuffer' })
}

function createZipContentWithTemplateError(template) {
  const metadata = EmailsTestData.getEmailsExpectedResponseWithNoTemplates()
  metadata['magicLink'] = EmailsTestData.getEmailsExpectedResponse.magicLink
  const jszip = new JSZip()
  jszip.file('.impexMetadata.json', Buffer.from(JSON.stringify(metadata), 'utf8'))
  jszip.file('MagicLink/en.html', Buffer.from(template, 'utf8'))
  return jszip.generateAsync({ type: 'arraybuffer' })
}

function createZipContentEmpty() {
  const jszip = new JSZip()
  return jszip.generateAsync({ type: 'arraybuffer' })
}

function createZipContentWithNewTemplate() {
  const jszip = new JSZip()
  jszip.file('.impexMetadata.json', Buffer.from(JSON.stringify(EmailsTestData.getEmailsExpectedResponseWithNoTemplates()), 'utf8'))
  jszip.file('NewUserWelcome/ar.html', emailTemplateBuffer)
  return jszip.generateAsync({ type: 'arraybuffer' })
}

function createZipContentWithTemplateLanguageRemoved() {
  const jszip = createZipContent()
  jszip.file('MagicLink/en.html', emailTemplateBuffer)
  jszip.file('MagicLink/pt.html', Buffer.from('', 'utf8'))
  return jszip.generateAsync({ type: 'arraybuffer' })
}

function createZipContentWithTemplateLanguageAdded() {
  const jszip = createZipContent()
  jszip.file('MagicLink/fr.html', emailTemplateBuffer)
  return jszip.generateAsync({ type: 'arraybuffer' })
}
