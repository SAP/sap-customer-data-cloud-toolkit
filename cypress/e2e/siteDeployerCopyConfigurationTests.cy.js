/* eslint-disable no-undef */
import * as servicesDataTest from '../../src/services/site/dataTest'
import * as utils from './utils'
import * as dataTest from './dataTest'

describe('siteDeployerCopyConfiguration test suite', () => {
  beforeEach(() => {
    utils.resizeObserverLoopErrRe()
    utils.mockGetConfigurationRequests()
    utils.mockResponse(servicesDataTest.expectedGigyaResponseNoPartnerId, 'POST', 'admin.createSite')
    utils.startUp(dataTest.siteDeployerIconName)
    cy.get('#addParentButton').click()
    utils.writeParentSiteTable(dataTest.parentBaseDomain, dataTest.parentSiteDescription, 2)
  })

  it('should set site configuration on save', () => {
    utils.getAddSiteConfigButton().shadow().find('button').should('be.enabled')
    utils.getEditSiteConfigButton().should('not.exist')
    utils.getDeclineSiteConfigButton().should('not.exist')
    utils.getAddSiteConfigButton().click()
    utils.getSiteCopyConfigurationDialog().should('be.visible')
    utils.fillSourceApiKeyInput()
    cy.wait(1000)
    utils.setConfigurationCheckBox()
    cy.get('#confirmButton').click()
    utils.getAddSiteConfigButton().should('not.exist')
    utils.getEditSiteConfigButton().shadow().find('button').should('be.enabled')
    utils.getDeclineSiteConfigButton().shadow().find('button').should('be.enabled')
  })

  it('should not set a site configuration on cancel', () => {
    utils.getAddSiteConfigButton().click()
    utils.fillSourceApiKeyInput()
    cy.wait(1000)
    utils.setConfigurationCheckBox()
    cy.get('#cancelButton').click()
    utils.getAddSiteConfigButton().shadow().find('button').should('be.enabled')
    utils.getEditSiteConfigButton().should('not.exist')
    utils.getDeclineSiteConfigButton().should('not.exist')
  })

  it('should remove a site configuration', () => {
    utils.getAddSiteConfigButton().click()
    utils.fillSourceApiKeyInput()
    cy.wait(1000)
    utils.setConfigurationCheckBox()
    cy.get('#confirmButton').click()
    utils.getDeclineSiteConfigButton().click()
    utils.getAddSiteConfigButton().shadow().find('button').should('be.enabled')
    utils.getEditSiteConfigButton().should('not.exist')
    utils.getDeclineSiteConfigButton().should('not.exist')
  })

  it('should update a site configuration on edit save', () => {
    utils.getAddSiteConfigButton().click()
    utils.fillSourceApiKeyInput()
    cy.wait(1000)
    utils.setConfigurationCheckBox()
    cy.get('#confirmButton').click()
    utils.getEditSiteConfigButton().click()
    cy.get('#selectAllCheckbox').realClick()
    cy.get('#selectAllCheckbox').should('have.prop', 'checked')
    cy.get('#confirmButton').click()
    utils.getEditSiteConfigButton().click()
    cy.get('ui5-tree').each(($el) => cy.wrap($el).find('ui5-checkbox').should('have.prop', 'checked'))
  })

  it('should not update a site configuration on edit cancel', () => {
    utils.getAddSiteConfigButton().click()
    utils.fillSourceApiKeyInput()
    cy.wait(1000)
    utils.setConfigurationCheckBox()
    cy.get('#confirmButton').click()
    utils.getEditSiteConfigButton().click()
    cy.get('#selectAllCheckbox').realClick()
    cy.get('#selectAllCheckbox').should('have.prop', 'checked')
    cy.get('#cancelButton').click()
    utils.getEditSiteConfigButton().click()
    cy.get('ui5-tree').each(($el) => cy.wrap($el).find('ui5-checkbox').should('not.be.checked'))
  })

  it('should update the source site when adding a second source site', () => {
    utils.getAddSiteConfigButton().click()
    utils.fillSourceApiKeyInput()
    utils.checkTargetSitesList()
    cy.get('#addTargetSiteButton').click()
    utils.checkTargetSitesList()
  })

  it('should clear site configurations when removing the source site', () => {
    utils.getAddSiteConfigButton().click()
    utils.fillSourceApiKeyInput()
    cy.wait(1000)
    utils.setConfigurationCheckBox()
    cy.get('#selectedTargetApiKeysList').find('ui5-li-custom').shadow().find('ui5-button').click()
    cy.get('#selectedTargetApiKeysList').should('not.exist')
    cy.get('#siteConfigurationsCard').should('not.be.visible')
  })
})
