/* eslint-disable no-undef */
import * as utils from './utils'
import manualRemovalTestData from './manual-removal-test-data.json'
import * as data from './test-data'

describe('Email Templates Test Suite', () => {
  beforeEach(() => {
    utils.startUp(data.emailTemplatesIconName)
  })

  it('should display Export All and Import All buttons', () => {
    cy.get('#exportAllButton').should('not.be.disabled')
    cy.get('#importAllButton').should('not.be.disabled')
  })

  it('should show error messages on export button', () => {
    utils.mockResponse(manualRemovalTestData.flat()[1], 'POST', 'admin.getSiteConfig')
    cy.get('#exportAllButton').click()
    cy.get('#emailTemplatesErrorPopup').shadow().find('#ui5-popup-header').should('have.text', 'Error')
    cy.get('ui5-list').find(`[data-title = '${data.emailTemplatesExportErrorMessage}']`).should('have.text', data.emailTemplatesExportErrorMessage)
  })

  it('should show error on import button', () => {
    cy.get('#importAllButton').click()
    cy.get('#emailsImportPopup').find('[slot ="startContent"]').should('have.text', data.importFileHeaderText)
    cy.get('#importZipButton').shadow().find('[type="button"]').should('be.disabled')
    cy.get('#zipFileInput').attachFile(data.cdcExampleFile)
    cy.get('#importZipButton').shadow().find('[type="button"]').should('not.be.disabled')
    cy.get('#importZipButton').click()
    cy.get('#emailTemplatesErrorPopup').shadow().find('#ui5-popup-header-text').should('have.text', 'Error')
  })
})
