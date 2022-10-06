'use strict'
const client = require('./client')

describe('Gigya client test suite', () => {
  //   test('post site', async () => {
  //     const request = {
  //       baseDomain: 'bruno_js_p1c1',
  //       description: 'parent 1 description',
  //       dataCenter: 'au1',
  //       partnerID: '79597568',
  //       userKey: 'ANAduftBfnKP',
  //       secret: 'n2c4vAt2GwEVLHrLCDwUpLbKJVhT3RC1',
  //     }
  //     let promise = await client.post('https://admin.us1.gigya.com/admin.createSite', request)
  //     console.log(promise.data)
  //     console.log('teste terminado')
  //   })

  //   test('post config', async () => {
  //     const request = {
  //       apiKey: '4_PBPbswmanpAXCegPkoN5VA',
  //       siteGroupOwner: '4_VTRB4Mh942pU9deVLy_bkw',
  //       userKey: 'ANAduftBfnKP',
  //       secret: 'n2c4vAt2GwEVLHrLCDwUpLbKJVhT3RC1',
  //     }
  //     let promise = await client.post('https://admin.us1.gigya.com/admin.setSiteConfig', request)
  //     console.log(promise.data)
  //     console.log('teste terminado')
  //   })

  test('send to unknown url', async () => {
    // const request = {
    // 	baseDomain: 'bruno_js_p1',
    // 	description: 'parent 1 description',
    // 	dataCenter: 'us1',
    // 	partnerID: '79597568',
    // 	userKey: 'ANAduftBfnKP',
    // 	secret: 'n2c4vAt2GwEVLHrLCDwUpLbKJVhT3RC1',
    // }
    // let response = await client
    // 	.post('https://Xadmin.us1.gigya.com/admin.createSite', request)
    // 	.catch(function (error) {
    // 		console.log('code=' + error.code)
    // 		console.log('message=' + error.message)
    // 		console.log('data=' + error.config.data)
    // 		if (error.response) {
    // 			// The request was made and the server responded with a status code
    // 			// that falls out of the range of 2xx
    // 			console.log(error.response.data)
    // 			console.log(error.response.status)
    // 			console.log(error.response.headers)
    // 		} else if (error.request) {
    // 			// The request was made but no response was received
    // 			// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // 			// http.ClientRequest in node.js
    // 			console.log(error.request)
    // 		} else {
    // 			// Something happened in setting up the request that triggered an Error
    // 			console.log('Error', error.message)
    // 		}
    // 		console.log(error.config)
    // 		expect(error.code).toEqual('ENOTFOUND')
    // 	})
    // console.log('teste terminado')
  })
})
