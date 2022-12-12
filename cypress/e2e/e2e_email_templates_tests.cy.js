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

  it('should show error messages', () => {
    utils.mockResponse(manualRemovalTestData.flat()[1], 'POST', 'admin.getSiteConfig')
    cy.get('#exportAllButton').click()
    cy.get('ui5-list').find(`[data-title = '${data.emailTemplatesExportErrorMessage}']`).should('have.text', data.emailTemplatesExportErrorMessage)
  })

  it('should show import popUp', () => {
    cy.get('#importAllButton').click()
    cy.get('#emailsImportPopup').find('[slot ="startContent"]').should('have.text', 'Import Zip')
    cy.get('ui5-bar').find('[class = "ui5-bar-content"]').find('[class = "btn dialog-button-1"]').should('have.text', 'Import')
  })
})
