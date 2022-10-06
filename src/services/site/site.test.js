'use strict'
const Site = require('./site.js')
const axios = require('axios').default
const TestData = require('./data_test.js')
const client = require('../gigya/client')

jest.mock('axios')

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
    let clone = Object.assign({}, credentials)
    delete clone.secret
    const response = await createSites(TestData.createSingleParentRequest().sites[0], TestData.expectedGigyaResponseNoSecret, clone)

    TestData.verifyResponseIsNotOk(response, TestData.expectedGigyaResponseNoSecret)
  })

  test('create site without partnerId', async () => {
    let clone = Object.assign({}, credentials)
    delete clone.partnerId
    const response = await createSites(TestData.createSingleParentRequest().sites[0], TestData.expectedGigyaResponseNoPartnerId, clone)

    TestData.verifyResponseIsNotOk(response, TestData.expectedGigyaResponseNoPartnerId)
  })

  test('create site without user key', async () => {
    let clone = Object.assign({}, credentials)
    delete clone.userKey
    const response = await createSites(TestData.createSingleParentRequest().sites[0], TestData.expectedGigyaResponseNoUserKey, clone)

    TestData.verifyResponseIsNotOk(response, TestData.expectedGigyaResponseNoUserKey)
  })

  test('create site without baseDomain', async () => {
    let request = TestData.createSingleParentRequest().sites[0]
    delete request.baseDomain
    const response = await createSites(request, TestData.expectedGigyaResponseNoBaseDomain, credentials)

    TestData.verifyResponseIsNotOk(response, TestData.expectedGigyaResponseNoBaseDomain)
  })

  test('create site with invalid data center', async () => {
    let request = TestData.createSingleParentRequest().sites[0]
    request.dataCenter = 'INVALID_DATA_CENTER'
    const response = await createSites(request, TestData.expectedGigyaResponseInvalidDataCenter, credentials)

    TestData.verifyResponseIsNotOk(response, TestData.expectedGigyaResponseInvalidDataCenter)
  })

  test('send request to invalid url', async () => {
    axios.mockImplementation(() => {
      let err = {}
      err.code = 'ENOTFOUND'
      err.details = 'getaddrinfo ENOTFOUND xadmin.us1.gigya.com'
      err.message = 'Error creating site'
      err.time = Date.now()
      throw err
    })

    const siteService = new Site(credentials)
    let response = await siteService.create(TestData.createSingleParentRequest().sites[0])
    console.log('response=' + JSON.stringify(response))

    expect(response.errorCode).toEqual('ENOTFOUND')
    expect(response.errorMessage).toEqual('Error creating site')
    expect(response.time).toBeDefined()
  })

  // test('create site real', async () => {
  // 	const request = {
  // 		Sites: [
  // 			{
  // 				baseDomain: 'bruno_js_p1',
  // 				description: 'parent 1 description',
  // 				dataCenter: 'us1',
  // 			},
  // 		],
  // 		PartnerID: '79597568',
  // 		UserKey: 'ANAduftBfnKP',
  // 		Secret: 'n2c4vAt2GwEVLHrLCDwUpLbKJVhT3RC1',
  // 	}
  // 	const siteService = new Site(
  // 		request.PartnerID,
  // 		'', //request.UserKey,
  // 		request.Secret,
  // 	)
  // 	let response = await siteService.create(request.Sites[0])
  // 	console.log('response=' + JSON.stringify(response))

  // 	//expect(response.ApiKey).toBeDefined()
  // 	//expect(response.StatusCode).toEqual(TestData.HttpStatus.OK)
  // })
})

async function createSites(request, expectedResponseFromServer, siteParams) {
  const mockedResponse = { data: expectedResponseFromServer }
  axios.mockResolvedValue(mockedResponse)

  const siteService = new Site(siteParams.partnerId, siteParams.userKey, siteParams.secret)
  let response = await siteService.create(request)
  console.log('response=' + JSON.stringify(response))
  return response
}

function verifyResponseIsOk(response) {
  TestData.verifyResponseIsOk(response)
  expect(response.apiKey).toBeDefined()
  expect(response.apiVersion).toBeDefined()
}
