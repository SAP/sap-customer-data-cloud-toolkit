import * as CommonTestData from '../servicesDataTest'
import ConfigManager from './configManager'
import axios from 'axios'
import * as ConfiguratorTestData from '../configurator/dataTest'
import { getInfoExpectedResponse } from './info/dataTest'
import { errorCallback, verifyAllResponsesAreOk, expectedGigyaResponseOk, expectedGigyaResponseInvalidAPI } from '../servicesDataTest'
import { expectedSchemaResponse } from './schema/dataTest'
import { getSocialsProviders } from './social/dataTest'
import { getSmsExpectedResponse } from '../sms/dataTest'
import {getExpectedResponseOkWithContext, smsTemplatesId, socialIdentitiesId} from './dataTest'

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
    const mockedDataCenterResponse = ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(1)
    axios
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: JSON.parse(JSON.stringify(getResponseWithDataContext(expectedGigyaResponseOk, apiKey))) })
      .mockResolvedValueOnce({ data: JSON.parse(JSON.stringify(getResponseWithProfileContext(expectedGigyaResponseOk, apiKey))) })
      .mockResolvedValueOnce({ data: JSON.parse(JSON.stringify(getExpectedResponseOkWithContext(socialIdentitiesId, apiKey))) })
      .mockResolvedValueOnce({ data: JSON.parse(JSON.stringify(getExpectedResponseOkWithContext(smsTemplatesId, apiKey))) })
    const response = await configManager.copy([apiKey], getInfoExpectedResponse(false))
    expect(response.length).toEqual(4)
    verifyAllResponsesAreOk(response)
    verifyAllContext(response)
  })

  test('copy all unsuccessfully - error getting origin data center', async () => {
    const mockedResponse = ConfiguratorTestData.scExpectedGigyaResponseNotOk
    const err = {
      message: mockedResponse.errorMessage,
      code: mockedResponse.errorCode,
      details: mockedResponse.errorDetails,
    }
    axios.mockResolvedValueOnce({ data: mockedResponse})
    await configManager
      .copy([apiKey], getInfoExpectedResponse(false))
      .then(() => {
        // It should not reach here
        expect(1).toEqual(0)
      })
      .catch((error) => {
        errorCallback(error[0], err)
        verifyAllContext(error)
      })
  })

  test('copy all unsuccessfully - error getting destination data center', async () => {
    const mockedResponse = ConfiguratorTestData.scExpectedGigyaResponseNotOk
    const mockedDataCenterResponse = ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0)
    axios.mockResolvedValueOnce({ data: mockedDataCenterResponse }).mockResolvedValueOnce({ data: mockedResponse })
    const response = await configManager.copy([apiKey], getInfoExpectedResponse(false))
    expect(response.length).toEqual(1)
    expect(response[0]).toEqual(mockedResponse)
  })

  test('copy all unsuccessfully - error getting configuration info', async () => {
    const mockedDataResponse = getResponseWithDataContext(ConfiguratorTestData.scExpectedGigyaResponseNotOk, apiKey)
    const mockedProfileResponse = getResponseWithProfileContext(ConfiguratorTestData.scExpectedGigyaResponseNotOk, apiKey)
    const mockedResponse = ConfiguratorTestData.scExpectedGigyaResponseNotOk
    const mockedDataCenterResponse = ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(1)
    axios
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce(JSON.parse(JSON.stringify({ data: mockedDataResponse })))
      .mockResolvedValueOnce(JSON.parse(JSON.stringify({ data: mockedProfileResponse })))
      .mockResolvedValueOnce(JSON.parse(JSON.stringify({ data: mockedResponse })))
      .mockResolvedValueOnce(JSON.parse(JSON.stringify({ data: mockedResponse })))

    await executeCopyAllUnsuccessfully(mockedResponse)
  })

  test('copy all unsuccessfully - error setting configuration info', async () => {
    const mockedResponse = ConfiguratorTestData.scExpectedGigyaResponseNotOk
    const mockedDataCenterResponse = ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0)
    axios
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce(JSON.parse(JSON.stringify({ data: mockedResponse })))
      .mockResolvedValueOnce(JSON.parse(JSON.stringify({ data: mockedResponse })))
      .mockResolvedValueOnce(JSON.parse(JSON.stringify({ data: mockedResponse })))
      .mockResolvedValueOnce(JSON.parse(JSON.stringify({ data: mockedResponse })))

    await executeCopyAllUnsuccessfully(mockedResponse)
  })

  test('copy all unsuccessfully - error on single copy', async () => {
    const mockedResponse = ConfiguratorTestData.scExpectedGigyaResponseNotOk
    const mockedDataCenterResponse = ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0)
    axios
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce(JSON.parse(JSON.stringify({ data: mockedResponse })))
      .mockResolvedValueOnce(JSON.parse(JSON.stringify({ data: expectedGigyaResponseOk })))
      .mockResolvedValueOnce(JSON.parse(JSON.stringify({ data: expectedGigyaResponseOk })))

    const response = await configManager.copy([apiKey], getInfoExpectedResponse(false))
    expect(response.length).toEqual(3)
    CommonTestData.verifyResponseIsNotOk(response[0], mockedResponse)
    expect(response[0].id).toEqual('Schema')
    expect(response[0].targetApiKey).toEqual(apiKey)
    CommonTestData.verifyResponseIsOk(response[1], expectedGigyaResponseOk)
    expect(response[1].id).toEqual('SocialIdentities')
    expect(response[1].targetApiKey).toEqual(apiKey)
    CommonTestData.verifyResponseIsOk(response[2], expectedGigyaResponseOk)
    expect(response[2].id).toEqual('SmsTemplates')
    expect(response[2].targetApiKey).toEqual(apiKey)
  })

  async function executeCopyAllUnsuccessfully(mockedResponse) {
    const response = await configManager.copy([apiKey], getInfoExpectedResponse(false))
    expect(response.length).toEqual(4)
    CommonTestData.verifyResponseIsNotOk(response[0], mockedResponse)
    expect(response[0].context.id).toEqual('dataSchema')
    expect(response[0].context.targetApiKey).toEqual(apiKey)
    CommonTestData.verifyResponseIsNotOk(response[1], mockedResponse)
    expect(response[1].context.id).toEqual('profileSchema')
    expect(response[1].context.targetApiKey).toEqual(apiKey)
    CommonTestData.verifyResponseIsNotOk(response[1], mockedResponse)
    expect(response[2].id).toEqual('SocialIdentities')
    expect(response[2].targetApiKey).toEqual(apiKey)
    CommonTestData.verifyResponseIsNotOk(response[2], mockedResponse)
    expect(response[3].id).toEqual('SmsTemplates')
    expect(response[3].targetApiKey).toEqual(apiKey)
  }

  function getResponseWithDataContext(response, apiKey) {
    const resp = JSON.parse(JSON.stringify(response))
    resp.context = { targetApiKey: apiKey, id: 'dataSchema' }
    return resp
  }

  function getResponseWithProfileContext(response, apiKey) {
    const resp = JSON.parse(JSON.stringify(response))
    resp.context = { targetApiKey: apiKey, id: 'profileSchema' }
    return resp
  }

  function verifyAllContext(responses) {
    for(const response of responses) {
      expect(response.context.id).toBeDefined()
      expect(response.context.targetApiKey).toBeDefined()
    }
  }
})
