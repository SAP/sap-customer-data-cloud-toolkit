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
    cy.get('#destinationSiteLabel').should('have.text', dataTest.copyConfigDestinationSiteLabel)
    cy.get('#targetSitesApisLabel').should('have.text', dataTest.copyConfigTargetSitesApisLabel)
    cy.get('#targetApiKeyInput').should('be.visible')

    cy.get('[title-text = "Select Configuration"]').should('be.visible')
    cy.get('ui5-tree').should('be.visible')

    cy.get('#saveButton').shadow().find('button').should('be.disabled')
    cy.get('#cancelButton').shadow().find('button').should('be.enabled')
  })

  it('should display success popup after successful copy on save', () => {
    utils.mockSetConfigurationRequests()

    cy.get('#targetApiKeyInput').shadow().find('[class = "ui5-input-inner"]').type(dataTest.dummyApiKey)
    cy.get('ui5-tree').eq(0).find('ui5-checkbox').eq(0).click()
    cy.get('#saveButton').shadow().find('button').should('be.enabled')
    cy.get('#saveButton').click()
    cy.get('#copyConfigSuccessPopup').should('have.text', dataTest.copyConfigSuccessPopupMessage)
    cy.get('#copyConfigSuccessPopup').find('#closeButton').click({ force: true })
  })

  it('should clear target api keys and checkboxes, and disable save button on cancel', () => {
    cy.get('#targetApiKeyInput').shadow().find('[class = "ui5-input-inner"]').type(dataTest.dummyApiKey)
    cy.get('ui5-tree').eq(0).find('ui5-checkbox').eq(0).click()
    cy.get('#cancelButton').click()
    cy.get('#targetApiKeyInput').shadow().find('[class = "ui5-input-inner"]').should('have.text', '')
    cy.get('ui5-tree').eq(0).find('ui5-checkbox').should('not.be.checked')
    cy.get('#saveButton').shadow().find('button').should('be.disabled')
  })
})
