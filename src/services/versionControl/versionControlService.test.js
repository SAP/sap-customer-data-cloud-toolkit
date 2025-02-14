/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import VersionControlService from './versionControlService'
import axios from 'axios'
import { expectedSchemaResponse } from '../copyConfig/schema/dataTest'
import { getExpectedScreenSetResponse } from '../copyConfig/screenset/dataTest'
import { getPolicyConfig } from '../copyConfig/policies/dataTest'
import { getSocialsProviders } from '../copyConfig/social/dataTest'
import { getEmailsExpectedResponse } from '../emails/dataTest'
import { getSmsExpectedResponse } from '../sms/dataTest'
import { getSiteConfig } from '../copyConfig/websdk/dataTest'
import { getConsentStatementExpectedResponse } from '../copyConfig/consent/dataTest'
import { channelsExpectedResponse } from '../copyConfig/communication/dataTest'
import { expectedGetRbaPolicyResponseOk, expectedGetRiskAssessmentResponseOk, expectedGetUnknownLocationNotificationResponseOk } from '../copyConfig/rba/dataTest'
import { getExpectedWebhookResponse } from '../copyConfig/webhook/dataTest'
import { getRecaptchaExpectedResponse, getRecaptchaPoliciesResponse, getRiskProvidersResponse } from '../recaptcha/dataTest'
import { getExpectedListExtensionResponse } from '../copyConfig/extension/dataTest'
import { getSearchDataflowsExpectedResponse } from '../copyConfig/dataflow/dataTest'
import { expectedGigyaResponseOk } from '../servicesDataTest'
import GitHub from './versionControlManager/github'
import { Octokit } from '@octokit/rest'

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
    it('should return true when creating a backup', async () => {
      axios
        .mockResolvedValueOnce({ data: channelsExpectedResponse })
        .mockResolvedValueOnce({ data: expectedSchemaResponse })
        .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
        .mockResolvedValueOnce({ data: getExpectedScreenSetResponse() })
        .mockResolvedValueOnce({ data: getPolicyConfig })
        .mockResolvedValueOnce({ data: getSocialsProviders('APP KEY') })
        .mockResolvedValueOnce({ data: getEmailsExpectedResponse })
        .mockResolvedValueOnce({ data: getSmsExpectedResponse })
        .mockResolvedValueOnce({ data: getSiteConfig })
        .mockResolvedValueOnce({ data: getSearchDataflowsExpectedResponse })
        .mockResolvedValueOnce({ data: getExpectedWebhookResponse() })
        .mockResolvedValueOnce({ data: getExpectedListExtensionResponse() })
        .mockResolvedValueOnce({ data: expectedGetRiskAssessmentResponseOk })
        .mockResolvedValueOnce({ data: expectedGetUnknownLocationNotificationResponseOk })
        .mockResolvedValueOnce({ data: expectedGetRbaPolicyResponseOk })
        .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
        .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
        .mockResolvedValueOnce({ data: expectedGigyaResponseOk })
        .mockResolvedValueOnce({ data: getRecaptchaExpectedResponse() })
        .mockResolvedValueOnce({ data: getRecaptchaPoliciesResponse() })
        .mockResolvedValueOnce({ data: getRiskProvidersResponse() })

      const response = await versionControlService.handleGetServices('commitMessage')
      expect(response).toEqual(true)
    })

    it('should fetch commit list if branch exists', async () => {
      const mockCommitList = { commitList: [{ sha: 'commit1' }, { sha: 'commit2' }], totalCommits: 2 }
      versionControlInstance.getCommits = jest.fn().mockResolvedValue({ data: mockCommitList.commitList })
      const result = await versionControlService.handleCommitListRequestServices()
      expect(result).toEqual(mockCommitList)
      expect(versionControlInstance.getCommits).toHaveBeenCalledWith(apiKey)
    })

    it('should return an empty array if branch does not exist', async () => {
      versionControlInstance.getCommits = jest.fn().mockResolvedValue({ data: [] })

      const result = await versionControlService.handleCommitListRequestServices()
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
      const response = await versionControlService.handleCommitRevertServices('mockSha')
      expect(response).toEqual(true)
    })
  })
})
