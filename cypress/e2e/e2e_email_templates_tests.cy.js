/* eslint-disable no-undef */
import * as utils from './utils'
import manualRemovalTestData from './manual-removal-test-data.json'
import * as data from './test-data'

describe('Email Templates Test Suite', () => {
  beforeEach(() => {
    utils.startUp('http://localhost:3000', data.emailTemplatesIconName)
  })

  it('should display Export All and Import All buttons', () => {
    cy.get('#exportAllEmailTemplatesButton').should('not.be.disabled')
    cy.get('#importAllEmailTemplatesButton').should('not.be.disabled')
  })

  it('should show error messages on export button', () => {
    utils.mockResponse(manualRemovalTestData.flat()[1], 'POST', 'admin.getSiteConfig')
    cy.get('#exportAllEmailTemplatesButton').click()
    cy.get('#emailTemplatesErrorPopup').shadow().find('#ui5-popup-header').should('have.text', 'Error')
    cy.get('#messageList').should('have.text', data.emailTemplatesExportErrorMessageDetail)
  })

  it('should show error on import button', () => {
    utils.resizeObserverLoopErrRe()
    cy.get('#importAllEmailTemplatesButton').click()
    cy.get('#emailsImportPopup').contains('Import email templates').should('have.text', data.importEmailsFileHeaderText)
    cy.get('#importZipButton').shadow().find('[type="button"]').should('be.disabled')

    cy.get('#zipFileInput').attachFile(data.cdcExampleFile)
    cy.get('#importZipButton').shadow().find('[type="button"]').should('not.be.disabled')
    cy.get('#importZipButton').click()
    cy.get('#messageList').should('have.text', data.importMessage)
  })

  it('should show credentials error dialog on export', () => {
    utils.clearCredentials()
    cy.get('#exportAllEmailTemplatesButton').click()
    cy.get('#errorPopup').should('have.text', data.missingCredentialsErrorMessage)
  })

  it('should show credentials error dialog on import', () => {
    utils.clearCredentials()
    cy.get('#importAllEmailTemplatesButton').click()
    cy.get('#zipFileInput').attachFile('cdc-tools-email-import')
    cy.get('#importZipButton').click()
    cy.get('#errorPopup').should('have.text', data.missingCredentialsErrorMessage)
  })
})
