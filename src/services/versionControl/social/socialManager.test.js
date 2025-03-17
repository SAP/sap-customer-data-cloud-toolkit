import SocialManager from './socialManager'
import Social from '../../copyConfig/social/social'
import { stringToJson } from '../../copyConfig/objectHelper'

jest.mock('axios')
jest.mock('../../copyConfig/social/social')
jest.mock('../../copyConfig/objectHelper')

describe('SocialManager test suite', () => {
  const credentials = { userKey: 'testUserKey', secret: 'testSecret', gigyaConsole: 'testConsole' }
  const apiKey = 'testApiKey'
  const dataCenter = 'eu1'
  const socialManager = new SocialManager(credentials, apiKey, dataCenter)

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  test('setFromFiles - success scenario', async () => {
    const config = { someConfig: 'value' }
    const mockResponse = {
      context: '&quot;someContext&quot;',
      data: 'someData',
    }

    Social.prototype.set.mockResolvedValue(mockResponse)

    const response = await socialManager.setFromFiles(apiKey, dataCenter, config)

    expect(response).toEqual(mockResponse)
    expect(Social.prototype.set).toHaveBeenCalledWith(apiKey, config, dataCenter)
    expect(stringToJson).toHaveBeenCalledWith(mockResponse, 'context')
  })

  test('setFromFiles - error scenario', async () => {
    const config = { someConfig: 'value' }
    const mockError = new Error('Error setting social config')

    Social.prototype.set.mockRejectedValue(mockError)

    await expect(socialManager.setFromFiles(apiKey, dataCenter, config)).rejects.toThrow('Error setting social config')
    expect(Social.prototype.set).toHaveBeenCalledWith(apiKey, config, dataCenter)
    expect(console.error).toHaveBeenCalledWith('Error setting recaptcha config from Git:', mockError)
  })
})
