/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import SiteManager from './siteManager.js'
import * as TestData from './dataTest.js'
import * as CommonTestData from '../servicesDataTest.js'
import * as ConfiguratorTestData from '../configurator/dataTest.js'
import axios from 'axios'
import { performance } from 'perf_hooks'

jest.mock('axios')
jest.mock('../gigya/client.js')
jest.setTimeout(60000)

describe.skip('Benchmark test suite', () => {
  const MEASURE_START_MARK = 'start'
  const MEASURE_NAME_ASYNC = 'Async'
  const MEASURE_NAME_ASYNC_ROLLBACK = 'AsyncRollback'

  const numberOfRepetitions = 3
  const numberOfParents = 3
  const numberOfChildrenPerParent = 10

  afterAll(() => {
    printResults(MEASURE_NAME_ASYNC)
    printResults(MEASURE_NAME_ASYNC_ROLLBACK)
  })

  test('Site manager create async', async () => {
    axios.mockResolvedValue({ data: TestData.expectedGigyaResponseOk })
    const request = TestData.createObject(numberOfParents, numberOfChildrenPerParent)

    for (let i = 0; i < numberOfRepetitions; ++i) {
      const response = await createTest(request, new SiteManager(CommonTestData.siteCredentials), MEASURE_NAME_ASYNC)
      expect(getNumberOfResponses(response)).toEqual(numberOfParents * numberOfChildrenPerParent + numberOfParents)
      verifyAllResponsesAreOk(response, false)
    }
  })

  test('Site manager rollback async', async () => {
    const request = mockAxiosAndCreateRequest()
    for (let i = 0; i < numberOfRepetitions; ++i) {
      const response = await createTest(request, new SiteManager(CommonTestData.siteCredentials), MEASURE_NAME_ASYNC_ROLLBACK)
      expect(getNumberOfResponses(response)).toEqual(numberOfParents * numberOfChildrenPerParent + numberOfParents)

      verifyAllResponsesAreOk(response.slice(0, -1), true)
      CommonTestData.verifyResponseIsNotOk(response.slice(-1)[0], ConfiguratorTestData.scExpectedGigyaResponseNotOk)
      expect(response.slice(-1)[0].deleted).toEqual(false)
    }
  })

  function mockAxiosAndCreateRequest() {
    axios.mockImplementation((axiosConfig) => {
      if (axiosConfig.data.has('baseDomain') && axiosConfig.data.get('baseDomain').includes(`${TestData.DOMAIN_PREFIX}p${numberOfParents - 1}.c${numberOfChildrenPerParent - 1}`)) {
        const response = { data: ConfiguratorTestData.scExpectedGigyaResponseNotOk }
        //console.log(`server response=${JSON.stringify(response)}`)
        return response
      } else if (axiosConfig.data.has('includeSiteGroupConfig')) {
        const response = { data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(numberOfChildrenPerParent) }
        //console.log(`server response=${JSON.stringify(response)}`)
        return response
      } else {
        const response = { data: TestData.expectedGigyaResponseOk }
        //console.log(`server response=${JSON.stringify(response)}`)
        return response
      }
    })
    return TestData.createObject(numberOfParents, numberOfChildrenPerParent)
  }

  async function createTest(request, manager, measureName) {
    performance.mark(MEASURE_START_MARK)
    let response = await manager.create(request)
    performance.measure(measureName, MEASURE_START_MARK)
    //console.log(`test.response=${JSON.stringify(response)}`)
    return response
  }

  function printResults(name) {
    let average = 0
    performance.getEntriesByName(name, 'measure').forEach((entry) => {
      average += entry.duration
      console.log(`${name} duration : ${entry.duration}`)
    })
    console.log(`${name} duration average : ${average / numberOfRepetitions}`)
    return average
  }

  function getNumberOfResponses(responsesArray) {
    let numberOfResponses = 0
    if (Array.isArray(responsesArray[0])) {
      responsesArray.forEach((hierarchyArray) => {
        numberOfResponses += hierarchyArray.length
      })
    } else {
      numberOfResponses = responsesArray.length
    }
    return numberOfResponses
  }
})

function verifyAllResponsesAreOk(responses, deleted) {
  responses.forEach((response) => {
    verifyResponseIsOk(response)
    expect(response.deleted).toEqual(deleted)
  })
}

function verifyResponseIsOk(response) {
  CommonTestData.verifyResponseIsOk(response)
  expect(response.apiKey).toBeDefined()
  expect(response.apiVersion).toBeDefined()
  expect(response.tempId).toBeDefined()
  expect(response.endpoint).toEqual(TestData.Endpoints.SITE_CREATE)
}
