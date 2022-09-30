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
		const response = client.post(url, body)
		console.log('createAsync.response=' + JSON.stringify(response))
		return response
	}

	async create(body) {
		const response = await this.createAsync(body)
		console.log('create.response=' + JSON.stringify(response))
		return response
	}

	delete() {}
}

module.exports = Site
