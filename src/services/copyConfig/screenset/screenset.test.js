import { credentials } from '../../servicesDataTest'
import { getExpectedScreenSetResponse, getScreenSetExpectedBody } from './dataTest'
import axios from 'axios'
import { expectedGigyaResponseInvalidAPI, expectedGigyaResponseOk } from '../../servicesDataTest'
import { getSiteConfigSuccessfullyMultipleMember } from '../../configurator/dataTest'
import { getExpectedResponseWithContext, getResponseWithContext } from '../dataTest'
import ScreenSet from './screenset'
import { getInfoExpectedResponse } from '../info/dataTest'
import Options from '../options'

jest.mock('axios')

describe('ScreenSets test suite', () => {
  const screenSetIndex = 3
  const apiKey = 'apiKey'
  const dataCenterConfiguration = getSiteConfigSuccessfullyMultipleMember(1)
  const dataCenter = dataCenterConfiguration.dataCenter
  const screenSet = new ScreenSet(credentials, apiKey, dataCenter)
  const screenSetId = getExpectedScreenSetResponse().screenSets[0].screenSetID
  const screenSetOptions = new Options(getInfoExpectedResponse(true)[screenSetIndex])

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('copy all screen sets successfully', async () => {
    const expectedScreenSetResponse = getExpectedScreenSetResponse()
    const serverResponse = expectedGigyaResponseOk
    let spy = jest.spyOn(screenSet, 'set')
    axios
      .mockResolvedValueOnce({ data: expectedScreenSetResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(serverResponse, expectedScreenSetResponse.screenSets[0].screenSetID, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(serverResponse, expectedScreenSetResponse.screenSets[1].screenSetID, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(serverResponse, expectedScreenSetResponse.screenSets[2].screenSetID, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(serverResponse, expectedScreenSetResponse.screenSets[3].screenSetID, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(serverResponse, expectedScreenSetResponse.screenSets[4].screenSetID, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(serverResponse, expectedScreenSetResponse.screenSets[5].screenSetID, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(serverResponse, expectedScreenSetResponse.screenSets[6].screenSetID, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(serverResponse, expectedScreenSetResponse.screenSets[7].screenSetID, apiKey) })
    const responses = await screenSet.copy(apiKey, dataCenterConfiguration, screenSetOptions)
    expect(responses.length).toBe(8)
    validateResponses(responses, serverResponse)

    expect(spy.mock.calls.length).toBe(8)
    expect(spy).toHaveBeenNthCalledWith(1, apiKey, dataCenter, getScreenSetExpectedBody(apiKey, 0))
    expect(spy).toHaveBeenNthCalledWith(2, apiKey, dataCenter, getScreenSetExpectedBody(apiKey, 1))
    expect(spy).toHaveBeenNthCalledWith(3, apiKey, dataCenter, getScreenSetExpectedBody(apiKey, 2))
    expect(spy).toHaveBeenNthCalledWith(4, apiKey, dataCenter, getScreenSetExpectedBody(apiKey, 3))
    expect(spy).toHaveBeenNthCalledWith(5, apiKey, dataCenter, getScreenSetExpectedBody(apiKey, 4))
    expect(spy).toHaveBeenNthCalledWith(6, apiKey, dataCenter, getScreenSetExpectedBody(apiKey, 5))
    expect(spy).toHaveBeenNthCalledWith(7, apiKey, dataCenter, getScreenSetExpectedBody(apiKey, 6))
    expect(spy).toHaveBeenNthCalledWith(8, apiKey, dataCenter, getScreenSetExpectedBody(apiKey, 7))
  })

  test('copy unsuccessfully - error on get', async () => {
    const mockedResponse = JSON.parse(JSON.stringify(expectedGigyaResponseInvalidAPI))
    mockedResponse.context = JSON.stringify({ id: screenSetId, targetApiKey: apiKey })
    axios.mockResolvedValueOnce({ data: mockedResponse })

    const response = await screenSet.copy(apiKey, dataCenterConfiguration, screenSetOptions)
    expect(response).toEqual(mockedResponse)
    expect(response.context.id).toEqual(screenSetId)
    expect(response.context.targetApiKey).toEqual(apiKey)
  })

  test('copy unsuccessfully - error on set data', async () => {
    const expectedScreenSetResponse = getExpectedScreenSetResponse()
    const serverResponse = expectedGigyaResponseInvalidAPI
    axios
      .mockResolvedValueOnce({ data: expectedScreenSetResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(serverResponse, expectedScreenSetResponse.screenSets[0].screenSetID, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(serverResponse, expectedScreenSetResponse.screenSets[1].screenSetID, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(serverResponse, expectedScreenSetResponse.screenSets[2].screenSetID, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(serverResponse, expectedScreenSetResponse.screenSets[3].screenSetID, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(serverResponse, expectedScreenSetResponse.screenSets[4].screenSetID, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(serverResponse, expectedScreenSetResponse.screenSets[5].screenSetID, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(serverResponse, expectedScreenSetResponse.screenSets[6].screenSetID, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(serverResponse, expectedScreenSetResponse.screenSets[7].screenSetID, apiKey) })
    const responses = await screenSet.copy(apiKey, dataCenterConfiguration, screenSetOptions)
    validateResponses(responses, serverResponse)
  })

  test('copy single screenset successfully', async () => {
    const screenSetSingleOptions = new Options(getInfoExpectedResponse(false)[screenSetIndex])
    screenSetSingleOptions.getOptions().branches[0].branches[0].value = true
    let spy = jest.spyOn(screenSet, 'set')
    axios.mockResolvedValueOnce({ data: getExpectedScreenSetResponse() }).mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
    const responses = await screenSet.copy(apiKey, dataCenterConfiguration, screenSetSingleOptions)
    expect(responses.length).toBe(1)
    expect(responses[0]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey))
    expect(responses[0].context.id).toEqual(screenSetId)
    expect(responses[0].context.targetApiKey).toEqual(apiKey)

    expect(spy.mock.calls.length).toBe(1)
    expect(spy).toHaveBeenNthCalledWith(1, apiKey, dataCenter, getScreenSetExpectedBody(apiKey, 0))
  })

  function validateResponses(responses, expectedResponse) {
    for (let i = 0; i < responses.length; ++i) {
      const screenSetId = getExpectedScreenSetResponse().screenSets[i].screenSetID
      expect(responses[i]).toEqual(getExpectedResponseWithContext(expectedResponse, screenSetId, apiKey))
      expect(responses[i].context.id).toEqual(screenSetId)
      expect(responses[i].context.targetApiKey).toEqual(apiKey)
    }
  }
})
