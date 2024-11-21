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
  test('updateFile updates or creates a file on GitHub', async () => {
    const fakeSha = 'fakeSha'
    const fileContentMock = { content: Base64.encode(JSON.stringify({ someProp: 'someValue' })), sha: fakeSha, name: 'testFile' }

    jest.spyOn(versionControl, 'getFileSHA').mockResolvedValue(fileContentMock)

    createOrUpdateFileContentsMock.mockResolvedValueOnce({
      data: { commit: { message: 'File updated/created' } },
    })

    await versionControl.updateFile('testPath', JSON.stringify({ someProp: 'someValue' }))

    expect(createOrUpdateFileContentsMock).toHaveBeenCalledWith({
      owner: 'iamGaspar',
      repo: 'CDCVersionControl',
      path: 'testPath',
      message: 'testFile File updated/created',
      content: Base64.encode(JSON.stringify({ someProp: 'someValue' })),
      branch: 'CDCRepo',
      sha: fakeSha,
    })
  })

    test('writeFile calls getResponses and updates files', async () => {
      const responses = [
        { name: 'webSdk', promise: Promise.resolve({ someProp: 'someValue' }) },
        { name: 'dataflow', promise: Promise.resolve({ someProp: 'someValue' }) },
      ]
      jest.spyOn(versionControl, 'getResponses').mockResolvedValue(responses)
      jest.spyOn(versionControl, 'updateFile').mockResolvedValue()

      await versionControl.writeFile()

      expect(versionControl.getResponses).toHaveBeenCalled()
      expect(versionControl.updateFile).toHaveBeenCalledTimes(2)
      expect(versionControl.updateFile).toHaveBeenCalledWith('src/versionControl/webSdk.json', JSON.stringify({ someProp: 'someValue' }, null, 2))
      expect(versionControl.updateFile).toHaveBeenCalledWith('src/versionControl/dataflow.json', JSON.stringify({ someProp: 'someValue' }, null, 2))
    })

test('fetchFileContent correctly fetches and decodes file content', async () => {
  const testContent = JSON.stringify({ someProp: 'someValue' })
  const encodedContent = Base64.encode(testContent)
  requestMock.mockResolvedValueOnce({ data: { content: encodedContent } })

  const result = await versionControl.fetchFileContent('test-url')

  expect(requestMock).toHaveBeenCalledWith('test-url')
  expect(result).toEqual(testContent)
})


    test('readCommit processes commits and sets data correctly', async () => {
      const commitData = {
        files: [
          { filename: 'src/versionControl/emails.json', contents_url: 'test-url-emails' },
          { filename: 'src/versionControl/extension.json', contents_url: 'test-url-extension' },
        ],
      }
      getCommitMock.mockResolvedValueOnce({ data: commitData })
      requestMock.mockResolvedValueOnce({ data: { content: Base64.encode(JSON.stringify({ someProp: 'someValue' })) } })
      requestMock.mockResolvedValueOnce({ data: { content: Base64.encode(JSON.stringify({ someProp: 'someValue' })) } })

      const setEmailTemplatesMock = jest.spyOn(versionControl, 'setEmailTemplates').mockResolvedValue()
      const setExtensionMock = jest.spyOn(versionControl, 'setExtension').mockResolvedValue()

      await versionControl.readCommit('testSha')

      expect(setEmailTemplatesMock).toHaveBeenCalledWith({ someProp: 'someValue' })
      expect(setExtensionMock).toHaveBeenCalledWith({ someProp: 'someValue' })
    })

      test('getCommits returns the list of commits', async () => {
        const commits = [{ sha: 'commit1' }, { sha: 'commit2' }]
        listCommitsMock.mockResolvedValueOnce({ data: commits })

        const result = await versionControl.getCommits()

        expect(result).toEqual(commits)
      })
})
