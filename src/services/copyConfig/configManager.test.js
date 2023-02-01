import * as CommonTestData from '../servicesDataTest'
import ConfigManager from './configManager'
import axios from 'axios'
import * as ConfiguratorTestData from '../configurator/dataTest'
import { getInfoExpectedResponse } from './info/dataTest'
import { errorCallback, verifyAllResponsesAreOk, expectedGigyaResponseOk } from '../servicesDataTest'
import { expectedSchemaResponse } from './schema/dataTest'

jest.mock('axios')

const apiKey = 'apiKey'

describe('Config Manager test suite', () => {
  let configManager = new ConfigManager(CommonTestData.credentials, apiKey)

  test('get configuration successfully', async () => {
    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockResolvedValueOnce({ data: expectedSchemaResponse })
    const response = await configManager.getConfiguration()
    //console.log('response=' + JSON.stringify(response))
    expect(response).toEqual(getInfoExpectedResponse(false))
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

  test('copy all successfully', async () => {
    const mockedDataCenterResponse = ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0)
    axios
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
    const response = await configManager.copy([apiKey], getInfoExpectedResponse(false))
    expect(response.length).toEqual(1)
    verifyAllResponsesAreOk(response)
    expect(response[0].id).toEqual(`Schema;${apiKey}`)
  })

  test('copy all unsuccessfully - error getting origin data center', async () => {
    const mockedResponse = { data: ConfiguratorTestData.scExpectedGigyaResponseNotOk }
    const err = {
      message: mockedResponse.data.errorMessage,
      code: mockedResponse.data.errorCode,
      details: mockedResponse.data.errorDetails,
    }
    axios.mockResolvedValueOnce(mockedResponse)
    await configManager.copy([apiKey], getInfoExpectedResponse(false)).catch((error) => {
      errorCallback(error, err)
    })
  })

  test('copy all unsuccessfully - error getting destination data center', async () => {
    const mockedResponse = { data: ConfiguratorTestData.scExpectedGigyaResponseNotOk }
    const err = {
      message: mockedResponse.data.errorMessage,
      code: mockedResponse.data.errorCode,
      details: mockedResponse.data.errorDetails,
    }
    const mockedDataCenterResponse = ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0)
    axios.mockResolvedValueOnce({ data: mockedDataCenterResponse }).mockResolvedValueOnce(mockedResponse)
    await configManager.copy([apiKey], getInfoExpectedResponse(false)).catch((error) => {
      errorCallback(error, err)
    })
  })

  test('copy all unsuccessfully - error getting configuration info', async () => {
    const mockedResponse = { data: ConfiguratorTestData.scExpectedGigyaResponseNotOk }
    const err = {
      message: mockedResponse.data.errorMessage,
      code: mockedResponse.data.errorCode,
      details: mockedResponse.data.errorDetails,
    }
    const mockedDataCenterResponse = ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0)
    axios.mockResolvedValueOnce({ data: mockedDataCenterResponse }).mockResolvedValueOnce({ data: mockedDataCenterResponse }).mockResolvedValueOnce(mockedResponse)
    await configManager.copy([apiKey], getInfoExpectedResponse(false)).catch((error) => {
      errorCallback(error, err)
    })
  })

  test('copy all unsuccessfully - error setting configuration info', async () => {
    const mockedResponse = { data: ConfiguratorTestData.scExpectedGigyaResponseNotOk }
    const err = {
      message: mockedResponse.data.errorMessage,
      code: mockedResponse.data.errorCode,
      details: mockedResponse.data.errorDetails,
    }
    const mockedDataCenterResponse = ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0)
    axios
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce(mockedResponse)
    await configManager.copy([apiKey], getInfoExpectedResponse(false)).catch((error) => {
      errorCallback(error, err)
    })
  })
})
