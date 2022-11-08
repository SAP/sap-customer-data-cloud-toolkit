import SiteConfigurator from './siteConfigurator'
import * as TestData from './data_test'
import * as CommonTestData from '../servicesData_test'
import axios from 'axios'

jest.mock('axios')
jest.setTimeout(10000)
describe('Site configurator test suite', () => {
  const credentials = {
    userKey: 'userKey',
    secret: 'secret',
  }

  test('configure site successfully', async () => {
    const mockedResponse = { data: TestData.scExpectedGigyaResponseOk }
    axios.mockResolvedValue(mockedResponse)

    const siteConfigurator = new SiteConfigurator(credentials.userKey, credentials.secret, 'us1')
    const response = await siteConfigurator.connect('parentApiKey', 'childApiKey')
    //console.log('response=' + JSON.stringify(response))

    CommonTestData.verifyResponseIsOk(response.data)
  })

  test('configure site unsuccessfully - api key do not exists', async () => {
    const expectedResponse = TestData.scExpectedGigyaResponseNotOk
    axios.mockResolvedValue({ data: expectedResponse })

    const siteConfigurator = new SiteConfigurator(credentials.userKey, credentials.secret, 'us1')
    const response = await siteConfigurator.connect('parentApiKey', 'childApiKey_NOT_EXISTS')
    //console.log('response=' + JSON.stringify(response))

    CommonTestData.verifyResponseIsNotOk(response.data, expectedResponse)
  })

  test('configure site unsuccessfully - data centers are different', async () => {
    const expectedResponse = TestData.scExpectedGigyaResponseWithDifferentDataCenter
    axios.mockResolvedValue({ data: expectedResponse })

    const siteConfigurator = new SiteConfigurator(credentials.userKey, credentials.secret, 'us1')
    const response = await siteConfigurator.connect('parentApiKey', 'childApiKey')
    //console.log('response=' + JSON.stringify(response))

    CommonTestData.verifyResponseIsNotOk(response.data, expectedResponse)
  })

  test('get site config successfully', async () => {
    const expectedResponse = TestData.getSiteConfigSuccessfullyMultipleMember(0)
    axios.mockResolvedValue({ data: expectedResponse })

    const siteConfigurator = new SiteConfigurator(credentials.userKey, credentials.secret, 'us1')
    let response = await siteConfigurator.getSiteConfig('#######')

    CommonTestData.verifyResponseIsOk(response)
  })

  test('send request to invalid url', async () => {
    axios.mockImplementation(() => {
      const err = {}
      err.code = 'ENOTFOUND'
      err.details = 'getaddrinfo ENOTFOUND xadmin.us1.gigya.com'
      err.message = 'Error configuring site'
      err.time = Date.now()
      throw err
    })

    const siteConfigurator = new SiteConfigurator(credentials.userKey, credentials.secret, 'us1')
    const response = await siteConfigurator.connect('parentApiKey', 'childApiKey')
    //console.log('response=' + JSON.stringify(response))

    expect(response.data.errorCode).toEqual('ENOTFOUND')
    expect(response.data.errorMessage).toEqual('Error configuring site')
    expect(response.data.time).toBeDefined()
  })
})
