import * as CommonTestData from '../servicesDataTest'
import ConfigManager from './configManager'
import axios from 'axios'
import * as ConfiguratorTestData from '../configurator/dataTest'
import { getInfoExpectedResponse } from './info/dataTest'
import { errorCallback, verifyAllResponsesAreOk, expectedGigyaResponseOk, expectedGigyaResponseInvalidAPI } from '../servicesDataTest'
import { expectedSchemaResponse } from './schema/dataTest'
import { getSocialsProviders } from './social/dataTest'
import { getSmsExpectedResponse } from '../sms/dataTest'

jest.mock('axios')

const apiKey = 'apiKey'

describe('Config Manager test suite', () => {
  let configManager

  beforeEach(() => {
    configManager = new ConfigManager(CommonTestData.credentials, apiKey)
  })
  const socialsKeys = 'APP KEY'

  test('get configuration successfully', async () => {
    axios
      .mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) })
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
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
      errorCallback(error[0], err)
    })
  })

  test('get configuration error getting schema info', async () => {
    const mockedResponse = { data: expectedGigyaResponseInvalidAPI }
    axios
      .mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) })
      .mockResolvedValueOnce(mockedResponse)
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
    const err = {
      message: mockedResponse.data.errorMessage,
      code: mockedResponse.data.errorCode,
      details: mockedResponse.data.errorDetails,
    }
    //axios.mockResolvedValueOnce(mockedResponse)
    await configManager
      .getConfiguration()
      .then(() => {
        // It should not reach here
        expect(1).toEqual(0)
      })
      .catch((error) => {
        errorCallback(error[0], err)
      })
  })

  test('copy all successfully', async () => {
    const mockedDataCenterResponse = ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0)
    axios
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: JSON.parse(JSON.stringify(expectedGigyaResponseOk)) })
      .mockResolvedValueOnce({ data: JSON.parse(JSON.stringify(expectedGigyaResponseOk)) })
      .mockResolvedValueOnce({ data: JSON.parse(JSON.stringify(expectedGigyaResponseOk)) })
      .mockResolvedValueOnce({ data: JSON.parse(JSON.stringify(expectedGigyaResponseOk)) })
    const response = await configManager.copy([apiKey], getInfoExpectedResponse(false))
    expect(response.length).toEqual(3)
    verifyAllResponsesAreOk(response)
    expect(response[0].id).toEqual(`Schema;${apiKey}`)
    expect(response[1].id).toEqual(`Social;${apiKey}`)
    expect(response[2].id).toEqual(`SmsConfiguration;${apiKey}`)
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
      errorCallback(error[0], err)
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
      errorCallback(error[0], err)
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
    axios
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce(JSON.parse(JSON.stringify(mockedResponse)))
      .mockResolvedValueOnce(JSON.parse(JSON.stringify(mockedResponse)))
      .mockResolvedValueOnce(JSON.parse(JSON.stringify(mockedResponse)))
    await configManager.copy([apiKey], getInfoExpectedResponse(false)).catch((error) => {
      errorCallback(error[0], err)
      expect(error[0].id).toBeDefined()
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
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce(JSON.parse(JSON.stringify(mockedResponse)))
      .mockResolvedValueOnce(JSON.parse(JSON.stringify(mockedResponse)))
      .mockResolvedValueOnce(JSON.parse(JSON.stringify(mockedResponse)))
      .mockResolvedValueOnce(mockedResponse)
    await configManager.copy([apiKey], getInfoExpectedResponse(false)).catch((error) => {
      errorCallback(error[0], err)
      expect(error[0].id).toBeDefined()
    })
  })
})
