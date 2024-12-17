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

describe('Revert', () => {
  const credentials = { userKey: 'testUserKey', secret: 'testSecret', gigyaConsole: 'testConsole' }
  const apiKey = 'testApiKey'
  const currentSite = { dataCenter: 'testDataCenter' }
  let versionControl

  beforeEach(() => {
    jest.clearAllMocks()
    Cookies.get.mockReturnValue('testGitToken')
    versionControl = new VersionControl(credentials, apiKey, currentSite)
  })

  test('applyCommitConfig works correctly', async () => {
    const commitSha = 'testSha'
    const files = [
      { filename: 'src/versionControl/emails.json', contents_url: 'test-url-emails' },
      { filename: 'src/versionControl/sms.json', contents_url: 'test-url-sms' },
    ]

    versionControl.getCommitFiles = jest.fn().mockResolvedValue(files)
    versionControl.setEmailTemplates = jest.fn()
    versionControl.setSMS = jest.fn()

    await versionControl.applyCommitConfig(commitSha)

    expect(versionControl.getCommitFiles).toHaveBeenCalledWith(commitSha)
    expect(versionControl.setEmailTemplates).toHaveBeenCalled()
    expect(versionControl.setSMS).toHaveBeenCalled()
  })

  test('applyCommitConfig handles missing filenames', async () => {
    const commitSha = 'testSha'
    const files = []

    versionControl.getCommitFiles = jest.fn().mockResolvedValue(files)
    versionControl.setEmailTemplates = jest.fn()
    versionControl.setSMS = jest.fn()

    await versionControl.applyCommitConfig(commitSha)

    expect(versionControl.getCommitFiles).toHaveBeenCalledWith(commitSha)
    expect(versionControl.setEmailTemplates).not.toHaveBeenCalled()
    expect(versionControl.setSMS).not.toHaveBeenCalled()
  })
})
