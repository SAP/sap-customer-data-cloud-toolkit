/* eslint-disable no-undef */
import * as utils from './utils'
import * as dataTest from './dataTest'

describe('Copy Configuration extended test suite', () => {
  beforeEach(() => {
    utils.mockGetConfigurationRequests()
    utils.startUp(dataTest.copyConfigExtendendMenuOption)
  })

  it('should display all expected elements', () => {
    cy.get('ui5-title').eq(1).should('have.text', dataTest.copyConfigExtendendTitle)
    cy.get('#copyConfigExtendedHeaderText').should('have.text', dataTest.copyConfigExtendendHeaderText)
    cy.get('[title-text = APIs]').should('be.visible')
    cy.get('#currentSiteLabel').should('have.text', dataTest.copyConfigCurrentSiteLabel)
    cy.get('#currentSiteApiKeyLabel').should('have.text', dataTest.copyConfigCurrentSiteApiKeyLabel)
    cy.get('#currentSiteName').should('have.text', dataTest.currentSiteName)
    cy.get('#targetSitesApisLabel').should('have.text', dataTest.copyConfigTargetSitesApisLabel)
    cy.get('#targetApiKeyInput').should('be.visible')
    cy.get('[title-text = "Select Configuration"]').should('be.visible')
    utils.checkElementsInitialState()
  })

  it('should display success popup after successfully copy on save', () => {
    utils.mockSetConfigurationRequests()
    utils.fillTargetApiKeyInput()
    utils.setConfigurationCheckBox()
    cy.get('#saveButton').shadow().find('button').should('be.enabled')
    cy.get('#saveButton').click()
    cy.get('#copyConfigSuccessPopup').should('have.text', dataTest.copyConfigSuccessPopupMessage)
    cy.get('#copyConfigSuccessPopup').find('#closeButton').click()
    utils.checkElementsInitialState()
  })

  it('should clear target api keys and checkboxes, and disable save button on cancel', () => {
    utils.fillTargetApiKeyInput()
    utils.setConfigurationCheckBox()
    cy.get('#cancelButton').click()
    utils.checkElementsInitialState()
  })

  it('should display errors on unsuccessfull set configurations and clear them on cancel', () => {
    utils.mockSetConfigurationRequests()
    utils.mockResponse(dataTest.mockedSetSchemaErrorResponse, 'POST', 'accounts.setSchema')
    utils.fillTargetApiKeyInput()
    utils.setConfigurationCheckBox()
    utils.checkErrors('not.exist')
    cy.get('#saveButton').click()
    utils.checkErrors('be.visible')
    cy.get('#cancelButton').shadow().find('button').click()
    utils.checkErrors('not.exist')
  })

  it('should delete an added Target Site from the Targe Sites list', () => {
    utils.fillTargetApiKeyInput()
    cy.get('#selectedTargetApiKeysList').should('have.length', '1')
    cy.get('#selectedTargetApiKeysList').find('ui5-li-custom').shadow().find('ui5-button').click()
    cy.get('#selectedTargetApiKeysList').find('ui5-li-custom').should('not.exist')
  })

  it('should show Toast warning when adding a duplicated Target Site', () => {
    cy.get('#targetApiKeyInput').shadow().find('[class = "ui5-input-inner"]').type('test!')
    cy.get('#addTargetSiteButton').click()
    cy.get('#targetApiKeyInput').shadow().find('[class = "ui5-input-inner"]').type('{enter}')
    cy.get('#duplicatedWarningToast').should('have.text', dataTest.expectedDuplicatedToastMessage)
  })
})
