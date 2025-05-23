/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import * as dataTest from './dataTest'
import { mockedSetSchemaErrorResponse, mockedSetSchemaResponse } from './dataTest'
import * as utils from './utils'

describe('Copy Configuration extended test suite', () => {
  context('Check initial elements state', () => {
    beforeEach(() => {
      utils.mockGetConfigurationRequests()
      utils.startUp(dataTest.copyConfigExtendendMenuOption)
    })

    it('should display all expected elements', () => {
      cy.get('[data-cy ="copyConfigurationExtendedPageTitle"]').should('have.text', dataTest.copyConfigExtendendTitle)
      cy.get('[data-cy ="copyConfigExtendedHeaderText"]').should('have.text', dataTest.copyConfigExtendendHeaderText)
      cy.get('[title-text = "Select Target Sites"]').should('be.visible')
      cy.get('[data-cy ="currentSiteLabel"]').should('have.text', dataTest.copyConfigCurrentSiteLabel)
      cy.get('[data-cy ="currentSiteApiKeyLabel"]').should('have.text', dataTest.copyConfigCurrentSiteApiKeyLabel)
      cy.get('[data-cy ="copyConfigurationExtendedSearchSitesInputCard"]').find('#apiKeyInput').should('be.visible')
      cy.get('[title-text = "Select Configuration"]').should('be.visible')
      utils.checkElementsInitialState()
    })

    it('should uncheck links and credentials', () => {
      //In the beginning all the checkBoxes are not checked
      cy.get('[data-cy ="selectAllCheckbox"]').should('not.be.checked')
      cy.get('ui5-tree').each(($el) => cy.wrap($el).find('ui5-checkbox').should('not.be.checked'))
      //When select all checkbox is clicked all the other checkboxes from the ui5-tree are checked
      cy.get('[data-cy ="selectAllCheckbox"]').realClick()
      cy.get('[data-cy ="selectAllCheckbox"]').should('have.prop', 'checked')
      cy.get('ui5-tree').each(($el) => cy.wrap($el).find('ui5-checkbox').should('have.prop', 'checked'))
      //When clicking on the removeIncludedUrlButton the "Include URL" checkbox are not checked
      cy.get('[data-cy ="removeIncludedUrlButton"]').click()
      cy.get('ui5-tree').find('[id="socialIdentities"]').should('not.be.checked')
      // email templates checkboxes
      cy.get('ui5-tree').find('[id="passwordReset-Link"]').should('not.be.checked')
      cy.get('ui5-tree').find('[id="LitepreferencesCenter-Link"]').should('not.be.checked')
      // policies checkboxes
      cy.get('ui5-tree').find('[id="pdoubleOptIn-nextUrl-Link"]').should('not.be.checked')
      cy.get('ui5-tree').find('[id="pdoubleOptIn-nextExpiredUrl-Link"]').should('not.be.checked')
      cy.get('ui5-tree').find('[id="pemailVerification-Link"]').should('not.be.checked')
      cy.get('ui5-tree').find('[id="recaptchaPolicies"]').should('not.be.checked')
    })

    it('should delete an added Target Site from the Targe Sites list', () => {
      utils.fillTargetApiKeyInput()
      utils.checkTargetSitesList()
      cy.get('[data-cy ="selectedTargetApiKeysList"]').find('ui5-li-custom').shadow().find('ui5-button').shadow().find('button').should('be.visible')
      cy.wait(1000)
      cy.get('[data-cy ="selectedTargetApiKeysList"]').find('ui5-li-custom').shadow().find('ui5-button').shadow().find('button').should('not.be.disabled').click()
      cy.get('[data-cy ="selectedTargetApiKeysList"]').should('not.exist')
    })

    it('should clear target api keys and checkboxes, and disable save button on cancel', () => {
      utils.fillTargetApiKeyInput()
      utils.setConfigurationCopyConfig()
      cy.get('[data-cy ="copyConfigExtendedCancelButton"]').click()
      utils.checkElementsInitialState()
    })

    it('should select and unselect all configurations', () => {
      cy.get('[data-cy ="selectAllCheckbox"]').should('not.be.checked')
      cy.get('ui5-tree').each(($el) => cy.wrap($el).find('ui5-checkbox').should('not.be.checked'))
      cy.get('[data-cy ="selectAllCheckbox"]').realClick()
      cy.get('[data-cy ="selectAllCheckbox"]').should('have.prop', 'checked')
      cy.get('ui5-tree').each(($el) => cy.wrap($el).find('ui5-checkbox').should('have.prop', 'checked'))
      cy.get('[data-cy ="selectAllCheckbox"]').realClick()
      cy.get('[data-cy ="selectAllCheckbox"]').should('not.be.checked')
      cy.get('ui5-tree').each(($el) => cy.wrap($el).find('ui5-checkbox').should('not.be.checked'))
    })
  })

  context('Display success messages', () => {
    beforeEach(() => {
      utils.mockGetConfigurationRequests()
      utils.startUp(dataTest.copyConfigExtendendMenuOption)
    })

    it('should display success popup after successfully copy on save', () => {
      cy.intercept('POST', 'accounts.setSchema', { body: mockedSetSchemaResponse }).as('setSchema')
      utils.fillTargetApiKeyInput()

      utils.setConfigurationCopyConfig()
      cy.get('[data-cy ="copyConfigExtendedSaveButton"]').shadow().find('button').should('be.enabled')
      cy.get('[data-cy ="copyConfigExtendedSaveButton"]').click()
      cy.get('[data-cy ="copyConfigSuccessPopup"]').should('have.text', dataTest.expectedCopyConfigSuccessMessage)
      cy.get('[data-cy ="copyConfigSuccessPopup"]').find('#closeButton').click()
    })

    it('should display errors on unsuccessfull set configurations and clear them on cancel', () => {
      cy.intercept('POST', 'accounts.setSchema', { body: mockedSetSchemaErrorResponse }).as('setSchemaError')
      utils.fillTargetApiKeyInput()
      utils.setConfigurationCopyConfig()
      cy.get('[icon = error]').should('not.exist')
      cy.get('[data-cy ="copyConfigExtendedSaveButton"]').click()
      cy.get('#errorListContainer').find('[id ="messageList"]').find('ui5-li-custom').should('have.length', 3)
      cy.get('[data-cy ="copyConfigExtendedCancelButton"]').shadow().find('button').click()
      cy.get('[icon = error]').should('not.exist')
    })

    it('should show a MessageStrip message when adding a duplicated Target Site and close it', () => {
      cy.get('[data-cy ="apiKeyInput"]').eq(0).shadow().find('[class = "ui5-input-inner"]').type('test')
      cy.wait(1000)
      cy.get('[data-cy ="copyConfigurationExtendedSearchSitesInputCard"]').find('#addTargetSiteButton').click()
      cy.get('[data-cy ="apiKeyInput"]').eq(0).shadow().find('[class = "ui5-input-inner"]').type('test')
      cy.wait(1000)
      cy.get('[data-cy ="copyConfigurationExtendedSearchSitesInputCard"]').find('#addTargetSiteButton').click()
      cy.get('[data-cy ="messageStripError"]').should('have.text', dataTest.expectedDuplicatedMessage)
      cy.get('[data-cy ="messageStripError"]').shadow().find('ui5-button').click()
      cy.get('[data-cy ="messageStripError"]').should('not.exist')
    })

    // it('should add the apiKey after the user insert it with spaces ', () => {
    //   const dummyApiKeyWithSpaces = ` ${dataTest.dummyApiKey}  `
    //   cy.get('[data-cy ="copyConfigurationExtendedSearchSitesInputCard"]').find('#apiKeyInput').shadow().find('[class = "ui5-input-inner"]').type(dummyApiKeyWithSpaces)
    //   cy.waitUntil(() =>
    //     cy
    //       .get('[data-cy ="copyConfigurationExtendedSearchSitesInputCard"]')
    //       .find('#apiKeyInput')
    //       .shadow()
    //       .find('[class = "ui5-input-inner"]')
    //       .then((win) => cy.get(win).should('have.value', dummyApiKeyWithSpaces)),
    //   )
    //   cy.get('[data-cy ="copyConfigurationExtendedSearchSitesInputCard"]').find('#apiKeyInput').shadow().find('[class = "ui5-input-inner"]').focus().type('{enter}')
    //   cy.get('[data-cy ="selectedTargetApiKeysList"]').find('ui5-li-custom').find('div > table').should('contain.text', dataTest.dummyTargetApiKeyText)
    // })
  })
})
