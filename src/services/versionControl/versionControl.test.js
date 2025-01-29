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
  const gitToken = 'testGitToken'
  const owner = 'testOwner'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should create VersionControl instance if gitToken is provided', () => {
    Cookies.get.mockReturnValue(gitToken)
    versionControl = new VersionControl(credentials, apiKey, siteInfo, gitToken, owner)
    expect(versionControl).toBeInstanceOf(VersionControl)
    expect(versionControl.gitToken).toBe(gitToken)
    expect(versionControl.owner).toBe(owner)
  })

  test('should not throw an error if gitToken is missing from cookies', () => {
    Cookies.get.mockReturnValue(undefined)
    expect(() => new VersionControl(credentials, apiKey, siteInfo, undefined, owner)).not.toThrow()
  })
})
