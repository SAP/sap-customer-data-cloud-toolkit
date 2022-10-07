'use strict'
const SiteConfigurator = require('./siteConfigurator.js')
const axios = require('axios').default
const TestData = require('./data_test.js')

jest.mock('axios')

describe('Site configurator test suite', () => {
  const credentials = {
    userKey: 'userKey',
    secret: 'secret',
  }

  test('configure site successfully', async () => {
    const mockedResponse = { data: TestData.scExpectedGigyaResponseOk }
    axios.mockResolvedValue(mockedResponse)

    const siteConfigurator = new SiteConfigurator(credentials.userKey, credentials.secret, 'us1')
    let response = await siteConfigurator.connect('parentApiKey', 'childApiKey')
    console.log('response=' + JSON.stringify(response))

    TestData.verifyResponseIsOk(response)
  })

  test('configure site unsuccessfully - api key do not exists', async () => {
    const expectedResponse = TestData.scExpectedGigyaResponseNotOk
    axios.mockResolvedValue({ data: expectedResponse })

    const siteConfigurator = new SiteConfigurator(credentials.userKey, credentials.secret, 'us1')
    let response = await siteConfigurator.connect('parentApiKey', 'childApiKey_NOT_EXISTS')
    console.log('response=' + JSON.stringify(response))

    TestData.verifyResponseIsNotOk(response, expectedResponse)
  })

  test('configure site unsuccessfully - data centers are different', async () => {
    const expectedResponse = TestData.scExpectedGigyaResponseWithDifferentDataCenter
    axios.mockResolvedValue({ data: expectedResponse })

    const siteConfigurator = new SiteConfigurator(credentials.userKey, credentials.secret, 'us1')
    let response = await siteConfigurator.connect('parentApiKey', 'childApiKey')
    console.log('response=' + JSON.stringify(response))

    TestData.verifyResponseIsNotOk(response, expectedResponse)
  })
})
