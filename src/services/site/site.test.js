'use strict'
const Site = require('./site.js')
const axios = require('axios').default

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

	const expectedGigyaResponseOk = {
		APIKey: 'apiKey',
		StatusCode: 200,
		ErrorCode: 0,
		StatusReason: 'OK',
		CallID: 'callId',
		ApiVersion: 2,
	}

	test('create', async () => {
		const response = { data: requestBody }
		axios.post.mockResolvedValue(response)

		const siteService = new Site(requestBody)
		let actual = await siteService.create()
		console.log(actual)
		expect(actual).toEqual(requestBody)
	})
})
