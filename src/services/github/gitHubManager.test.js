import GitHubManager from './gitHubManager'
import axios from 'axios'
import { gitHubExpectedErrorResponse, gitHubExpectedResponse } from './data_test'

jest.mock('axios')
jest.mock('../../../package.json')

let gitHubManager

beforeAll(() => {
  axios.create.mockReturnThis()
  gitHubManager = new GitHubManager()
})

describe('GitHub Manager test suite', () => {
  test('1 - error getting latest release', async () => {
    const err = {}
    axios.get.mockImplementation(() => {
      err.code = gitHubExpectedErrorResponse.code
      err.message = GitHubManager.ERROR_MSG_RELEASE
      err.details = gitHubExpectedErrorResponse.message
      throw err
    })

    let testPassed = false
    await gitHubManager.getNewReleaseAvailable().catch((error) => {
      if (error.errorMessage !== err.message || error.errorCode !== err.code || error.errorDetails !== err.details || error.time === undefined) {
        throw new Error('It is not the expected exception')
      } else {
        testPassed = true
      }
    })
    if (!testPassed) {
      throw new Error('Expected exception was not thrown')
    }
  })

  test('2 - test is new minor release available', async () => {
    executeTest('5.5.9', true)
  })

  test('3 - test is new major release available', async () => {
    executeTest('6.0.0', true)
  })

  test('4 - test is new release not available', async () => {
    executeTest('5.5.5', false)
  })

  test('5 - test is new minor release not available', async () => {
    executeTest('5.4.9', false)
  })

  async function executeTest(latestVersion, shouldBeNewer) {
    const expectedResponse = gitHubExpectedResponse
    expectedResponse.tag_name = latestVersion
    const mockedResponse = { data: JSON.parse(JSON.stringify(expectedResponse)) }
    axios.get.mockResolvedValueOnce(mockedResponse)
    const response = await gitHubManager.getNewReleaseAvailable()
    //console.log('response=' + JSON.stringify(response))
    expect(response.isNewReleaseAvailable).toEqual(shouldBeNewer)
    expect(response.latestReleaseVersion).toEqual(latestVersion)
    expect(response.latestReleaseUrl).toBeDefined()
  }
})
