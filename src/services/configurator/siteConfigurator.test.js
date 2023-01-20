import SiteConfigurator from './siteConfigurator'
import * as TestData from './dataTest'
import * as CommonTestData from '../servicesDataTest'
import axios from 'axios'

jest.mock('axios')
jest.setTimeout(10000)

describe('Site configurator test suite', () => {
  const siteConfigurator = new SiteConfigurator(CommonTestData.credentials.userKey, CommonTestData.credentials.secret, 'us1')

  test('configure site successfully', async () => {
    const mockedResponse = { data: TestData.scExpectedGigyaResponseOk }
    axios.mockResolvedValue(mockedResponse)

    const response = await siteConfigurator.connect('parentApiKey', 'childApiKey')
    //console.log('response=' + JSON.stringify(response))

    CommonTestData.verifyResponseIsOk(response.data)
  })

  test('configure site unsuccessfully - api key do not exists', async () => {
    const expectedResponse = TestData.scExpectedGigyaResponseNotOk
    axios.mockResolvedValue({ data: expectedResponse })

    const response = await siteConfigurator.connect('parentApiKey', 'childApiKey_NOT_EXISTS')
    //console.log('response=' + JSON.stringify(response))

    CommonTestData.verifyResponseIsNotOk(response.data, expectedResponse)
  })

  test('configure site unsuccessfully - data centers are different', async () => {
    const expectedResponse = TestData.scExpectedGigyaResponseWithDifferentDataCenter
    axios.mockResolvedValue({ data: expectedResponse })

    const response = await siteConfigurator.connect('parentApiKey', 'childApiKey')
    //console.log('response=' + JSON.stringify(response))

    CommonTestData.verifyResponseIsNotOk(response.data, expectedResponse)
  })

  test('get site config successfully', async () => {
    const expectedResponse = TestData.getSiteConfigSuccessfullyMultipleMember(0)
    axios.mockResolvedValue({ data: expectedResponse })

    let response = await siteConfigurator.getSiteConfig('#######')

    CommonTestData.verifyResponseIsOk(response)
  })

  test('send request to invalid url', async () => {
    const err = CommonTestData.createErrorObject('Error configuring site')
    axios.mockImplementation(() => {
      throw err
    })

    const response = await siteConfigurator.connect('parentApiKey', 'childApiKey')
    //console.log('response=' + JSON.stringify(response))

    expect(response.data.errorCode).toEqual(err.code)
    expect(response.data.errorMessage).toEqual(err.message)
    expect(response.data.time).toBeDefined()
  })
})
