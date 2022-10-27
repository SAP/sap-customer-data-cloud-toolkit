/* eslint-disable no-undef */
describe('Site Deployer create multiple datacenters', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')

    cy.contains('Site Deployer').click()
  })

  it('Creating a parent with multiple datacenters', () => {
    getSiteDomain('a_b_c_site_deployer_multiple_datacenters').should('have.value', 'a_b_c_site_deployer_multiple_datacenters')

    getSiteStructure(1).should('have.text', 'Structure 1')

    getCreateButton().click()
    cy.get('ui5-table-row').should('have.length', '6')
  })

  it('Create 1 parent site', () => {
    const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
    cy.on('uncaught:exception', (err) => {
      if (resizeObserverLoopErrRe.test(err.message)) {
        return false
      }
    })
    getSiteStructure(1).should('have.text', 'Structure 1')
    getDataCenters('AU').click()
    getDataCenters('EU').click()
    getDataCenters('US').shadow().find('[class="ui5-token--text"]').should('have.text', 'US')
    getCreateButton().should('be.disabled')
    getSaveButton().should('be.disabled')
    getSiteDomain('a_b_c_site_deployer_multiple_datacenters').should('have.value', 'a_b_c_site_deployer_multiple_datacenters')

    cy.get('ui5-table-row').should('have.length', '0')
    getCreateButton().should('not.be.disabled')
    getCreateButton().click()
    cy.get('ui5-table-row').should('have.length', '2')
    getSaveButton().should('not.be.disabled')
    cy.get('#cancel-main').click()

    cy.get('ui5-table-row').should('have.length', '0')
  })
  it('Should add a parent Site Manually and a ChildSite', () => {
    cy.get('#addParentButton').click()

    // cy.get('#baseDomainInput').shadow().find('[class = "ui5-input-inner"]').type('manually_add_parent_site')
    cy.get('#baseDomainInput').shadow().find('[class = "ui5-input-inner"]').type('Manually add  parent site')
    cy.get('ui5-table-cell').eq(1).shadow().get('ui5-input').eq(2).shadow().find('[class = "ui5-input-inner"]').type('Manually added description')
    cy.get('#dataCenterSelect').click()
    cy.get('ui5-static-area-item').shadow().find('.ui5-select-popover').eq(1).find('ui5-li').eq(2).click()
    getSaveButton().should('not.be.disabled')

    cy.get('ui5-table-cell').eq(3).click()
    cy.get('ui5-responsive-popover').find('[data-component-name = "ActionSheetMobileContent"] ').find('[accessible-name="Create Child Site Item 1 of 2"]').click()

    cy.get('ui5-table-row')
      .eq(1)
      .shadow()
      .get('ui5-table-cell')
      .eq(4)
      .shadow()
      .get('ui5-input')
      .eq(4)
      .shadow()
      .find('[class = "ui5-input-inner"]')
      .type('Manually added description')

    cy.get('ui5-table-row')
      .eq(1)
      .shadow()
      .get('ui5-table-cell')
      .eq(4)
      .shadow()
      .get('ui5-input')
      .eq(3)
      .shadow()
      .find('[class = "ui5-input-inner"]')
      .type('Manually added description')
    getSaveButton().should('not.be.disabled')
  })

  function getDataCenters(dataCenter) {
    return cy.get('#cdctools-dataCenter').shadow().find('.ui5-multi-combobox-tokenizer').find(`[text = ${dataCenter}]`)
  }

  function getSiteStructure(optionNumber) {
    cy.get('#cdctools-siteStructure').click()
    return cy.get('ui5-static-area-item').shadow().find('.ui5-select-popover').find('ui5-li').eq(optionNumber).click()
  }

  function getSiteDomain(siteDomain) {
    return cy.get('#cdctools-siteDomain').shadow().find('[class = "ui5-input-inner"]').type(siteDomain)
  }

  function getCreateButton() {
    return cy.get('body').find('#createButton').shadow().find('.ui5-button-root')
  }
  function getSaveButton() {
    return cy.get('body').find('#save-main')
  }
})
