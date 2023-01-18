/* eslint-disable no-undef */
import * as utils from './utils'
import * as dataTest from './dataTest'

describe('SMS Templates Test Suite', () => {
  beforeEach(() => {
    utils.startUp('http://localhost:3000', dataTest.smsTemplatesIconName)
  })

  it('should display Export All and Import All buttons', () => {
    cy.get('#exportAllSmsTemplatesButton').should('not.be.disabled')
    cy.get('#importAllSmsTemplatesButton').should('not.be.disabled')
  })

  it('should show error messages on export button', () => {
    utils.mockResponse(dataTest.smsTemplateExportError, 'POST', 'admin.getSiteConfig')
    cy.get('#exportAllSmsTemplatesButton').click()
    cy.get('#smsTemplatesErrorPopup').shadow().find('#ui5-popup-header').should('have.text', dataTest.smsTemplatesExportErrorHeaderMessage)
  })

  it('should show error on import button', () => {
    utils.mockResponse(dataTest.smsTemplateExportError, 'POST', 'admin.getSiteConfig')
    utils.resizeObserverLoopErrRe()
    cy.get('#importAllSmsTemplatesButton').click()
    cy.get('#smsImportPopup').contains('Import SMS templates').should('have.text', dataTest.importSmsFileHeaderText)
    cy.get('#importZipButton').shadow().find('[type="button"]').should('be.disabled')
    cy.get('#zipFileInput').attachFile(dataTest.smsExampleFile)
    cy.get('#importZipButton').shadow().find('[type="button"]').should('not.be.disabled')
    cy.get('#importZipButton').click()
    cy.get('#smsTemplatesErrorPopup').shadow().find('#ui5-popup-header').should('have.text', dataTest.smsTemplatesImportErrorHeaderMessage)
  })

  it('should show credentials error dialog on export', () => {
    utils.clearCredentials()
    cy.get('#exportAllSmsTemplatesButton').click()
    cy.get('#errorPopup').should('have.text', dataTest.missingCredentialsErrorMessage)
    cy.get('#errorPopup').find('#closeButton').click({ force: true })
  })

  it('should show credentials error dialog on import', () => {
    utils.clearCredentials()
    cy.get('#importAllSmsTemplatesButton').click()
    cy.get('#zipFileInput').attachFile(dataTest.smsExampleFile)
    cy.get('#importZipButton').click()
    cy.get('#errorPopup').should('have.text', dataTest.missingCredentialsErrorMessage)
    cy.get('#errorPopup').find('#closeButton').click({ force: true })
  })
})
