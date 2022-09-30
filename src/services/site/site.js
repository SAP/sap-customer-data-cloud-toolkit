const client = require('../gigya/client')

class Site {
	constructor(data) {
		this.data = data
	}

	get site() {
		return this.data
	}

	create() {
		return client.post('url', this.data)
	}

	delete() {}
}

module.exports = Site
