import * as CommonTestData from '../servicesDataTest'
import ConfigManager from './configManager'
import axios from 'axios'
import * as ConfiguratorTestData from '../configurator/dataTest'
import { getInfoExpectedResponse } from './info/dataTest'
import { errorCallback, verifyAllResponsesAreOk, expectedGigyaResponseOk, expectedGigyaResponseInvalidAPI } from '../servicesDataTest'
import { expectedSchemaResponse } from './schema/dataTest'
import { getSocialsProviders } from './social/dataTest'
import { getSiteConfig } from './websdk/dataTest'
import { getSmsExpectedResponse } from '../sms/dataTest'
import { getEmailsExpectedResponse } from '../emails/dataTest'

import { getExpectedScreenSetResponse } from './screenset/dataTest'
import { getPolicyConfig } from './policies/dataTest'
import { getResponseWithContext, profileId, schemaId, smsTemplatesId, socialIdentitiesId, emailTemplatesId, webSdkId, policyId, subscriptionsId } from './dataTest'

jest.mock('axios')

const apiKey = 'apiKey'
const screenSetId = 'screenSet'

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
      .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
      .mockResolvedValueOnce({ data: getPolicyConfig })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: getSiteConfig })
    const response = await configManager.getConfiguration()
    //console.log('response=' + JSON.stringify(response))
    expect(response).toEqual(getInfoExpectedResponse(false))
  })

  test('get configuration error getting data center', async () => {
    const mockedResponse = ConfiguratorTestData.scExpectedGigyaResponseNotOk
    const err = {
      message: mockedResponse.errorMessage,
      code: mockedResponse.errorCode,
      details: mockedResponse.errorDetails,
    }
    axios.mockResolvedValueOnce({ data: mockedResponse })
    let errorThrown
    await configManager
      .getConfiguration()
      .then(() => {})
      .catch((error) => {
        errorThrown = error
      })
      .finally(() => {
        errorCallback(errorThrown[0], err)
        verifyAllContext(errorThrown)
      })
  })

  test('get configuration error getting schema info', async () => {
    const mockedResponse = expectedGigyaResponseInvalidAPI
    axios
      .mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, 'schema', apiKey) })
      .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
      .mockResolvedValueOnce({ data: getPolicyConfig })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: getSiteConfig })
    const err = {
      message: mockedResponse.errorMessage,
      code: mockedResponse.errorCode,
      details: mockedResponse.errorDetails,
    }
    let errorThrown
    await configManager
      .getConfiguration()
      .then(() => {})
      .catch((error) => {
        errorThrown = error
      })
      .finally(() => {
        errorCallback(errorThrown[0], err)
        verifyAllContext(errorThrown)
      })
  })

  test('copy all successfully', async () => {
    const mockedDataCenterResponse = ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(1)
    axios
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
      .mockResolvedValueOnce({ data: getPolicyConfig })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: getSiteConfig })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, schemaId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, profileId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, subscriptionsId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, policyId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, socialIdentitiesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, smsTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, webSdkId, apiKey) })
    const response = await configManager.copy([apiKey], getInfoExpectedResponse(true))

    expect(response.length).toEqual(26)
    verifyAllResponsesAreOk(response)
    verifyAllContext(response)
  })

  test('copy data schema only successfully to child site', async () => {
    await testSchemaOption(schemaId, 0)
  })

  test('copy data schema only successfully to parent site', async () => {
    await testSchemaOption(schemaId, 1)
  })

  test('copy profile schema only successfully', async () => {
    await testSchemaOption(profileId, 1)
  })

  test('copy all unsuccessfully - error getting origin data center', async () => {
    const mockedResponse = ConfiguratorTestData.scExpectedGigyaResponseNotOk
    const err = {
      message: mockedResponse.errorMessage,
      code: mockedResponse.errorCode,
      details: mockedResponse.errorDetails,
    }
    axios.mockResolvedValueOnce({ data: mockedResponse })
    await configManager
      .copy([apiKey], getInfoExpectedResponse(true))
      .then(() => {
        // It should not reach here
        // eslint-disable-next-line jest/no-conditional-expect
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
    const response = await configManager.copy([apiKey], getInfoExpectedResponse(true))
    expect(response.length).toEqual(1)
    expect(response[0]).toEqual(mockedResponse)
  })

  test('copy all unsuccessfully - error getting info', async () => {
    const mockedDataCenterResponse = ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(1)
    axios
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(ConfiguratorTestData.scExpectedGigyaResponseNotOk, schemaId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(ConfiguratorTestData.scExpectedGigyaResponseNotOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(ConfiguratorTestData.scExpectedGigyaResponseNotOk, policyId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(ConfiguratorTestData.scExpectedGigyaResponseNotOk, socialIdentitiesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(ConfiguratorTestData.scExpectedGigyaResponseNotOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(ConfiguratorTestData.scExpectedGigyaResponseNotOk, smsTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(ConfiguratorTestData.scExpectedGigyaResponseNotOk, webSdkId, apiKey) })

    await executeCopyAllUnsuccessfully(ConfiguratorTestData.scExpectedGigyaResponseNotOk, 7)
  })

  test('copy all unsuccessfully - error setting info', async () => {
    const mockedResponse = ConfiguratorTestData.scExpectedGigyaResponseNotOk
    const mockedDataCenterResponse = ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0)
    axios
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
      .mockResolvedValueOnce({ data: getPolicyConfig })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: getSiteConfig })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, schemaId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, profileId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, subscriptionsId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, policyId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, socialIdentitiesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, smsTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, webSdkId, apiKey) })

    await executeCopyAllUnsuccessfully(mockedResponse, 26)
  })

  test('copy all unsuccessfully - error on single copy', async () => {
    const mockedResponse = ConfiguratorTestData.scExpectedGigyaResponseNotOk
    const mockedDataCenterResponse = ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(1)
    axios
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
      .mockResolvedValueOnce({ data: getPolicyConfig })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: getSiteConfig })
      .mockResolvedValueOnce({ data: getResponseWithContext(mockedResponse, schemaId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, profileId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, subscriptionsId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, policyId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, socialIdentitiesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, emailTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, smsTemplatesId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, webSdkId, apiKey) })

    const response = await configManager.copy([apiKey], getInfoExpectedResponse(true))
    expect(response.length).toEqual(26)
    CommonTestData.verifyResponseIsNotOk(response[0], mockedResponse)
    expect(response[0].context.id).toEqual(schemaId)
    expect(response[0].context.targetApiKey).toEqual(apiKey)

    verifyAllResponsesAreOk(response.slice(1))
    verifyAllContext(response)
  })

  async function executeCopyAllUnsuccessfully(mockedResponse, numberOfExpectedResponses) {
    const response = await configManager.copy([apiKey], getInfoExpectedResponse(true))
    expect(response.length).toEqual(numberOfExpectedResponses)
    for (const resp of response) {
      CommonTestData.verifyResponseIsNotOk(resp, mockedResponse)
    }
    verifyAllContext(response)
  }

  function verifyAllContext(responses) {
    for (const response of responses) {
      expect(response.context.id).toBeDefined()
      expect(response.context.targetApiKey).toBeDefined()
    }
  }

  async function testSchemaOption(option, numberOfChildren) {
    const schemaOption = {
      id: 'schema',
      name: 'schema',
      value: false,
      branches: [
        {
          id: schemaId,
          name: schemaId,
          value: schemaId === option,
        },
        {
          id: profileId,
          name: profileId,
          value: profileId === option,
        },
        {
          id: subscriptionsId,
          name: subscriptionsId,
          value: subscriptionsId === option,
        },
      ],
    }
    const mockedDataCenterResponse = ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(numberOfChildren)
    axios
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: mockedDataCenterResponse })
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, option, apiKey) })
    if (numberOfChildren === 0) {
      axios.mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, option, apiKey) })
    }
    const response = await configManager.copy([apiKey], [schemaOption])
    expect(response.length).toEqual(1)
    verifyAllResponsesAreOk(response)
    verifyAllContext(response)
  }
})
