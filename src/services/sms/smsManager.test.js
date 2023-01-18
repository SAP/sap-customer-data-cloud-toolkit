import axios from 'axios'
import * as ConfiguratorTestData from '../configurator/dataTest'
import ZipManager from '../zip/zipManager'
import SmsManager from './smsManager'
import { credentials } from '../servicesDataTest'
import { getSmsExpectedResponse, getSmsExpectedResponseWithNoTemplates, setSmsExpectedTemplateArgument } from './dataTest'
import * as CommonTestData from '../servicesDataTest'
import JSZip from 'jszip'

jest.mock('axios')
jest.setTimeout(30000)

const apiKey = 'apiKey'
const methodNameToSpy = 'setSiteSms'
const directoriesTable = [['cdc-toolbox-sms-templates/'], ['a/b/'], ['']]

describe('Sms Manager test suite', () => {
  let smsManager
  let zipRootFolder

  beforeEach(() => {
    smsManager = new SmsManager(credentials)
    zipRootFolder = ''
    jest.clearAllMocks()
  })

  test('1 - export all templates', async () => {
    const mockedResponse = { data: JSON.parse(JSON.stringify(getSmsExpectedResponse)) }
    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockResolvedValueOnce(mockedResponse)
    const expectedZipEntries = createExpectedZipEntries()

    const zipContent = await smsManager.export(apiKey)

    const zipContentMap = await new ZipManager().read(zipContent)
    expect(zipContentMap).toEqual(expectedZipEntries)
  })

  test('2 - export no templates', async () => {
    const mockedResponse = { data: JSON.parse(JSON.stringify(getSmsExpectedResponseWithNoTemplates())) }
    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockResolvedValueOnce(mockedResponse)
    const expectedZipEntries = new Map()

    const zipContent = await smsManager.export(apiKey)

    const zipContentMap = await new ZipManager().read(zipContent)
    expect(zipContentMap).toEqual(expectedZipEntries)
  })

  test('3 - export with error getting data center', async () => {
    const mockedResponse = { data: ConfiguratorTestData.scExpectedGigyaResponseNotOk }
    axios.mockResolvedValueOnce(mockedResponse)
    await expect(smsManager.export('apiKey')).rejects.toEqual([mockedResponse.data])
  })

  test.each(directoriesTable)('4 - import all templates', async (zipRootFolder) => {
    let spy = jest.spyOn(smsManager.smsService, methodNameToSpy)
    const zipContent = await createZipFullContent(zipRootFolder)

    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockResolvedValue({ data: CommonTestData.expectedGigyaResponseOk })

    const response = await smsManager.import(apiKey, zipContent)
    //console.log('response=' + JSON.stringify(response))
    CommonTestData.verifyResponseIsOk(response)
    expect(response).toEqual(CommonTestData.expectedGigyaResponseOk)
    expect(spy).toHaveBeenCalledWith(apiKey, setSmsExpectedTemplateArgument())
  })

  test('5 - import no templates', async () => {
    const zipContent = await createZipContentEmpty()
    const expectedError = {
      errorCode: 1,
      errorDetails: 'Zip file does not contains any SMS template files. Please export the templates again.',
      errorMessage: 'Error importing SMS templates',
    }
    await expect(smsManager.import('apiKey', zipContent)).rejects.toEqual([
      { errorCode: expectedError.errorCode, errorDetails: expectedError.errorDetails, errorMessage: expectedError.errorMessage, time: expect.any(Number) },
    ])
  })

  test.each(directoriesTable)('6 - import all templates with zip containing unrelated content', async (zipRootFolder) => {
    let spy = jest.spyOn(smsManager.smsService, methodNameToSpy)
    const zipContent = await createZipWithUnrelatedContent(zipRootFolder)

    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockResolvedValue({ data: CommonTestData.expectedGigyaResponseOk })

    const response = await smsManager.import(apiKey, zipContent)
    //console.log('response=' + JSON.stringify(response))
    CommonTestData.verifyResponseIsOk(response)
    expect(response).toEqual(CommonTestData.expectedGigyaResponseOk)
    expect(spy).toHaveBeenCalledWith(apiKey, setSmsExpectedTemplateArgument())
  })

  test('7 - import with error getting data center', async () => {
    const zipContent = await createZipFullContent(zipRootFolder)
    const mockedResponse = { data: ConfiguratorTestData.scExpectedGigyaResponseNotOk }
    axios.mockResolvedValueOnce(mockedResponse)
    await expect(smsManager.import('apiKey', zipContent)).rejects.toEqual([mockedResponse.data])
  })

  test('8 - import with error setting templates', async () => {
    const zipContent = await createZipFullContent(zipRootFolder)
    const mockedResponse = { data: CommonTestData.expectedGigyaResponseInvalidAPI }
    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockResolvedValue(mockedResponse)
    await expect(smsManager.import('apiKey', zipContent)).rejects.toEqual([mockedResponse.data])
  })

  function createExpectedZipEntries() {
    const expectedZipEntries = new Map()
    expectedZipEntries.set('tfa/globalTemplates/en.default.txt', getSmsExpectedResponse.templates.tfa.globalTemplates.templates.en)
    expectedZipEntries.set('tfa/globalTemplates/pt-br.txt', getSmsExpectedResponse.templates.tfa.globalTemplates.templates['pt-br'])
    expectedZipEntries.set('tfa/templatesPerCountryCode/355/en.default.txt', getSmsExpectedResponse.templates.tfa.templatesPerCountryCode['355'].templates.en)
    expectedZipEntries.set('tfa/templatesPerCountryCode/355/bg.txt', getSmsExpectedResponse.templates.tfa.templatesPerCountryCode['355'].templates.bg)
    expectedZipEntries.set('tfa/templatesPerCountryCode/351/en.txt', getSmsExpectedResponse.templates.tfa.templatesPerCountryCode['351'].templates.en)
    expectedZipEntries.set('tfa/templatesPerCountryCode/351/pt.default.txt', getSmsExpectedResponse.templates.tfa.templatesPerCountryCode['351'].templates.pt)

    expectedZipEntries.set('otp/globalTemplates/en.default.txt', getSmsExpectedResponse.templates.otp.globalTemplates.templates.en)
    expectedZipEntries.set('otp/globalTemplates/nl.txt', getSmsExpectedResponse.templates.otp.globalTemplates.templates.nl)
    return expectedZipEntries
  }

  function createZipFullContent(zipRootFolder) {
    return createContent(zipRootFolder).generateAsync({ type: 'arraybuffer' })
  }

  function createZipWithUnrelatedContent(zipRootFolder) {
    const jszip = createContent(zipRootFolder)
    jszip.file('nl.txt', getSmsExpectedResponse.templates.otp.globalTemplates.templates.nl)
    jszip.file('bin/globalTemplates/nl.txt', getSmsExpectedResponse.templates.otp.globalTemplates.templates.nl)
    jszip.file('otp/globalTemplates/nl.html', getSmsExpectedResponse.templates.otp.globalTemplates.templates.nl)
    jszip.file('tfa/globalTemplates/nl.html', getSmsExpectedResponse.templates.otp.globalTemplates.templates.nl)
    jszip.file('__MACOSX/tfa/globalTemplates/nl.txt', getSmsExpectedResponse.templates.otp.globalTemplates.templates.nl)
    jszip.file('tfa/templatesPerCountryCode/351/en.html', getSmsExpectedResponse.templates.tfa.templatesPerCountryCode['351'].templates.en)
    jszip.file('otp/templatesPerCountryCode/351/en.html', getSmsExpectedResponse.templates.tfa.templatesPerCountryCode['351'].templates.en)
    jszip.file('tfa/globalTemplates/en.default.txt', getSmsExpectedResponse.templates.tfa.globalTemplates.templates.en)
    return jszip.generateAsync({ type: 'arraybuffer' })
  }

  function createZipContentEmpty() {
    const jszip = new JSZip()
    return jszip.generateAsync({ type: 'arraybuffer' })
  }

  function createContent(zipRootFolder) {
    const jszip = new JSZip()
    jszip.file(zipRootFolder + 'tfa/globalTemplates/en.default.txt', getSmsExpectedResponse.templates.tfa.globalTemplates.templates.en)
    jszip.file(zipRootFolder + 'tfa/globalTemplates/pt-br.txt', getSmsExpectedResponse.templates.tfa.globalTemplates.templates['pt-br'])
    jszip.file(zipRootFolder + 'tfa/templatesPerCountryCode/355/en.default.txt', getSmsExpectedResponse.templates.tfa.templatesPerCountryCode['355'].templates.en)
    jszip.file(zipRootFolder + 'tfa/templatesPerCountryCode/355/bg.txt', getSmsExpectedResponse.templates.tfa.templatesPerCountryCode['355'].templates.bg)
    jszip.file(zipRootFolder + 'tfa/templatesPerCountryCode/351/en.txt', getSmsExpectedResponse.templates.tfa.templatesPerCountryCode['351'].templates.en)
    jszip.file(zipRootFolder + 'tfa/templatesPerCountryCode/351/pt.default.txt', getSmsExpectedResponse.templates.tfa.templatesPerCountryCode['351'].templates.pt)
    jszip.file(zipRootFolder + 'otp/globalTemplates/en.default.txt', getSmsExpectedResponse.templates.otp.globalTemplates.templates.en)
    jszip.file(zipRootFolder + 'otp/globalTemplates/nl.txt', getSmsExpectedResponse.templates.otp.globalTemplates.templates.nl)
    return jszip
  }
})
