/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

/* eslint-disable no-undef */

import * as dataTest from './dataTest'
import * as utils from './utils'

describe('Version Control Test Suite', () => {
  beforeEach(() => {
    utils.startUp(dataTest.versionControlIconName)
  })

  it.only('should display the version control page', () => {
    utils.mockGetConfigurationRequests()
    cy.intercept('GET', 'https://api.github.com/repos/testOwner/testRepo/branches', { body: dataTest.mockedVersionControlGetResponse }).as('getBranches')
    cy.intercept('GET', 'https://api.github.com/repos/testOwner/testRepo/branches/main', { body: dataTest.mockedVersionControlGetResponse })
    cy.intercept('GET', 'https://api.github.com/repos/testOwner/testRepo/commits?sha=testSha&per_page=100&page=1', {
      body: dataTest.mockedVersionControlGetCommitsResponse,
    }).as('getCommits')
    cy.intercept('GET', 'https://api.github.com/user', {
      body: { callId: 'ea4861dc2cab4c01ab265ffe3eab6c71', errorCode: 0, apiVersion: 2, statusCode: 200, statusReason: 'OK', login: 'testOwner' },
    })
    cy.intercept('GET', 'https://api.github.com/repos/testOwner/testRepo/git/ref/heads%2Fundefined', {
      body: dataTest.mockFetchCommits,
    })
    cy.intercept('POST', 'https://api.github.com/repos/testOwner/testRepo/git/blobs', {
      body: dataTest.mockGetBlob,
    })
    cy.intercept('POST', 'https://api.github.com/repos/testOwner/testRepo/git/trees', {
      body: dataTest.mockTree,
    })
    cy.intercept('POST', 'https://api.github.com/repos/testOwner/testRepo/git/commits', {
      body: dataTest.mockCommits,
    })
    cy.intercept('PATCH', 'https://api.github.com/repos/testOwner/testRepo/git/refs/heads%2Fundefined', {
      body: dataTest.mockGetRef,
    })
    cy.intercept('GET', 'https://api.github.com/repos/testOwner/testRepo/git/ref/heads%2Fundefined', {
      body: dataTest.mockGetRef,
    })
    cy.intercept('POST', 'https://api.github.com/repos/iamgaspar/CDCVersionControl/git/refs', {
      body: dataTest.mockGetRef,
    })
    cy.intercept('OPTIONS', 'https://api.github.com/repos/testOwner/testRepo/git/refs/heads%2Fundefined', {})
    cy.get('#versionControlTitle').should('have.text', 'Version Control')
    cy.get('#ownerInput').should('be.visible').shadow().find('input').type('testOwner')
    cy.get('#gitTokenInput').should('be.visible').shadow().find('input').type('testToken')
    cy.get('[data-cy="repoInput"]').should('be.visible').shadow().find('input').type('testRepo{enter}')
    cy.get('#backupButton').should('be.not.disabled')
    cy.get('#backupButton').click()
    cy.get('#backupDialog').find('#header').should('contain.text', 'Backup Information')
    cy.get('#backupDialog').find('li').should('have.length', '16')
    cy.get('#backupDialog').find('ui5-textarea').shadow().find('textArea').should('be.visible').type('test commit message')
    cy.get('[data-cy="confirmBackupButton"]').should('be.visible').click()
  })

  it('should display credentials input fields', () => {
    cy.get('#ownerInput').should('be.visible')
    cy.get('#gitTokenInput').should('be.visible')
  })
  it('should display credentials error when the credentials are not correct', () => {
    cy.get('#ownerInput').should('be.visible').shadow().find('input').type('testOwner')
    cy.get('#gitTokenInput').should('be.visible').shadow().find('input').type('testToken')
    cy.get('#warningCredentials').should('contain.text', 'Please insert the correct configurations.')
  })

  // it('should enable the backup button when credentials are provided', () => {
  //   cy.get('#ownerInput').type(dataTest.owner)
  //   cy.get('#gitTokenInput').type(dataTest.gitToken)
  //   cy.get('[data-cy="backupButton"]').should('not.be.disabled')
  // })

  // it('should open the backup dialog when backup button is clicked', () => {
  //   cy.get('[data-cy="ownerInput"]').type(dataTest.owner)
  //   cy.get('[data-cy="gitTokenInput"]').type(dataTest.gitToken)
  //   cy.get('[data-cy="backupButton"]').click()
  //   cy.get('[data-cy="backupDialog"]').should('be.visible')
  // })

  // it('should display the commit message input in the backup dialog', () => {
  //   cy.get('[data-cy="ownerInput"]').type(dataTest.owner)
  //   cy.get('[data-cy="gitTokenInput"]').type(dataTest.gitToken)
  //   cy.get('[data-cy="backupButton"]').click()
  //   cy.get('[data-cy="commitMessageInput"]').should('be.visible')
  // })

  // it('should close the backup dialog when cancel button is clicked', () => {
  //   cy.get('[data-cy="ownerInput"]').type(dataTest.owner)
  //   cy.get('[data-cy="gitTokenInput"]').type(dataTest.gitToken)
  //   cy.get('[data-cy="backupButton"]').click()
  //   cy.get('[data-cy="cancelBackupButton"]').click()
  //   cy.get('[data-cy="backupDialog"]').should('not.exist')
  // })

  // it('should create a backup when confirm button is clicked', () => {
  //   cy.get('[data-cy="ownerInput"]').type(dataTest.owner)
  //   cy.get('[data-cy="gitTokenInput"]').type(dataTest.gitToken)
  //   cy.get('[data-cy="backupButton"]').click()
  //   cy.get('[data-cy="commitMessageInput"]').type(dataTest.commitMessage)
  //   cy.get('[data-cy="confirmBackupButton"]').click()
  //   cy.get('[data-cy="backupDialog"]').should('not.exist')
  //   cy.get('[data-cy="commitList"]').should('contain.text', dataTest.commitMessage)
  // })

  // it('should revert a commit when revert button is clicked', () => {
  //   cy.get('[data-cy="ownerInput"]').type(dataTest.owner)
  //   cy.get('[data-cy="gitTokenInput"]').type(dataTest.gitToken)
  //   cy.get('[data-cy="backupButton"]').click()
  //   cy.get('[data-cy="commitMessageInput"]').type(dataTest.commitMessage)
  //   cy.get('[data-cy="confirmBackupButton"]').click()
  //   cy.get('[data-cy="commitList"]').should('contain.text', dataTest.commitMessage)
  //   cy.get('[data-cy="revertCommitButton"]').first().click()
  //   cy.get('[data-cy="commitList"]').should('not.contain.text', dataTest.commitMessage)
  // })
})
