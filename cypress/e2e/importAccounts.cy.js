import * as utils from './utils'
import * as dataTest from './dataTest'

describe('Import Account - Configuration Tree test suite', () => {
  context('Configuration Tree ', () => {
    beforeEach(() => {
      utils.mockConfigurationTreeFullAccount()
      utils.startUp('Import Data')
      utils.getImportAccountsInformation()
    })
    afterEach(() => {
      cy.clearAllCookies()
      cy.clearAllLocalStorage()
      cy.clearAllSessionStorage()
    })
    it('Should export data schema successfully from a full account', () => {
      cy.get('#importAccountsCard').get('ui5-tree').should('have.length', 20)
      cy.get('[data-cy ="importDataSaveButton"]').should('not.be.disabled')
      cy.get('#data').click().should('have.prop', 'checked')
      cy.get('#importDataSaveButton').click()
    })
    it('Should export data schema successfully from a lite account', () => {
      cy.get('#importDataSelectAccount').click()
      cy.get('ui5-static-area-item').shadow().find('ui5-responsive-popover').find('ui5-li').contains('Lite Account').click()
      cy.get('#importDataSelectAccount').shadow().find('.ui5-select-label-root').should('have.text', 'Lite Account')
      cy.get('#importAccountsCard').get('ui5-tree').should('have.length', 6)
      cy.get('[data-cy ="importDataSaveButton"]').should('not.be.disabled')
      cy.get('#data').click().should('have.prop', 'checked')
      cy.get('#importDataSaveButton').click()
    })
    it('Should check if isSubscribe checkbox is readOnly', () => {
      cy.get(':nth-child(4) > [level="1"]').shadow().find('.ui5-li-tree-toggle-box').click()
      cy.get(':nth-child(4) > [level="1"] > :nth-child(2)').shadow().find('li').find('.ui5-li-tree-toggle-box').find('ui5-icon').click()
      cy.get('#importAccountsCard').find('[id="subscriptions.newsletter.commercial.tags"]').click()
      cy.get('#importAccountsCard').find('[id="subscriptions.newsletter.commercial.isSubscribed"]').should('have.prop', 'checked')
    })
    it('Should check if isConsentGranted checkbox is readOnly', () => {
      cy.get(':nth-child(7) > [level="1"]').shadow().find('.ui5-li-tree-toggle-box').click()
      cy.get(':nth-child(7) > [level="1"] > :nth-child(2)').shadow().find('li').find('.ui5-li-tree-toggle-box').find('ui5-icon').click()
      cy.get('[expanded=""] > [level="3"]').shadow().find('.ui5-li-tree-toggle-box').find('ui5-icon').click()
      cy.get('#importAccountsCard').find('[id="preferences.terms.sap.actionTimestamp"]').click()
      cy.get('#importAccountsCard').find('[id="preferences.terms.sap.isConsentGranted"]').should('have.prop', 'checked')
    })
    it('Should check if status checkbox is readOnly', () => {
      cy.get(':nth-child(8) > [level="1"]').shadow().find('.ui5-li-tree-toggle-box').click()
      cy.get(':nth-child(8) > [level="1"] > :nth-child(4)').shadow().find('li').find('.ui5-li-tree-toggle-box').find('ui5-icon').click()
      cy.get('#importAccountsCard').find('[id="communications.C_mobileApp.optIn.acceptanceLocation"]').click()
      cy.get('#importAccountsCard').find('[id="communications.C_mobileApp.status"]').should('have.prop', 'checked')
    })
  })
  context('Configuration Tree - Search Tree ', () => {
    beforeEach(() => {
      utils.mockConfigurationTreeFullAccount()
      utils.startUp('Import Data')
      utils.getImportAccountsInformation()
    })
    afterEach(() => {
      cy.clearAllCookies()
      cy.clearAllLocalStorage()
      cy.clearAllSessionStorage()
    })
    it.only('Should write on the search input and check the amount of checkboxes', () => {
      cy.get('#importAccountsCard').get('ui5-tree').should('have.length', 20)
      cy.get('#schemaInput').shadow().find('input').type('data.loyalty.rewardPoints{enter}')
      cy.get('#importAccountsCard').get('ui5-tree-item-custom').should('have.length', 3)
    })
  })
})
