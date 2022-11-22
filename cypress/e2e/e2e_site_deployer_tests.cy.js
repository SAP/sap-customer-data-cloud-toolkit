/* eslint-disable no-undef */
import * as TestData from '../../src/services/site/data_test'
import manualRemovalTestData from './manual-removal-test-data.json'

describe('Site Deployer Test Suite', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    cy.contains('Site Deployer').click({ force: true })
    writeCredentials()
  })

  it('Creating 3 parent sites with different datacenters', () => {
    getSiteDomain('a_b_c_site_deployer')

    getSiteStructure(5).should('have.text', 'Test Structure')

    getCreateButton().click()
    cy.get('ui5-table-row').should('have.length', '6')
    cy.get('ui5-table-cell').find('[id ="baseDomainInput"]').eq(0).should('have.value', 'dev.au.a_b_c_site_deployer')
    cy.get('ui5-table-cell').find('[id ="baseDomainInput"]').eq(1).should('have.value', 'dev.eu.a_b_c_site_deployer')
    cy.get('ui5-table-cell').find('[id ="baseDomainInput"]').eq(2).should('have.value', 'dev.us.a_b_c_site_deployer')
  })

  it('Create 1 parent site with US datacenter', () => {
    resizeObserverLoopErrRe()
    getSiteDomain('a_b_c_site_deployer')
    getDataCenters('US', 'EU', 'AU')

    getCreateButton().should('be.disabled')
    getSiteStructure(5).should('have.text', 'Test Structure')

    cy.get('ui5-table-row').should('have.length', '0')
    getCreateButton().should('not.be.disabled')
    getCreateButton().click()
    cy.get('ui5-table-row').should('have.length', '2')
    cy.get('ui5-table-cell').find('[id ="baseDomainInput"]').should('have.value', 'dev.us.a_b_c_site_deployer')

    getSaveButton().should('not.be.disabled')

    cy.get('ui5-card').eq(2).shadow().get('ui5-bar').eq(2).find('[class ="ui5-bar-content"]').find('#cancel-main').click()

    cy.get('ui5-table-row').should('have.length', '0')
  })

  it('Should add a single Parent Site Manually with error message', () => {
    mockResponse(TestData.expectedGigyaResponseNoPartnerId)
    cy.get('#addParentButton').click()

    writeParentSiteTable('Manually add  parent site', 'Manually added description', 2)
    getSaveButton().should('not.be.disabled')
    getSaveButton().click()
    cy.get('.MessageView-container-0-2-28')
      .eq(1)
      .find('ui5-list')
      .should('have.text', 'Missing required parameter (Manually add  parent site - eu1)Missing required parameter : partnerID')
    cy.get('.MessageViewButtonStyles-btn-0-2-27').should('be.visible')
  })

  it('Should add a single Parent Site Manually with sucess message', () => {
    resizeObserverLoopErrRe()
    mockResponse(TestData.expectedGigyaResponseOk)
    cy.get('#addParentButton').click()

    writeParentSiteTable('Manually add parent site', 'Manually added description', 2)
    getSaveButton().should('not.be.disabled')
    getSaveButton().click()
    const successPopup = cy.get('#successPopup')
    successPopup.should('be.visible')
    successPopup.should('have.text', 'OkAll sites have been created successfully')
  })

  it('Should add a Parent Site and a Child Site Manually', () => {
    resizeObserverLoopErrRe()
    cy.get('#addParentButton').click()
    writeParentSiteTable('Manually add parent site', 'Manually added description', 2)
    getSaveButton().should('not.be.disabled')
    cy.get('ui5-table-row').should('have.length', 1)
    createChild()
    cy.get('ui5-table-row').should('have.length', 2)
    cy.get('ui5-table-cell').eq(0).find('[tooltip ="Hide Child Sites"]').click()
    cy.get('ui5-table-row').should('have.length', 1)
    cy.get('ui5-table-cell').eq(0).find('[tooltip ="Show Child Sites"]').click()
    writeChildrenSiteTable('Children site domain', 'Children site description')
    cy.get('#dataCenterSelect').shadow().find('[class ="ui5-select-root ui5-input-focusable-element"]').find('[class ="ui5-select-label-root"]').should('have.text', 'EU')

    getSaveButton().should('not.be.disabled')

    getIcon(0)
    cy.get('ui5-responsive-popover').find('[data-component-name = "ActionSheetMobileContent"] ').find('[accessible-name="Delete Item 2 of 2"]').click()
    cy.get('ui5-table-row').should('have.length', 0)
  })

  it('Should show error Popup when Credentials are empty', () => {
    clearCredentials()
    cy.get('#addParentButton').click()

    writeParentSiteTable('Manually add parent site', 'Manually added description', 2)
    getSaveButton().should('not.be.disabled')
    getSaveButton().click()

    const errorPopup = cy.get('#errorPopup')
    errorPopup.should('be.visible')
    errorPopup.should('have.text', 'OkPlease insert User and Secret Keys in the Credentials menu')
  })

  it('Should show Manual Removal Popup', () => {
    resizeObserverLoopErrRe()
    mockResponse(manualRemovalTestData.flat()[0])
    cy.get('#addParentButton').click()
    writeParentSiteTable('Manually add parent site', 'Manually added description', 2)
    getSaveButton().click()
    cy.get('#manualRemovalPopup').should('be.visible')
    cy.get('#manualRemovalPopup').find('#manualRemovalConfirmButton').shadow().find('.ui5-button-root').should('be.disabled')
    cy.get('#manualRemovalPopup').find('#manualRemovalCheckbox').click()
    cy.get('#manualRemovalPopup').find('#manualRemovalConfirmButton').shadow().find('.ui5-button-root').should('not.be.disabled')
    cy.get('#manualRemovalPopup').find('#manualRemovalConfirmButton').click()
    // cy.get('#manualRemovalPopup').should('not.be.visible')
  })

  function getDataCenters(chosenDataCenter, removeFirst, removeSecond) {
    cy.get('#cdctools-dataCenter').shadow().find('.ui5-multi-combobox-tokenizer').find(`[text = ${removeFirst}]`).click()
    cy.get('#cdctools-dataCenter').shadow().find('.ui5-multi-combobox-tokenizer').find(`[text = ${removeSecond}]`).click()
    return cy
      .get('#cdctools-dataCenter')
      .shadow()
      .find('.ui5-multi-combobox-tokenizer')
      .find(`[text = ${chosenDataCenter}]`)
      .shadow()
      .find('[class="ui5-token--text"]')
      .should('have.text', chosenDataCenter)
  }

  function getSiteStructure(optionNumber) {
    cy.get('#cdctools-siteStructure').click()
    return cy.get('ui5-static-area-item').shadow().find('.ui5-select-popover').find('ui5-li').eq(optionNumber).click()
  }

  function getSiteDomain(siteDomain) {
    return cy.get('#cdctools-siteDomain').shadow().find('[class = "ui5-input-inner"]').type(siteDomain).should('have.value', siteDomain)
  }

  function getCreateButton() {
    return cy.get('body').find('#createButton').shadow().find('.ui5-button-root')
  }

  function getSaveButton() {
    return cy.get('ui5-card').eq(2).shadow().get('ui5-bar').eq(2).find('[class ="ui5-bar-content"]').find('#save-main')
  }

  function writeParentSiteTable(siteDomain, siteDescription, dataCenterOption) {
    cy.get('#baseDomainInput').shadow().find('[class = "ui5-input-inner"]').type(siteDomain).should('have.value', siteDomain)
    getTableCell(1).shadow().get('ui5-input').eq(4).shadow().find('[class = "ui5-input-inner"]').type(siteDescription).should('have.value', siteDescription)
    cy.get('#dataCenterSelect').click()
    cy.get('ui5-static-area-item').shadow().find('.ui5-select-popover').eq(1).find('ui5-li').eq(dataCenterOption).click()
  }

  function writeChildrenSiteTable(childrenDomain, childrenDescription) {
    cy.get('ui5-input').eq(5).shadow().find('[class = "ui5-input-inner"]').type(childrenDomain).should('have.value', childrenDomain)
    cy.get('ui5-input').eq(6).shadow().find('[class = "ui5-input-inner"]').type(childrenDescription).should('have.value', childrenDescription)
  }

  function mockResponse(response) {
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

  function writeCredentials() {
    resizeObserverLoopErrRe()
    const openPopoverButton = cy.get('body').find('#openPopoverButton')
    openPopoverButton.click({ force: true })
    cy.get('#userKey').shadow().find('[class = "ui5-input-inner"]').focus().type('dummyuserkey')
    cy.get('#userSecret').shadow().find('[class = "ui5-input-content"]').find('[class = "ui5-input-inner"]').type('dummyusersecret', { force: true })
    openPopoverButton.click({ force: true })
  }

  function clearCredentials() {
    resizeObserverLoopErrRe()
    const openPopoverButton = cy.get('body').find('#openPopoverButton')
    openPopoverButton.click()
    cy.get('#userKey').shadow().find('[class = "ui5-input-inner"]').focus().clear()
    cy.get('#userSecret').shadow().find('[class = "ui5-input-inner"]').clear({ force: true })
    openPopoverButton.click()
  }
  function getTableCell(cellNumber) {
    return cy.get('ui5-table-cell').eq(cellNumber)
  }

  function createChild() {
    getIcon(0)
    cy.get('ui5-responsive-popover').find('[data-component-name = "ActionSheetMobileContent"] ').find('[accessible-name="Create Child Site Item 1 of 2"]').click()
  }
  function getIcon(iconNumber) {
    return cy.get('[icon ="overflow"]').eq(iconNumber).click()
  }
})
