/* eslint-disable no-undef */
import * as servicesDataTest from '../../src/services/site/dataTest'
import * as dataTest from './dataTest'
import * as utils from './utils'

describe('Site Deployer Test Suite', () => {
  beforeEach(() => {
    utils.startUp(dataTest.siteDeployerIconName)
  })

  it('Should create 3 parent sites with different datacenters', () => {
    utils.getBaseDomain(dataTest.baseDomain, 0)
    utils.getSiteStructure(1)
    cy.get('[data-cy ="cdctools-siteStructure"]').shadow().find('.ui5-select-label-root').should('have.text', dataTest.dropdownOption)
    utils.getCreateButton().click()
    cy.get('ui5-table-row').should('have.length', '18')
    cy.get(' [data-cy ="baseDomainInput"]').eq(0).should('have.value', `dev.au.parent.${dataTest.baseDomain}`)
    cy.get(' [data-cy ="baseDomainInput"]').eq(3).should('have.value', `dev.eu.parent.${dataTest.baseDomain}`)
    cy.get(' [data-cy ="baseDomainInput"]').eq(6).should('have.value', `dev.us.parent.${dataTest.baseDomain}`)
  })

  it('Should create 3 parent sites (dev, stag, prod) with US datacenter', () => {
    utils.getCreateButton().should('be.disabled')
    utils.getDataCenters('US', 'EU', 'AU')
    utils.getBaseDomain(dataTest.baseDomain, 0)
    utils.getSiteStructure(1)

    cy.get(' [data-cy ="cdctools-siteStructure"]').shadow().find('.ui5-select-label-root').should('have.text', dataTest.dropdownOption)
    cy.get('ui5-table-row').should('have.length', '0')
    utils.getCreateButton().should('not.be.disabled')
    utils.getCreateButton().click()
    cy.get('ui5-table-row').should('have.length', '6')
    cy.get(' [data-cy ="baseDomainInput"]').eq(0).should('have.value', `dev.us.parent.${dataTest.baseDomain}`)
    utils.getSaveButton().should('not.be.disabled')
    utils.getCancelButton().click()
    cy.get('ui5-table-row').should('have.length', '0')
  })

  it('Should add a single Parent Site Manually with error message', () => {
    utils.resizeObserverLoopErrRe()
    utils.mockResponse(servicesDataTest.expectedGigyaResponseNoPartnerId, 'POST', 'admin.createSite')

    cy.get(' [data-cy ="addParentButton"]').click()
    utils.writeParentSiteTable(dataTest.parentBaseDomain, dataTest.parentSiteDescription, 2)
    utils.getSaveButton().should('not.be.disabled')
    utils.getSaveButton().click()
    cy.get(' [data-cy ="messageItem"]').eq(1).should('have.text', dataTest.expectedErrorMessage)
    cy.get('[icon ="error"]').should('be.visible')
    cy.get('@windowOpenStub').should('not.be.called')
  })

  it('Should add a single Parent Site Manually with success message', () => {
    utils.resizeObserverLoopErrRe()
    utils.mockResponse(servicesDataTest.expectedGigyaResponseOk, 'POST', 'admin.createSite')
    utils.mockResponse(servicesDataTest.expectedGigyaResponseOk, 'POST', 'accounts.migrateConsentFlow')

    cy.get(' [data-cy ="addParentButton"]').click()
    utils.writeParentSiteTable(dataTest.parentBaseDomain, dataTest.parentSiteDescription, 2)
    utils.getSaveButton().should('not.be.disabled')
    utils.getSaveButton().click()

    const successPopup = cy.get(' [data-cy ="siteDeployersuccessPopup"]')
    successPopup.should('be.visible')
    successPopup.should('have.text', dataTest.expectedSuccessMessage)

    utils.clickPopUpOkButton('siteDeployersuccessPopup')
    cy.get('@windowOpenStub').should('be.called')
  })

  it('Should add a Parent Site and a Child Site Manually', () => {
    utils.resizeObserverLoopErrRe()
    cy.get('[data-cy ="addParentButton"]').click()
    utils.writeParentSiteTable(dataTest.parentBaseDomain, dataTest.parentSiteDescription, 2)
    utils.getSaveButton().should('not.be.disabled')
    cy.get('ui5-table-row').should('have.length', 1)
    utils.createChild()
    cy.get('ui5-table-row').should('have.length', 2)
    cy.get('ui5-table-cell').eq(0).find('[tooltip ="Hide Child Sites"]').click()
    cy.get('ui5-table-row').should('have.length', 1)
    cy.get('ui5-table-cell').eq(0).find('[tooltip ="Show Child Sites"]').click()
    utils.writeChildrenSiteTable(dataTest.childrenBaseDomain, dataTest.childrenSiteDescription)

    cy.get('[data-cy ="dataCenterSelect"]')
      .shadow()
      .find('[class ="ui5-select-root ui5-input-focusable-element"]')
      .find('[class ="ui5-select-label-root"]')
      .should('have.text', 'EU')
    utils.getSaveButton().should('not.be.disabled')
    utils.getIcon(0)
    cy.get('ui5-responsive-popover').find('[data-component-name = "ActionSheetMobileContent"] ').find('[accessible-name="Delete Item 2 of 2"]').click()
    cy.get('ui5-table-row').should('have.length', 0)
  })

  it('Should show error Popup when Credentials are empty', () => {
    utils.clearCredentials()
    cy.get('[data-cy ="addParentButton"]').click()
    utils.writeParentSiteTable(dataTest.parentBaseDomain, dataTest.parentSiteDescription, 2)
    utils.getSaveButton().should('not.be.disabled')
    utils.getSaveButton().realClick()
    const errorPopup = cy.get('[data-cy ="errorPopup"]').eq(0)
    errorPopup.should('be.visible')
    errorPopup.should('have.text', dataTest.missingCredentialsErrorMessage)
    utils.clickPopUpOkButton('errorPopup')
  })

  it('Should show Manual Removal Popup', () => {
    utils.resizeObserverLoopErrRe()
    utils.mockResponse(dataTest.errorToManualRemoveSiteMessage, 'POST', 'admin.createSite')
    cy.get('[data-cy ="addParentButton"]').click()
    utils.writeParentSiteTable(dataTest.parentBaseDomain, dataTest.parentSiteDescription, 2)
    utils.getSaveButton().click()
    cy.get('#manualRemovalPopup').should('be.visible')
    cy.get('[data-cy ="manualRemovalConfirmButton"]').shadow().find('.ui5-button-root').should('be.disabled')
    cy.get('[data-cy ="manualRemovalCheckbox"]').click()
    cy.get('[data-cy ="manualRemovalConfirmButton"]').shadow().find('.ui5-button-root').should('not.be.disabled')
    cy.get('[data-cy ="manualRemovalConfirmButton"]').click()
    cy.get('@windowOpenStub').should('not.be.called')
  })
})
