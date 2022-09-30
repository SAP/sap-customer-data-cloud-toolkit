'use strict'
const axios = require('axios').default

const client = {
	get: async function (url) {
		try {
			const response = await axios.get(url)
			console.log(JSON.stringify(response))
			return response.data
		} catch (error) {
			console.log(JSON.stringify(error))
		}
	},
	post: async function (url, body) {
		try {
			const response = await axios.post(url, body)
			console.log('response=' + JSON.stringify(response))
			return response.data
			//return axios.post(url, body).then((resp) => resp.data)
		} catch (error) {
			console.log(JSON.stringify(error))
		}
	},
}

module.exports = client
