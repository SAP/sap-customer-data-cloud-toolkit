import * as CommonTestData from '../servicesDataTest'
import ConfigManager from './configManager'
import axios from 'axios'
import * as ConfiguratorTestData from '../configurator/dataTest'
import { getInfoExpectedResponse } from './info/dataTest'
import { errorCallback } from '../servicesDataTest'

jest.mock('axios')

const apiKey = 'apiKey'

describe('Config Manager test suite', () => {
  let configManager = new ConfigManager(CommonTestData.credentials, apiKey, [apiKey], {})

  test('get configuration successfully', async () => {
    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) })
    const response = await configManager.getConfiguration()
    //console.log('response=' + JSON.stringify(response))
    expect(response).toEqual(getInfoExpectedResponse(true))
  })

  test('get configuration error getting data center', async () => {
    const mockedResponse = { data: ConfiguratorTestData.scExpectedGigyaResponseNotOk }
    const err = {
      message: mockedResponse.data.errorMessage,
      code: mockedResponse.data.errorCode,
      details: mockedResponse.data.errorDetails,
    }
    axios.mockResolvedValueOnce(mockedResponse)
    await configManager.getConfiguration().catch((error) => {
      errorCallback(error, err)
    })
  })
})
