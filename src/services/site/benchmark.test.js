import SiteManagerAsync from './siteManagerAsync'
import SiteManager from './siteManager'
import * as TestData from './data_test'
import axios from 'axios'
import { performance } from 'perf_hooks'

jest.mock('axios')
jest.mock('../gigya/client')
jest.setTimeout(40000)

describe('Benchmark test suite', () => {
  const credentials = {
    partnerId: 'partnerId',
    userKey: 'userKey',
    secret: 'secret',
  }

  const MEASURE_START_MARK = 'start'
  const MEASURE_NAME_ASYNC = 'Async'
  const MEASURE_NAME_SYNC = 'Sync'
  const MEASURE_NAME_ASYNC_ROLLBACK = 'AsyncRollback'
  const MEASURE_NAME_SYNC_ROLLBACK = 'SyncRollback'

  const numberOfRepetitions = 3
  const numberOfParents = 3
  const numberOfChildrenPerParent = 10

  afterAll(() => {
    const asyncAverage = printResults(MEASURE_NAME_ASYNC)
    const syncAverage = printResults(MEASURE_NAME_SYNC)
    if (syncAverage && asyncAverage) {
      console.log(`Async version is ${Math.round((syncAverage / asyncAverage) * 100) / 100} times faster`)
    }

    const asyncRollbackAverage = printResults(MEASURE_NAME_ASYNC_ROLLBACK)
    const syncRollbackAverage = printResults(MEASURE_NAME_SYNC_ROLLBACK)
    if (syncRollbackAverage && asyncRollbackAverage) {
      console.log(`Async rollback version is ${Math.round((syncRollbackAverage / asyncRollbackAverage) * 100) / 100} times faster`)
    }
  })

  test('Site manager create async', async () => {
    axios.mockResolvedValue({ data: TestData.expectedGigyaResponseOk })
    const request = TestData.createObject(numberOfParents, numberOfChildrenPerParent)

    for (let i = 0; i < numberOfRepetitions; ++i) {
      const response = await createTest(request, new SiteManagerAsync(credentials), MEASURE_NAME_ASYNC)
      expect(getNumberOfResponses(response)).toEqual(numberOfParents * numberOfChildrenPerParent + numberOfParents)
      verifyAllArrayResponsesAreOk(response, false)
    }
  })

  test('Site manager create sync', async () => {
    axios.mockResolvedValue({ data: TestData.expectedGigyaResponseOk })
    const request = TestData.createObject(numberOfParents, numberOfChildrenPerParent)

    for (let i = 0; i < numberOfRepetitions; ++i) {
      const response = await createTest(request, new SiteManager(credentials), MEASURE_NAME_SYNC)
      expect(getNumberOfResponses(response)).toEqual(numberOfParents * numberOfChildrenPerParent + numberOfParents)
      verifyAllResponsesAreOk(response, false)
    }
  })

  test('Site manager rollback async', async () => {
    const request = mockAxiosAndCreateRequest()
    for (let i = 0; i < numberOfRepetitions; ++i) {
      const response = await createTest(request, new SiteManagerAsync(credentials), MEASURE_NAME_ASYNC_ROLLBACK)
      expect(getNumberOfResponses(response)).toEqual(numberOfParents * numberOfChildrenPerParent + numberOfParents)
      for (let i = 0; i < numberOfParents - 1; ++i) {
        verifyAllResponsesAreOk(response[i], true)
      }
      verifyAllResponsesAreOk(response[numberOfParents - 1].slice(0, -1), true)
      TestData.verifyResponseIsNotOk(response[numberOfParents - 1].slice(-1)[0], TestData.scExpectedGigyaResponseNotOk)
    }
  })

  test('Site manager rollback sync', async () => {
    const request = mockAxiosAndCreateRequest()
    for (let i = 0; i < numberOfRepetitions; ++i) {
      const response = await createTest(request, new SiteManager(credentials), MEASURE_NAME_SYNC_ROLLBACK)
      expect(getNumberOfResponses(response)).toEqual(numberOfParents * numberOfChildrenPerParent + numberOfParents)
      verifyAllResponsesAreOk(response.slice(0, -1), true)
      TestData.verifyResponseIsNotOk(response.slice(-1)[0], TestData.scExpectedGigyaResponseNotOk)
    }
  })

  function mockAxiosAndCreateRequest() {
    axios.mockImplementation((axiosConfig) => {
      if (axiosConfig.data.has('baseDomain') && axiosConfig.data.get('baseDomain').includes(`p${numberOfParents - 1}.c${numberOfChildrenPerParent - 1}`)) {
        const response = { data: TestData.scExpectedGigyaResponseNotOk }
        console.log(`server response=${JSON.stringify(response)}`)
        return response
      } else if (axiosConfig.data.has('siteConfigParameters')) {
        const response = { data: TestData.getSiteConfigSuccessfullyMultipleMember(numberOfChildrenPerParent) }
        console.log(`server response=${JSON.stringify(response)}`)
        return response
      } else {
        const response = { data: TestData.expectedGigyaResponseOk }
        console.log(`server response=${JSON.stringify(response)}`)
        return response
      }
    })
    return TestData.createObject(numberOfParents, numberOfChildrenPerParent)
  }

  async function createTest(request, manager, measureName) {
    performance.mark(MEASURE_START_MARK)
    let response = await manager.create(request)
    performance.measure(measureName, MEASURE_START_MARK)
    console.log(`test.response=${JSON.stringify(response)}`)
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

function verifyAllArrayResponsesAreOk(responsesArray, deleted) {
  responsesArray.forEach((response) => {
    verifyAllResponsesAreOk(response, deleted)
  })
}

function verifyAllResponsesAreOk(responses, deleted) {
  responses.forEach((response) => {
    verifyResponseIsOk(response)
    expect(response.deleted).toEqual(deleted)
  })
}

function verifyResponseIsOk(response) {
  TestData.verifyResponseIsOk(response)
  expect(response.apiKey).toBeDefined()
  expect(response.apiVersion).toBeDefined()
  expect(response.tempId).toBeDefined()
  expect(response.endpoint).toEqual(TestData.Endpoints.SITE_CREATE)
}
