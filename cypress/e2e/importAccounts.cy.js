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
    it('Should export data schema successfully ', () => {
      cy.intercept('POST', 'accounts.setSchema', { body: dataTest.mockedSetSchemaResponse }).as('setSchema')
      cy.get('[data-cy ="importDataSaveButton"]').should('not.be.disabled')
      cy.get('#data').click().should('have.prop', 'checked')
      cy.get('#importDataSaveButton').click()
    })
  })
})
