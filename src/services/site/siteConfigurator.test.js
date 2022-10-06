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

    verifyResponseIsOk(response)
  })

  test('configure site unsuccessfully - api key do not exists', async () => {
    const expectedResponse = TestData.scExpectedGigyaResponseNotOk
    axios.mockResolvedValue({ data: expectedResponse })

    const siteConfigurator = new SiteConfigurator(credentials.userKey, credentials.secret, 'us1')
    let response = await siteConfigurator.connect('parentApiKey', 'childApiKey_NOT_EXISTS')
    console.log('response=' + JSON.stringify(response))

    verifyResponseIsNotOk(response, expectedResponse)
  })

  test('configure site unsuccessfully - data centers are different', async () => {
    const expectedResponse = TestData.expectedGigyaResponseWithDifferentDataCenter
    axios.mockResolvedValue({ data: expectedResponse })

    const siteConfigurator = new SiteConfigurator(credentials.userKey, credentials.secret, 'us1')
    let response = await siteConfigurator.connect('parentApiKey', 'childApiKey')
    console.log('response=' + JSON.stringify(response))

    verifyResponseIsNotOk(response, expectedResponse)
  })
})

function verifyResponseIsOk(response) {
  expect(response.statusCode).toBeDefined()
  expect(response.statusCode).toEqual(TestData.HttpStatus.OK)
  expect(response.statusReason).toEqual('OK')
  //expect(response.siteUiId).toBeDefined()
  expect(response.callId).toBeDefined()
  expect(response.time).toBeDefined()
  // error case
  //expect(response.deleted).toEqual(false)
  expect(response.errorMessage).toBeUndefined()
  expect(response.errorCode).toEqual(0)
  expect(response.errorDetails).toBeUndefined()
}

function verifyResponseIsNotOk(response, expectedResponse) {
  expect(response.statusCode).toBeDefined()
  expect(response.callId).toBeDefined()
  expect(response.time).toBeDefined()
  expect(response.statusCode).toEqual(expectedResponse.statusCode)
  expect(response.statusReason).toEqual(expectedResponse.statusReason)
  // error case
  expect(response.errorMessage).toBeDefined()
  expect(response.errorMessage).toEqual(expectedResponse.errorMessage)
  expect(response.errorCode).not.toEqual(0)
  expect(response.errorDetails).toEqual(expectedResponse.errorDetails)
}
