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
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })

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
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseWithDifferentDataCenter })

    let request = TestData.createParentWithOneChildRequest()
    const siteManager = new SiteManager(credentials)
    let response = await siteManager.create(request)

    expect(response.length).toEqual(2)
    verifyResponseIsOk(response[0])
    verifyResponseIsNotOk(response[1], TestData.scExpectedGigyaResponseWithDifferentDataCenter)
    expect(response[0].deleted).toEqual(true)
    expect(response[1].apiKey).toBeDefined()
    expect(response[1].deleted).toEqual(true)
  })

  test('create site unsuccessfully - invalid data centers on 2nd child', async () => {
    axios
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
    verifyResponseIsNotOk(response[2], TestData.expectedGigyaResponseInvalidDataCenter)
    expect(response[0].deleted).toEqual(true)
    expect(response[1].deleted).toEqual(true)
    expect(response[2].deleted).toEqual(false)
    expect(response[2].apiKey).toBeUndefined()
  })

  test('create site unsuccessfully - error creating 2nd hierarchy', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseWithDifferentDataCenter })

    let request = TestData.createMultipleParentWithMultipleChildrenRequest()
    const siteManager = new SiteManager(credentials)
    let response = await siteManager.create(request)

    expect(response.length).toEqual(5)
    verifyResponseIsOk(response[0])
    verifyResponseIsOk(response[1])
    verifyResponseIsOk(response[2])
    verifyResponseIsOk(response[3])
    verifyResponseIsNotOk(response[4], TestData.scExpectedGigyaResponseWithDifferentDataCenter)
    expect(response[0].deleted).toEqual(true)
    expect(response[1].deleted).toEqual(true)
    expect(response[2].deleted).toEqual(true)
    expect(response[3].deleted).toEqual(true)
    expect(response[4].deleted).toEqual(true)
    expect(response[4].apiKey).toBeDefined()
  })

  test('create site unsuccessfully - error creating 1st hierarchy', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseWithDifferentDataCenter })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })

    let request = TestData.createMultipleParentWithMultipleChildrenRequest()
    const siteManager = new SiteManager(credentials)
    let response = await siteManager.create(request)

    expect(response.length).toEqual(2)
    verifyResponseIsOk(response[0])
    verifyResponseIsNotOk(response[1], TestData.scExpectedGigyaResponseWithDifferentDataCenter)
    expect(response[0].deleted).toEqual(true)
    expect(response[1].deleted).toEqual(true)
    expect(response[1].apiKey).toBeDefined()
  })
})

function verifyAllResponsesAreOk(responses) {
  responses.forEach((response) => {
    verifyResponseIsOk(response)
    expect(response.deleted).toEqual(false)
  })
}

function verifyResponseIsOk(response) {
  TestData.verifyResponseIsOk(response)
  expect(response.apiKey).toBeDefined()
  expect(response.apiVersion).toBeDefined()
  expect(response.siteUiId).toBeDefined()
}

function verifyResponseIsNotOk(response, expectedResponse) {
  TestData.verifyResponseIsNotOk(response, expectedResponse)
  expect(response.siteUiId).toBeDefined()
}
