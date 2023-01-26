import Info from './info'
import * as CommonTestData from '../../servicesDataTest'
import { getInfoExpectedResponse } from './dataTest'

describe('Info test suite', () => {
  const apiKey = 'apiKey'
  const info = new Info(CommonTestData.credentials, apiKey, 'eu1')

  test('get info successfully', async () => {
    const response = await info.get()
    //console.log('response=' + JSON.stringify(response))
    expect(response).toEqual(getInfoExpectedResponse(true))
  })
})
