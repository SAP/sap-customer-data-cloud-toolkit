import Site from './site'
import * as TestData from './data_test'
import axios from 'axios'
import * as CommonTestData from '../servicesData_test'
import * as ConfiguratorTestData from '../configurator/data_test'

jest.mock('axios')
jest.setTimeout(10000)

describe('Service Site test suite', () => {
  const credentials = {
    partnerId: 'partnerId',
    userKey: 'userKey',
    secret: 'secret',
  }

  test('create site successfully', async () => {
    const response = await createSites(TestData.createSingleParentRequest().sites[0], TestData.expectedGigyaResponseOk, credentials)

    verifyResponseIsOk(response)
  })

  test('create site without secret', async () => {
    const clone = Object.assign({}, credentials)
    delete clone.secret
    const response = await createSites(TestData.createSingleParentRequest().sites[0], TestData.expectedGigyaResponseNoSecret, clone)

    CommonTestData.verifyResponseIsNotOk(response, TestData.expectedGigyaResponseNoSecret)
  })

  test('create site without partnerId', async () => {
    const clone = Object.assign({}, credentials)
    delete clone.partnerId
    const response = await createSites(TestData.createSingleParentRequest().sites[0], TestData.expectedGigyaResponseNoPartnerId, clone)

    CommonTestData.verifyResponseIsNotOk(response, TestData.expectedGigyaResponseNoPartnerId)
  })

  test('create site without user key', async () => {
    const clone = Object.assign({}, credentials)
    delete clone.userKey
    const response = await createSites(TestData.createSingleParentRequest().sites[0], TestData.expectedGigyaResponseNoUserKey, clone)

    CommonTestData.verifyResponseIsNotOk(response, TestData.expectedGigyaResponseNoUserKey)
  })

  test('create site without baseDomain', async () => {
    const request = TestData.createSingleParentRequest().sites[0]
    delete request.baseDomain
    const response = await createSites(request, TestData.expectedGigyaResponseNoBaseDomain, credentials)

    CommonTestData.verifyResponseIsNotOk(response, TestData.expectedGigyaResponseNoBaseDomain)
  })

  test('create site with invalid data center', async () => {
    const request = TestData.createSingleParentRequest().sites[0]
    request.dataCenter = 'INVALID_DATA_CENTER'
    const response = await createSites(request, TestData.expectedGigyaResponseInvalidDataCenter, credentials)

    CommonTestData.verifyResponseIsNotOk(response, TestData.expectedGigyaResponseInvalidDataCenter)
  })

  test('send request to invalid url', async () => {
    axios.mockImplementation(() => {
      const err = {}
      err.code = 'ENOTFOUND'
      err.details = 'getaddrinfo ENOTFOUND xadmin.us1.gigya.com'
      err.message = 'Error creating site'
      err.time = Date.now()
      throw err
    })

    const siteService = new Site(credentials)
    const response = await siteService.create(TestData.createSingleParentRequest().sites[0])
    console.log('response=' + JSON.stringify(response))

    expect(response.data.errorCode).toEqual('ENOTFOUND')
    expect(response.data.errorMessage).toEqual('Error creating site')
    expect(response.data.time).toBeDefined()
  })

  test('error geting token to delete site', async () => {
    const response = await deleteSite('######', 'us1', TestData.expectedGigyaResponseInvalidAPI, credentials)
    CommonTestData.verifyResponseIsNotOk(response, TestData.expectedGigyaResponseInvalidAPI)
  })

  test('delete single site', async () => {
    axios.mockResolvedValueOnce({ data: TestData.sdExpectedDeleteTokenSuccessfully }).mockResolvedValueOnce({ data: TestData.sdExpectedGigyaResponseDeletedSite })

    const siteService = new Site(credentials.partnerId, credentials.userKey, credentials.secret)
    let response = await siteService.delete('####')
    //console.log('response=' + JSON.stringify(response))

    CommonTestData.verifyResponseIsOk(response)
  })

  test('delete site unsuccessfully: delete group site first', async () => {
    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockResolvedValueOnce({ data: TestData.sdDeleteGroupSitesFirst })

    const siteService = new Site(credentials.partnerId, credentials.userKey, credentials.secret)
    let response = await siteService.delete('####')
    //console.log('response=' + JSON.stringify(response))

    CommonTestData.verifyResponseIsNotOk(response, TestData.sdDeleteGroupSitesFirst)
  })

  async function createSites(request, expectedResponseFromServer, siteParams) {
    const mockedResponse = { data: expectedResponseFromServer }
    axios.mockResolvedValue(mockedResponse)

    const siteService = new Site(siteParams.partnerId, siteParams.userKey, siteParams.secret)
    const response = await siteService.create(request)
    //console.log('response=' + JSON.stringify(response))
    return response.data
  }
})

function verifyResponseIsOk(response) {
  CommonTestData.verifyResponseIsOk(response)
  expect(response.apiKey).toBeDefined()
  expect(response.apiVersion).toBeDefined()
}

async function deleteSite(site, dataCenter, expectedResponseFromServer, siteParams) {
  const mockedResponse = { data: expectedResponseFromServer }
  axios.mockResolvedValue(mockedResponse)

  const siteService = new Site(siteParams.partnerId, siteParams.userKey, siteParams.secret)
  let response = await siteService.delete(site, dataCenter)
  //console.log('response=' + JSON.stringify(response))
  return response
}
