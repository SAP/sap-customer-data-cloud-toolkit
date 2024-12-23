/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import VersionControl from './versionControl'
import Cookies from 'js-cookie'

jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
}))

describe('VersionControl test suite', () => {
  let versionControl
  const credentials = { userKey: 'testUserKey', secret: 'testSecret' }
  const apiKey = 'testApiKey'
  const siteInfo = { dataCenter: 'testDataCenter' }

  beforeEach(() => {
    jest.clearAllMocks()
    Cookies.get.mockReturnValue('testGitToken')
  })

  test('should throw an error if gitToken is not available in cookies', () => {
    Cookies.get.mockReturnValue(undefined)
    expect(() => new VersionControl(credentials, apiKey, siteInfo)).toThrow('Git token is not available in cookies')
  })

  test('should create VersionControl instance if gitToken is available in cookies', () => {
    versionControl = new VersionControl(credentials, apiKey, siteInfo)
    expect(versionControl).toBeInstanceOf(VersionControl)
  })
})
