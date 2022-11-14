import client from '../gigya/client'
import { performance } from 'perf_hooks'

// // const Site = require('../site/site.js')
import * as TestData from '../site/data_test'
//import SiteManager from '../site/siteManager'

jest.setTimeout(30000)

describe('Gigya client test suite', () => {
  const MEASURE_START_MARK = 'start'
  const MEASURE_NAME_ASYNC = 'Async'
  const numberOfRepetitions = 3

  // test('post site', async () => {
  //   const request = {
  //     baseDomain: 'bruno_js_p1c1',
  //     description: 'parent 1 description',
  //     dataCenter: 'au1',
  //     partnerID: '79597568',
  //     userKey: 'ANAduftBfnKP',
  //     secret: 'n2c4vAt2GwEVLHrLCDwUpLbKJVhT3RC1',
  //   }
  //   for (let i = 0; i < numberOfRepetitions; ++i) {
  //     performance.mark(MEASURE_START_MARK)
  //     let promise = await client.post('https://admin.us1.gigya.com/admin.createSite', request)
  //     performance.measure(MEASURE_NAME_ASYNC, MEASURE_START_MARK)
  //     console.log(promise.data)
  //   }
  //   console.log('teste terminado')

  //   const asyncAverage = printResults(MEASURE_NAME_ASYNC)
  //   console.log(`Duration : ${Math.round(asyncAverage * 100) / 100} ms`)
  // })

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

  // test('real create test', async () => {
  //   jest.setTimeout(25000)
  //   const request = TestData.createMultipleParentWithMultipleChildrenRequest()

  //   const siteManager = new SiteManager({
  //     partnerID: '79597568',
  //     userKey: 'ANAduftBfnKP',
  //     secret: 'n2c4vAt2GwEVLHrLCDwUpLbKJVhT3RC1',
  //   })
  //   const response = await siteManager.create(request)

  //   expect(response.length).toEqual(6)
  //   verifyAllResponsesAreOk(response)
  // })

  // test('real delete test', async () => {
  //   jest.setTimeout(25000)

  //   const siteManager = new SiteManager({
  //     partnerID: '79597568',
  //     userKey: 'ANAduftBfnKP',
  //     secret: 'n2c4vAt2GwEVLHrLCDwUpLbKJVhT3RC1',
  //   })
  //   const response = await siteManager.deleteSites(['4_seEB7mvjaXEv-4aT0XbCew', '', '4_BeH9Jyt7-hX_B7bekp1WSw'])
  //   console.log(response)

  //   expect(response.length).toEqual(6)
  //   verifyAllResponsesAreOk(response)
  // })

  test('Export email templates', async () => {})

  function printResults(name) {
    let average = 0
    performance.getEntriesByName(name, 'measure').forEach((entry) => {
      average += entry.duration
      console.log(`${name} duration : ${entry.duration}`)
    })
    console.log(`${name} duration average : ${average / numberOfRepetitions}`)
    return average
  }

  function verifyAllResponsesAreOk(responses) {
    responses.forEach((response) => {
      TestData.verifyResponseIsOk(response)
      expect(response.deleted).toEqual(false)
    })
  }
})
