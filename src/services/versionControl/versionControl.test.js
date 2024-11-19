import { Octokit } from '@octokit/rest'
import { Base64 } from 'js-base64'
import VersionControl from './versionControl'

jest.mock('@octokit/rest')
jest.mock('js-base64', () => ({
  Base64: {
    encode: jest.fn(),
    decode: jest.fn(),
  },
}))

describe('VersionControl test suite', () => {
    let versionControl
    const credentials = { userKey: 'testUserKey', secret: 'testSecret' }
    const apiKey = 'testApiKey'
    const siteInfo = { dataCenter: 'testDataCenter' }

    const listBranchesMock = jest.fn()
    const getBranchMock = jest.fn()
    const createRefMock = jest.fn()
    const getContentMock = jest.fn()
    const getCommitMock = jest.fn()
    const createOrUpdateFileContentsMock = jest.fn()
    const listCommitsMock = jest.fn()
    const requestMock = jest.fn()

    beforeEach(() => {
      Octokit.mockImplementation(() => ({
        rest: {
          repos: {
            listBranches: listBranchesMock,
            getBranch: getBranchMock,
            getContent: getContentMock,
            getCommit: getCommitMock,
            createOrUpdateFileContents: createOrUpdateFileContentsMock,
            listCommits: listCommitsMock,
          },
          git: {
            createRef: createRefMock,
          },
        },
        request: requestMock,
      }))

      Base64.decode.mockReset()
      Base64.encode.mockReset()

      versionControl = new VersionControl(credentials, apiKey, siteInfo)
    })

    test('createBranch creates a new branch if it does not exist', async () => {
      listBranchesMock.mockResolvedValueOnce({ data: [{ name: 'main' }] })
      getBranchMock.mockResolvedValueOnce({ data: { commit: { sha: 'testSha' } } })
      createRefMock.mockResolvedValueOnce({})

      await versionControl.createBranch('newBranch')

      expect(createRefMock).toHaveBeenCalledWith({
        owner: 'iamGaspar',
        repo: 'CDCVersionControl',
        ref: 'refs/heads/newBranch',
        sha: 'testSha',
      })
    })
})
