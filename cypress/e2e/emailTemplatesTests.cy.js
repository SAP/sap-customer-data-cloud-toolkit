/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

/* eslint-disable no-undef */
import * as dataTest from './dataTest'
import * as utils from './utils'

describe('Email Templates Test Suite', () => {
  beforeEach(() => {
    utils.startUp(dataTest.emailTemplatesIconName)
  })

  it('should display Export All and Import All buttons', () => {
    cy.get('[data-cy ="exportAllEmailTemplatesButton"]').should('not.be.disabled')
    cy.get('[data-cy ="importAllEmailTemplatesButton"]').should('not.be.disabled')
  })

  it('should show error messages on export button', () => {
    utils.mockResponse(dataTest.emailTemplateExportError, 'POST', 'admin.getSiteConfig')
    cy.get('[data-cy ="exportAllEmailTemplatesButton"]').click()
    cy.get('[data-cy ="emailTemplatesErrorPopup"]').shadow().find('#ui5-popup-header').should('have.text', dataTest.emailTemplatesExportErrorHeaderMessage)
    cy.get('[data-cy ="messageItem"]').eq(0).should('have.text', dataTest.emailTemplatesExportErrorMessageDetail)
  })

  it('should show error on import button', () => {
    utils.resizeObserverLoopErrRe()
    cy.get('[data-cy ="importAllEmailTemplatesButton"]').click()
    cy.get('[data-cy ="importPopup"]').contains('Import email templates').should('have.text', dataTest.importEmailsFileHeaderText)
    cy.get('[data-cy ="importZipButton"]').shadow().find('[type="button"]').should('be.disabled')
    cy.get('[data-cy ="zipFileInput"]').attachFile(dataTest.emailExampleFile)
    cy.get('[data-cy ="importZipButton"]').shadow().find('[type="button"]').should('not.be.disabled')
    cy.get('[data-cy ="importZipButton"]').click()
    cy.get('[data-cy ="emailTemplatesErrorPopup"]').shadow().find('header').should('have.text', 'Error')
    cy.get('[data-cy ="messageList"]').eq(0).should('have.text', dataTest.importEmailTemplatesErrorMessage)
  })

  it('should show credentials error dialog on import', () => {
    cy.get('[data-cy ="importAllEmailTemplatesButton"]').click()
    cy.get('[data-cy ="zipFileInput"]').attachFile(dataTest.emailExampleFile)
    cy.get('[data-cy ="importZipButton"]').click()
    cy.get('[data-cy ="credentialErrorPopup"]').eq(1).should('have.text', dataTest.missingCredentialsErrorMessage)
    cy.get('[data-cy ="credentialErrorPopup"]').eq(1).find('#closeButton').click({ force: true })
  })
})
