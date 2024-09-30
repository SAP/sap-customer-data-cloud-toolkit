import Policy from './policy.js'
import axios from 'axios'
import { expectedGetRbaPolicyResponseOk } from './dataTest.js'
import { credentials, expectedGigyaResponseInvalidAPI, expectedGigyaResponseOk } from '../../servicesDataTest.js'
import client from '../../gigya/client.js'

jest.mock('axios')

describe('User sites test suite', () => {
  const dataCenter = 'eu1'
  const apiKey = 'apiKey'
  const rbaPolicy = { key: 'value' }

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('get rba policy successfully', async () => {
    axios.mockResolvedValueOnce({ data: expectedGetRbaPolicyResponseOk })

    const policy = new Policy(credentials, apiKey, dataCenter)
    const response = await policy.get()
    expect(response).toBe(expectedGetRbaPolicyResponseOk)
  })

  test('get rba policy unsuccessfully', async () => {
    axios.mockResolvedValueOnce({ data: expectedGigyaResponseInvalidAPI })

    const policy = new Policy(credentials, apiKey, dataCenter)
    const response = await policy.get()
    expect(response).toBe(expectedGigyaResponseInvalidAPI)
  })

  test('set rba policy successfully', async () => {
    const payload = {
      apiKey: apiKey,
      context: JSON.stringify({ id: Policy.CONTEXT_ID, targetApiKey: apiKey }),
      secret: credentials.secret,
      userKey: credentials.userKey,
      policy: JSON.stringify(rbaPolicy),
    }
    const spy = jest.spyOn(client, 'post')
    axios.mockResolvedValueOnce({ data: expectedGigyaResponseOk })

    const policy = new Policy(credentials, apiKey, dataCenter)
    const response = await policy.set(apiKey, { policy: rbaPolicy }, dataCenter)
    expect(response).toBe(expectedGigyaResponseOk)
    expect(spy).toHaveBeenCalledWith(`https://accounts.${dataCenter}.gigya.com/accounts.rba.setPolicy`, payload)
  })

  test('set rba policy unsuccessfully', async () => {
    axios.mockResolvedValueOnce({ data: expectedGigyaResponseInvalidAPI })

    const policy = new Policy(credentials, apiKey, dataCenter)
    const response = await policy.set(apiKey, { policy: rbaPolicy }, dataCenter)
    expect(response).toBe(expectedGigyaResponseInvalidAPI)
  })
})
