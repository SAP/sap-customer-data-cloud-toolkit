/* eslint-disable no-undef */
describe('Site Deployer E2E Tests', () => {
  it('Validates the url"', () => {
    cy.visit('http://localhost:3000')

    cy.contains('Site Deployer').click()
    cy.url().should('include', '/cdc-tools/site-deployer')
  })

  it('Writes the site name', () => {
    cy.get('#cdctools-siteDomain').shadow().find('#ui5wc_11-inner').type('a_b_c_site_deployer').should('have.value', 'a_b_c_site_deployer')
  })

  it('Selects a Data Center"', () => {
    cy.get('#cdctools-dataCenter').shadow().find('.ui5-multi-combobox-tokenizer').find('[text="AU"]').click()
    cy.get('#cdctools-dataCenter').shadow().find('.ui5-multi-combobox-tokenizer').find('[text="US"]').click()
    cy.get('#cdctools-dataCenter').shadow().find('.ui5-multi-combobox-tokenizer').should('have.length', '1')
  })

  it('Selects a Site Structure"', () => {
    cy.get('#cdctools-siteStructure').then((dropdown) => {
      cy.wrap(dropdown).click()

      cy.get('.ui5wc_24').shadow().find('.ui5-select-popover').find('#ui5wc_20-li').click()
    })
    cy.get('#cdctools-siteStructure').shadow().find('.ui5-select-label-root').should('have.text', 'Structure 1')
  })

  it('Select the create site button"', () => {
    cy.get('ui5-button[icon = "add"]').shadow().find('.ui5-button-root').find('#ui5wc_12-content').click()
    cy.get('ui5-table-row').should('have.length', '1')
  })

  it('Saves the Site"', () => {
    cy.get('#save-main').click()
  })
})
