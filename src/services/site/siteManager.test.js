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
    const siteManager = new SiteManager(credentials)
    let response = await siteManager.create(request)

    expect(response.length).toEqual(1)
    verifyAllResponsesAreOk(response)
  })

  test('create site successfully - parent with one child', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })

    let request = TestData.createParentWithOneChildRequest()
    const siteManager = new SiteManager(credentials)
    let response = await siteManager.create(request)

    expect(response.length).toEqual(2)
    verifyAllResponsesAreOk(response)
  })

  test('create site successfully - parent with two children', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })

    let request = TestData.createParentWithTwoChildRequest()
    const siteManager = new SiteManager(credentials)
    let response = await siteManager.create(request)

    expect(response.length).toEqual(3)
    verifyAllResponsesAreOk(response)
  })

  test('create site successfully - two parent with two children', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })

    let request = TestData.createMultipleParentWithMultipleChildrenRequest()
    const siteManager = new SiteManager(credentials)
    let response = await siteManager.create(request)

    expect(response.length).toEqual(6)
    verifyAllResponsesAreOk(response)
  })

  test('create site unsuccessfully - different data centers', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseWithDifferentDataCenter })

    let request = TestData.createParentWithOneChildRequest()
    const siteManager = new SiteManager(credentials)
    let response = await siteManager.create(request)

    expect(response.length).toEqual(2)
    verifyResponseIsOk(response[0])
    TestData.verifyResponseIsNotOk(response[1], TestData.expectedGigyaResponseWithDifferentDataCenter)
    expect(response[1].apiKey).toBeDefined()
  })

  test('create site unsuccessfully - invalid data centers on 2nd child', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseInvalidDataCenter })

    let request = TestData.createParentWithTwoChildRequest()
    const siteManager = new SiteManager(credentials)
    let response = await siteManager.create(request)

    expect(response.length).toEqual(3)
    verifyResponseIsOk(response[0])
    verifyResponseIsOk(response[1])
    TestData.verifyResponseIsNotOk(response[2], TestData.expectedGigyaResponseInvalidDataCenter)
    expect(response[2].apiKey).toBeDefined()
  })
})

function verifyAllResponsesAreOk(responses) {
  responses.forEach((response) => verifyResponseIsOk(response))
}

function verifyResponseIsOk(response) {
  TestData.verifyResponseIsOk(response)
  expect(response.apiKey).toBeDefined()
  expect(response.apiVersion).toBeDefined()
  expect(response.siteUiId).toBeDefined()
  expect(response.deleted).toEqual(false)
}
