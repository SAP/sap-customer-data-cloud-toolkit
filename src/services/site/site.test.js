'use strict'
const Site = require('./site.js')
const axios = require('axios').default
const TestData = require('./data_test.js')

jest.mock('axios')

describe('Service Site test suite', () => {
	const parent1SiteId = 'idP1'

	const requestBody = {
		BaseDomain: 'p1.com',
		Description: 'parent 1 description',
		DataCenter: 'us1',
		IsChildSite: false,
		Id: parent1SiteId,
		ParentSiteId: '',
	}

	test('reference comparison', async () => {
		const mockedResponse = {
			data: TestData.createSingleParentRequest().Sites[0],
		}
		axios.post.mockResolvedValue(mockedResponse)

		const siteService = new Site('partnerId', 'userKey', 'secret')
		let response = await siteService.create(requestBody)
		console.log('response=' + JSON.stringify(response))
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
})

async function createSites(request, expectedResponseFromServer) {
	const mockedResponse = { data: expectedResponseFromServer }
	axios.post.mockResolvedValue(expectedResponseFromServer)

	const siteService = new Site('partnerId', 'userKey', '')
	let response = await siteService.create(request)
	console.log('response=' + JSON.stringify(response))
	return response
}

function verifyResponseIsNotOk(response, message) {
	expect(response.ApiKey).toBeUndefined()
	expect(response.StatusCode).not.toEqual(TestData.HttpStatus.OK)
	//expect(response.SiteUid).toBeDefined()
	expect(response.ErrorMessage).toEqual(message)
}
