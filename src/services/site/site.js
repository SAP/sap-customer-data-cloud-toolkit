'use strict'
const client = require('../gigya/client')

class Site {
	constructor(partnerId, userKey, secret) {
		this.partnerId = partnerId
		this.userKey = userKey
		this.secret = secret
	}

	get site() {
		return this.data
	}

	createAsync(body) {
		let url = 'https://admin.' + body.dataCenter + '.gigya.com/admin.createSite'
		let bodyWithCredentials = this.addCredentials(body)
		return client.post(url, bodyWithCredentials)
	}

	async create(body) {
		const response = await this.createAsync(body)
		console.log('create.response=' + JSON.stringify(response))
		console.log(
			'isPromise=' +
				(typeof response === 'object' && typeof response.then === 'function'),
		)
		return response
	}

	addCredentials(body) {
		let bodyWithCredentials = Object.assign({}, body)
		bodyWithCredentials.partnerID = this.partnerId
		bodyWithCredentials.userKey = this.userKey
		bodyWithCredentials.secret = this.secret
		return bodyWithCredentials
	}
}

module.exports = Site
