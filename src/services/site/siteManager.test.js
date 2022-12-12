import SiteManager from './siteManager'
import * as TestData from './data_test'
import client from '../gigya/client'
import axios from 'axios'
import * as CommonTestData from '../servicesData_test'
import * as ConfiguratorTestData from '../configurator/data_test'

jest.mock('axios')
describe('Site manager async test suite', () => {
  const credentials = {
    partnerId: 'partnerId',
    userKey: 'userKey',
    secret: 'secret',
  }
  const siteManager = new SiteManager(credentials)

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('create site successfully - single parent', async () => {
    const mockedResponse = { data: TestData.expectedGigyaResponseOk }
    axios.mockResolvedValue(mockedResponse)

    const request = TestData.createSingleParentRequest()

    let response = await siteManager.create(request)
    //console.log(`test.response=${JSON.stringify(response)}`)

    expect(response.length).toEqual(1)
    verifyAllResponsesAreOk(response)
  })
  test('create site successfully - single parent - rate limit', async () => {
    let spy = await jest.spyOn(client, 'wait')

    const mockedResponse = { data: TestData.expectedGigyaResponseOk }
    axios.mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit }).mockResolvedValueOnce(mockedResponse)

    const request = TestData.createSingleParentRequest()

    let response = await siteManager.create(request)
    //console.log(`test.response=${JSON.stringify(response)}`)

    expect(response.length).toEqual(1)
    expect(spy).toHaveBeenCalled()
    verifyAllResponsesAreOk(response)
  })

  test('create site successfully - parent with one child', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.scExpectedGigyaResponseOk })

    const request = TestData.createParentWithOneChildRequest()
    let response = await siteManager.create(request)
    //console.log(`test.response=${JSON.stringify(response)}`)

    expect(response.length).toEqual(2)
    verifyAllResponsesAreOk(response)
  })
  test('create site successfully - parent with one child - rate limit', async () => {
    let spy = await jest.spyOn(client, 'wait')

    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.scExpectedGigyaResponseOk })

    const request = TestData.createParentWithOneChildRequest()
    let response = await siteManager.create(request)
    //console.log(`test.response=${JSON.stringify(response)}`)

    expect(spy).toHaveBeenCalled()
    expect(response.length).toEqual(2)
    verifyAllResponsesAreOk(response)
  })

  // In this test case, it is assumed that the rate limit error continues until reaching the max number of attempts and making rollback impossible.
  test('create site unsuccessfully - rate limit retries excedeed', async () => {
    let spy = await jest.spyOn(client, 'wait')

    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(1) })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })

    const request = TestData.createParentWithOneChildRequest()
    let response = await siteManager.create(request)
    //console.log(`test.response=${JSON.stringify(response)}`)

    expect(spy).toHaveBeenCalled()
    expect(spy.mock.calls.length).toBe(20)
    expect(response.length).toEqual(2)
    expectResponseIsOk(response[0], true)
    verifyResponseIsNotOk(response[1], TestData.expectedGigyaErrorApiRateLimit)
  })

  test('create site successfully - parent with two children', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.scExpectedGigyaResponseOk })

    const request = TestData.createParentWithTwoChildRequest()
    let response = await siteManager.create(request)
    //console.log(`test.response=${JSON.stringify(response)}`)

    expect(response.length).toEqual(3)
    verifyAllResponsesAreOk(response)
  })

  test('create site successfully - parent with two children - rate limit', async () => {
    let spy = await jest.spyOn(client, 'wait')
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.scExpectedGigyaResponseOk })

    const request = TestData.createParentWithTwoChildRequest()
    let response = await siteManager.create(request)
    //console.log(`test.response=${JSON.stringify(response)}`)

    expect(spy).toHaveBeenCalled()
    expect(response.length).toEqual(3)
    verifyAllResponsesAreOk(response)
  })

  test('create site successfully - two parent with two children', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.scExpectedGigyaResponseOk })

    const request = TestData.createMultipleParentWithMultipleChildrenRequest()
    const response = await siteManager.create(request)
    //console.log(`test.response=${JSON.stringify(response)}`)

    expect(response.length).toEqual(6)
    verifyAllResponsesAreOk(response)
  })

  test('create site successfully - two parent with two children - rate limit', async () => {
    let spy = await jest.spyOn(client, 'wait')

    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.scExpectedGigyaResponseOk })

    const request = TestData.createMultipleParentWithMultipleChildrenRequest()
    const response = await siteManager.create(request)
    //console.log(`test.response=${JSON.stringify(response)}`)

    expect(spy).toHaveBeenCalled()
    expect(spy.mock.calls.length).toBe(2)
    expect(response.length).toEqual(6)
    verifyAllResponsesAreOk(response)
  })

  test('create site unsuccessfully - error on parent', async () => {
    axios.mockResolvedValueOnce({ data: TestData.expectedGigyaResponseNoBaseDomain })

    const request = TestData.createParentWithOneChildRequest()
    let response = await siteManager.create(request)
    //console.log(`test.response=${JSON.stringify(response)}`)

    expect(response.length).toEqual(1)
    expectResponseIsNotOk(response[0], TestData.expectedGigyaResponseNoBaseDomain, false, TestData.Endpoints.SITE_CREATE)
    expect(response[0].apiKey).toBeUndefined()
  })

  test('create site unsuccessfully - different data centers', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.scExpectedGigyaResponseWithDifferentDataCenter })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(1) })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })

    const request = TestData.createParentWithOneChildRequest()
    let response = await siteManager.create(request)
    //console.log(`test.response=${JSON.stringify(response)}`)

    expect(response.length).toEqual(2)
    expectResponseIsOk(response[0], true)
    expectResponseIsNotOk(response[1], ConfiguratorTestData.scExpectedGigyaResponseWithDifferentDataCenter, true, TestData.Endpoints.SITE_CONFIG)
    expect(response[1].apiKey).toBeDefined()
  })

  test('create site unsuccessfully - different data centers - rate limit', async () => {
    let spy = await jest.spyOn(client, 'wait')
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.scExpectedGigyaResponseWithDifferentDataCenter })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(1) })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaErrorApiRateLimit })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })

    const request = TestData.createParentWithOneChildRequest()
    let response = await siteManager.create(request)
    //console.log(`test.response=${JSON.stringify(response)}`)

    expect(response.length).toEqual(2)
    expectResponseIsOk(response[0], true)
    expectResponseIsNotOk(response[1], ConfiguratorTestData.scExpectedGigyaResponseWithDifferentDataCenter, true, TestData.Endpoints.SITE_CONFIG)
    expect(response[1].apiKey).toBeDefined()
    expect(spy).toHaveBeenCalled()
    expect(spy.mock.calls.length).toBe(3)
  })

  test('create site unsuccessfully - invalid data centers on 2nd child', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseInvalidDataCenter })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(1) })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })

    const request = TestData.createParentWithTwoChildRequest()
    let response = await siteManager.create(request)
    //console.log(`test.response=${JSON.stringify(response)}`)

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
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.scExpectedGigyaResponseWithDifferentDataCenter })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(2) })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(2) })
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
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })

    const request = TestData.createMultipleParentWithMultipleChildrenRequest()
    let response = await siteManager.create(request)
    //console.log(`test.response=${JSON.stringify(response)}`)

    expect(response.length).toEqual(6)
    expectResponseIsOk(response[0], true)
    expectResponseIsOk(response[1], true)
    expectResponseIsOk(response[2], true)
    expectResponseIsOk(response[3], true)
    expectResponseIsOk(response[4], true)
    expectResponseIsNotOk(response[5], ConfiguratorTestData.scExpectedGigyaResponseWithDifferentDataCenter, true, TestData.Endpoints.SITE_CONFIG)
    expect(response[5].apiKey).toBeDefined()
  })

  test('create site unsuccessfully - error creating 1st hierarchy', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.scExpectedGigyaResponseWithDifferentDataCenter })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(2) })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(2) })
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
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })

    const request = TestData.createMultipleParentWithMultipleChildrenRequest()
    const response = await siteManager.create(request)
    //console.log(`test.response=${JSON.stringify(response)}`)

    expect(response.length).toEqual(6)
    expectResponseIsOk(response[0], true)
    expectResponseIsNotOk(response[1], ConfiguratorTestData.scExpectedGigyaResponseWithDifferentDataCenter, true, TestData.Endpoints.SITE_CONFIG)
    expectResponseIsOk(response[2], true)
    expectResponseIsOk(response[3], true)
    expectResponseIsOk(response[4], true)
    expectResponseIsOk(response[5], true)
    expect(response[1].apiKey).toBeDefined()
  })

  test('create site unsuccessfully - error on rollback', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseNoBaseDomain })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdSiteAlreadyDeleted })

    const request = TestData.createParentWithOneChildRequest()
    let response = await siteManager.create(request)
    //console.log(`test.response=${JSON.stringify(response)}`)

    expect(response.length).toEqual(2)
    expectResponseIsOk(response[0], false)
    expectResponseIsNotOk(response[1], TestData.expectedGigyaResponseNoBaseDomain, false, TestData.Endpoints.SITE_CREATE)
    expect(response[1].apiKey).toBeUndefined()
  })

  test('delete single site with site manager', async () => {
    axios
      .mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })

    let response = await siteManager.deleteSites(['####'])
    //console.log(`test.response=${JSON.stringify(response)}`)

    expect(response.length).toBe(1)
    CommonTestData.verifyResponseIsOk(response[0])
  })

  test('delete site with site members', async () => {
    axios
      .mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(1) })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })

    let response = await siteManager.deleteSites(['####'])
    //console.log(`test.response=${JSON.stringify(response)}`)

    expect(response.length).toBe(2)
    CommonTestData.verifyResponseIsOk(response[0])
    CommonTestData.verifyResponseIsOk(response[1])
  })

  test('delete site already deleted', async () => {
    axios.mockResolvedValueOnce({ data: TestData.sdSiteAlreadyDeleted })

    let response = await siteManager.deleteSites(['####'])
    //console.log(`test.response=${JSON.stringify(response)}`)

    expect(response.length).toBe(1)
    CommonTestData.verifyResponseIsNotOk(response[0], TestData.sdSiteAlreadyDeleted)
  })

  test('delete 3 sites: 2 sites with multiple members and 1 site already deleted', async () => {
    axios
      .mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(1) })
      .mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(1) })
      .mockResolvedValueOnce({ data: TestData.sdSiteAlreadyDeleted })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })

    let response = await siteManager.deleteSites(['####', '####2', '####3'])
    //console.log(`test.response=${JSON.stringify(response)}`)

    expect(response.length).toBe(5)
    CommonTestData.verifyResponseIsOk(response[0])
    CommonTestData.verifyResponseIsOk(response[1])
    CommonTestData.verifyResponseIsOk(response[2])
    CommonTestData.verifyResponseIsOk(response[3])
    CommonTestData.verifyResponseIsNotOk(response[4], TestData.sdSiteAlreadyDeleted)
  })

  test('delete site invalid API', async () => {
    axios.mockResolvedValueOnce({ data: TestData.expectedGigyaResponseInvalidAPI })

    const response = await siteManager.deleteSites(['####'])
    //console.log(`test.response=${JSON.stringify(response)}`)
    CommonTestData.verifyResponseIsNotOk(response[0], TestData.expectedGigyaResponseInvalidAPI)
  })
})

function verifyAllResponsesAreOk(responses) {
  responses.forEach((response) => {
    verifyResponseIsOk(response)
    expect(response.deleted).toEqual(false)
  })
}

function verifyResponseIsOk(response) {
  CommonTestData.verifyResponseIsOk(response)
  expect(response.apiKey).toBeDefined()
  expect(response.apiVersion).toBeDefined()
  expect(response.tempId).toBeDefined()
  expect(response.endpoint).toEqual(TestData.Endpoints.SITE_CREATE)
}

function expectResponseIsOk(response, deleted) {
  verifyResponseIsOk(response)
  expect(response.deleted).toEqual(deleted)
}

function verifyResponseIsNotOk(response, expectedResponse) {
  CommonTestData.verifyResponseIsNotOk(response, expectedResponse)
  expect(response.tempId).toBeDefined()
}

function expectResponseIsNotOk(response, expectedResponse, deleted, endpoint) {
  verifyResponseIsNotOk(response, expectedResponse)
  expect(response.deleted).toEqual(deleted)
  expect(response.endpoint).toEqual(endpoint)
}

export { verifyAllResponsesAreOk }
