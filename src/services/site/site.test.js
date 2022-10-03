'use strict'
const Site = require('./site.js')
const axios = require('axios').default
const TestData = require('./data_test.js')

jest.mock('axios')

describe('Service Site test suite', () => {
	const parent1SiteId = 'idP1'

	const requestBody = {
		baseDomain: 'p1.com',
		description: 'parent 1 description',
		dataCenter: 'us1',
		isChildSite: false,
		id: parent1SiteId,
		parentSiteId: '',
	}

	test('reference comparison', async () => {
		const mockedResponse = {
			data: TestData.createSingleParentRequest().Sites[0],
		}
		axios.post.mockResolvedValue(mockedResponse)

		const siteService = new Site('partnerId', 'userKey', 'secret')
		let response = await siteService.create(requestBody)
		console.log('test.response=' + JSON.stringify(response))
		expect(response).toEqual(requestBody)
	})

	test('create site successfully', async () => {
		const mockedResponse = { data: TestData.expectedGigyaResponseOk }
		axios.post.mockResolvedValue(mockedResponse)

		const siteService = new Site('partnerId', 'userKey', 'secret')
		let response = await siteService.create(
			TestData.createSingleParentRequest().Sites[0],
		)
		console.log('response=' + JSON.stringify(response))

		expect(response.ApiKey).toBeDefined()
		expect(response.StatusCode).toEqual(TestData.HttpStatus.OK)
	})

	test('create site without secret', async () => {
		// const response = createSites(
		// 	TestData.createSingleParentRequest().Sites[0],
		// 	TestData.expectedGigyaResponseNoSecret,
		// )
		const mockedResponse = { data: TestData.expectedGigyaResponseNoSecret }
		axios.post.mockResolvedValue(mockedResponse)

		const siteService = new Site('partnerId', 'userKey', '')
		let response = await siteService.create(
			TestData.createSingleParentRequest().Sites[0],
		)
		console.log('response=' + JSON.stringify(response))

		verifyResponseIsNotOk(
			response,
			TestData.expectedGigyaResponseNoSecret.ErrorMessage,
		)
	})

	test('create site without partnerId', async () => {
		// const response = createSites(
		// 	TestData.createSingleParentRequest().Sites[0],
		// 	TestData.expectedGigyaResponseNoPartnerId,
		// 	{
		// 		PartnerId: '',
		// 		UserKey: 'userKey',
		// 		Secret: 'secret',
		// 	},
		// )
		const mockedResponse = { data: TestData.expectedGigyaResponseNoPartnerId }
		axios.post.mockResolvedValue(mockedResponse)

		const siteService = new Site('', 'userKey', 'secret')
		let response = await siteService.create(
			TestData.createSingleParentRequest().Sites[0],
		)
		console.log('response=' + JSON.stringify(response))

		verifyResponseIsNotOk(
			response,
			TestData.expectedGigyaResponseNoPartnerId.ErrorMessage,
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
	// 	let response = await siteService.createAsync(request.Sites[0])
	// 	console.log('response=' + JSON.stringify(response))

	// 	//expect(response.ApiKey).toBeDefined()
	// 	//expect(response.StatusCode).toEqual(TestData.HttpStatus.OK)
	// })
})

function createSites(request, expectedResponseFromServer, siteParams) {
	const mockedResponse = { data: expectedResponseFromServer }
	axios.post.mockResolvedValue(expectedResponseFromServer)

	const siteService = new Site(
		siteParams.PartnerId,
		siteParams.UserKey,
		siteParams.Secret,
	)
	let response = siteService.create(request)
	console.log('response=' + JSON.stringify(response))
	return response
}

function verifyResponseIsNotOk(response, message) {
	expect(response.ApiKey).toBeUndefined()
	expect(response.StatusCode).not.toEqual(TestData.HttpStatus.OK)
	//expect(response.SiteUid).toBeDefined()
	expect(response.ErrorMessage).toEqual(message)
}
