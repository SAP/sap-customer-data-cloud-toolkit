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

    let response = await siteManager.create(request)
    console.log(`test.response=${JSON.stringify(response)}`)
    response = response[0]

    expect(response.length).toEqual(1)
    verifyAllResponsesAreOk(response)
  })

  test('create site successfully - parent with one child', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })

    const request = TestData.createParentWithOneChildRequest()
    let response = await siteManager.create(request)
    console.log(`test.response=${JSON.stringify(response)}`)
    response = response[0]

    expect(response.length).toEqual(2)
    verifyAllResponsesAreOk(response)
  })

  test('create site successfully - parent with two children', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })

    const request = TestData.createParentWithTwoChildRequest()
    let response = await siteManager.create(request)
    console.log(`test.response=${JSON.stringify(response)}`)
    response = response[0]

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
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })

    const request = TestData.createMultipleParentWithMultipleChildrenRequest()
    const response = await siteManager.create(request)
    console.log(`test.response=${JSON.stringify(response)}`)

    expect(response[0].length).toEqual(3)
    verifyAllResponsesAreOk(response[0])
    expect(response[1].length).toEqual(3)
    verifyAllResponsesAreOk(response[1])
  })

  test('create site unsuccessfully - error on parent', async () => {
    axios.mockResolvedValueOnce({ data: TestData.expectedGigyaResponseNoBaseDomain })

    const request = TestData.createParentWithOneChildRequest()
    let response = await siteManager.create(request)
    console.log(`test.response=${JSON.stringify(response)}`)
    response = response[0]

    expect(response.length).toEqual(1)
    expectResponseIsNotOk(response[0], TestData.expectedGigyaResponseNoBaseDomain, false, TestData.Endpoints.SITE_CREATE)
    expect(response[0].apiKey).toBeUndefined()
  })

  test('create site unsuccessfully - different data centers', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseWithDifferentDataCenter })
      .mockResolvedValueOnce({ data: TestData.getSiteConfigSuccessfullyMultipleMember(1) })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })

    const request = TestData.createParentWithOneChildRequest()
    let response = await siteManager.create(request)
    console.log(`test.response=${JSON.stringify(response)}`)
    response = response[0]

    expect(response.length).toEqual(2)
    expectResponseIsOk(response[0], true)
    expectResponseIsNotOk(response[1], TestData.scExpectedGigyaResponseWithDifferentDataCenter, true, TestData.Endpoints.SITE_CONFIG)
    expect(response[1].apiKey).toBeDefined()
  })

  test('create site unsuccessfully - invalid data centers on 2nd child', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseInvalidDataCenter })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.getSiteConfigSuccessfullyMultipleMember(1) })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })

    const request = TestData.createParentWithTwoChildRequest()
    let response = await siteManager.create(request)
    console.log(`test.response=${JSON.stringify(response)}`)
    response = response[0]

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
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseWithDifferentDataCenter })
      .mockResolvedValueOnce({ data: TestData.getSiteConfigSuccessfullyMultipleMember(2) })
      .mockResolvedValueOnce({ data: TestData.getSiteConfigSuccessfullyMultipleMember(2) })
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
    console.log(`test.response=${JSON.stringify(response)}`)

    expect(response[0].length + response[1].length).toEqual(6)
    expectResponseIsOk(response[0][0], true)
    expectResponseIsOk(response[0][1], true)
    expectResponseIsOk(response[0][2], true)
    expectResponseIsOk(response[1][0], true)
    expectResponseIsOk(response[1][1], true)
    expectResponseIsNotOk(response[1][2], TestData.scExpectedGigyaResponseWithDifferentDataCenter, true, TestData.Endpoints.SITE_CONFIG)
    expect(response[1][2].apiKey).toBeDefined()
  })

  test('create site unsuccessfully - error creating 1st hierarchy', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseWithDifferentDataCenter })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.scExpectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.getSiteConfigSuccessfullyMultipleMember(2) })
      .mockResolvedValueOnce({ data: TestData.getSiteConfigSuccessfullyMultipleMember(2) })
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
    console.log(`test.response=${JSON.stringify(response)}`)

    expect(response[0].length + response[1].length).toEqual(6)
    expectResponseIsOk(response[0][0], true)
    expectResponseIsNotOk(response[0][1], TestData.scExpectedGigyaResponseWithDifferentDataCenter, true, TestData.Endpoints.SITE_CONFIG)
    expectResponseIsOk(response[0][2], true)
    expectResponseIsOk(response[1][0], true)
    expectResponseIsOk(response[1][1], true)
    expectResponseIsOk(response[1][2], true)
    expect(response[0][1].apiKey).toBeDefined()
  })

  test('create site unsuccessfully - error on rollback', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
      .mockResolvedValueOnce({ data: TestData.expectedGigyaResponseNoBaseDomain })
      .mockResolvedValueOnce({ data: TestData.getSiteConfigSuccessfullyMultipleMember(0) })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdSiteAlreadyDeleted })

    const request = TestData.createParentWithOneChildRequest()
    let response = await siteManager.create(request)
    console.log(`test.response=${JSON.stringify(response)}`)
    response = response[0]

    expect(response.length).toEqual(2)
    expectResponseIsOk(response[0], false)
    expectResponseIsNotOk(response[1], TestData.expectedGigyaResponseNoBaseDomain, false, TestData.Endpoints.SITE_CREATE)
    expect(response[1].apiKey).toBeUndefined()
  })

  test('delete single site with site manager', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.getSiteConfigSuccessfullyMultipleMember(0) })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })

    let response = await siteManager.deleteSites(['####'])
    console.log(`test.response=${JSON.stringify(response)}`)

    expect(response.length).toBe(1)
    TestData.verifyResponseIsOk(response[0])
  })

  test('delete site with site members', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.getSiteConfigSuccessfullyMultipleMember(1) })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })
      .mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully })
      .mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })

    let response = await siteManager.deleteSites(['####'])
    console.log(`test.response=${JSON.stringify(response)}`)

    expect(response.length).toBe(2)
    TestData.verifyResponseIsOk(response[0])
    TestData.verifyResponseIsOk(response[1])
  })

  test('delete site already deleted', async () => {
    axios.mockResolvedValueOnce({ data: TestData.sdSiteAlreadyDeleted })

    let response = await siteManager.deleteSites(['####'])
    console.log(`test.response=${JSON.stringify(response)}`)

    expect(response.length).toBe(1)
    TestData.verifyResponseIsNotOk(response[0], TestData.sdSiteAlreadyDeleted)
  })

  test('delete 3 sites: 2 sites with multiple members and 1 site already deleted', async () => {
    axios
      .mockResolvedValueOnce({ data: TestData.getSiteConfigSuccessfullyMultipleMember(1) })
      .mockResolvedValueOnce({ data: TestData.getSiteConfigSuccessfullyMultipleMember(1) })
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
    console.log(`test.response=${JSON.stringify(response)}`)

    expect(response.length).toBe(5)
    TestData.verifyResponseIsOk(response[0])
    TestData.verifyResponseIsOk(response[1])
    TestData.verifyResponseIsOk(response[2])
    TestData.verifyResponseIsOk(response[3])
    TestData.verifyResponseIsNotOk(response[4], TestData.sdSiteAlreadyDeleted)
  })

  test('delete site invalid API', async () => {
    axios.mockResolvedValueOnce({ data: TestData.expectedGigyaResponseInvalidAPI })

    const response = await siteManager.deleteSites(['####'])
    console.log(`test.response=${JSON.stringify(response)}`)
    TestData.verifyResponseIsNotOk(response[0], TestData.expectedGigyaResponseInvalidAPI)
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
  expect(response.tempId).toBeDefined()
  expect(response.endpoint).toEqual(TestData.Endpoints.SITE_CREATE)
}

function expectResponseIsOk(response, deleted) {
  verifyResponseIsOk(response)
  expect(response.deleted).toEqual(deleted)
}

function verifyResponseIsNotOk(response, expectedResponse) {
  TestData.verifyResponseIsNotOk(response, expectedResponse)
  expect(response.tempId).toBeDefined()
}

function expectResponseIsNotOk(response, expectedResponse, deleted, endpoint) {
  verifyResponseIsNotOk(response, expectedResponse)
  expect(response.deleted).toEqual(deleted)
  expect(response.endpoint).toEqual(endpoint)
}

export { verifyAllResponsesAreOk }
