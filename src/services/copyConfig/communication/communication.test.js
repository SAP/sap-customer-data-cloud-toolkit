import axios from 'axios'
import { credentials, expectedGigyaResponseInvalidAPI, expectedGigyaResponseOk, verifyResponseIsNotOk, verifyResponseIsOk } from '../../servicesDataTest'
import { getResponseWithContext } from '../dataTest'
import { channelsExpectedResponse, topicsExpectedResponse } from './dataTest'
import Communication from './communication'
import CommunicationOptions from './communicationOptions'

jest.mock('axios')

describe('Communication test suite', () => {
  const apiKey = 'apiKey'
  const dataCenter = 'eu1'
  const communication = new Communication(credentials, apiKey, dataCenter)
  const communicationOptions = new CommunicationOptions()

  test('nothing to copy', async () => {
    const responses = await communication.copy(apiKey, { dataCenter }, communicationOptions.getOptionsDisabled())
    expect(responses.length).toEqual(0)
  })

  test('copy successfully to parent site', async () => {
    axios
      .mockResolvedValueOnce({ data: channelsExpectedResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'communication_channel_SMS', apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'communication_channel_WiFi', apiKey) })
      .mockResolvedValueOnce({ data: topicsExpectedResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'communication_topic_NoTax_SMS', apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'communication_topic_NoTax_WiFi', apiKey) })

    const responses = await communication.copy(apiKey, { dataCenter }, communicationOptions.getOptions())
    expect(responses.length).toEqual(4)
    responses.forEach((response) => {
      verifyResponseIsOk(response)
      expect(response.context.targetApiKey).toEqual(`${apiKey}`)
      expect(response.context.id.startsWith('communication_')).toBeTruthy()
    })
  })

  test('copy successfully to child site', async () => {
    axios
      .mockResolvedValueOnce({ data: topicsExpectedResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'communication_topic_NoTax_SMS', apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'communication_topic_NoTax_WiFi', apiKey) })

    const responses = await communication.copy(apiKey, { dataCenter, siteGroupOwner: apiKey + 'x' }, communicationOptions.getOptions())
    expect(responses.length).toEqual(2)
    responses.forEach((response) => {
      verifyResponseIsOk(response)
      expect(response.context.targetApiKey).toEqual(`${apiKey}`)
      expect(response.context.id.startsWith('communication_topic_')).toBeTruthy()
    })
  })

  test('copy unsuccessfully - error on get', async () => {
    const mockedResponse = getResponseWithContext(expectedGigyaResponseInvalidAPI, 'communication_channel_get', apiKey)
    axios
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, 'communication_channel_get', apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, 'communication_topic_get', apiKey) })

    const responses = await communication.copy(apiKey, { dataCenter }, communicationOptions.getOptions())
    expect(responses.length).toEqual(2)
    verifyResponseIsNotOk(responses[0], expectedGigyaResponseInvalidAPI)
    expect(responses[0].context.targetApiKey).toEqual(`${apiKey}`)
    expect(responses[0].context.id).toEqual('communication_channel_get')
    verifyResponseIsNotOk(responses[1], expectedGigyaResponseInvalidAPI)
    expect(responses[1].context.targetApiKey).toEqual(`${apiKey}`)
    expect(responses[1].context.id).toEqual('communication_topic_get')
  })

  test('copy unsuccessfully - error on set', async () => {
    axios
      .mockResolvedValueOnce({ data: channelsExpectedResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, 'communication_channel_SMS', apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'communication_channel_WiFi', apiKey) })
      .mockResolvedValueOnce({ data: topicsExpectedResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseInvalidAPI, 'communication_topic_NoTax_SMS', apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(expectedGigyaResponseOk, 'communication_topic_NoTax_WiFi', apiKey) })

    const responses = await communication.copy(apiKey, { dataCenter }, communicationOptions.getOptions())
    expect(responses.length).toEqual(4)

    verifyResponseIsNotOk(responses[0], expectedGigyaResponseInvalidAPI)
    expect(responses[0].context.targetApiKey).toEqual(`${apiKey}`)
    expect(responses[0].context.id).toEqual('communication_channel_SMS')
    verifyResponseIsOk(responses[1])
    expect(responses[1].context.targetApiKey).toEqual(`${apiKey}`)
    expect(responses[1].context.id).toEqual('communication_channel_WiFi')
    verifyResponseIsNotOk(responses[2], expectedGigyaResponseInvalidAPI)
    expect(responses[2].context.targetApiKey).toEqual(`${apiKey}`)
    expect(responses[2].context.id).toEqual('communication_topic_NoTax_SMS')
    verifyResponseIsOk(responses[3])
    expect(responses[3].context.targetApiKey).toEqual(`${apiKey}`)
    expect(responses[3].context.id).toEqual('communication_topic_NoTax_WiFi')
  })
})
