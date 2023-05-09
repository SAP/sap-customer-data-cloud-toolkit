import { credentials, expectedGigyaResponseInvalidAPI, expectedGigyaResponseOk, verifyAllResponsesAreOk } from '../../servicesDataTest'
import axios from 'axios'
import { getResponseWithContext } from '../dataTest'
import { getExpectedWebhookResponse, getWebhookExpectedBody } from './dataTest'
import Webhook from './webhook'
import { getSiteConfigSuccessfullyMultipleMember } from '../../configurator/dataTest'
import Options from '../options'

jest.mock('axios')

describe('Webhooks test suite', () => {
  const apiKey = 'apiKey'
  const webhookId = 'webhook'
  const dataCenterConfiguration = getSiteConfigSuccessfullyMultipleMember(1)
  const webhook = new Webhook(credentials, apiKey, dataCenterConfiguration.dataCenter)
  const webhookOptions = new Options({
    id: 'webhooks',
    name: 'webhooks',
    value: true,
    formatName: false,
    branches: [
      {
        id: getExpectedWebhookResponse().webhooks[0].name,
        name: getExpectedWebhookResponse().webhooks[0].name,
        value: true,
      },
      {
        id: getExpectedWebhookResponse().webhooks[1].name,
        name: getExpectedWebhookResponse().webhooks[1].name,
        value: true,
      },
    ],
  })

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('copy all webhooks successfully', async () => {
    const expectedWebhookResponse = getExpectedWebhookResponse()
    const serverResponse = expectedGigyaResponseOk
    let spy = jest.spyOn(webhook, 'set')
    axios
      .mockResolvedValueOnce({ data: expectedWebhookResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(serverResponse, expectedWebhookResponse.webhooks[0].name, apiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(serverResponse, expectedWebhookResponse.webhooks[1].name, apiKey) })
    const responses = await webhook.copy(apiKey, dataCenterConfiguration, webhookOptions)
    expect(responses.length).toBe(expectedWebhookResponse.webhooks.length)
    verifyAllResponsesAreOk(responses)

    expect(spy.mock.calls.length).toBe(expectedWebhookResponse.webhooks.length)
    expect(spy).toHaveBeenNthCalledWith(1, apiKey, dataCenterConfiguration.dataCenter, getWebhookExpectedBody(apiKey, 0))
    expect(spy).toHaveBeenNthCalledWith(2, apiKey, dataCenterConfiguration.dataCenter, getWebhookExpectedBody(apiKey, 1))
  })

  test('copy unsuccessfully - error on get', async () => {
    const mockedResponse = JSON.parse(JSON.stringify(expectedGigyaResponseInvalidAPI))
    mockedResponse.context = JSON.stringify({ id: webhookId, targetApiKey: apiKey })
    axios.mockResolvedValueOnce({ data: mockedResponse })

    const response = await webhook.copy(apiKey, dataCenterConfiguration, webhookOptions)
    expect(response).toEqual(mockedResponse)
    expect(response.context.id).toEqual(webhookId)
    expect(response.context.targetApiKey).toEqual(apiKey)
  })

  test('copy unsuccessfully - error on first set', async () => {
    let spy = jest.spyOn(webhook, 'set')
    const expectedWebhookResponse = getExpectedWebhookResponse()
    const context = `${webhookId}_${expectedWebhookResponse.webhooks[0].name}`
    const mockedResponse = JSON.parse(JSON.stringify(expectedGigyaResponseInvalidAPI))
    mockedResponse.context = JSON.stringify({ id: context, targetApiKey: apiKey })
    const responseOk = getResponseWithContext(expectedGigyaResponseOk, `${webhookId}_${expectedWebhookResponse.webhooks[1].name}`, apiKey)
    axios.mockResolvedValueOnce({ data: expectedWebhookResponse }).mockResolvedValueOnce({ data: mockedResponse }).mockResolvedValueOnce({ data: responseOk })

    const responses = await webhook.copy(apiKey, dataCenterConfiguration, webhookOptions)
    expect(responses.length).toBe(expectedWebhookResponse.webhooks.length)
    expect(responses[0]).toEqual(mockedResponse)
    expect(responses[0].context.id).toEqual(context)
    expect(responses[0].context.targetApiKey).toEqual(apiKey)
    expect(responses[1]).toEqual(responseOk)
    expect(responses[1].context.id).toEqual(`${webhookId}_${expectedWebhookResponse.webhooks[1].name}`)
    expect(responses[1].context.targetApiKey).toEqual(apiKey)

    expect(spy.mock.calls.length).toBe(expectedWebhookResponse.webhooks.length)
    expect(spy).toHaveBeenNthCalledWith(1, apiKey, dataCenterConfiguration.dataCenter, getWebhookExpectedBody(apiKey, 0))
    expect(spy).toHaveBeenNthCalledWith(2, apiKey, dataCenterConfiguration.dataCenter, getWebhookExpectedBody(apiKey, 1))
  })
})
