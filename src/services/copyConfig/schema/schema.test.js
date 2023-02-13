import Schema from './schema'
import * as CommonTestData from '../../servicesDataTest'
import {
  expectedSchemaResponse,
  getDataSchemaExpectedBodyForParentSite,
  getDataSchemaExpectedBodyForChildSiteStep1,
  getDataSchemaExpectedBodyForChildSiteStep2,
  getProfileSchemaExpectedBodyForChildSite,
  getProfileSchemaExpectedBodyForParentSite,
} from './dataTest'
import axios from 'axios'
import { expectedGigyaResponseInvalidAPI, expectedGigyaResponseOk } from '../../servicesDataTest'
import { getSiteConfigSuccessfullyMultipleMember } from '../../configurator/dataTest'
import { getExpectedResponseWithContext, getResponseWithContext, profileId, schemaId } from '../dataTest'

jest.mock('axios')

describe('Schema test suite', () => {
  const apiKey = 'apiKey'
  const dataCenterConfiguration = getSiteConfigSuccessfullyMultipleMember(1)
  const dataCenter = dataCenterConfiguration.dataCenter
  const schema = new Schema(CommonTestData.credentials, apiKey, dataCenter)

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('copy successfully to parent site', async () => {
    let spy = jest.spyOn(schema, 'set')
    axios
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, schemaId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, profileId, apiKey) })
    const responses = await schema.copy(apiKey, dataCenterConfiguration)
    expect(responses.length).toBe(2)
    expect(responses[0]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, schemaId, apiKey))
    expect(responses[1]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, profileId, apiKey))
    expect(responses[0].context.id).toEqual(schemaId)
    expect(responses[1].context.id).toEqual(profileId)
    expect(responses[0].context.targetApiKey).toEqual(apiKey)
    expect(responses[1].context.targetApiKey).toEqual(apiKey)

    expect(spy.mock.calls.length).toBe(2)
    expect(spy).toHaveBeenNthCalledWith(1, apiKey, dataCenter, getDataSchemaExpectedBodyForParentSite(apiKey))
    expect(spy).toHaveBeenNthCalledWith(2, apiKey, dataCenter, getProfileSchemaExpectedBodyForParentSite(apiKey))
  })

  test('copy successfully to child site', async () => {
    const dataCenterConfiguration = getSiteConfigSuccessfullyMultipleMember(0)
    let spy = jest.spyOn(schema, 'set')
    axios
      .mockResolvedValueOnce({ data: JSON.parse(JSON.stringify(expectedSchemaResponse)) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, schemaId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, schemaId, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, profileId, apiKey) })
    const responses = await schema.copy(apiKey, dataCenterConfiguration)
    expect(responses.length).toBe(2)
    expect(responses[1]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, schemaId, apiKey))
    expect(responses[0]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, profileId, apiKey))
    expect(responses[1].context.id).toEqual(schemaId)
    expect(responses[0].context.id).toEqual(profileId)
    expect(responses[1].context.targetApiKey).toEqual(apiKey)
    expect(responses[0].context.targetApiKey).toEqual(apiKey)

    expect(spy.mock.calls.length).toBe(3)
    expect(spy).toHaveBeenNthCalledWith(2, apiKey, dataCenter, getProfileSchemaExpectedBodyForChildSite(apiKey))
    expect(spy).toHaveBeenNthCalledWith(1, apiKey, dataCenter, getDataSchemaExpectedBodyForChildSiteStep1(apiKey))
    expect(spy).toHaveBeenNthCalledWith(3, apiKey, dataCenter, getDataSchemaExpectedBodyForChildSiteStep2(apiKey))
  })

  test('copy unsuccessfully - error on get', async () => {
    const mockedResponse = JSON.parse(JSON.stringify(expectedGigyaResponseInvalidAPI))
    mockedResponse.context = JSON.stringify({ id: 'schema', targetApiKey: apiKey })
    axios.mockResolvedValueOnce({ data: mockedResponse })

    const response = await schema.copy(apiKey, dataCenterConfiguration)
    expect(response).toEqual(mockedResponse)
    expect(response.context.id).toEqual('schema')
    expect(response.context.targetApiKey).toEqual(`${apiKey}`)
  })

  test('copy unsuccessfully - error on set data', async () => {
    const mockedDataResponse = getResponseWithContext(expectedGigyaResponseInvalidAPI, schemaId, apiKey)
    const mockedProfileResponse = getResponseWithContext(expectedGigyaResponseInvalidAPI, profileId, apiKey)
    axios.mockResolvedValueOnce({ data: expectedSchemaResponse }).mockResolvedValueOnce({ data: mockedDataResponse }).mockResolvedValueOnce({ data: mockedProfileResponse })
    const responses = await schema.copy(apiKey, dataCenterConfiguration)
    expect(responses[0]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseInvalidAPI, schemaId, apiKey))
    expect(responses[0].context.id).toEqual(`${schemaId}`)
    expect(responses[0].context.targetApiKey).toEqual(`${apiKey}`)
  })
})
