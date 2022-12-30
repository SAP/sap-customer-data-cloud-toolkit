/* eslint-disable no-undef */
import * as TestData from '../../src/services/site/data_test'
import manualRemovalTestData from './manual-removal-test-data.json'
import * as data from './test-data'
import * as utils from './utils'

describe('Site Deployer Test Suite', () => {
  beforeEach(() => {
    utils.startUp('http://localhost:3000', data.siteDeployerIconName)
  })

  it('Creating 3 parent sites with different datacenters', () => {
    utils.getSiteDomain(data.siteDomain, 0)

    utils.getSiteStructure(5).should('have.text', data.dropdownOption)

    utils.getCreateButton().click()
    cy.get('ui5-table-row').should('have.length', '6')
    cy.get('ui5-table-cell').find('[id ="baseDomainInput"]').eq(0).should('have.value', `dev.au.${data.siteDomain}`)
    cy.get('ui5-table-cell').find('[id ="baseDomainInput"]').eq(1).should('have.value', `dev.eu.${data.siteDomain}`)
    cy.get('ui5-table-cell').find('[id ="baseDomainInput"]').eq(2).should('have.value', `dev.us.${data.siteDomain}`)
  })

  it('Create 1 parent site with US datacenter', () => {
    utils.resizeObserverLoopErrRe()
    utils.getSiteDomain(data.siteDomain, 0)
    utils.getDataCenters('US', 'EU', 'AU')

    utils.getCreateButton().should('be.disabled')
    utils.getSiteStructure(5).should('have.text', data.dropdownOption)

    cy.get('ui5-table-row').should('have.length', '0')
    utils.getCreateButton().should('not.be.disabled')
    utils.getCreateButton().click()
    cy.get('ui5-table-row').should('have.length', '2')
    cy.get('ui5-table-cell').find('[id ="baseDomainInput"]').should('have.value', `dev.us.${data.siteDomain}`)

    utils.getSaveButton().should('not.be.disabled')

    cy.get('ui5-card').eq(2).shadow().get('ui5-bar').eq(2).find('[class ="ui5-bar-content"]').find('#cancel-main').click()

    cy.get('ui5-table-row').should('have.length', '0')
  })

  it('Should add a single Parent Site Manually with error message', () => {
    utils.resizeObserverLoopErrRe()
    utils.mockResponse(TestData.expectedGigyaResponseNoPartnerId, 'POST', 'admin.createSite')
    cy.get('#addParentButton').click()

    writeParentSiteTable(data.parentSiteDomain, data.parentSiteDescription, 2)
    utils.getSaveButton().should('not.be.disabled')
    utils.getSaveButton().click()
    cy.get('#messageList').should('have.text', data.expectedErrorMessage)
    cy.get('[icon ="error"]').should('be.visible')
  })

  it('Should add a single Parent Site Manually with success message', () => {
    utils.resizeObserverLoopErrRe()

    utils.mockResponse(TestData.expectedGigyaResponseOk, 'POST', 'admin.createSite')
    cy.get('#addParentButton').click()

    writeParentSiteTable(data.parentSiteDomain, data.parentSiteDescription, 2)
    utils.getSaveButton().should('not.be.disabled')
    utils.getSaveButton().click()
    const successPopup = cy.get('#successPopup')
    successPopup.should('be.visible')
    successPopup.should('have.text', data.expectedSuccessMessage)
  })

  it('Should add a Parent Site and a Child Site Manually', () => {
    utils.resizeObserverLoopErrRe()
    cy.get('#addParentButton').click()
    writeParentSiteTable(data.parentSiteDomain, data.parentSiteDescription, 2)
    utils.getSaveButton().should('not.be.disabled')
    cy.get('ui5-table-row').should('have.length', 1)
    createChild()
    cy.get('ui5-table-row').should('have.length', 2)
    cy.get('ui5-table-cell').eq(0).find('[tooltip ="Hide Child Sites"]').click()
    cy.get('ui5-table-row').should('have.length', 1)
    cy.get('ui5-table-cell').eq(0).find('[tooltip ="Show Child Sites"]').click()
    writeChildrenSiteTable(data.childrenSiteDomain, data.childrenSiteDescription)
    cy.get('#dataCenterSelect').shadow().find('[class ="ui5-select-root ui5-input-focusable-element"]').find('[class ="ui5-select-label-root"]').should('have.text', 'EU')

    utils.getSaveButton().should('not.be.disabled')

    getIcon(0)
    cy.get('ui5-responsive-popover').find('[data-component-name = "ActionSheetMobileContent"] ').find('[accessible-name="Delete Item 2 of 2"]').click()
    cy.get('ui5-table-row').should('have.length', 0)
  })

  it('Should show error Popup when Credentials are empty', () => {
    utils.clearCredentials()
    cy.get('#addParentButton').click()

    writeParentSiteTable(data.parentSiteDomain, data.parentSiteDescription, 2)
    utils.getSaveButton().should('not.be.disabled')
    utils.getSaveButton().click()

    const errorPopup = cy.get('#errorPopup')
    errorPopup.should('be.visible')
    errorPopup.should('have.text', data.missingCredentialsErrorMessage)
  })

  it('Should show Manual Removal Popup', () => {
    utils.resizeObserverLoopErrRe()

    utils.mockResponse(manualRemovalTestData.flat()[0], 'POST', 'admin.createSite')
    cy.get('#addParentButton').click()
    writeParentSiteTable(data.parentSiteDomain, data.parentSiteDescription, 2)
    utils.getSaveButton().click()
    cy.get('#manualRemovalPopup').should('be.visible')
    cy.get('#manualRemovalPopup').find('#manualRemovalConfirmButton').shadow().find('.ui5-button-root').should('be.disabled')
    cy.get('#manualRemovalPopup').find('#manualRemovalCheckbox').click()
    cy.get('#manualRemovalPopup').find('#manualRemovalConfirmButton').shadow().find('.ui5-button-root').should('not.be.disabled')
    cy.get('#manualRemovalPopup').find('#manualRemovalConfirmButton').click()
  })

  function writeParentSiteTable(siteDomain, siteDescription, dataCenterOption) {
    cy.get('#baseDomainInput').shadow().find('[class = "ui5-input-inner"]').type(siteDomain).should('have.value', siteDomain)
    cy.get('#descriptionInput').shadow().find('[class = "ui5-input-inner"]').type(siteDescription).should('have.value', siteDescription)
    cy.get('#dataCenterSelect').click()
    cy.get('ui5-static-area-item').shadow().find('.ui5-select-popover').eq(1).find('ui5-li').eq(dataCenterOption).click()
  }

  function writeChildrenSiteTable(childrenDomain, childrenDescription) {
    cy.get('#childBaseDomainInput').shadow().find('[class = "ui5-input-inner"]').type(childrenDomain).should('have.value', childrenDomain)
    cy.get('#childDescriptionInput').shadow().find('[class = "ui5-input-inner"]').type(childrenDescription).should('have.value', childrenDescription)
  }

  function createChild() {
    getIcon(0)
    cy.get('ui5-responsive-popover').find('[data-component-name = "ActionSheetMobileContent"] ').find('[accessible-name="Create Child Site Item 1 of 2"]').click()
  }
  function getIcon(iconNumber) {
    return cy.get('[icon ="overflow"]').eq(iconNumber).click()
  }
})
