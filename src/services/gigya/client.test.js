'use strict'
const client = require('./client')

describe('Gigya client test suite', () => {
	test('post', async () => {
		const request = {
			baseDomain: 'bruno_js_p1',
			description: 'parent 1 description',
			dataCenter: 'us1',
			partnerID: '79597568',
			userKey: 'ANAduftBfnKP',
			secret: 'n2c4vAt2GwEVLHrLCDwUpLbKJVhT3RC1',
		}
		let promise = await client.post(
			'https://admin.us1.gigya.com/admin.createSite',
			request,
		)

		console.log(promise.data)
		console.log('teste terminado')
	})
})
