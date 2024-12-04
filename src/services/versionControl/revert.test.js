import axios from 'axios'
import VersionControl from './versionControl'

jest.mock('axios')
jest.mock('@octokit/rest')

describe('Revert', () => {
  let versionControl
  const credentials = { userKey: 'testUserKey', secret: 'testSecret' }
  const apiKey = 'testApiKey'
  const siteInfo = { dataCenter: 'testDataCenter' }

  const mockCommitFiles = [
    { filename: 'src/versionControl/webSdk.json', content: JSON.stringify({ someProp: 'someValue for WebsdK' }), contents_url: 'test-url-webSdk' },
    { filename: 'src/versionControl/emails.json', content: JSON.stringify({ someProp: 'someValue for EmailTemplates' }), contents_url: 'test-url-emails' },
    { filename: 'src/versionControl/extension.json', content: JSON.stringify({ someProp: 'someValue for Extension' }), contents_url: 'test-url-extension' },
    { filename: 'src/versionControl/policies.json', content: JSON.stringify({ someProp: 'someValue for Policies' }), contents_url: 'test-url-policies' },
    { filename: 'src/versionControl/rba.json', content: JSON.stringify({ someProp: 'someValue for RBA' }), contents_url: 'test-url-rba' },
    { filename: 'src/versionControl/sets.json', content: JSON.stringify({ someProp: 'someValue for ScreenSets' }), contents_url: 'test-url-sets' },
    { filename: 'src/versionControl/sms.json', content: JSON.stringify({ someProp: 'someValue for SMS' }), contents_url: 'test-url-sms' },
    { filename: 'src/versionControl/schema.json', content: JSON.stringify({ someProp: 'someValue for Schema' }), contents_url: 'test-url-schema' },
  ]

  beforeEach(() => {
    versionControl = new VersionControl(credentials, apiKey, siteInfo)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('applyCommitConfig works correctly', async () => {
    jest.spyOn(versionControl, 'getCommitFiles').mockResolvedValue(mockCommitFiles.map((file) => ({ ...file, content: JSON.parse(file.content) })))

    const configApplyMocks = ['setWebSDK', 'setEmailTemplates', 'setExtension', 'setPolicies', 'setRBA', 'setScreenSets', 'setSMS', 'setSchema'].reduce((acc, method) => {
      acc[method] = jest.spyOn(versionControl, method).mockResolvedValue()
      return acc
    }, {})

    const sha = 'testSha'
    await versionControl.applyCommitConfig(sha)

    expect(versionControl.getCommitFiles).toHaveBeenCalledWith(sha)
    expect(versionControl.getCommitFiles).toHaveBeenCalledTimes(1)

    const paramsByFilename = {
      webSdk: { someProp: 'someValue for WebsdK' },
      emails: { someProp: 'someValue for EmailTemplates' },
      extension: { someProp: 'someValue for Extension' },
      policies: { someProp: 'someValue for Policies' },
      rba: { someProp: 'someValue for RBA' },
      sets: { someProp: 'someValue for ScreenSets' },
      sms: { someProp: 'someValue for SMS' },
      schema: { someProp: 'someValue for Schema' },
    }

    Object.keys(configApplyMocks).forEach((method, index) => {
      const { filename } = mockCommitFiles[index]
      const [type] = filename.split('/').slice(-1)
      expect(configApplyMocks[method]).toHaveBeenCalledWith(paramsByFilename[type.split('.')[0]])
      expect(configApplyMocks[method]).toHaveBeenCalledTimes(1)
    })
  })

  test('applyCommitConfig handles missing filenames', async () => {
    const incompleteCommitFiles = [{ filename: 'src/versionControl/unknownFile.json', content: '{}' }]

    jest.spyOn(versionControl, 'getCommitFiles').mockResolvedValue(incompleteCommitFiles.map((file) => ({ ...file, content: JSON.parse(file.content) })))

    const configApplyMocks = ['setWebSDK', 'setSMS', 'setExtension', 'setPolicies', 'setSchema', 'setScreenSets', 'setRBA', 'setEmailTemplates'].reduce((acc, method) => {
      acc[method] = jest.spyOn(versionControl, method).mockResolvedValue()
      return acc
    }, {})

    await versionControl.applyCommitConfig('someSha')

    Object.keys(configApplyMocks).forEach((method) => {
      expect(configApplyMocks[method]).not.toHaveBeenCalled()
    })
  })
})
