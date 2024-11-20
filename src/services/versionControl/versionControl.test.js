import VersionControl from './versionControl'
import { Octokit } from '@octokit/rest'
import { Base64 } from 'js-base64' // Import the actual library

jest.mock('@octokit/rest') // Still mock `@octokit/rest`

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

  test('readFile calls getFileSHA and does various sets based on file names', async () => {
    const content = JSON.stringify({ someProp: 'someValue' })
    const encodedContent = Base64.encode(content)
    console.log('encodedContent:', encodedContent) // Adding the log for encoded content

    const fileContentMock = { content: encodedContent }

    jest.spyOn(versionControl, 'getFileSHA').mockResolvedValue(fileContentMock)

    const setEmailTemplatesMock = jest.spyOn(versionControl, 'setEmailTemplates').mockResolvedValue()
    const setExtensionMock = jest.spyOn(versionControl, 'setExtension').mockResolvedValue()
    const setPoliciesMock = jest.spyOn(versionControl, 'setPolicies').mockResolvedValue()
    const setRbaMock = jest.spyOn(versionControl, 'setRBA').mockResolvedValue()
    const setSchemaMock = jest.spyOn(versionControl, 'setSchema').mockResolvedValue()
    const setSmsMock = jest.spyOn(versionControl, 'setSMS').mockResolvedValue()
    const setWebSdkMock = jest.spyOn(versionControl, 'setWebSDK').mockResolvedValue()

    await versionControl.readFile()

    expect(versionControl.getFileSHA).toHaveBeenCalledTimes(11)

    expect(setEmailTemplatesMock).toHaveBeenCalledWith({ someProp: 'someValue' })
    expect(setExtensionMock).toHaveBeenCalledWith({ someProp: 'someValue' })
    expect(setPoliciesMock).toHaveBeenCalledWith({ someProp: 'someValue' })
    expect(setRbaMock).toHaveBeenCalledWith({ someProp: 'someValue' })
    expect(setSchemaMock).toHaveBeenCalledWith({ someProp: 'someValue' })
    expect(setSmsMock).toHaveBeenCalledWith({ someProp: 'someValue' })
    expect(setWebSdkMock).toHaveBeenCalledWith({ someProp: 'someValue' })
  })
})
