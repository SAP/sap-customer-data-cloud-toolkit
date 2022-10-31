/* eslint-disable no-undef */
import * as TestData from '../../src/services/site/data_test'
const expectedGigyaResponseNoUserKey = {
  callId: '80312d051f1345cd931a71ac4db55890',
  errorCode: 403005,
  errorDetails: 'The supplied userkey was not found',
  errorMessage: 'Unauthorized user',
  apiVersion: 2,
  statusCode: 403,
  statusReason: 'Forbidden',
  time: Date.now(),
}
describe('Site Deployer Test Suite', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')

    cy.contains('Site Deployer').click()
  })

  it('Creating 3 parent sites with different datacenters', () => {
    getSiteDomain('a_b_c_site_deployer').should('have.value', 'a_b_c_site_deployer')

    getSiteStructure(5).should('have.text', 'Test Structure')

    getCreateButton().click()
    cy.get('ui5-table-row').should('have.length', '6')
    cy.get('ui5-table-cell').find('[id ="baseDomainInput"]').eq(0).should('have.value', 'dev.au.a_b_c_site_deployer')
    cy.get('ui5-table-cell').find('[id ="baseDomainInput"]').eq(1).should('have.value', 'dev.eu.a_b_c_site_deployer')
    cy.get('ui5-table-cell').find('[id ="baseDomainInput"]').eq(2).should('have.value', 'dev.us.a_b_c_site_deployer')
  })

  it('Create 1 parent site with US datacenter', () => {
    resizeObserverLoopErrRe()
    getSiteDomain('a_b_c_site_deployer').should('have.value', 'a_b_c_site_deployer')
    getDataCenters('AU').click()
    getDataCenters('EU').click()
    getDataCenters('US').shadow().find('[class="ui5-token--text"]').should('have.text', 'US')
    getCreateButton().should('be.disabled')
    getSiteStructure(5).should('have.text', 'Test Structure')

    cy.get('ui5-table-row').should('have.length', '0')
    getCreateButton().should('not.be.disabled')
    getCreateButton().click()
    cy.get('ui5-table-row').should('have.length', '2')
    cy.get('ui5-table-cell').find('[id ="baseDomainInput"]').eq(0).should('have.value', 'dev.us.a_b_c_site_deployer')

    getSaveButton().should('not.be.disabled')

    cy.get('ui5-card').eq(2).shadow().get('ui5-bar').eq(2).find('[class ="ui5-bar-content"]').find('#cancel-main').click()

    cy.get('ui5-table-row').should('have.length', '0')
  })

  it('Should add a single Parent Site Manually with error message', () => {
    verifyResponse(expectedGigyaResponseNoUserKey)
    cy.get('#addParentButton').click()

    writeParentSiteTable('Manually add  parent site', 'Manually added description', 2)
    getSaveButton().should('not.be.disabled')
    getSaveButton().click()
    cy.get('.MessageView-container-0-2-28').eq(1).find('ui5-list').should('have.text', 'Unauthorized user (Manually add  parent site - eu1)The supplied userkey was not found')
    cy.get('.MessageViewButtonStyles-btn-0-2-27').should('be.visible')
  })
  it('Should add a single Parent Site Manually with sucess message', () => {
    resizeObserverLoopErrRe()
    verifyResponse(TestData.expectedGigyaResponseOk)
    cy.get('#addParentButton').click()

    writeParentSiteTable('Manually add  parent site', 'Manually added description', 2)
    getSaveButton().should('not.be.disabled')
    getSaveButton().click()
    cy.get('ui5-dialog').should('be.visible')
    cy.get('ui5-dialog').should('have.text', 'OkAll sites have been created successfully')
  })

  it('Should add a Parent Site and a Child Site Manually', () => {
    // TODO: validate child datacenter equals parent datacenter
    resizeObserverLoopErrRe()
    cy.get('#addParentButton').click()

    writeParentSiteTable('Manually add  parent site', 'Manually added description', 2)
    getSaveButton().should('not.be.disabled')
    cy.get('ui5-table-row').should('have.length', 1)
    cy.get('ui5-table-cell').eq(3).click()
    cy.get('ui5-responsive-popover').find('[data-component-name = "ActionSheetMobileContent"] ').find('[accessible-name="Create Child Site Item 1 of 2"]').click()
    cy.get('ui5-table-row').should('have.length', 2)
    cy.get('ui5-table-cell').eq(0).find('[tooltip ="Add Parent Site"]').click()
    cy.get('ui5-table-row').should('have.length', 1)
    cy.get('ui5-table-cell').eq(0).find('[tooltip ="Add Parent Site"]').click()

    writeChildrenSiteTable('Children site description', 'Children site domain')
    getSaveButton().should('not.be.disabled')

    cy.get('ui5-table-cell').eq(7).click()
    cy.get('ui5-responsive-popover')
      .find('[data-component-name = "ActionSheetMobileContent"] ')
      .find('[accessible-name="Delete Item 1 of 1"]')
      .shadow()
      .find('[aria-label="Delete Item 1 of 1"]')
      .click({ force: true })
    cy.get('ui5-table-row').should('have.length', 1)
    cy.get('ui5-table-cell').eq(3).click()
    cy.get('ui5-responsive-popover').find('[data-component-name = "ActionSheetMobileContent"] ').find('[accessible-name="Create Child Site Item 1 of 2"]').click()
    writeChildrenSiteTable('Children site description', 'Children site domain')
    cy.get('#dataCenterSelect').shadow().find('[class ="ui5-select-root ui5-input-focusable-element"]').find('[class ="ui5-select-label-root"]').should('have.text', 'EU')
    cy.get('ui5-table-cell').eq(6).should('have.text', 'EU')
    cy.get('ui5-table-cell').eq(3).click()
    cy.get('ui5-responsive-popover').find('[data-component-name = "ActionSheetMobileContent"] ').find('[accessible-name="Delete Item 2 of 2"]').click()
    cy.get('ui5-table-row').should('have.length', 0)
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
    return cy.get('ui5-card').eq(2).shadow().get('ui5-bar').eq(2).find('[class ="ui5-bar-content"]').find('#save-main')
  }

  function writeParentSiteTable(siteDomain, siteDescription, dataCenterOption) {
    cy.get('#baseDomainInput').shadow().find('[class = "ui5-input-inner"]').type(siteDomain)
    cy.get('ui5-table-cell').eq(1).shadow().get('ui5-input').eq(2).shadow().find('[class = "ui5-input-inner"]').type(siteDescription)
    cy.get('#dataCenterSelect').click()
    cy.get('ui5-static-area-item').shadow().find('.ui5-select-popover').eq(1).find('ui5-li').eq(dataCenterOption).click()
  }

  function writeChildrenSiteTable(childrenDomain, childrenDescription) {
    cy.get('ui5-table-row').eq(1).shadow().get('ui5-table-cell').eq(4).shadow().get('ui5-input').eq(4).shadow().find('[class = "ui5-input-inner"]').type(childrenDomain)

    cy.get('ui5-table-row').eq(1).shadow().get('ui5-table-cell').eq(4).shadow().get('ui5-input').eq(3).shadow().find('[class = "ui5-input-inner"]').type(childrenDescription)
  }
  function verifyResponse(response) {
    cy.intercept('POST', 'admin.createSite', {
      body: response,
    })
  }
  function resizeObserverLoopErrRe() {
    const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
    cy.on('uncaught:exception', (err) => {
      if (resizeObserverLoopErrRe.test(err.message)) {
        return false
      }
    })
  }
})
