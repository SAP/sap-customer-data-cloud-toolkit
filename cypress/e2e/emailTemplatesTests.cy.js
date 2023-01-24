/* eslint-disable no-undef */
import * as utils from './utils'
import * as dataTest from './dataTest'

describe('Email Templates Test Suite', () => {
  beforeEach(() => {
    utils.startUp('http://localhost:3000', dataTest.emailTemplatesIconName)
  })

  it('should display Export All and Import All buttons', () => {
    cy.get('#exportAllEmailTemplatesButton').should('not.be.disabled')
    cy.get('#importAllEmailTemplatesButton').should('not.be.disabled')
  })

  it('should show error messages on export button', () => {
    utils.mockResponse(dataTest.emailTemplateExportError, 'POST', 'admin.getSiteConfig')
    cy.get('#exportAllEmailTemplatesButton').click()
    cy.get('#emailTemplatesErrorPopup').shadow().find('#ui5-popup-header').should('have.text', dataTest.emailTemplatesExportErrorHeaderMessage)
    cy.get('#messageList').should('have.text', dataTest.emailTemplatesExportErrorMessageDetail)
  })

  it('should show error on import button', () => {
    utils.resizeObserverLoopErrRe()
    cy.get('#importAllEmailTemplatesButton').click()
    cy.get('#emailsImportPopup').contains('Import email templates').should('have.text', dataTest.importEmailsFileHeaderText)
    cy.get('#importZipButton').shadow().find('[type="button"]').should('be.disabled')

    cy.get('#zipFileInput').attachFile(dataTest.emailExampleFile)
    cy.get('#importZipButton').shadow().find('[type="button"]').should('not.be.disabled')
    cy.get('#importZipButton').click()
    cy.get('#emailTemplatesValidationErrorPopup').shadow().find('#ui5-popup-header').should('have.text', 'Warning')
    cy.get('#emailTemplatesValidationErrorPopup').find('[id="messageList"]').should('have.text', dataTest.importEmailTemplatesErrorMessage)
  })

  it('should show credentials error dialog on export', () => {
    utils.clearCredentials()
    cy.get('#exportAllEmailTemplatesButton').click()
    cy.get('#errorPopup').should('have.text', dataTest.missingCredentialsErrorMessage)
    utils.clickPopUpOkButton('#errorPopup')
  })

  it('should show credentials error dialog on import', () => {
    utils.clearCredentials()
    cy.get('#importAllEmailTemplatesButton').click()
    cy.get('#zipFileInput').attachFile(dataTest.emailExampleFile)
    cy.get('#importZipButton').click()
    cy.get('#errorPopup').should('have.text', dataTest.missingCredentialsErrorMessage)
    cy.get('#errorPopup').find('#closeButton').click({ force: true })
  })
})
