'use strict'
const axios = require('axios').default
const TestData = require('./data_test.js')
const SiteManager = require('./siteManager.js')

jest.mock('axios')

describe('Site manager test suite', () => {
  const credentials = {
    partnerId: 'partnerId',
    userKey: 'userKey',
    secret: 'secret',
  }

  test('create site successfully - single parent', async () => {
    const mockedResponse = { data: TestData.expectedGigyaResponseOk }
    axios.mockResolvedValue(mockedResponse)

    let request = TestData.createSingleParentRequest()
    const siteManager = new SiteManager()
    let response = await siteManager.create(request)

    expect(response.length).toEqual(1)
    verifyAllResponsesAreOk(response)
  })

  test('create site successfully - parent with one child', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })

    let request = TestData.createParentWithOneChildRequest()
    const siteManager = new SiteManager()
    let response = await siteManager.create(request)

    expect(response.length).toEqual(2)
    verifyAllResponsesAreOk(response)
  })
})

function verifyAllResponsesAreOk(responses) {
  responses.forEach((response) => verifyResponseIsOk(response))
}

function verifyResponseIsOk(response) {
  expect(response.apiKey).toBeDefined()
  expect(response.statusCode).toBeDefined()
  expect(response.statusCode).toEqual(TestData.HttpStatus.OK)
  expect(response.statusReason).toEqual('OK')
  expect(response.siteUiId).toBeDefined()
  expect(response.callId).toBeDefined()
  expect(response.time).toBeDefined()
  expect(response.apiVersion).toBeDefined()
  // error case
  expect(response.deleted).toEqual(false)
  expect(response.errorMessage).toBeUndefined()
  expect(response.errorCode).toEqual(0)
  expect(response.errorDetails).toBeUndefined()
}
