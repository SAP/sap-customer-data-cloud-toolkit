/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

/* eslint-disable no-undef */

import * as dataTest from './dataTest'
import * as utils from './utils'

describe('Version Control Test Suite', () => {
  const protocol = 'https://'
  const host = 'api.github.com'
  const url = `${protocol}${host}`
  let requestCount = 0
  beforeEach(() => {
    utils.startUp(dataTest.versionControlIconName)
  })

  it('should display the version control page', () => {
    utils.mockGetConfigurationRequests()

    let mockedCommits = [
      {
        sha: 'initialCommitSha',
        commit: {
          message: 'Initial commit',
          committer: { date: '2023-01-01T00:00:00Z' },
          author: {
            name: 'testOwner',
            email: '48961605+testOwner@users.noreply.github.com',
            date: '2024-11-13T12:41:21Z',
          },
        },
        files: [
          {
            sha: 'testSha2',
            filename: 'policies',
            status: 'modified',
            additions: 2,
            deletions: 2,
            changes: 4,
            blob_url: 'https://github.com/testOwner/testRepo/blob/testSha2/policies',
            raw_url: 'https://github.com/testOwner/testRepo/raw/testSha2/policies',
            contents_url: '/repos/testOwner/testRepo/contents/policies?ref=testSha',
            patch:
              '@@ -1,11 +1,11 @@\n {\n-  "callId": "e4ac87ae7d6c403a8f9a29c44ba0ac49",\n+  "callId": "e848dff38ecf4beab8513b5a47c4545e",\n   "context": "{\\"id\\":\\"smsTemplates\\",\\"targetApiKey\\":\\"4_anUcVDIu7iIQP-uPNKi7aQ\\"}",\n   "errorCode": 0,\n   "apiVersion": 2,\n   "statusCode": 200,\n   "statusReason": "OK",\n-  "time": "2025-03-21T13:41:09.819Z",\n+  "time": "2025-03-21T14:35:00.264Z",\n   "templates": {\n     "otp": {\n       "globalTemplates": {',
          },
        ],
        parents: [
          {
            sha: 'testSha',
            url: 'https://api.github.com/repos/testOwner/testRepo/commits/testSha',
            html_url: 'https://api.github.com/testOwner/testRepo/commit/testSha',
          },
        ],
      },
    ]
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/branches`, { body: dataTest.mockedVersionControlGetListBranches }).as('getBranches')
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/branches/main`, { body: dataTest.mockedVersionControlGetResponse })
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/commits?sha=undefined&per_page=100&page=1`, (req) => {
      requestCount++

      if (requestCount > 4) {
        mockedCommits.unshift({
          sha: 'afterCommitSha',
          commit: {
            message: 'New commit after backup',
            committer: { date: '2024-11-13T13:41:21Z' },
            author: {
              name: 'testOwner',
              email: '48961605+testOwner@users.noreply.github.com',
              date: '2024-11-13T13:41:21Z',
            },
          },
          files: [
            {
              sha: 'testSha3',
              filename: 'newFile',
              status: 'added',
              additions: 5,
              deletions: 0,
              changes: 5,
              blob_url: 'https://github.com/testOwner/testRepo/blob/testSha3/newFile',
              raw_url: 'https://github.com/testOwner/testRepo/raw/testSha3/newFile',
              contents_url: '/repos/testOwner/testRepo/contents/newFile?ref=testSha3',
              patch: '@@ -0,0 +1,5 @@\n+New content added to the file\n',
            },
          ],
          parents: [
            {
              sha: 'initialCommitSha',
              url: 'https://api.github.com/repos/testOwner/testRepo/commits/initialCommitSha',
              html_url: 'https://api.github.com/testOwner/testRepo/commit/initialCommitSha',
            },
          ],
        })
      }
      req.reply({ body: mockedCommits })
    }).as('getCommits')

    cy.intercept('GET', `${url}/user`, {
      body: { callId: 'ea4861dc2cab4c01ab265ffe3eab6c71', errorCode: 0, apiVersion: 2, statusCode: 200, statusReason: 'OK', login: 'testOwner' },
    })

    cy.intercept('GET', `${url}/repos/testOwner/testRepo/contents/src%2FversionControl%2Fpolicies.json?ref=undefined`, {
      body: {
        callId: 'ea4861dc2cab4c01ab265ffe3eab6c71',
        errorCode: 0,
        apiVersion: 2,
        statusCode: 200,
        statusReason: 'OK',
        name: 'policies.json',
        path: 'src/versionControl/policies.json',
        sha: 'testSha',
        size: 100,
      },
    })
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/contents/src%2FversionControl%2FwebSdk.json?ref=undefined`, {
      body: {
        callId: 'ea4861dc2cab4c01ab265ffe3eab6c71',
        errorCode: 0,
        apiVersion: 2,
        statusCode: 200,
        statusReason: 'OK',
        name: 'webSdk.json',
        path: 'src/versionControl/webSdk.json',
        sha: 'testSha',
        size: 100,
      },
    })
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/contents/src%2FversionControl%2Fdataflow.json?ref=undefined`, {
      body: {
        callId: 'ea4861dc2cab4c01ab265ffe3eab6c71',
        errorCode: 0,
        apiVersion: 2,
        statusCode: 200,
        statusReason: 'OK',
        name: 'dataflow.json',
        path: 'src/versionControl/dataflow.json',
        sha: 'testSha',
        size: 100,
      },
    })
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/contents/src%2FversionControl%2Femails.json?ref=undefined`, {
      body: {
        callId: 'ea4861dc2cab4c01ab265ffe3eab6c71',
        errorCode: 0,
        apiVersion: 2,
        statusCode: 200,
        statusReason: 'OK',
        name: 'emails.json',
        path: 'src/versionControl/emails.json',
        sha: 'testSha',
        size: 100,
      },
    })
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/contents/src%2FversionControl%2Fextension.json?ref=undefined`, {
      body: {
        callId: 'ea4861dc2cab4c01ab265ffe3eab6c71',
        errorCode: 0,
        apiVersion: 2,
        statusCode: 200,
        statusReason: 'OK',
        name: 'extension.json',
        path: 'src/versionControl/extension.json',
        sha: 'testSha',
        size: 100,
      },
    })
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/contents/src%2FversionControl%2Frba.json?ref=undefined`, {
      body: {
        callId: 'ea4861dc2cab4c01ab265ffe3eab6c71',
        errorCode: 0,
        apiVersion: 2,
        statusCode: 200,
        statusReason: 'OK',
        name: 'rba.json',
        path: 'src/versionControl/rba.json',
        sha: 'testSha',
        size: 100,
      },
    })
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/contents/src%2FversionControl%2FriskAssessment.json?ref=undefined`, {
      body: {
        callId: 'ea4861dc2cab4c01ab265ffe3eab6c71',
        errorCode: 0,
        apiVersion: 2,
        statusCode: 200,
        statusReason: 'OK',
        name: 'riskAssessment.json',
        path: 'src/versionControl/riskAssessment.json',
        sha: 'testSha',
        size: 100,
      },
    })
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/contents/src%2FversionControl%2Fschema.json?ref=undefined`, {
      body: {
        callId: 'ea4861dc2cab4c01ab265ffe3eab6c71',
        errorCode: 0,
        apiVersion: 2,
        statusCode: 200,
        statusReason: 'OK',
        name: 'schema.json',
        path: 'src/versionControl/schema.json',
        sha: 'testSha',
        size: 100,
      },
    })
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/contents/src%2FversionControl%2FscreenSets.json?ref=undefined`, {
      body: {
        callId: 'ea4861dc2cab4c01ab265ffe3eab6c71',
        errorCode: 0,
        apiVersion: 2,
        statusCode: 200,
        statusReason: 'OK',
        name: 'screenSets.json',
        path: 'src/versionControl/screenSets.json',
        sha: 'testSha',
        size: 100,
      },
    })
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/contents/src%2FversionControl%2Fsms.json?ref=undefined`, {
      body: {
        callId: 'ea4861dc2cab4c01ab265ffe3eab6c71',
        errorCode: 0,
        apiVersion: 2,
        statusCode: 200,
        statusReason: 'OK',
        name: 'sms.json',
        path: 'src/versionControl/sms.json',
        sha: 'testSha',
        size: 100,
      },
    })
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/contents/src%2FversionControl%2Fchannel.json?ref=undefined`, {
      body: {
        callId: 'ea4861dc2cab4c01ab265ffe3eab6c71',
        errorCode: 0,
        apiVersion: 2,
        statusCode: 200,
        statusReason: 'OK',
        name: 'channel.json',
        path: 'src/versionControl/channel.json',
        sha: 'testSha',
        size: 100,
      },
    })
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/contents/src%2FversionControl%2Ftopic.json?ref=undefined`, {
      body: {
        callId: 'ea4861dc2cab4c01ab265ffe3eab6c71',
        errorCode: 0,
        apiVersion: 2,
        statusCode: 200,
        statusReason: 'OK',
        name: 'topic.json',
        path: 'src/versionControl/topic.json',
        sha: 'testSha',
        size: 100,
      },
    })
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/contents/src%2FversionControl%2Fwebhook.json?ref=undefined`, {
      body: {
        callId: 'ea4861dc2cab4c01ab265ffe3eab6c71',
        errorCode: 0,
        apiVersion: 2,
        statusCode: 200,
        statusReason: 'OK',
        name: 'webhook.json',
        path: 'src/versionControl/webhook.json',
        sha: 'testSha',
        size: 100,
      },
    })
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/contents/src%2FversionControl%2Fconsent.json?ref=undefined`, {
      body: {
        callId: 'ea4861dc2cab4c01ab265ffe3eab6c71',
        errorCode: 0,
        apiVersion: 2,
        statusCode: 200,
        statusReason: 'OK',
        name: 'consent.json',
        path: 'src/versionControl/consent.json',
        sha: 'testSha',
        size: 100,
      },
    })
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/contents/src%2FversionControl%2Fsocial.json?ref=undefined`, {
      body: {
        callId: 'ea4861dc2cab4c01ab265ffe3eab6c71',
        errorCode: 0,
        apiVersion: 2,
        statusCode: 200,
        statusReason: 'OK',
        name: 'social.json',
        path: 'src/versionControl/social.json',
        sha: 'testSha',
        size: 100,
      },
    })
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/contents/src%2FversionControl%2Frecaptcha.json?ref=undefined`, {
      body: {
        callId: 'ea4861dc2cab4c01ab265ffe3eab6c71',
        errorCode: 0,
        apiVersion: 2,
        statusCode: 200,
        statusReason: 'OK',
        name: 'recaptcha.json',
        path: 'src/versionControl/recaptcha.json',
        sha: 'testSha',
        size: 100,
      },
    })

    cy.intercept('GET', `${url}/repos/testOwner/testRepo/git/ref/heads%2Fundefined`, {
      body: dataTest.mockFetchCommits,
    })

    cy.intercept('GET', `${url}/repos/testOwner/testRepo/git/blobs/testSha`, {
      callId: 'ea4861dc2cab4c01ab265ffe3eab6c71',
      errorCode: 0,
      apiVersion: 2,
      statusCode: 200,
      statusReason: 'OK',
      body: dataTest.mockGetBlob,
    })

    cy.intercept('POST', `${url}/repos/testOwner/testRepo/git/blobs`, {
      callId: 'ea4861dc2cab4c01ab265ffe3eab6c71',
      errorCode: 0,
      apiVersion: 2,
      statusCode: 200,
      statusReason: 'OK',
      body: dataTest.mockGetBlob,
    })
    cy.intercept('POST', `${url}/repos/testOwner/testRepo/git/trees`, {
      body: dataTest.mockTree,
    })
    cy.intercept('POST', `${url}/repos/testOwner/testRepo/git/commits`, {
      body: dataTest.mockCommits,
    })
    cy.intercept('PATCH', `${url}/repos/testOwner/testRepo/git/refs/heads%2Fundefined`, {
      body: dataTest.mockGetRef,
    })

    cy.intercept('POST', `${url}/repos/testOwner/testRepo/git/refs`, {
      body: dataTest.mockGetRef,
    })
    cy.intercept('OPTIONS', `${url}/repos/testOwner/testRepo/git/refs/heads%2Fundefined`, {})
    cy.get('#versionControlTitle').should('have.text', 'Version Control')
    cy.get('#ownerInput').should('be.visible').shadow().find('input').type('testOwner')
    cy.get('#gitTokenInput').should('be.visible').shadow().find('input').type('testToken')
    cy.get('[data-cy="repoInput"]').should('be.visible').shadow().find('input').type('testRepo{enter}')
    cy.get('#backupButton').should('be.not.disabled')
    cy.get('#backupButton').click()
    cy.get('#backupDialog').find('#header').should('contain.text', 'Backup Information')
    cy.get('#backupDialog').find('li').should('have.length', '16')
    cy.get('#backupDialog').find('ui5-textarea').shadow().find('textArea').should('be.visible').type('test commit message')
    cy.get('[data-cy="confirmBackupButton"]').click()
    cy.get('#versionControlSuccessPopup').should('be.visible').should('contain.text', 'Backup completed successfully!')
  })

  it('should display credentials input fields', () => {
    cy.get('#ownerInput').should('be.visible')
    cy.get('#gitTokenInput').should('be.visible')
    cy.get('[data-cy="repoInput"]').should('be.visible')
  })

  it('should display credentials error when the credentials are not correct', () => {
    cy.get('#ownerInput').should('be.visible').shadow().find('input').type('testOwner')
    cy.get('#gitTokenInput').should('be.visible').shadow().find('input').type('testToken')
    cy.get('#warningCredentials').should('contain.text', 'Please insert the correct configurations.')
  })

  it('should enable the backup button when credentials are provided', () => {
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/branches`, { body: dataTest.mockedVersionControlGetListBranches2 }).as('getBranches')
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/branches/main`, { body: dataTest.mockedVersionControlGetResponse })
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/commits?sha=undefined&per_page=100&page=1`, {
      body: dataTest.mockedVersionControlGetCommitsEmptyResponse,
    }).as('getCommits')
    cy.intercept('GET', `${url}/user`, {
      body: { callId: 'ea4861dc2cab4c01ab265ffe3eab6c71', errorCode: 0, apiVersion: 2, statusCode: 200, statusReason: 'OK', login: 'testOwner' },
    })
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/git/ref/heads%2Fundefined`, {
      body: dataTest.mockFetchCommits,
    })
    cy.intercept('POST', `${url}/repos/testOwner/testRepo/git/blobs`, {
      body: dataTest.mockGetBlob,
    })
    cy.intercept('POST', `${url}/repos/testOwner/testRepo/git/trees`, {
      body: dataTest.mockTree,
    })
    cy.intercept('POST', `${url}/repos/testOwner/testRepo/git/commits`, {
      body: dataTest.mockCommits,
    })
    cy.intercept('PATCH', `${url}/repos/testOwner/testRepo/git/refs/heads%2Fundefined`, {
      body: dataTest.mockGetRef,
    })
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/git/ref/heads%2Fundefined`, {
      body: dataTest.mockGetRef,
    })
    cy.intercept('POST', `${url}/repos/testOwner/testRepo/git/refs`, {
      body: dataTest.mockGetRef,
    })
    cy.intercept('OPTIONS', `${url}/repos/testOwner/testRepo/git/refs/heads%2Fundefined`, {})

    cy.get('#ownerInput').should('be.visible').shadow().find('input').type('testOwner')
    cy.get('#gitTokenInput').should('be.visible').shadow().find('input').type('testToken')
    cy.get('[data-cy="repoInput"]').should('be.visible').shadow().find('input').type('testRepo{enter}')
    cy.get('[data-cy="backupButton"]').should('not.be.disabled')
    cy.get('#versionControlCommitBar').should('contain.text', 'There are no commits for this API key')
  })

  it('should fetch commits and enable the revert operation', () => {
    utils.mockGetConfigurationRequests()
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/branches`, { body: dataTest.mockedVersionControlGetListBranches }).as('getBranches')
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/branches/main`, { body: dataTest.mockedVersionControlGetResponse })
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/commits?sha=undefined&per_page=100&page=1`, {
      body: dataTest.mockedVersionControlGetCommitsResponse,
    }).as('getCommits')
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/commits/testSha`, {
      body: dataTest.mockedVersionControlGetCommitsResponse[0],
    }).as('getCommits')
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/commits`, {
      statusCode: 200,
      body: dataTest.mockedVersionControlGetCommitsResponse[0],
    }).as('getCommits')
    cy.intercept('GET', `${url}/user`, {
      body: { callId: 'ea4861dc2cab4c01ab265ffe3eab6c71', errorCode: 0, apiVersion: 2, statusCode: 200, statusReason: 'OK', login: 'testOwner' },
    })
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/contents/policies?ref=testSha`, {
      body: {
        callId: 'ea4861dc2cab4c01ab265ffe3eab6c71',
        errorCode: 0,
        apiVersion: 2,
        statusCode: 200,
        statusReason: 'OK',
        name: 'policies.json',
        path: 'src/versionControl/policies.json',
        sha: 'testSha',
        size: 100,
      },
    })
    cy.intercept('OPTIONS', `${url}/repos/testOwner/testRepo/git/refs/heads%2FtestApiKey`, {})
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/contents/policies?ref=undefined`, {
      statusCode: 200,
      body: {
        contents_url: 'mocked content',
        encoding: 'base64',
      },
    }).as('getFileContent')
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/git/blobs`, {
      statusCode: 200,
      body: {
        content: 'eyJ0ZW1wbGF0ZXMiOiAidmFsdWUifQ==',
        encoding: 'base64',
      },
    })
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/git/blobs/testSha`, {
      callId: 'ea4861dc2cab4c01ab265ffe3eab6c71',
      errorCode: 0,
      apiVersion: 2,
      statusCode: 200,
      statusReason: 'OK',
      body: {
        sha: 'testSha',
        content: 'eyJ0ZW1wbGF0ZXMiOiAidmFsdWUifQ==',
        encoding: 'base64',
      },
    })
    cy.intercept('GET', `accounts.setPolicies`, {
      statusCode: 200,
    })

    cy.get('#ownerInput').should('be.visible').shadow().find('input').type('testOwner')
    cy.get('#gitTokenInput').should('be.visible').shadow().find('input').type('testToken')
    cy.get('[data-cy="repoInput"]').should('be.visible').shadow().find('input').type('testRepo{enter}')
    cy.get('[data-cy="backupButton"]').should('not.be.disabled')
    cy.get('#versionControlTable').should('be.visible').should('contain.text', 'Create test CDCRepo branch creation')
    cy.get('#commitRevertButton-0').should('be.visible').click()
    cy.get('#versionControlSuccessPopup').should('be.visible').should('contain.text', 'Restore completed successfully!')
  })

  it('should not do the backup because there is no changes', () => {
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/branches`, { body: dataTest.mockedVersionControlGetListBranches }).as('getBranches')
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/branches/main`, { body: dataTest.mockedVersionControlGetResponse })
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/commits?sha=undefined&per_page=100&page=1`, {
      body: dataTest.mockedVersionControlGetCommitsResponse,
    }).as('getCommits')
    cy.intercept('GET', `${url}/user`, {
      body: { callId: 'ea4861dc2cab4c01ab265ffe3eab6c71', errorCode: 0, apiVersion: 2, statusCode: 200, statusReason: 'OK', login: 'testOwner' },
    })

    cy.intercept('OPTIONS', `${url}/repos/testOwner/testRepo/git/refs/heads%2FtestApiKey`, {})
    cy.get('#ownerInput').should('be.visible').shadow().find('input').type('testOwner')
    cy.get('#gitTokenInput').should('be.visible').shadow().find('input').type('testToken')
    cy.get('[data-cy="repoInput"]').should('be.visible').shadow().find('input').type('testRepo{enter}')
    cy.get('[data-cy="backupButton"]').should('not.be.disabled').click()
    cy.get('#backupDialog').should('contain.text', 'There are no changes since your last backup.')
  })

  it('should popup the error dialog when reverting', () => {
    utils.mockGetConfigurationRequests()
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/branches`, { body: dataTest.mockedVersionControlGetListBranches }).as('getBranches')
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/branches/main`, { body: dataTest.mockedVersionControlGetResponse })
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/commits?sha=undefined&per_page=100&page=1`, {
      body: dataTest.mockedVersionControlGetCommitsResponse,
    }).as('getCommits')
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/commits/testSha`, {
      body: dataTest.mockedVersionControlGetCommitsResponse[0],
    }).as('getCommits')
    cy.intercept('GET', `${url}/user`, {
      body: { callId: 'ea4861dc2cab4c01ab265ffe3eab6c71', errorCode: 0, apiVersion: 2, statusCode: 200, statusReason: 'OK', login: 'testOwner' },
    })

    cy.intercept('OPTIONS', `${url}/repos/testOwner/testRepo/git/refs/heads%2FtestApiKey`, {})
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/contents/policies?ref=testSha`, {
      statusCode: 200,
      body: {
        contents_url: 'mocked content',
        encoding: 'base64',
      },
    }).as('getFileContent')
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/git/blobs`, {
      statusCode: 200,
      body: {
        content: 'test',
        encoding: 'base64',
      },
    }).as('getBlobs')
    cy.intercept('POST', 'accounts.setPolicies', {
      statusCode: 403,
      body: {
        errorMessage: 'Error getting SMS templates',
        errorDetails: 'There was an error when getting the SMS templates or you do not have the required permissions to call it.',
        statusCode: 403,
        errorCode: 403007,
        statusReason: 'Forbidden',
        callId: 'ed5c54bfe321478b8db4298c2539265a',
        apiVersion: 2,
        time: 'Date.now()',
      },
    })
    cy.get('#ownerInput').should('be.visible').shadow().find('input').type('testOwner')
    cy.get('#gitTokenInput').should('be.visible').shadow().find('input').type('testToken')
    cy.get('[data-cy="repoInput"]').should('be.visible').shadow().find('input').type('testRepo{enter}')
    cy.get('[data-cy="backupButton"]').should('not.be.disabled')
    cy.get('#versionControlTable').should('be.visible').should('contain.text', 'Create test CDCRepo branch creation')
    cy.get('#commitRevertButton-0').should('be.visible').click()
    cy.get('#versionControlErrorPopup').should('be.visible').should('contain.text', 'OkFailed to revert configurations')
  })
})
