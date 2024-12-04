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
    {
      content: JSON.stringify({ someProp: 'someValue for WebsdK' }),
      contents_url: 'test-url',
      filename: 'src/versionControl/webSdk.json',
    },
    {
      content: JSON.stringify({ someProp: 'someValue for EmailTemplates' }),
      contents_url: 'test-url',
      filename: 'src/versionControl/emails.json',
    },
    {
      content: JSON.stringify({ someProp: 'someValue for Extension' }),
      contents_url: 'test-url',
      filename: 'src/versionControl/extension.json',
    },
    {
      content: JSON.stringify({ someProp: 'someValue for Policies' }),
      contents_url: 'test-url',
      filename: 'src/versionControl/policies.json',
    },
    {
      content: JSON.stringify({ someProp: 'someValue for RBA' }),
      contents_url: 'test-url',
      filename: 'src/versionControl/rba.json',
    },
    {
      content: JSON.stringify({ someProp: 'someValue for ScreenSets' }),
      contents_url: 'test-url',
      filename: 'src/versionControl/sets.json',
    },
    {
      content: JSON.stringify({ someProp: 'someValue for SMS' }),
      contents_url: 'test-url',
      filename: 'src/versionControl/sms.json',
    },
    {
      content: JSON.stringify({ someProp: 'someValue for Schema' }),
      contents_url: 'test-url',
      filename: 'src/versionControl/schema.json',
    },
  ]

  beforeEach(() => {
    // Initialize VersionControl
    versionControl = new VersionControl(credentials, apiKey, siteInfo)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Revert Flow', async () => {
    let spyGetCommitFiles = jest.spyOn(versionControl, 'getCommitFiles').mockResolvedValue(
      mockCommitFiles.map((file) => ({
        ...file,
        content: JSON.parse(file.content), // Ensure `content` is parsed
      })),
    )

    let spySetWebSDK = jest.spyOn(versionControl, 'setWebSDK').mockResolvedValue()
    let spySetSMS = jest.spyOn(versionControl, 'setSMS').mockResolvedValue()
    let spySetExtension = jest.spyOn(versionControl, 'setExtension').mockResolvedValue()
    let spySetPolicies = jest.spyOn(versionControl, 'setPolicies').mockResolvedValue()
    let spySetSchema = jest.spyOn(versionControl, 'setSchema').mockResolvedValue()
    let spySetScreenSets = jest.spyOn(versionControl, 'setScreenSets').mockResolvedValue()
    let spySetRBA = jest.spyOn(versionControl, 'setRBA').mockResolvedValue()
    let spySetEmailTemplates = jest.spyOn(versionControl, 'setEmailTemplates').mockResolvedValue()

    const sha = 'cd082512618469bda1afb8eebc4c1692d3d50b05'
    await versionControl.applyCommitConfig(sha)

    // Validate that getCommitFiles and setWebSDK were called with expected args

    expect(spyGetCommitFiles).toHaveBeenCalledWith(sha)
    expect(spyGetCommitFiles).toHaveBeenCalledTimes(1)

    expect(spySetWebSDK).toHaveBeenCalledWith({ someProp: 'someValue for WebsdK' })
    expect(spySetWebSDK).toHaveBeenCalledTimes(1)
    expect(spySetSMS).toHaveBeenCalledWith({ someProp: 'someValue for SMS' })
    expect(spySetSMS).toHaveBeenCalledTimes(1)
    expect(spySetExtension).toHaveBeenCalledWith({ someProp: 'someValue for Extension' })
    expect(spySetExtension).toHaveBeenCalledTimes(1)
    expect(spySetPolicies).toHaveBeenCalledWith({ someProp: 'someValue for Policies' })
    expect(spySetPolicies).toHaveBeenCalledTimes(1)
    expect(spySetSchema).toHaveBeenCalledWith({ someProp: 'someValue for Schema' })
    expect(spySetSchema).toHaveBeenCalledTimes(1)
    expect(spySetScreenSets).toHaveBeenCalledWith({ someProp: 'someValue for ScreenSets' })
    expect(spySetScreenSets).toHaveBeenCalledTimes(1)
    expect(spySetRBA).toHaveBeenCalledWith({ someProp: 'someValue for RBA' })
    expect(spySetRBA).toHaveBeenCalledTimes(1)
    expect(spySetEmailTemplates).toHaveBeenCalledWith({ someProp: 'someValue for EmailTemplates' })
    expect(spySetEmailTemplates).toHaveBeenCalledTimes(1)
  })
})
