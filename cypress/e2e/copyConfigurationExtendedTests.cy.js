/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import * as utils from './utils'
import * as dataTest from './dataTest'

describe('Copy Configuration extended test suite', () => {
  beforeEach(() => {
    utils.mockGetConfigurationRequests()
    utils.startUp(dataTest.copyConfigExtendendMenuOption)
  })

  // it('should display all expected elements', () => {
  //   cy.get('[data-cy ="copyConfigurationExtendedPageTitle"]').should('have.text', dataTest.copyConfigExtendendTitle)
  //   cy.get('[data-cy ="copyConfigExtendedHeaderText"]').should('have.text', dataTest.copyConfigExtendendHeaderText)
  //   cy.get('[title-text = "Select Target Sites"]').should('be.visible')
  //   cy.get('[data-cy ="currentSiteLabel"]').should('have.text', dataTest.copyConfigCurrentSiteLabel)
  //   cy.get('[data-cy ="currentSiteApiKeyLabel"]').should('have.text', dataTest.copyConfigCurrentSiteApiKeyLabel)
  //   cy.get('[data-cy ="currentSiteName"]').should('have.text', dataTest.currentSiteName)
  //   cy.get('[data-cy ="copyConfigurationExtendedSearchSitesInputCard"]').find('#apiKeyInput').should('be.visible')
  //   cy.get('[title-text = "Select Configuration"]').should('be.visible')
  //   utils.checkElementsInitialState()
  //   cy.get('@windowOpenStub').should('not.be.called')
  // })
  //
  // it('should display success popup after successfully copy on save', () => {
  //   utils.mockSetConfigurationRequests()
  //   utils.fillTargetApiKeyInput()
  //   utils.setConfigurationCheckBox()
  //   cy.get('[data-cy ="copyConfigExtendedSaveButton"]').shadow().find('button').should('be.enabled')
  //   cy.get('[data-cy ="copyConfigExtendedSaveButton"]').click()
  //   cy.get('[data-cy ="copyConfigSuccessPopup"]').should('have.text', dataTest.expectedSuccessMessage)
  //   cy.get('[data-cy ="copyConfigSuccessPopup"]').find('#closeButton').click()
  //   utils.checkElementsInitialState()
  //   cy.wait(1500)
  //   cy.get('@windowOpenStub').should('be.called')
  // })
  //
  // it('should clear target api keys and checkboxes, and disable save button on cancel', () => {
  //   utils.fillTargetApiKeyInput()
  //   utils.setConfigurationCheckBox()
  //   cy.get('[data-cy ="copyConfigExtendedCancelButton"]').click()
  //   utils.checkElementsInitialState()
  //   cy.get('@windowOpenStub').should('not.be.called')
  // })
  //
  // it('should display errors on unsuccessfull set configurations and clear them on cancel', () => {
  //   utils.mockSetConfigurationRequests()
  //   utils.mockResponse(dataTest.mockedSetSchemaErrorResponse, 'POST', 'accounts.setSchema')
  //   utils.fillTargetApiKeyInput()
  //   utils.setConfigurationCheckBox()
  //   cy.get('[icon = error]').should('not.exist')
  //   cy.get('[data-cy ="copyConfigExtendedSaveButton"]').click()
  //   cy.get('#errorListContainer').find('[id ="messageList"]').find('ui5-li-custom').should('have.length', 3)
  //   cy.get('[data-cy ="copyConfigExtendedCancelButton"]').shadow().find('button').click()
  //   cy.get('[icon = error]').should('not.exist')
  //   cy.get('@windowOpenStub').should('not.be.called')
  // })
  //
  // it('should delete an added Target Site from the Targe Sites list', () => {
  //   utils.fillTargetApiKeyInput()
  //   utils.checkTargetSitesList()
  //   cy.get('[data-cy ="selectedTargetApiKeysList"]').find('ui5-li-custom').shadow().find('ui5-button').click()
  //   cy.get('[data-cy ="selectedTargetApiKeysList"]').should('not.exist')
  // })
  //
  // it('should show a MessageStrip message when adding a duplicated Target Site and close it', () => {
  //   cy.get('[data-cy ="apiKeyInput"]').eq(0).shadow().find('[class = "ui5-input-inner"]').type('test')
  //   cy.wait(1000)
  //   cy.get('[data-cy ="copyConfigurationExtendedSearchSitesInputCard"]').find('#addTargetSiteButton').click()
  //   cy.get('[data-cy ="apiKeyInput"]').eq(0).shadow().find('[class = "ui5-input-inner"]').type('test')
  //   cy.wait(1000)
  //   cy.get('[data-cy ="copyConfigurationExtendedSearchSitesInputCard"]').find('#addTargetSiteButton').click()
  //   cy.get('[data-cy ="messageStripError"]').should('have.text', dataTest.expectedDuplicatedMessage)
  //   cy.get('[data-cy ="messageStripError"]').shadow().find('ui5-button').click()
  //   cy.get('[data-cy ="messageStripError"]').should('not.exist')
  // })
  //
  // it('should add a Target Site to the Targe Sites list on pressing Enter', () => {
  //   cy.get('[data-cy ="apiKeyInput"]').eq(0).shadow().find('[class = "ui5-input-inner"]').type('cdc{enter}')
  //   utils.checkTargetSitesList()
  // })
  //
  // it('should select and unselect all configurations', () => {
  //   cy.get('[data-cy ="selectAllCheckbox"]').should('not.be.checked')
  //   cy.get('ui5-tree').each(($el) => cy.wrap($el).find('ui5-checkbox').should('not.be.checked'))
  //   cy.get('[data-cy ="selectAllCheckbox"]').realClick()
  //   cy.get('[data-cy ="selectAllCheckbox"]').should('have.prop', 'checked')
  //   cy.get('ui5-tree').each(($el) => cy.wrap($el).find('ui5-checkbox').should('have.prop', 'checked'))
  //   cy.get('[data-cy ="selectAllCheckbox"]').realClick()
  //   cy.get('[data-cy ="selectAllCheckbox"]').should('not.be.checked')
  //   cy.get('ui5-tree').each(($el) => cy.wrap($el).find('ui5-checkbox').should('not.be.checked'))
  // })
  //
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
  //   cy.get('[data-cy ="selectedTargetApiKeysList"]').find('ui5-li-custom').find('div > table').should('have.text', dataTest.dummyTargetApiKeyText)
  // })

  it('should uncheck links and credentials', () => {
    cy.get('[data-cy ="selectAllCheckbox"]').should('not.be.checked')
    cy.get('ui5-tree').each(($el) => cy.wrap($el).find('ui5-checkbox').should('not.be.checked'))
    cy.get('[data-cy ="selectAllCheckbox"]').realClick()
    cy.get('[data-cy ="selectAllCheckbox"]').should('have.prop', 'checked')
    cy.get('[data-cy ="removeIncludedUrlButton"]').click()
   // cy.get('ui5-tree').find('ui5-checkbox').contains('Include Document URL').should('not.be.checked')

    // cy.get('ui5-tree').each(($el) => cy.wrap($el).find('ui5-checkbox').should('have.prop', 'checked'))
    // cy.get('[data-cy ="selectAllCheckbox"]').realClick()
    // cy.get('[data-cy ="selectAllCheckbox"]').should('not.be.checked')
    // cy.get('ui5-tree').each(($el) => cy.wrap($el).find('ui5-checkbox').should('not.be.checked'))
  })
})
