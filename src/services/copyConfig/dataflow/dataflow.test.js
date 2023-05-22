/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import { credentials, expectedGigyaResponseInvalidAPI, verifyAllResponsesAreOk, verifyResponseIsOk } from '../../servicesDataTest'
import axios from 'axios'
import { getResponseWithContext } from '../dataTest'
import { getSiteConfigSuccessfullyMultipleMember } from '../../configurator/dataTest'
import Options from '../options'
import {
  getEmptyDataflowResponse,
  getExpectedArgument,
  getExpectedCreateDataflowResponse,
  getExpectedSetDataflowResponse,
  getResponseDataflowHasNotChanged,
  getSearchDataflowsExpectedResponse,
} from './dataTest'
import Dataflow from './dataflow'

jest.mock('axios')

describe('Dataflows test suite', () => {
  const apiKey = 'apiKey'
  const dataflowId = 'dataflows'
  const dataCenterConfiguration = getSiteConfigSuccessfullyMultipleMember(1)
  const dataflow = new Dataflow(credentials, apiKey, dataCenterConfiguration.dataCenter)
  const dataflowOptions = new Options({
    id: dataflowId,
    name: dataflowId,
    value: true,
    formatName: false,
    branches: [
      {
        id: getSearchDataflowsExpectedResponse.result[0].name,
        name: getSearchDataflowsExpectedResponse.result[0].name,
        value: true,
      },
      {
        id: getSearchDataflowsExpectedResponse.result[1].name,
        name: getSearchDataflowsExpectedResponse.result[1].name,
        value: true,
        variables: [
          { variable: '{{hostname}}', value: 'hostname' },
          { variable: '{{username}}', value: 'username' },
          { variable: '{{mobile}}', value: 'mobile' },
          { variable: '{{phoneNumber}}', value: 'phoneNumber' },
          { variable: '{{userKey}}', value: 'userKey' },
          { variable: '{{accounts}}', value: 'accounts' },
          { variable: '{{wrapField}}', value: 'wrapField' },
          { variable: '{{injectValue}}', value: 'injectValue' },
        ],
      },
    ],
  })

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('copy all new dataflows successfully', async () => {
    await testSucessful(dataCenterConfiguration, 'create', getEmptyDataflowResponse(), [getExpectedCreateDataflowResponse(0), getExpectedCreateDataflowResponse(1)])
  })

  test('copy all existing dataflows successfully', async () => {
    await testSucessful(dataCenterConfiguration, 'set', getSearchDataflowsExpectedResponse, [getExpectedSetDataflowResponse(0), getExpectedSetDataflowResponse(1)])
  })

  test('copy all dataflows successfully without modifications', async () => {
    let spy = jest.spyOn(dataflow, 'set')
    axios
      .mockResolvedValueOnce({
        data: getResponseWithContext(getSearchDataflowsExpectedResponse, `${dataflowId}_search`, apiKey),
      })
      .mockResolvedValueOnce({
        data: getResponseWithContext(getEmptyDataflowResponse(), `${dataflowId}_search`, apiKey),
      })
      .mockResolvedValueOnce({
        data: getResponseWithContext(getSearchDataflowsExpectedResponse, `${dataflowId}_search`, apiKey),
      })
      .mockResolvedValueOnce({
        data: getResponseWithContext(getEmptyDataflowResponse(), `${dataflowId}_search`, apiKey),
      })
      .mockResolvedValueOnce({
        data: getResponseWithContext(getResponseDataflowHasNotChanged(), `${dataflowId}_${getSearchDataflowsExpectedResponse.result[0].name}`, apiKey),
      })
      .mockResolvedValueOnce({
        data: getResponseWithContext(getResponseDataflowHasNotChanged(), `${dataflowId}_${getSearchDataflowsExpectedResponse.result[1].name}`, apiKey),
      })

    const responses = await dataflow.copy(apiKey, dataCenterConfiguration, dataflowOptions)
    expect(responses.length).toBe(getSearchDataflowsExpectedResponse.result.length)
    responses.forEach((response) => {
      expect(response.statusCode).toEqual(200)
      expect(response.statusReason).toEqual('OK')
      expect(response.callId).toBeDefined()
      expect(response.time).toBeDefined()
      // error case
      expect(response.errorMessage).toEqual('Redundant Operation')
      expect(response.errorCode).toEqual(0)
      expect(response.errorDetails).toEqual('dataflow has not changed')
    })

    expect(spy.mock.calls.length).toBe(getSearchDataflowsExpectedResponse.result.length)
    expect(spy).toHaveBeenNthCalledWith(1, apiKey, dataCenterConfiguration.dataCenter, getExpectedArgument(0))
    expect(spy).toHaveBeenNthCalledWith(2, apiKey, dataCenterConfiguration.dataCenter, getExpectedArgument(1))
  })

  test('copy unsuccessfully - error on get dataflows from source site', async () => {
    await testErrorOnGet(false)
  })

  test('copy unsuccessfully - error on getting dataflows from destination site', async () => {
    await testErrorOnGet(true)
  })

  test('copy unsuccessfully - error on create', async () => {
    await testUnsucessful(dataCenterConfiguration, 'create', getEmptyDataflowResponse(), getExpectedCreateDataflowResponse(1))
  })

  test('copy unsuccessfully - error on set', async () => {
    await testUnsucessful(dataCenterConfiguration, 'set', getSearchDataflowsExpectedResponse, getExpectedSetDataflowResponse(1))
  })

  async function testSucessful(dataCenterConfiguration, methodSpied, destinationSiteDataflowsResponse, serverExpectedResponse) {
    let spy = jest.spyOn(dataflow, methodSpied)
    axios
      .mockResolvedValueOnce({
        data: getResponseWithContext(getSearchDataflowsExpectedResponse, `${dataflowId}_search`, apiKey),
      })
      .mockResolvedValueOnce({
        data: getResponseWithContext(getEmptyDataflowResponse(), `${dataflowId}_search`, apiKey),
      })
      .mockResolvedValueOnce({
        data: getResponseWithContext(destinationSiteDataflowsResponse, `${dataflowId}_search`, apiKey),
      })
      .mockResolvedValueOnce({
        data: getResponseWithContext(getEmptyDataflowResponse(), `${dataflowId}_search`, apiKey),
      })
      .mockResolvedValueOnce({
        data: getResponseWithContext(serverExpectedResponse[0], `${dataflowId}_${getSearchDataflowsExpectedResponse.result[0].name}`, apiKey),
      })
      .mockResolvedValueOnce({
        data: getResponseWithContext(serverExpectedResponse[1], `${dataflowId}_${getSearchDataflowsExpectedResponse.result[1].name}`, apiKey),
      })

    const responses = await dataflow.copy(apiKey, dataCenterConfiguration, dataflowOptions)
    expect(responses.length).toBe(getSearchDataflowsExpectedResponse.result.length)
    verifyAllResponsesAreOk(responses)

    expect(spy.mock.calls.length).toBe(getSearchDataflowsExpectedResponse.result.length)
    expect(spy).toHaveBeenNthCalledWith(1, apiKey, dataCenterConfiguration.dataCenter, getExpectedArgument(0))
    expect(spy).toHaveBeenNthCalledWith(2, apiKey, dataCenterConfiguration.dataCenter, getExpectedArgument(1))
  }

  async function testUnsucessful(dataCenterConfiguration, methodSpied, destinationSiteDataflowsResponse, serverExpectedResponse) {
    let spy = jest.spyOn(dataflow, methodSpied)
    const context = `${dataflowId}_${getSearchDataflowsExpectedResponse.result[0].name}`
    const mockedResponse = JSON.parse(JSON.stringify(expectedGigyaResponseInvalidAPI))
    mockedResponse.context = JSON.stringify({ id: context, targetApiKey: apiKey })
    axios
      .mockResolvedValueOnce({ data: getSearchDataflowsExpectedResponse })
      .mockResolvedValueOnce({ data: getEmptyDataflowResponse() })
      .mockResolvedValueOnce({ data: destinationSiteDataflowsResponse })
      .mockResolvedValueOnce({ data: getEmptyDataflowResponse() })
      .mockResolvedValueOnce({ data: mockedResponse })
      .mockResolvedValueOnce({ data: serverExpectedResponse })

    const responses = await dataflow.copy(apiKey, dataCenterConfiguration, dataflowOptions)
    expect(responses.length).toBe(getSearchDataflowsExpectedResponse.result.length)
    expect(responses[0]).toEqual(mockedResponse)
    expect(responses[0].context.id).toEqual(context)
    expect(responses[0].context.targetApiKey).toEqual(apiKey)
    expect(responses[1]).toEqual(serverExpectedResponse)
    expect(responses[1].context.id).toEqual(`${dataflowId}_${getSearchDataflowsExpectedResponse.result[1].name}`)
    expect(responses[1].context.targetApiKey).toEqual(apiKey)

    expect(spy.mock.calls.length).toBe(getSearchDataflowsExpectedResponse.result.length)
    expect(spy).toHaveBeenNthCalledWith(1, apiKey, dataCenterConfiguration.dataCenter, getExpectedArgument(0))
    expect(spy).toHaveBeenNthCalledWith(2, apiKey, dataCenterConfiguration.dataCenter, getExpectedArgument(1))
  }

  async function testErrorOnGet(testDestinationSite) {
    const mockedResponse = JSON.parse(JSON.stringify(expectedGigyaResponseInvalidAPI))
    mockedResponse.context = JSON.stringify({ id: dataflowId, targetApiKey: apiKey })
    if (testDestinationSite) {
      axios.mockResolvedValueOnce({ data: getSearchDataflowsExpectedResponse })
    }
    axios.mockResolvedValueOnce({ data: mockedResponse })

    const responses = await dataflow.copy(apiKey, dataCenterConfiguration, dataflowOptions)
    expect(responses.length).toBe(1)
    expect(responses[0]).toEqual(mockedResponse)
    expect(responses[0].context.id).toEqual(dataflowId)
    expect(responses[0].context.targetApiKey).toEqual(apiKey)
  }
})
