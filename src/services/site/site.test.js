'use strict'
const Site = require('./site.js')
const axios = require('axios').default
const TestData = require('./data_test.js')
const client = require('../gigya/client')

jest.mock('axios')

describe('Service Site test suite', () => {
	const parent1SiteId = 'idP1'

	const credentials = {
		partnerId: 'partnerId',
		userKey: 'userKey',
		secret: 'secret',
	}

	test('create site successfully', async () => {
		const response = await createSites(
			TestData.createSingleParentRequest().Sites[0],
			TestData.expectedGigyaResponseOk,
			credentials,
		)

		expect(response.ApiKey).toBeDefined()
		expect(response.StatusCode).toEqual(TestData.HttpStatus.OK)
	})

	test('create site without secret', async () => {
		let clone = Object.assign({}, credentials)
		delete clone.secret
		const response = await createSites(
			TestData.createSingleParentRequest().Sites[0],
			TestData.expectedGigyaResponseNoSecret,
			clone,
		)

		verifyResponseIsNotOk(
			response,
			TestData.expectedGigyaResponseNoSecret.ErrorMessage,
		)
	})

	test('create site without partnerId', async () => {
		let clone = Object.assign({}, credentials)
		delete clone.partnerId
		const response = await createSites(
			TestData.createSingleParentRequest().Sites[0],
			TestData.expectedGigyaResponseNoPartnerId,
			clone,
		)

		verifyResponseIsNotOk(
			response,
			TestData.expectedGigyaResponseNoPartnerId.ErrorMessage,
		)
	})

	test('create site without user key', async () => {
		let clone = Object.assign({}, credentials)
		delete clone.userKey
		const response = await createSites(
			TestData.createSingleParentRequest().Sites[0],
			TestData.expectedGigyaResponseNoUserKey,
			clone,
		)

		verifyResponseIsNotOk(
			response,
			TestData.expectedGigyaResponseNoUserKey.ErrorMessage,
		)
	})

	test('create site without baseDomain', async () => {
		let request = TestData.createSingleParentRequest().Sites[0]
		delete request.baseDomain
		const response = await createSites(
			TestData.createSingleParentRequest().Sites[0],
			TestData.expectedGigyaResponseNoBaseDomain,
			credentials,
		)

		verifyResponseIsNotOk(
			response,
			TestData.expectedGigyaResponseNoBaseDomain.ErrorMessage,
		)
	})

	test('create site with invalid data center', async () => {
		let request = TestData.createSingleParentRequest().Sites[0]
		request.dataCenter = 'INVALID_DATA_CENTER'
		const response = await createSites(
			request,
			TestData.expectedGigyaResponseInvalidDataCenter,
			credentials,
		)

		verifyResponseIsNotOk(
			response,
			TestData.expectedGigyaResponseInvalidDataCenter.ErrorMessage,
		)
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
	// 		request.UserKey,
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

	const siteService = new Site(
		siteParams.partnerId,
		siteParams.userKey,
		siteParams.secret,
	)
	let response = await siteService.create(request)
	console.log('response=' + JSON.stringify(response))
	return response
}

function verifyResponseIsNotOk(response, message) {
	expect(response.ApiKey).toBeUndefined()
	expect(response.StatusCode).toBeDefined()
	expect(response.StatusCode).not.toEqual(TestData.HttpStatus.OK)
	//expect(response.SiteUid).toBeDefined()
	expect(response.ErrorMessage).toEqual(message)
}
