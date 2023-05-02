/* eslint-disable no-undef */
import * as utils from './utils'
import * as dataTest from './dataTest'

describe('Copy Configuration extended test suite', () => {
  beforeEach(() => {
    utils.mockGetConfigurationRequests()
    utils.startUp(dataTest.copyConfigExtendendMenuOption)
  })

  it('should display all expected elements', () => {
    cy.get('#copyConfigurationExtendedPageTitle').should('have.text', dataTest.copyConfigExtendendTitle)
    cy.get('#copyConfigExtendedHeaderText').should('have.text', dataTest.copyConfigExtendendHeaderText)
    cy.get('[title-text = "Select Target Sites"]').should('be.visible')
    cy.get('#currentSiteLabel').should('have.text', dataTest.copyConfigCurrentSiteLabel)
    cy.get('#currentSiteApiKeyLabel').should('have.text', dataTest.copyConfigCurrentSiteApiKeyLabel)
    cy.get('#currentSiteName').should('have.text', dataTest.currentSiteName)
    cy.get('#copyConfigurationExtendedSearchSitesInputCard').find('#apiKeyInput').should('be.visible')
    cy.get('[title-text = "Select Configuration"]').should('be.visible')
    utils.checkElementsInitialState()
    cy.get('@windowOpenStub').should('not.be.called')
  })

  it('should display success popup after successfully copy on save', () => {
    utils.mockSetConfigurationRequests()
    utils.fillTargetApiKeyInput()
    utils.setConfigurationCheckBox()
    cy.get('#copyConfigExtendedSaveButton').shadow().find('button').should('be.enabled')
    cy.get('#copyConfigExtendedSaveButton').click()
    cy.get('#copyConfigSuccessPopup').should('have.text', dataTest.copyConfigSuccessPopupMessage)
    cy.get('#copyConfigSuccessPopup').find('#closeButton').click()
    utils.checkElementsInitialState()
    cy.wait(1500)
    cy.get('@windowOpenStub').should('be.called')
  })

  it('should clear target api keys and checkboxes, and disable save button on cancel', () => {
    utils.fillTargetApiKeyInput()
    utils.setConfigurationCheckBox()
    cy.get('#copyConfigExtendedCancelButton').click()
    utils.checkElementsInitialState()
    cy.get('@windowOpenStub').should('not.be.called')
  })

  it('should display errors on unsuccessfull set configurations and clear them on cancel', () => {
    utils.mockSetConfigurationRequests()
    utils.mockResponse(dataTest.mockedSetSchemaErrorResponse, 'POST', 'accounts.setSchema')
    utils.mockResponse(dataTest.mockedSetSchemaErrorResponse, 'POST', 'accounts.getPolicies')
    utils.fillTargetApiKeyInput()
    utils.setConfigurationCheckBox()
    utils.checkErrors('not.exist')
    cy.get('#copyConfigExtendedSaveButton').click()
    utils.checkErrors('be.visible')
    cy.get('#copyConfigExtendedCancelButton').shadow().find('button').click()
    utils.checkErrors('not.exist')
    cy.get('@windowOpenStub').should('not.be.called')
  })

  it('should delete an added Target Site from the Targe Sites list', () => {
    utils.fillTargetApiKeyInput()
    utils.checkTargetSitesList()
    cy.get('#selectedTargetApiKeysList').find('ui5-li-custom').shadow().find('ui5-button').click()
    cy.get('#selectedTargetApiKeysList').should('not.exist')
  })

  it('should show a MessageStrip message when adding a duplicated Target Site and close it', () => {
    cy.get('#copyConfigurationExtendedSearchSitesInputCard').find('#apiKeyInput').shadow().find('[class = "ui5-input-inner"]').type('test')
    cy.wait(1000)
    cy.get('#copyConfigurationExtendedSearchSitesInputCard').find('#addTargetSiteButton').click()
    cy.get('#copyConfigurationExtendedSearchSitesInputCard').find('#apiKeyInput').shadow().find('[class = "ui5-input-inner"]').type('test')
    cy.wait(1000)
    cy.get('#copyConfigurationExtendedSearchSitesInputCard').find('#addTargetSiteButton').click()
    cy.get('#messageStripError').should('have.text', dataTest.expectedDuplicatedMessage)
    cy.get('#messageStripError').shadow().find('ui5-button').click()
    cy.get('#messageStripError').should('not.exist')
  })

  it('should add a Target Site to the Targe Sites list on pressing Enter', () => {
    cy.get('#copyConfigurationExtendedSearchSitesInputCard').find('#apiKeyInput').shadow().find('[class = "ui5-input-inner"]').type('cdc{enter}')
    utils.checkTargetSitesList()
  })

  it('should select and unselect all configurations', () => {
    cy.get('#selectAllCheckbox').should('not.be.checked')
    cy.get('ui5-tree').each(($el) => cy.wrap($el).find('ui5-checkbox').should('not.be.checked'))
    cy.get('#selectAllCheckbox').realClick()
    cy.get('#selectAllCheckbox').should('have.prop', 'checked')
    cy.get('ui5-tree').each(($el) => cy.wrap($el).find('ui5-checkbox').should('have.prop', 'checked'))
    cy.get('#selectAllCheckbox').realClick()
    cy.get('#selectAllCheckbox').should('not.be.checked')
    cy.get('ui5-tree').each(($el) => cy.wrap($el).find('ui5-checkbox').should('not.be.checked'))
  })
})
