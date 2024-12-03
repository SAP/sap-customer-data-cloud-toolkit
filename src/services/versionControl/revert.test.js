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

  const mockCommitData = {
    sha: 'cd082512618469bda1afb8eebc4c1692d3d50b05',
    commit: {
      author: { name: 'iamGaspar', email: '48961605+iamGaspar@users.noreply.github.com', date: '2024-11-28T11:57:18Z' },
      committer: { name: 'iamGaspar', email: '48961605+iamGaspar@users.noreply.github.com', date: '2024-11-28T11:57:18Z' },
      message: 'Backup created',
      tree: { sha: '8f0a265adf35177b50983a69e876016d721c78b4', url: 'https://api.github.com/repos/iamGaspar/CDCVersionControl/git/trees/8f0a265adf35177b50983a69e876016d721c78b4' },
      url: 'https://api.github.com/repos/iamGaspar/CDCVersionControl/git/commits/cd082512618469bda1afb8eebc4c1692d3d50b05',
      verification: { verified: false, reason: 'unsigned', signature: null, payload: null },
    },
    url: 'https://api.github.com/repos/iamGaspar/CDCVersionControl/commits/cd082512618469bda1afb8eebc4c1692d3d50b05',
    html_url: 'https://github.com/iamGaspar/CDCVersionControl/commit/cd082512618469bda1afb8eebc4c1692d3d50b05',
    comments_url: 'https://api.github.com/repos/iamGaspar/CDCVersionControl/commits/cd082512618469bda1afb8eebc4c1692d3d50b05/comments',
    author: {
      login: 'iamGaspar',
      id: 48961605,
      avatar_url: 'https://avatars.githubusercontent.com/u/48961605?v=4',
      followers_url: 'https://api.github.com/users/iamGaspar/followers',
    },
    committer: { login: 'iamGaspar', id: 48961605 },
    parents: [
      { sha: 'a30fcaeb2de083851200f3e24b76ef7f1293ff18', url: 'https://api.github.com/repos/iamGaspar/CDCVersionControl/commits/a30fcaeb2de083851200f3e24b76ef7f1293ff18' },
    ],
    stats: { total: 6, additions: 3, deletions: 3 },
    files: [
      {
        sha: '6156ca422797ca3217007c3303573ebb264a9f39',
        filename: 'src/versionControl/webSdk.json',
        status: 'modified',
        additions: 3,
        deletions: 3,
        changes: 6,
        blob_url: 'https://github.com/iamGaspar/CDCVersionControl/blob/cd082512618469bda1afb8eebc4c1692d3d50b05/src%2FversionControl%2FwebSdk.json',
        raw_url: 'https://github.com/iamGaspar/CDCVersionControl/raw/cd082512618469bda1afb8eebc4c1692d3d50b05/src%2FversionControl%2FwebSdk.json',
        contents_url: 'https://api.github.com/repos/iamGaspar/CDCVersionControl/contents/src%2FversionControl%2FwebSdk.json?ref=cd082512618469bda1afb8eebc4c1692d3d50b05',
        patch:
          '@@ -1,10 +1,10 @@\n {\n-  "callId": "5aeffaeee921456daa801addf679e9a3",\n+  "callId": "498e52ea5e8e41ae9faf0cd4bf808d60",\n   "errorCode": 0,\n   "apiVersion": 2,\n   "statusCode": 200',
      },
    ],
  }

  beforeEach(() => {
    // Setup axios mock
    axios.get.mockResolvedValue({ data: mockCommitData })

    // Initialize VersionControl
    versionControl = new VersionControl(credentials, apiKey, siteInfo)

    // Mocking methods
    jest.spyOn(versionControl, 'getCommitFiles').mockResolvedValue(
      mockCommitFiles.map((file) => ({
        ...file,
        content: JSON.parse(file.content), // Ensure `content` is parsed
      })),
    )
    jest.spyOn(versionControl, 'setWebSDK').mockResolvedValue()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Revert Flow', async () => {
    const sha = 'cd082512618469bda1afb8eebc4c1692d3d50b05'
    await versionControl.applyCommitConfig(sha)

    // Validate that getCommitFiles and setWebSDK were called with expected args
    expect(versionControl.getCommitFiles).toHaveBeenCalledWith(sha)
    expect(versionControl.setWebSDK).toHaveBeenCalledWith({ someProp: 'someValue' })
  })
})
