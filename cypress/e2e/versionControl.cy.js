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
  beforeEach(() => {
    utils.startUp(dataTest.versionControlIconName)
  })

  it('should display the version control page', () => {
    utils.mockGetConfigurationRequests()
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/branches`, { body: dataTest.mockedVersionControlGetListBranches }).as('getBranches')
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/branches/main`, { body: dataTest.mockedVersionControlGetResponse })
    cy.intercept('GET', `${url}/repos/testOwner/testRepo/commits?sha=testSha&per_page=100&page=1`, {
      body: dataTest.mockedVersionControlGetCommitsResponse,
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

  // it.only('should display an error Popup when reverting', () => {
  //   utils.mockGetConfigurationRequests()
  //   cy.intercept('GET', `${url}/repos/testOwner/testRepo/branches`, { body: dataTest.mockedVersionControlGetListBranches }).as('getBranches')
  //   cy.intercept('GET', `${url}/repos/testOwner/testRepo/branches/main`, { body: dataTest.mockedVersionControlGetResponse })
  //   cy.intercept('GET', `${url}https://api.github.com/repos/testOwner/testRepo/commits/testSha`, { body: dataTest.mockedVersionControlGetCommitsResponse[0] })
  //   cy.intercept('GET', `${url}https://api.github.com/repos/testOwner/testRepo/commits/testSha`, { body: dataTest.mockedVersionControlGetResponse })
  //   cy.intercept('GET', `${url}/repos/testOwner/testRepo/commits?sha=undefined&per_page=100&page=1`, {
  //     body: dataTest.mockedVersionControlGetCommitsResponse,
  //   }).as('getCommits')
  //   cy.intercept('GET', `${url}/user`, {
  //     body: { callId: 'ea4861dc2cab4c01ab265ffe3eab6c71', errorCode: 0, apiVersion: 2, statusCode: 200, statusReason: 'OK', login: 'testOwner' },
  //   })

  //   cy.intercept('OPTIONS', `${url}/repos/testOwner/testRepo/git/refs/heads%2FtestApiKey`, {})
  //   cy.get('#ownerInput').should('be.visible').shadow().find('input').type('testOwner')
  //   cy.get('#gitTokenInput').should('be.visible').shadow().find('input').type('testToken')
  //   cy.get('[data-cy="repoInput"]').should('be.visible').shadow().find('input').type('testRepo{enter}')
  //   cy.get('[data-cy="backupButton"]').should('not.be.disabled')
  //   cy.get('#versionControlTable').should('be.visible').should('contain.text', 'Create test CDCRepo branch creation')
  //   cy.get('#commitRevertButton-0').should('be.visible').click()
  //   cy.get('#versionControlSuccessPopup').should('be.visible').should('contain.text', 'Restore completed successfully!')
  // })

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
    cy.intercept('GET', `${url}/user`, {
      body: { callId: 'ea4861dc2cab4c01ab265ffe3eab6c71', errorCode: 0, apiVersion: 2, statusCode: 200, statusReason: 'OK', login: 'testOwner' },
    })

    cy.intercept('OPTIONS', `${url}/repos/testOwner/testRepo/git/refs/heads%2FtestApiKey`, {})
    cy.get('#ownerInput').should('be.visible').shadow().find('input').type('testOwner')
    cy.get('#gitTokenInput').should('be.visible').shadow().find('input').type('testToken')
    cy.get('[data-cy="repoInput"]').should('be.visible').shadow().find('input').type('testRepo{enter}')
    cy.get('[data-cy="backupButton"]').should('not.be.disabled')
    cy.get('#versionControlTable').should('be.visible').should('contain.text', 'Create test CDCRepo branch creation')
    cy.get('#commitRevertButton-0').should('be.visible').click()
    cy.get('#versionControlSuccessPopup').should('be.visible').should('contain.text', 'Restore completed successfully!')
  })

  it('should fetch commits and enable the revert operation', () => {
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
})
