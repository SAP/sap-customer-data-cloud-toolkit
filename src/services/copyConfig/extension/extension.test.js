import { credentials, expectedGigyaResponseInvalidAPI, expectedGigyaResponseOk, verifyAllResponsesAreOk } from '../../servicesDataTest'
import axios from 'axios'
import { getResponseWithContext } from '../dataTest'
import { getSiteConfigSuccessfullyMultipleMember } from '../../configurator/dataTest'
import Options from '../options'
import Extension from './extension'
import { getChildExtensionExpectedBody, getEmptyExtensionResponse, getExpectedExtensionResponse } from './dataTest'

jest.mock('axios')

describe('Extensions test suite', () => {
  const apiKey = 'apiKey'
  const extensionId = 'extensions'
  const dataCenterConfiguration = getSiteConfigSuccessfullyMultipleMember(1)
  const extension = new Extension(credentials, apiKey, dataCenterConfiguration.dataCenter)
  const extensionOptions = new Options({
    id: extensionId,
    name: extensionId,
    value: true,
    formatName: false,
    branches: [
      {
        id: getExpectedExtensionResponse().result[0].extensionPoint,
        name: getExpectedExtensionResponse().result[0].extensionPoint,
        value: true,
      },
      {
        id: getExpectedExtensionResponse().result[1].extensionPoint,
        name: getExpectedExtensionResponse().result[1].extensionPoint,
        value: true,
      },
    ],
  })

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('copy all extensions successfully - create on parent site', async () => {
    await testOnParent(dataCenterConfiguration, 'create', getEmptyExtensionResponse(), getExpectedExtensionResponse().result)
  })

  test('copy all extensions successfully - set on parent site', async () => {
    await testOnParent(dataCenterConfiguration, 'set', getExpectedExtensionResponse(), getExpectedExtensionResponse().result)
  })

  test('copy all extensions successfully - create on child site', async () => {
    await testOnParent(getSiteConfigSuccessfullyMultipleMember(0), 'create', getEmptyExtensionResponse(), getExpectedExtensionResponse().result)
  })

  test('copy all extensions successfully - set on child site', async () => {
    await testOnParent(getSiteConfigSuccessfullyMultipleMember(0), 'set', getExpectedExtensionResponse(), getChildExtensionExpectedBody(apiKey))
  })

  test('copy unsuccessfully - error on get extensions from source site', async () => {
    const mockedResponse = JSON.parse(JSON.stringify(expectedGigyaResponseInvalidAPI))
    mockedResponse.context = JSON.stringify({ id: extensionId, targetApiKey: apiKey })
    axios.mockResolvedValueOnce({ data: mockedResponse })

    const response = await extension.copy(apiKey, dataCenterConfiguration, extensionOptions)
    expect(response).toEqual(mockedResponse)
    expect(response.context.id).toEqual(extensionId)
    expect(response.context.targetApiKey).toEqual(apiKey)
  })

  test('copy unsuccessfully - error on get extensions from destination site', async () => {
    const mockedResponse = JSON.parse(JSON.stringify(expectedGigyaResponseInvalidAPI))
    mockedResponse.context = JSON.stringify({ id: extensionId, targetApiKey: apiKey })
    axios.mockResolvedValueOnce({ data: getExpectedExtensionResponse() }).mockResolvedValueOnce({ data: mockedResponse })

    const responses = await extension.copy(apiKey, dataCenterConfiguration, extensionOptions)
    expect(responses.length).toBe(1)
    expect(responses[0]).toEqual(mockedResponse)
    expect(responses[0].context.id).toEqual(extensionId)
    expect(responses[0].context.targetApiKey).toEqual(apiKey)
  })

  test('copy unsuccessfully - error on first set on parent site', async () => {
    let spy = jest.spyOn(extension, 'set')
    const expectedExtensionResponse = getExpectedExtensionResponse()
    const context = `${extensionId}_${expectedExtensionResponse.result[0].extensionPoint}`
    const mockedResponse = JSON.parse(JSON.stringify(expectedGigyaResponseInvalidAPI))
    mockedResponse.context = JSON.stringify({ id: context, targetApiKey: apiKey })
    const responseOk = getResponseWithContext(expectedGigyaResponseOk, `${extensionId}_${expectedExtensionResponse.result[1].extensionPoint}`, apiKey)
    axios
      .mockResolvedValueOnce({ data: expectedExtensionResponse })
      .mockResolvedValueOnce({ data: expectedExtensionResponse })
      .mockResolvedValueOnce({ data: mockedResponse })
      .mockResolvedValueOnce({ data: responseOk })

    const responses = await extension.copy(apiKey, dataCenterConfiguration, extensionOptions)
    expect(responses.length).toBe(expectedExtensionResponse.result.length)
    expect(responses[0]).toEqual(mockedResponse)
    expect(responses[0].context.id).toEqual(context)
    expect(responses[0].context.targetApiKey).toEqual(apiKey)
    expect(responses[1]).toEqual(responseOk)
    expect(responses[1].context.id).toEqual(`${extensionId}_${expectedExtensionResponse.result[1].extensionPoint}`)
    expect(responses[1].context.targetApiKey).toEqual(apiKey)

    expect(spy.mock.calls.length).toBe(expectedExtensionResponse.result.length)
    expect(spy).toHaveBeenNthCalledWith(1, apiKey, dataCenterConfiguration.dataCenter, getExpectedExtensionResponse().result[0])
    expect(spy).toHaveBeenNthCalledWith(2, apiKey, dataCenterConfiguration.dataCenter, getExpectedExtensionResponse().result[1])
  })

  test('copy unsuccessfully - error on first set on child site', async () => {
    let spy = jest.spyOn(extension, 'set')
    const expectedExtensionResponse = getExpectedExtensionResponse()
    const context = `${extensionId}_${expectedExtensionResponse.result[0].extensionPoint}`
    const mockedResponse = JSON.parse(JSON.stringify(expectedGigyaResponseInvalidAPI))
    mockedResponse.context = JSON.stringify({ id: context, targetApiKey: apiKey })
    const responseOk = getResponseWithContext(expectedGigyaResponseOk, `${extensionId}_${expectedExtensionResponse.result[1].extensionPoint}`, apiKey)
    axios
      .mockResolvedValueOnce({ data: expectedExtensionResponse })
      .mockResolvedValueOnce({ data: expectedExtensionResponse })
      .mockResolvedValueOnce({ data: mockedResponse })
      .mockResolvedValueOnce({ data: responseOk })

    const responses = await extension.copy(apiKey, getSiteConfigSuccessfullyMultipleMember(0), extensionOptions)
    expect(responses.length).toBe(expectedExtensionResponse.result.length)
    expect(responses[0]).toEqual(mockedResponse)
    expect(responses[0].context.id).toEqual(context)
    expect(responses[0].context.targetApiKey).toEqual(apiKey)
    expect(responses[1]).toEqual(responseOk)
    expect(responses[1].context.id).toEqual(`${extensionId}_${expectedExtensionResponse.result[1].extensionPoint}`)
    expect(responses[1].context.targetApiKey).toEqual(apiKey)

    expect(spy.mock.calls.length).toBe(expectedExtensionResponse.result.length)
    expect(spy).toHaveBeenNthCalledWith(1, apiKey, dataCenterConfiguration.dataCenter, getChildExtensionExpectedBody(apiKey)[0])
    expect(spy).toHaveBeenNthCalledWith(2, apiKey, dataCenterConfiguration.dataCenter, getChildExtensionExpectedBody(apiKey)[1])
  })

  async function testOnParent(dataCenterConfiguration, methodSpied, destinationSiteExtensionsResponse, extensionExpectedBodies) {
    const expectedExtensionResponse = getExpectedExtensionResponse()
    const serverResponse = expectedGigyaResponseOk
    let spy = jest.spyOn(extension, methodSpied)
    axios
      .mockResolvedValueOnce({ data: expectedExtensionResponse })
      .mockResolvedValueOnce({ data: destinationSiteExtensionsResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(serverResponse, `${extensionId}_${expectedExtensionResponse.result[0].extensionPoint}`, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(serverResponse, `${extensionId}_${expectedExtensionResponse.result[1].extensionPoint}`, apiKey) })
    const responses = await extension.copy(apiKey, dataCenterConfiguration, extensionOptions)
    expect(responses.length).toBe(expectedExtensionResponse.result.length)
    verifyAllResponsesAreOk(responses)

    expect(spy.mock.calls.length).toBe(expectedExtensionResponse.result.length)
    expect(spy).toHaveBeenNthCalledWith(1, apiKey, dataCenterConfiguration.dataCenter, extensionExpectedBodies[0])
    expect(spy).toHaveBeenNthCalledWith(2, apiKey, dataCenterConfiguration.dataCenter, extensionExpectedBodies[1])
  }
})
