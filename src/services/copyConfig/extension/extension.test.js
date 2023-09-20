/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import { credentials, expectedGigyaResponseInvalidAPI, expectedGigyaResponseOk, verifyAllResponsesAreOk } from '../../servicesDataTest.js'
import axios from 'axios'
import { getResponseWithContext } from '../dataTest.js'
import { getSiteConfigSuccessfullyMultipleMember } from '../../configurator/dataTest.js'
import Options from '../options.js'
import Extension from './extension.js'
import { getChildExtensionExpectedBody, getEmptyExtensionResponse, getExpectedCreateExtensionResponse, getExpectedListExtensionResponse } from './dataTest.js'

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
        id: getExpectedListExtensionResponse().result[0].extensionPoint,
        name: getExpectedListExtensionResponse().result[0].extensionPoint,
        value: true,
      },
      {
        id: getExpectedListExtensionResponse().result[1].extensionPoint,
        name: getExpectedListExtensionResponse().result[1].extensionPoint,
        value: true,
      },
    ],
  })

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('copy all extensions successfully - create on parent site', async () => {
    await testOnParent(dataCenterConfiguration, 'create', getEmptyExtensionResponse(), getExpectedListExtensionResponse().result)
  })

  test('copy all extensions successfully - modify on parent site', async () => {
    await testOnParent(dataCenterConfiguration, 'set', getExpectedListExtensionResponse(), getExpectedListExtensionResponse().result)
  })

  test('copy all extensions successfully - create on child site', async () => {
    await testOnParent(getSiteConfigSuccessfullyMultipleMember(0), 'create', getEmptyExtensionResponse(), getExpectedListExtensionResponse().result)
  })

  test('copy all extensions successfully - modify on child site', async () => {
    await testOnParent(getSiteConfigSuccessfullyMultipleMember(0), 'set', getExpectedListExtensionResponse(), getChildExtensionExpectedBody(apiKey))
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
    axios.mockResolvedValueOnce({ data: getExpectedListExtensionResponse() }).mockResolvedValueOnce({ data: mockedResponse })

    const responses = await extension.copy(apiKey, dataCenterConfiguration, extensionOptions)
    expect(responses.length).toBe(1)
    expect(responses[0]).toEqual(mockedResponse)
    expect(responses[0].context.id).toEqual(extensionId)
    expect(responses[0].context.targetApiKey).toEqual(apiKey)
  })

  test('copy unsuccessfully - error on first modify on parent site', async () => {
    let spy = jest.spyOn(extension, 'set')
    const expectedExtensionResponse = getExpectedListExtensionResponse()
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
    expect(spy).toHaveBeenNthCalledWith(1, apiKey, dataCenterConfiguration.dataCenter, getExpectedListExtensionResponse().result[0])
    expect(spy).toHaveBeenNthCalledWith(2, apiKey, dataCenterConfiguration.dataCenter, getExpectedListExtensionResponse().result[1])
  })

  test('copy unsuccessfully - error on create on parent site', async () => {
    await testErrorCreateOnParentSite(false)
  })

  test('copy unsuccessfully - error on modify after create on parent site', async () => {
    await testErrorCreateOnParentSite(true)
  })

  test('copy unsuccessfully - error on first modify on child site', async () => {
    let spy = jest.spyOn(extension, 'set')
    const expectedExtensionResponse = getExpectedListExtensionResponse()
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
    const expectedExtensionResponse = getExpectedListExtensionResponse()
    let spy = jest.spyOn(extension, methodSpied)
    axios.mockResolvedValueOnce({ data: expectedExtensionResponse }).mockResolvedValueOnce({ data: destinationSiteExtensionsResponse })
    if (methodSpied === 'create') {
      axios
        .mockResolvedValueOnce({
          data: getResponseWithContext(getExpectedCreateExtensionResponse(0), `${extensionId}_${expectedExtensionResponse.result[0].extensionPoint}`, apiKey),
        })
        .mockResolvedValueOnce({
          data: getResponseWithContext(getExpectedCreateExtensionResponse(1), `${extensionId}_${expectedExtensionResponse.result[1].extensionPoint}`, apiKey),
        })
        .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, `${extensionId}_${expectedExtensionResponse.result[0].extensionPoint}`, apiKey) })
        .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, `${extensionId}_${expectedExtensionResponse.result[1].extensionPoint}`, apiKey) })
    } else {
      axios
        .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, `${extensionId}_${expectedExtensionResponse.result[0].extensionPoint}`, apiKey) })
        .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, `${extensionId}_${expectedExtensionResponse.result[1].extensionPoint}`, apiKey) })
    }

    const responses = await extension.copy(apiKey, dataCenterConfiguration, extensionOptions)
    expect(responses.length).toBe(expectedExtensionResponse.result.length)
    verifyAllResponsesAreOk(responses)

    expect(spy.mock.calls.length).toBe(expectedExtensionResponse.result.length)
    expect(spy).toHaveBeenNthCalledWith(1, apiKey, dataCenterConfiguration.dataCenter, extensionExpectedBodies[0])
    expect(spy).toHaveBeenNthCalledWith(2, apiKey, dataCenterConfiguration.dataCenter, extensionExpectedBodies[1])
  }

  async function testErrorCreateOnParentSite(errorOnModifyStep) {
    let spy = jest.spyOn(extension, 'create')
    const expectedExtensionResponse = getExpectedListExtensionResponse()
    const extensionOptionsOnlyOne = new Options(JSON.parse(JSON.stringify(extensionOptions.getOptions())))
    extensionOptionsOnlyOne.getOptions().branches[1].value = false
    const context = `${extensionId}_${expectedExtensionResponse.result[0].extensionPoint}`
    const mockedResponse = JSON.parse(JSON.stringify(expectedGigyaResponseInvalidAPI))
    mockedResponse.context = JSON.stringify({ id: context, targetApiKey: apiKey })
    axios.mockResolvedValueOnce({ data: expectedExtensionResponse }).mockResolvedValueOnce({ data: getEmptyExtensionResponse() })

    if (errorOnModifyStep) {
      axios.mockResolvedValueOnce({ data: getExpectedCreateExtensionResponse(0) })
    }
    axios.mockResolvedValueOnce({ data: mockedResponse })

    const responses = await extension.copy(apiKey, dataCenterConfiguration, extensionOptionsOnlyOne)
    expect(responses.length).toBe(expectedExtensionResponse.result.length - 1)
    expect(responses[0]).toEqual(mockedResponse)
    expect(responses[0].context.id).toEqual(context)
    expect(responses[0].context.targetApiKey).toEqual(apiKey)

    expect(spy.mock.calls.length).toBe(expectedExtensionResponse.result.length - 1)
    expect(spy).toHaveBeenNthCalledWith(1, apiKey, dataCenterConfiguration.dataCenter, getExpectedListExtensionResponse().result[0])
  }
})
