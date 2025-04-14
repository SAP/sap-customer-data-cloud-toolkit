/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import VersionControlService from './versionControlService'
import axios from 'axios'
import { getConsentStatementExpectedResponse } from '../copyConfig/consent/dataTest'
import { channelsExpectedResponse } from '../copyConfig/communication/dataTest'
import { expectedGigyaResponseOk } from '../servicesDataTest'
import GitHub from './versionControlManager/github'
import { Octokit } from '@octokit/rest'
jest.mock('@octokit/rest', () => {
  return {
    Octokit: jest.fn(),
  }
})
jest.mock('axios')
jest.mock('./versionControlManager/github')

describe('versionControlService', () => {
  const credentials = { userKey: 'testUserKey', secret: 'testSecret', gigyaConsole: 'testConsole' }
  const apiKey = 'testApiKey'
  const currentSite = { dataCenter: 'testDataCenter' }
  const dataCenter = 'eu1'
  const versionControlInstance = new GitHub(new Octokit({ auth: 'testToken' }), 'testOwner', 'CDCVersionControl')
  const versionControlService = new VersionControlService(credentials, apiKey, versionControlInstance, dataCenter, currentSite)
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('handleGetServices', () => {
    jest.spyOn(versionControlService.cdcService.consentManager, 'getConsentsAndLegalStatements').mockResolvedValue(getConsentStatementExpectedResponse)

    it('should fetch commit list if branch exists', async () => {
      const mockCommitList = { commitList: [{ sha: 'commit1' }, { sha: 'commit2' }], totalCommits: 2 }
      versionControlInstance.getCommits = jest.fn().mockResolvedValue(mockCommitList.commitList)
      const result = await versionControlService.getCommitsFromBranch()
      expect(result).toEqual(mockCommitList)
      expect(versionControlInstance.getCommits).toHaveBeenCalledWith(apiKey)
    })

    it('should return an empty array if branch does not exist', async () => {
      versionControlInstance.getCommits = jest.fn().mockResolvedValue([])

      const result = await versionControlService.getCommitsFromBranch()
      expect(result).toEqual({ commitList: [], totalCommits: 0 })
    })

    it('should revert commit and show success alert', async () => {
      axios.mockResolvedValueOnce({ data: expectedGigyaResponseOk }).mockResolvedValueOnce({ data: expectedGigyaResponseOk })
      const mockFiles = [
        {
          filename: 'src/versionControl/channel.json',
          contents_url: 'https://api.github.com/repos/test/testRepo/contents/src%2FversionControl%2Fchannel.json?ref=abc123',
          content: channelsExpectedResponse,
        },
      ]
      versionControlInstance.getCommitFiles = jest.fn().mockResolvedValue(mockFiles)
      const response = await versionControlService.revertBackup('mockSha')
      expect(response).toEqual(true)
    })
  })
})
