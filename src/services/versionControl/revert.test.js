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
      content: JSON.stringify({ someProp: 'someValue' }),
      contents_url: 'test-url',
      filename: 'src/versionControl/webSdk.json',
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
    let spy = jest.spyOn(versionControl, 'getCommitFiles').mockResolvedValue(
      mockCommitFiles.map((file) => ({
        ...file,
        content: JSON.parse(file.content), // Ensure `content` is parsed
      })),
    )

    let spySet = jest.spyOn(versionControl, 'setWebSDK').mockResolvedValue()

    const sha = 'cd082512618469bda1afb8eebc4c1692d3d50b05'
    await versionControl.applyCommitConfig(sha)

    // Validate that getCommitFiles and setWebSDK were called with expected args

    expect(spy).toHaveBeenCalledWith(sha)

    expect(spy).toHaveBeenCalledTimes(1)

    expect(spySet).toHaveBeenCalledWith({ someProp: 'someValue' })
  })
})
