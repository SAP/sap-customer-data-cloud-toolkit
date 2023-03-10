import axios from 'axios'
import * as EmailsTestData from './dataTest'
import EmailManager from './emailManager'
import ZipManager from '../zip/zipManager'
import * as CommonTestData from '../servicesDataTest'
import * as ConfiguratorTestData from '../configurator/dataTest'
import JSZip from 'jszip'
import { errorCallback } from '../servicesDataTest'
import SiteConfigurator from '../configurator/siteConfigurator'

jest.mock('axios')
jest.setTimeout(30000)

const apiKey = 'apiKey'
const methodNameToSpy = 'setSiteEmailsWithDataCenter'
const magicLinkTemplateName = 'magicLink'
const emailTemplateBuffer = Buffer.from(EmailsTestData.emailTemplate, 'utf8')
let zipRootFolder

const directoriesTable = [['cdc-toolbox-email-templates/'], ['a/b/'], ['']]

describe('Emails Manager test suite', () => {
  let emailManager

  beforeEach(() => {
    emailManager = new EmailManager(CommonTestData.credentials)
    zipRootFolder = 'cdc-toolbox-email-templates/'
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
    await emailManager.export(apiKey).catch((error) => {
      errorCallback(error[0], err)
    })
  })

  test('4 - export error getting data center', async () => {
    const err = CommonTestData.createErrorObject(SiteConfigurator.ERROR_MSG_CONFIG)
    axios.mockImplementation(() => {
      throw err
    })
    await emailManager.export(apiKey).catch((error) => {
      errorCallback(error[0], err)
    })
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

  test.each(directoriesTable)('7 - import with several directories', async (zipRootFolder) => {
    let spy = jest.spyOn(emailManager.emailService, methodNameToSpy)
    const customEmailTemplate = createCustomEmailTemplate(zipRootFolder)
    const expectCallArgument = {
      defaultLanguage: 'en',
      urlPlaceHolder: '$url',
      emailTemplates: {
        en: customEmailTemplate,
        pt: customEmailTemplate,
      },
    }

    const jszip = createZipContent(zipRootFolder)
    jszip.file(zipRootFolder + 'MagicLink/pt.html', Buffer.from(customEmailTemplate, 'utf8'))
    jszip.file(zipRootFolder + 'MagicLink/en.html', Buffer.from(customEmailTemplate, 'utf8'))
    jszip.file(zipRootFolder + 'MagicLink/.DS_Store', Buffer.from(customEmailTemplate, 'utf8'))
    jszip.file(`__MACOSX/${zipRootFolder}MagicLink/es.html`, emailTemplateBuffer)
    jszip.file('anotherFolder/MagicLink/fr.html', emailTemplateBuffer)
    const zipContent = await jszip.generateAsync({ type: 'arraybuffer' })

    const siteConfigResponse = ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0)
    axios.mockResolvedValueOnce({ data: siteConfigResponse }).mockResolvedValue({ data: CommonTestData.expectedGigyaResponseOk })

    const response = await emailManager.import(apiKey, zipContent)
    //console.log('response=' + JSON.stringify(response))
    response.map((resp) => CommonTestData.verifyResponseIsOk(resp))
    expect(spy.mock.calls.length).toBe(1)
    expect(spy).toHaveBeenCalledWith(apiKey, magicLinkTemplateName, expectCallArgument, siteConfigResponse.dataCenter)
  })

  test('7.1 - import with email validation', async () => {
    let spy = jest.spyOn(emailManager.emailService, methodNameToSpy)
    const zipContent = await createZipFullContent()
    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockResolvedValue({ data: CommonTestData.expectedGigyaResponseOk })

    const validEmailsResponse = await emailManager.validateEmailTemplates(zipContent)
    expect(validEmailsResponse.length).toBe(1)
    expect(validEmailsResponse[0].errorCode).toBe(0)
    expect(validEmailsResponse[0].severity).toBe(EmailManager.ERROR_SEVERITY_INFO)

    const response = await emailManager.import(apiKey, zipContent)
    //console.log('response=' + JSON.stringify(response))
    response.map((resp) => CommonTestData.verifyResponseIsOk(resp))
    expect(spy.mock.calls.length).toBe(9)
  })

  test.each(directoriesTable)('8 - import new template', async (zipRootFolder) => {
    let spy = jest.spyOn(emailManager.emailService, methodNameToSpy)
    const customEmailTemplate = createCustomEmailTemplate(zipRootFolder)
    const expectCallArgument = {
      welcomeEmailTemplates: {
        ar: customEmailTemplate,
      },
    }

    const jszip = new JSZip()
    jszip.file(zipRootFolder + '.impexMetadata.json', Buffer.from(JSON.stringify(EmailsTestData.getEmailsExpectedResponseWithNoTemplates()), 'utf8'))
    jszip.file(zipRootFolder + 'NewUserWelcome/ar.html', Buffer.from(customEmailTemplate, 'utf8'))
    const zipContent = await jszip.generateAsync({ type: 'arraybuffer' })

    const siteConfigResponse = ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0)
    axios.mockResolvedValueOnce({ data: siteConfigResponse }).mockResolvedValueOnce({ data: CommonTestData.expectedGigyaResponseOk })

    const response = await emailManager.import(apiKey, zipContent)
    //console.log('response=' + JSON.stringify(response))
    response.map((resp) => CommonTestData.verifyResponseIsOk(resp))
    expect(spy.mock.calls.length).toBe(1)
    expect(spy).toHaveBeenCalledWith(apiKey, 'emailNotifications', expectCallArgument, siteConfigResponse.dataCenter)
  })

  test.each(directoriesTable)('9 - delete template language', async (zipRootFolder) => {
    let spy = jest.spyOn(emailManager.emailService, methodNameToSpy)
    const customEmailTemplate = createCustomEmailTemplate(zipRootFolder)
    const expectCallArgument = {
      defaultLanguage: 'en',
      urlPlaceHolder: '$url',
      emailTemplates: {
        en: customEmailTemplate,
        pt: null,
      },
    }
    const jszip = createZipContent(zipRootFolder)
    jszip.file(zipRootFolder + 'MagicLink/en.html', customEmailTemplate)
    jszip.file(zipRootFolder + 'MagicLink/pt.html', Buffer.from('', 'utf8'))
    const zipContent = await jszip.generateAsync({ type: 'arraybuffer' })

    const siteConfigResponse = ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0)
    axios.mockResolvedValueOnce({ data: siteConfigResponse }).mockResolvedValueOnce({ data: CommonTestData.expectedGigyaResponseOk })

    const response = await emailManager.import(apiKey, zipContent)
    //console.log('response=' + JSON.stringify(response))
    response.map((resp) => CommonTestData.verifyResponseIsOk(resp))
    expect(spy.mock.calls.length).toBe(1)
    expect(spy).toHaveBeenCalledWith(apiKey, magicLinkTemplateName, expectCallArgument, siteConfigResponse.dataCenter)
  })

  test('9.1 - import error getting data center', async () => {
    const err = CommonTestData.createErrorObject(SiteConfigurator.ERROR_MSG_CONFIG)
    axios.mockImplementation(() => {
      throw err
    })
    const zipContent = await createZipFullContent()
    await emailManager.import(apiKey, zipContent).catch((error) => {
      errorCallback(error[0], err)
    })
  })

  test.each(directoriesTable)('10 - add template language', async (zipRootFolder) => {
    let spy = jest.spyOn(emailManager.emailService, methodNameToSpy)
    const customEmailTemplate = createCustomEmailTemplate(zipRootFolder)
    const expectCallArgument = {
      defaultLanguage: 'en',
      urlPlaceHolder: '$url',
      emailTemplates: {
        en: customEmailTemplate,
        pt: customEmailTemplate,
        fr: customEmailTemplate,
      },
    }

    const jszip = createZipContent(zipRootFolder)
    jszip.file(zipRootFolder + 'MagicLink/en.html', customEmailTemplate)
    jszip.file(zipRootFolder + 'MagicLink/pt.html', customEmailTemplate)
    jszip.file(zipRootFolder + 'MagicLink/fr.html', customEmailTemplate)
    const zipContent = await jszip.generateAsync({ type: 'arraybuffer' })

    const siteConfigResponse = ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0)
    axios.mockResolvedValueOnce({ data: siteConfigResponse }).mockResolvedValueOnce({ data: CommonTestData.expectedGigyaResponseOk })

    const response = await emailManager.import(apiKey, zipContent)
    //console.log('response=' + JSON.stringify(response))
    response.map((resp) => CommonTestData.verifyResponseIsOk(resp))
    expect(spy.mock.calls.length).toBe(1)
    expect(spy).toHaveBeenCalledWith(apiKey, magicLinkTemplateName, expectCallArgument, siteConfigResponse.dataCenter)
  })

  test('11 - import cleaning dispensable files', async () => {
    let spy = jest.spyOn(emailManager.emailService, methodNameToSpy)
    const zipContent = await createZipFullContentWithIgnorableFiles()

    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockResolvedValue({ data: CommonTestData.expectedGigyaResponseOk })

    const response = await emailManager.import(apiKey, zipContent)
    //console.log('response=' + JSON.stringify(response))
    response.map((resp) => CommonTestData.verifyResponseIsOk(resp))
    expect(spy.mock.calls.length).toBe(9)
  })

  test('20 - error validating html template', async () => {
    const err = {
      message: 'Error validating email templates',
      code: 'InvalidXml',
      details: `Error on template file cdc-toolbox-email-templates/MagicLink/en.html. Extra text at the end on line 18`,
      severity: EmailManager.ERROR_SEVERITY_WARNING,
    }
    const zipContent = await createZipContentWithTemplateError(EmailsTestData.emailTemplate + 'x')
    await emailManager.validateEmailTemplates(zipContent).catch((error) => {
      errorCallback(error[0], err)
    })
  })

  test('21 - error template without meta subject', async () => {
    let spy = jest.spyOn(emailManager.emailService, methodNameToSpy)
    const template = '<a>test</a>'
    const expectCallArgument = {
      defaultLanguage: 'en',
      urlPlaceHolder: '$url',
      emailTemplates: {
        en: template,
        pt: EmailsTestData.emailTemplate,
      },
    }
    const zipContent = await createZipContentWithTemplateError(template)
    const siteConfigResponse = ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0)
    axios.mockResolvedValueOnce({ data: siteConfigResponse }).mockResolvedValueOnce({ data: EmailsTestData.expectedGigyaImportTemplateWithoutMetaSubject })

    const response = await emailManager.import(apiKey, zipContent)
    //console.log('response=' + JSON.stringify(response[0]))
    response.map((resp) => CommonTestData.verifyResponseIsNotOk(resp, EmailsTestData.expectedGigyaImportTemplateWithoutMetaSubject))
    expect(spy.mock.calls.length).toBe(1)
    expect(spy).toHaveBeenCalledWith(apiKey, magicLinkTemplateName, expectCallArgument, siteConfigResponse.dataCenter)
  })

  test('22 - import empty zip file', async () => {
    const err = {
      message: 'Error importing email templates',
      code: 1,
      details: `Zip file does not contains the metadata file .impexMetadata.json. Please export the email templates again.`,
      severity: EmailManager.ERROR_SEVERITY_ERROR,
    }
    const zipContent = await createZipContentEmpty()

    await emailManager.import(apiKey, zipContent).catch((error) => {
      errorCallback(error[0], err)
    })
  })

  test('23 - validate emails on empty zip file', async () => {
    const err = {
      message: 'Error validating email templates',
      code: 1,
      details: `Zip file does not contains the metadata file .impexMetadata.json. Please export the email templates again.`,
      severity: EmailManager.ERROR_SEVERITY_ERROR,
    }
    const zipContent = await createZipContentEmpty()

    await emailManager.validateEmailTemplates(zipContent).catch((error) => {
      errorCallback(error[0], err)
    })
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

function createZipFullContent() {
  const jszip = new JSZip()
  jszip.file(zipRootFolder + 'MagicLink/en.html', emailTemplateBuffer)
  jszip.file(zipRootFolder + 'MagicLink/pt.html', emailTemplateBuffer)
  jszip.file(zipRootFolder + 'CodeVerification/en.html', emailTemplateBuffer)
  jszip.file(zipRootFolder + 'LitePreferencesCenter/en.html', emailTemplateBuffer)
  jszip.file(zipRootFolder + 'DoubleOptInConfirmation/ar.html', emailTemplateBuffer)
  jszip.file(zipRootFolder + 'PasswordReset/en.html', emailTemplateBuffer)
  jszip.file(zipRootFolder + 'TFAEmailVerification/en.html', emailTemplateBuffer)
  jszip.file(zipRootFolder + '.impexMetadata.json', Buffer.from(JSON.stringify(EmailsTestData.expectedExportConfigurationFileContent), 'utf8'))
  jszip.file(zipRootFolder + 'EmailVerification/en.html', emailTemplateBuffer)
  jszip.file(zipRootFolder + 'AccountDeletionConfirmation/pt-br.html', emailTemplateBuffer)
  jszip.file(zipRootFolder + 'PasswordResetConfirmation/pt-br.html', emailTemplateBuffer)
  jszip.file(zipRootFolder + 'ImpossibleTraveler/en.html', emailTemplateBuffer)
  jszip.file(zipRootFolder + 'NewUserWelcome/ar.html', emailTemplateBuffer)
  return jszip.generateAsync({ type: 'arraybuffer' })
}

function createZipFullContentWithIgnorableFiles() {
  const jszip = new JSZip()
  jszip.file(zipRootFolder + 'MagicLink/en.html', emailTemplateBuffer)
  jszip.file(zipRootFolder + 'MagicLink/pt.html', emailTemplateBuffer)
  jszip.file(zipRootFolder + 'CodeVerification/en.html', emailTemplateBuffer)
  jszip.file('/__MACOSX/' + zipRootFolder, emailTemplateBuffer)
  jszip.file(zipRootFolder + 'MagicLink/.DS_Store', emailTemplateBuffer)
  jszip.file('.DS_Store', emailTemplateBuffer)
  jszip.file('dummy.txt', emailTemplateBuffer)
  jszip.file(zipRootFolder + '.impexMetadata.json', Buffer.from(JSON.stringify(EmailsTestData.expectedExportConfigurationFileContent), 'utf8'))

  return jszip.generateAsync({ type: 'arraybuffer' })
}

function createZipContentWithTemplateError(template) {
  const jszip = createZipContent(zipRootFolder)
  jszip.file(zipRootFolder + 'MagicLink/en.html', Buffer.from(template, 'utf8'))
  return jszip.generateAsync({ type: 'arraybuffer' })
}

function createZipContentEmpty() {
  const jszip = new JSZip()
  return jszip.generateAsync({ type: 'arraybuffer' })
}

function createZipContent(zipRootFolder) {
  const metadata = EmailsTestData.getEmailsExpectedResponseWithNoTemplates()
  metadata[magicLinkTemplateName] = EmailsTestData.getEmailsExpectedResponse.magicLink
  const jszip = new JSZip()
  jszip.file(zipRootFolder + '.impexMetadata.json', Buffer.from(JSON.stringify(metadata), 'utf8'))
  return jszip
}

function createCustomEmailTemplate(zipRootFolder) {
  let customEmailTemplate = EmailsTestData.emailTemplate.slice()
  const replaceValue = `##${zipRootFolder}##`
  return customEmailTemplate.replace('noreply', replaceValue)
}
