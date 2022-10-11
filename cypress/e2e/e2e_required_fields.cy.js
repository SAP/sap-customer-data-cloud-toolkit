/* eslint-disable no-undef */
describe('Site Deployer required fields tests', () => {
  it('should render disabled create button', () => {
    cy.visit('http://localhost:3000')
    cy.contains('Site Deployer').click()
    const createButton = cy.get('body').find('#createButton').shadow().find('.ui5-button-root')
    createButton.should('be.disabled')
  })

  it('should render enabled create button when basedomain, datacenter and struture fields are filled in', () => {
    cy.get('#cdctools-siteDomain').shadow().find('#ui5wc_11-inner').type('a_b_c_site_deployer').should('have.value', 'a_b_c_site_deployer')
    cy.get('#cdctools-dataCenter').shadow().find('.ui5-multi-combobox-tokenizer').find('[text="AU"]').click()
    cy.get('#cdctools-siteStructure').then((dropdown) => {
      cy.wrap(dropdown).click()

      cy.get('.ui5wc_24').shadow().find('.ui5-select-popover').find('#ui5wc_20-li').click()
    })
    const createButton = cy.get('body').find('#createButton').shadow().find('.ui5-button-root')
    createButton.should('be.enabled')
  })

  it('should render disabled save button', () => {
    const saveButton = cy.get('body').find('#save-main')
    saveButton.should('be.disabled')
  })

  it('should render disabled cancel button', () => {
    const cancelButton = cy.get('body').find('#cancel-main')
    cancelButton.should('be.disabled')
  })

  it('should render enabled save button when basedomain and datacenter fields are filled in', () => {
    cy.get('body').find('#addParentButton').click()
    cy.get('body').find('#baseDomainInput').shadow().find('.ui5-input-inner').type('a_b_c_site_deployer')
    cy.get('body').find('#dataCenterSelect').click()
    cy.get('body').find('ui5-static-area-item').shadow().find('.ui5-select-popover').find('ui5-list').eq(1).click()

    const saveButton = cy.get('body').find('#save-main')
    saveButton.should('be.enabled')
  })

  it('should render enabled cancel button after adding a parent site', () => {
    const cancelButton = cy.get('body').find('#cancel-main')
    cancelButton.should('be.enabled')
  })
})
