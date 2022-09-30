'use strict'
//import { get } from './client.js'
const client = require('./client')

describe('Gigya client test suite', () => {
	test('get', () => {
		let expected = 3
		let actual = client.get('')
		console.log(actual)
	})
})
