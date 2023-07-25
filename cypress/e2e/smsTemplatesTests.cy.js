/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


/* eslint-disable no-undef */
import * as utils from './utils'
import * as dataTest from './dataTest'
describe('SMS Templates Test Suite', () => {
  beforeEach(() => {
    utils.startUp(dataTest.smsTemplatesIconName)
  })

  it('should display Export All and Import All buttons', () => {
    cy.get('[data-cy ="exportAllSmsTemplatesButton"]').should('not.be.disabled')
    cy.get('[data-cy ="importAllSmsTemplatesButton"]').should('not.be.disabled')
  })

  it('should show error messages on export button', () => {
    utils.mockResponse(dataTest.smsTemplateExportError, 'POST', 'admin.getSiteConfig')
    cy.get('[data-cy ="exportAllSmsTemplatesButton"]').click()
    cy.get('[data-cy ="smsTemplatesErrorPopup"]').shadow().find('#ui5-popup-header').should('have.text', dataTest.smsTemplatesExportErrorHeaderMessage)
    cy.get('[data-cy ="smsTemplatesErrorPopup"]').find('#closeButton').click()
  })

  it('should execute with success on export button', () => {
    utils.mockResponse(dataTest.siteConfigResponse, 'POST', 'admin.getSiteConfig')
    utils.mockResponse(dataTest.smsTemplateSuccessResponse, 'POST', 'accounts.sms.templates.get')
    cy.get('[data-cy ="exportAllSmsTemplatesButton"]').click()
  })

  it('should show error on import button', () => {
    utils.mockResponse(dataTest.smsTemplateExportError, 'POST', 'admin.getSiteConfig')
    utils.resizeObserverLoopErrRe()
    cy.get('[data-cy ="importAllSmsTemplatesButton"]').click()
    cy.get('[data-cy ="importPopup"]').contains('Import SMS templates').should('have.text', dataTest.importSmsFileHeaderText)
    cy.get('[data-cy ="importZipButton"]').shadow().find('[type="button"]').should('be.disabled')
    cy.get('[data-cy ="zipFileInput"]').attachFile(dataTest.smsExampleFile)
    cy.get('[data-cy ="importZipButton"]').shadow().find('[type="button"]').should('not.be.disabled')
    cy.get('[data-cy ="importZipButton"]').click()
    cy.get('[data-cy ="smsTemplatesErrorPopup"]').shadow().find('#ui5-popup-header').should('have.text', dataTest.smsTemplatesImportErrorHeaderMessage)
    cy.get('@windowOpenStub').should('not.be.called')
  })

  it('should show success popup on import', () => {
    utils.mockResponse(dataTest.siteConfigResponse, 'POST', 'admin.getSiteConfig')
    utils.mockResponse(dataTest.smsTemplateSuccessResponse, 'POST', 'accounts.sms.templates.set')
    utils.resizeObserverLoopErrRe()
    cy.get('[data-cy ="importAllSmsTemplatesButton"]').click()
    cy.get('[data-cy ="importPopup"]').contains('Import SMS templates').should('have.text', dataTest.importSmsFileHeaderText)
    cy.get('[data-cy ="importZipButton"]').shadow().find('[type="button"]').should('be.disabled')
    cy.get('[data-cy ="zipFileInput"]').attachFile(dataTest.smsExampleFile)
    cy.get('[data-cy ="importZipButton"]').shadow().find('[type="button"]').should('not.be.disabled')
    cy.get('[data-cy ="importZipButton"]').click()
    cy.get('[data-cy ="smsSuccessPopup"]').shadow().find('#ui5-popup-header').should('have.text', 'Success')
    utils.clickPopUpOkButton('smsSuccessPopup')
    cy.get('@windowOpenStub').should('be.called')
    
  })

  it('should show credentials error dialog on export', () => {
    utils.clearCredentials()
    cy.get('[data-cy ="exportAllSmsTemplatesButton"]').click()
    cy.get('[data-cy ="credentialErrorPopup"]').eq(1).should('have.text', dataTest.missingCredentialsErrorMessage)
    utils.clickPopUpOkButton('credentialErrorPopup')
    cy.get('@windowOpenStub').should('not.be.called')
  })

  it('should show credentials error dialog on import', () => {
    utils.clearCredentials()
    cy.get('[data-cy ="importAllSmsTemplatesButton"]').click()
    cy.get('[data-cy ="zipFileInput"]').attachFile(dataTest.smsExampleFile)
    cy.get('[data-cy ="importZipButton"]').click()
    cy.get('[data-cy ="credentialErrorPopup"]').eq(1).should('have.text', dataTest.missingCredentialsErrorMessage)
    cy.get('@windowOpenStub').should('not.be.called')
  })
})
