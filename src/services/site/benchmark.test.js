import SiteManagerAsync from './siteManagerAsync'
import SiteManager from './siteManager'
import * as TestData from './data_test'
import axios from 'axios'
import { performance } from 'perf_hooks'

jest.mock('axios')
jest.mock('../gigya/client')
jest.setTimeout(30000)

describe('Benchmark test suite', () => {
  const credentials = {
    partnerId: 'partnerId',
    userKey: 'userKey',
    secret: 'secret',
  }

  let request
  const MEASURE_NAME_ASYNC = 'Async'
  const MEASURE_NAME_SYNC = 'Sync'
  const MEASURE_START_MARK = 'start'
  const numberOfRepetitions = 1
  const numberOfParents = 2
  const numberOfChildrenPerParent = 10

  beforeAll(() => {
    request = TestData.createObject(numberOfParents, numberOfChildrenPerParent)
  })

  afterAll(() => {
    const asyncAverage = printResults(MEASURE_NAME_ASYNC)
    const syncAverage = printResults(MEASURE_NAME_SYNC)
    if (syncAverage && asyncAverage) {
      console.log(`Async version is ${Math.round((syncAverage / asyncAverage) * 100) / 100} times faster`)
    }
  })

  test('Site manager async', async () => {
    axios.mockResolvedValue({ data: TestData.expectedGigyaResponseOk })

    for (let i = 0; i < numberOfRepetitions; ++i) {
      const response = await createTest(new SiteManagerAsync(credentials), MEASURE_NAME_ASYNC)
      verifyAllArrayResponsesAreOk(response)
    }
  })

  test('Site manager sync', async () => {
    axios.mockResolvedValue({ data: TestData.expectedGigyaResponseOk })

    for (let i = 0; i < numberOfRepetitions; ++i) {
      const response = await createTest(new SiteManager(credentials), MEASURE_NAME_SYNC)
      verifyAllResponsesAreOk(response)
    }
  })

  test('dummy', () => {})

  async function createTest(manager, measureName) {
    performance.mark(MEASURE_START_MARK)
    let response = await manager.create(request)
    performance.measure(measureName, MEASURE_START_MARK)
    console.log(`test.response=${JSON.stringify(response)}`)

    expect(getNumberOfResponses(response)).toEqual(numberOfParents * numberOfChildrenPerParent + numberOfParents)
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
})

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

function verifyAllArrayResponsesAreOk(responsesArray) {
  responsesArray.forEach((response) => {
    verifyAllResponsesAreOk(response)
  })
}

function verifyAllResponsesAreOk(responses) {
  responses.forEach((response) => {
    verifyResponseIsOk(response)
    expect(response.deleted).toEqual(false)
  })
}

function verifyResponseIsOk(response) {
  TestData.verifyResponseIsOk(response)
  expect(response.apiKey).toBeDefined()
  expect(response.apiVersion).toBeDefined()
  expect(response.tempId).toBeDefined()
  expect(response.endpoint).toEqual(TestData.Endpoints.SITE_CREATE)
}
