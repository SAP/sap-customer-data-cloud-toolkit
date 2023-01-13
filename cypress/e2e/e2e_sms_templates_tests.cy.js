/* eslint-disable no-undef */
import * as utils from './utils'
import manualRemovalTestData from './manual-removal-test-data.json'
import * as data from './test-data'

describe('SMS Templates Test Suite', () => {
  beforeEach(() => {
    utils.startUp(data.smsTemplatesIconName)
  })

  it('should display Export All and Import All buttons', () => {
    cy.get('#exportAllSmsTemplatesButton').should('not.be.disabled')
    cy.get('#importAllSmsTemplatesButton').should('not.be.disabled')
  })

  it('should show error messages on export button', () => {
    utils.mockResponse(manualRemovalTestData.flat()[2], 'POST', 'admin.getSiteConfig')
    cy.get('#exportAllSmsTemplatesButton').click()
    cy.get('#smsTemplatesErrorPopup').shadow().find('#ui5-popup-header').should('have.text', data.smsTemplatesExportErrorHeaderMessage)
  })

  it('should show error on import button', () => {
    utils.mockResponse(manualRemovalTestData.flat()[2], 'POST', 'admin.getSiteConfig')
    utils.resizeObserverLoopErrRe()
    cy.get('#importAllSmsTemplatesButton').click()
    cy.get('#smsImportPopup').contains('Import SMS templates').should('have.text', data.importSmsFileHeaderText)
    cy.get('#importZipButton').shadow().find('[type="button"]').should('be.disabled')
    cy.get('#zipFileInput').attachFile(data.cdcExampleFile)
    cy.get('#importZipButton').shadow().find('[type="button"]').should('not.be.disabled')
    cy.get('#importZipButton').click()
    cy.get('#smsTemplatesErrorPopup').shadow().find('#ui5-popup-header').should('have.text', data.smsTemplatesImportErrorHeaderMessage)
  })

  it('should show credentials error dialog on export', () => {
    utils.clearCredentials()
    cy.get('#exportAllSmsTemplatesButton').click()
    cy.get('#errorPopup').should('have.text', data.missingCredentialsErrorMessage)
  })

  it('should show credentials error dialog on import', () => {
    utils.clearCredentials()
    cy.get('#importAllSmsTemplatesButton').click()
    cy.get('#zipFileInput').attachFile(data.cdcExampleFile)
    cy.get('#importZipButton').click()
    cy.get('#errorPopup').should('have.text', data.missingCredentialsErrorMessage)
  })
})
