import { credentials } from '../../servicesDataTest'
import { expectedScreenSetResponse, getScreenSetExpectedBody } from './dataTest'
import axios from 'axios'
import { expectedGigyaResponseInvalidAPI, expectedGigyaResponseOk } from '../../servicesDataTest'
import { getSiteConfigSuccessfullyMultipleMember } from '../../configurator/dataTest'
import { getExpectedResponseWithContext, getResponseWithContext } from '../dataTest'
import ScreenSet from './screenset'

jest.mock('axios')

describe('ScreenSets test suite', () => {
  const apiKey = 'apiKey'
  const dataCenterConfiguration = getSiteConfigSuccessfullyMultipleMember(1)
  const dataCenter = dataCenterConfiguration.dataCenter
  const screenSet = new ScreenSet(credentials, apiKey, dataCenter)
  const screenSetId = expectedScreenSetResponse.screenSets[0].screenSetID
  const screenSetOptions = { branches: [{ id: screenSetId, name: screenSetId, value: true }] }

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('copy successfully to parent site', async () => {
    let spy = jest.spyOn(screenSet, 'set')
    axios.mockResolvedValueOnce({ data: expectedScreenSetResponse }).mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey) })
    const responses = await screenSet.copy(apiKey, dataCenterConfiguration, screenSetOptions)
    expect(responses.length).toBe(1)
    expect(responses[0]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseOk, screenSetId, apiKey))
    expect(responses[0].context.id).toEqual(screenSetId)
    expect(responses[0].context.targetApiKey).toEqual(apiKey)

    expect(spy.mock.calls.length).toBe(1)
    expect(spy).toHaveBeenNthCalledWith(1, apiKey, dataCenter, getScreenSetExpectedBody(apiKey))
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
    const mockedDataResponse = getResponseWithContext(expectedGigyaResponseInvalidAPI, screenSetId, apiKey)
    axios.mockResolvedValueOnce({ data: expectedScreenSetResponse }).mockResolvedValueOnce({ data: mockedDataResponse })
    const responses = await screenSet.copy(apiKey, dataCenterConfiguration, screenSetOptions)
    expect(responses[0]).toEqual(getExpectedResponseWithContext(expectedGigyaResponseInvalidAPI, screenSetId, apiKey))
    expect(responses[0].context.id).toEqual(screenSetId)
    expect(responses[0].context.targetApiKey).toEqual(apiKey)
  })
})
