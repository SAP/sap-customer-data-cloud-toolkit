import axios from 'axios'
import * as ConfiguratorTestData from '../configurator/data_test'
import ZipManager from '../zip/zipManager'
import SmsManager from './smsManager'
import { credentials } from '../servicesData_test'
import { getSmsExpectedResponse, getSmsExpectedResponseWithNoTemplates } from './data_test'

jest.mock('axios')
jest.setTimeout(30000)

const apiKey = 'apiKey'

describe('Sms Manager test suite', () => {
  let smsManager

  beforeEach(() => {
    smsManager = new SmsManager(credentials)
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
    await expect(smsManager.export('apiKey')).rejects.toEqual(mockedResponse.data)
  })
})

function createExpectedZipEntries() {
  const expectedZipEntries = new Map()
  expectedZipEntries.set('tfa/globalTemplates/en.txt', getSmsExpectedResponse.templates.tfa.globalTemplates.templates.en)
  expectedZipEntries.set('tfa/globalTemplates/pt-br.txt', getSmsExpectedResponse.templates.tfa.globalTemplates.templates['pt-br'])
  expectedZipEntries.set('tfa/templatesPerCountryCode/355/en.txt', getSmsExpectedResponse.templates.tfa.templatesPerCountryCode['355'].templates.en)
  expectedZipEntries.set('tfa/templatesPerCountryCode/355/bg.txt', getSmsExpectedResponse.templates.tfa.templatesPerCountryCode['355'].templates.bg)
  expectedZipEntries.set('tfa/templatesPerCountryCode/351/en.txt', getSmsExpectedResponse.templates.tfa.templatesPerCountryCode['351'].templates.en)
  expectedZipEntries.set('tfa/templatesPerCountryCode/351/pt.txt', getSmsExpectedResponse.templates.tfa.templatesPerCountryCode['351'].templates.pt)

  expectedZipEntries.set('otp/globalTemplates/en.txt', getSmsExpectedResponse.templates.otp.globalTemplates.templates.en)
  expectedZipEntries.set('otp/globalTemplates/nl.txt', getSmsExpectedResponse.templates.otp.globalTemplates.templates.nl)
  return expectedZipEntries
}
