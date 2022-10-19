import SiteManagerAsync from './siteManagerAsync'
import * as TestData from './data_test'
import axios from 'axios'

jest.mock('axios')

describe('Site manager async test suite', () => {
  const credentials = {
    partnerId: 'partnerId',
    userKey: 'userKey',
    secret: 'secret',
  }
  const siteManager = new SiteManagerAsync(credentials)

  test('create site successfully - single parent', async () => {
    const mockedResponse = { data: TestData.expectedGigyaResponseOk }
    axios.mockResolvedValue(mockedResponse)

    const request = TestData.createSingleParentRequest()

    const response = await siteManager.create(request)
    console.log(`test.response=${JSON.stringify(response)}`)

    expect(response[0].length).toEqual(1)
    verifyAllResponsesAreOk(response[0])
  })

  test('create site successfully - parent with one child', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })

    const request = TestData.createParentWithOneChildRequest()
    const response = await siteManager.create(request)

    expect(response[0].length).toEqual(2)
    verifyAllResponsesAreOk(response[0])
  })

  test('create site successfully - parent with two children', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })

    const request = TestData.createParentWithTwoChildRequest()
    const response = await siteManager.create(request)

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

    const request = TestData.createMultipleParentWithMultipleChildrenRequest()
    const response = await siteManager.create(request)

    expect(response.length).toEqual(6)
    verifyAllResponsesAreOk(response)
  })

  test('create site unsuccessfully - error on parent', async () => {
    axios.mockResolvedValueOnce({ data: TestData.expectedGigyaResponseNoBaseDomain })

    const request = TestData.createParentWithOneChildRequest()
    const response = await siteManager.create(request)

    expect(response.length).toEqual(1)
    expectResponseIsNotOk(response[0], TestData.expectedGigyaResponseNoBaseDomain, false, TestData.Endpoints.SITE_CREATE)
    expect(response[0].apiKey).toBeUndefined()
  })

  test('create site unsuccessfully - different data centers', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseWithDifferentDataCenter })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })

    const request = TestData.createParentWithOneChildRequest()
    const response = await siteManager.create(request)

    expect(response.length).toEqual(2)
    expectResponseIsOk(response[0], true)
    expectResponseIsNotOk(response[1], TestData.scExpectedGigyaResponseWithDifferentDataCenter, true, TestData.Endpoints.SITE_CONFIG)
    expect(response[1].apiKey).toBeDefined()
  })

  test('create site unsuccessfully - invalid data centers on 2nd child', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseInvalidDataCenter })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })

    const request = TestData.createParentWithTwoChildRequest()
    const response = await siteManager.create(request)

    expect(response.length).toEqual(3)
    expectResponseIsOk(response[0], true)
    expectResponseIsOk(response[1], true)
    expectResponseIsNotOk(response[2], TestData.expectedGigyaResponseInvalidDataCenter, false, TestData.Endpoints.SITE_CREATE)
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
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })

    const request = TestData.createMultipleParentWithMultipleChildrenRequest()
    const response = await siteManager.create(request)

    expect(response.length).toEqual(5)
    expectResponseIsOk(response[0], true)
    expectResponseIsOk(response[1], true)
    expectResponseIsOk(response[2], true)
    expectResponseIsOk(response[3], true)
    expectResponseIsNotOk(response[4], TestData.scExpectedGigyaResponseWithDifferentDataCenter, true, TestData.Endpoints.SITE_CONFIG)
    expect(response[4].apiKey).toBeDefined()
  })

  test('create site unsuccessfully - error creating 1st hierarchy', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseWithDifferentDataCenter })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })

    const request = TestData.createMultipleParentWithMultipleChildrenRequest()
    const response = await siteManager.create(request)

    expect(response.length).toEqual(2)
    expectResponseIsOk(response[0], true)
    expectResponseIsNotOk(response[1], TestData.scExpectedGigyaResponseWithDifferentDataCenter, true, TestData.Endpoints.SITE_CONFIG)
    expect(response[1].apiKey).toBeDefined()
  })

  test('create site unsuccessfully - error on rollback', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseNoBaseDomain })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdSiteAlreadyDeleted })

    const request = TestData.createParentWithOneChildRequest()
    const response = await siteManager.create(request)

    expect(response.length).toEqual(2)
    expectResponseIsOk(response[0], false)
    expectResponseIsNotOk(response[1], TestData.expectedGigyaResponseNoBaseDomain, false, TestData.Endpoints.SITE_CREATE)
    expect(response[1].apiKey).toBeUndefined()
  })

  test('delete single site with site manager', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.scGetSiteConfigSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })

    let response = await siteManager.deleteSites(['####'])

    expect(response.length).toBe(1)
    expect(response[0]).toBeDefined()
    expect(response[0].statusCode).toBe(200)
  })

  test('delete site with site members', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.scGetSiteConfigSuccessfullyMultipleMember })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })

    let response = await siteManager.deleteSites(['####'])

    expect(response.length).toBe(2)
    expect(response[0]).toBeDefined()
    expect(response[0].statusCode).toBe(200)
    expect(response[1]).toBeDefined()
    expect(response[1].statusCode).toBe(200)
  })

  test('delete site already deleted', async () => {
    axios.mockResolvedValueOnce({ data: TestData.sdSiteAlreadyDeleted })

    let response = await siteManager.deleteSites(['####'])
    expect(response.length).toBe(0)
  })

  test('delete 3 sites: 2 sites with multiple members and 1 site already deleted', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.scGetSiteConfigSuccessfullyMultipleMember })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })
      .mockResolvedValueOnce({ data: TestData.scGetSiteConfigSuccessfullyMultipleMember })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })
      .mockResolvedValueOnce({ data: TestData.sdSiteAlreadyDeleted })

    let response = await siteManager.deleteSites(['####', '####2', '####3'])
    expect(response.length).toBe(4)
    expect(response[0].statusCode).toBe(200)
    expect(response[1].statusCode).toBe(200)
    expect(response[2].statusCode).toBe(200)
    expect(response[3].statusCode).toBe(200)
  })

  test('delete site invalid API', async () => {
    axios.mockResolvedValueOnce({ data: TestData.expectedGigyaResponseInvalidAPI })

    let response = await siteManager.deleteSites(['####'])
    expect(response[0].statusCode).toBe(400)
    expect(response[0].errorMessage).toBe(TestData.invalidApiParam)
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
  expect(response.endpoint).toEqual(TestData.Endpoints.SITE_CREATE)
}

function expectResponseIsOk(response, deleted) {
  verifyResponseIsOk(response)
  expect(response.deleted).toEqual(deleted)
}

function verifyResponseIsNotOk(response, expectedResponse) {
  TestData.verifyResponseIsNotOk(response, expectedResponse)
  expect(response.siteUiId).toBeDefined()
}

function expectResponseIsNotOk(response, expectedResponse, deleted, endpoint) {
  verifyResponseIsNotOk(response, expectedResponse)
  expect(response.deleted).toEqual(deleted)
  expect(response.endpoint).toEqual(endpoint)
}
