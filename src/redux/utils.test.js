import * as data from '../redux/emails/testData'
import { getApiKey } from './utils'

describe('Redux utils test suite', () => {
  test('should get API Key from URL', () => {
    expect(getApiKey(data.testHash)).toEqual(data.testAPIKey)
    expect(getApiKey('')).toEqual('')
  })
})
