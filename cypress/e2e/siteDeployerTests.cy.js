/* eslint-disable no-undef */
import * as servicesDataTest from '../../src/services/site/dataTest'
import * as dataTest from './dataTest'
import * as utils from './utils'

describe('Site Deployer Test Suite', () => {
  beforeEach(() => {
    utils.startUp(dataTest.siteDeployerIconName)
  })

  it('Creating 3 parent sites with different datacenters', () => {
    utils.getBaseDomain(dataTest.baseDomain, 0)
    utils.getSiteStructure(1)
    cy.get('#cdctools-siteStructure').shadow().find('.ui5-select-label-root').should('have.text', dataTest.dropdownOption)
    utils.getCreateButton().click()
    cy.get('ui5-table-row').should('have.length', '18')
    cy.get('ui5-table-cell').find('[id ="baseDomainInput"]').eq(0).should('have.value', `dev.au.parent.${dataTest.baseDomain}`)
    cy.get('ui5-table-cell').find('[id ="baseDomainInput"]').eq(3).should('have.value', `dev.eu.parent.${dataTest.baseDomain}`)
    cy.get('ui5-table-cell').find('[id ="baseDomainInput"]').eq(6).should('have.value', `dev.us.parent.${dataTest.baseDomain}`)
  })

  it('Create 3 parent sites (dev, stag, prod) with US datacenter', () => {
    utils.getCreateButton().should('be.disabled')
    utils.getDataCenters('US', 'EU', 'AU')
    utils.getBaseDomain(dataTest.baseDomain, 0)
    utils.getSiteStructure(1)
    cy.get('#cdctools-siteStructure').shadow().find('.ui5-select-label-root').should('have.text', dataTest.dropdownOption)
    cy.get('ui5-table-row').should('have.length', '0')
    utils.getCreateButton().should('not.be.disabled')
    utils.getCreateButton().click()
    cy.get('ui5-table-row').should('have.length', '6')
    cy.get('ui5-table-cell').find('[id ="baseDomainInput"]').eq(0).should('have.value', `dev.us.parent.${dataTest.baseDomain}`)
    utils.getSaveButton().should('not.be.disabled')
    cy.get('ui5-card').eq(2).shadow().get('ui5-bar').eq(2).find('[class ="ui5-bar-content"]').find('#cancel-main').click()
    cy.get('ui5-table-row').should('have.length', '0')
  })

  it('Should add a single Parent Site Manually with error message', () => {
    utils.resizeObserverLoopErrRe()
    utils.mockResponse(servicesDataTest.expectedGigyaResponseNoPartnerId, 'POST', 'admin.createSite')
    cy.get('#addParentButton').click()
    writeParentSiteTable(dataTest.parentBaseDomain, dataTest.parentSiteDescription, 2)
    utils.getSaveButton().should('not.be.disabled')
    utils.getSaveButton().click()
    cy.get('#messageList').should('have.text', dataTest.expectedErrorMessage)
    cy.get('[icon ="error"]').should('be.visible')
  })

  it('Should add a single Parent Site Manually with success message', () => {
    utils.resizeObserverLoopErrRe()
    utils.mockResponse(servicesDataTest.expectedGigyaResponseOk, 'POST', 'admin.createSite')
    cy.get('#addParentButton').click()
    writeParentSiteTable(dataTest.parentBaseDomain, dataTest.parentSiteDescription, 2)
    utils.getSaveButton().should('not.be.disabled')
    utils.getSaveButton().click()
    const successPopup = cy.get('#successPopup')
    successPopup.should('be.visible')
    successPopup.should('have.text', dataTest.expectedSuccessMessage)
    utils.clickPopUpOkButton('#successPopup')
  })

  it('Should add a Parent Site and a Child Site Manually', () => {
    utils.resizeObserverLoopErrRe()
    cy.get('#addParentButton').click()
    writeParentSiteTable(dataTest.parentBaseDomain, dataTest.parentSiteDescription, 2)
    utils.getSaveButton().should('not.be.disabled')
    cy.get('ui5-table-row').should('have.length', 1)
    createChild()
    cy.get('ui5-table-row').should('have.length', 2)
    cy.get('ui5-table-cell').eq(0).find('[tooltip ="Hide Child Sites"]').click()
    cy.get('ui5-table-row').should('have.length', 1)
    cy.get('ui5-table-cell').eq(0).find('[tooltip ="Show Child Sites"]').click()
    writeChildrenSiteTable(dataTest.childrenBaseDomain, dataTest.childrenSiteDescription)
    cy.get('#dataCenterSelect').shadow().find('[class ="ui5-select-root ui5-input-focusable-element"]').find('[class ="ui5-select-label-root"]').should('have.text', 'EU')
    utils.getSaveButton().should('not.be.disabled')
    getIcon(0)
    cy.get('ui5-responsive-popover').find('[data-component-name = "ActionSheetMobileContent"] ').find('[accessible-name="Delete Item 2 of 2"]').click()
    cy.get('ui5-table-row').should('have.length', 0)
  })

  it('Should show error Popup when Credentials are empty', () => {
    utils.clearCredentials()
    cy.get('#addParentButton').click()
    writeParentSiteTable(dataTest.parentBaseDomain, dataTest.parentSiteDescription, 2)
    utils.getSaveButton().should('not.be.disabled')
    utils.getSaveButton().click()
    const errorPopup = cy.get('#errorPopup')
    errorPopup.should('be.visible')
    errorPopup.should('have.text', dataTest.missingCredentialsErrorMessage)
    utils.clickPopUpOkButton('#errorPopup')
  })

  it('Should show Manual Removal Popup', () => {
    utils.resizeObserverLoopErrRe()
    utils.mockResponse(dataTest.errorToManualRemoveSiteMessage, 'POST', 'admin.createSite')
    cy.get('#addParentButton').click()
    writeParentSiteTable(dataTest.parentBaseDomain, dataTest.parentSiteDescription, 2)
    utils.getSaveButton().click()
    cy.get('#manualRemovalPopup').should('be.visible')
    cy.get('#manualRemovalPopup').find('#manualRemovalConfirmButton').shadow().find('.ui5-button-root').should('be.disabled')
    cy.get('#manualRemovalPopup').find('#manualRemovalCheckbox').click()
    cy.get('#manualRemovalPopup').find('#manualRemovalConfirmButton').shadow().find('.ui5-button-root').should('not.be.disabled')
    cy.get('#manualRemovalPopup').find('#manualRemovalConfirmButton').click()
  })

  function writeParentSiteTable(baseDomain, siteDescription, dataCenterOption) {
    cy.get('#baseDomainInput').shadow().find('[class = "ui5-input-inner"]').type(baseDomain).should('have.value', baseDomain)
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