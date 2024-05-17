/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

/* eslint-disable no-undef */
import * as servicesDataTest from '../../src/services/site/dataTest'
import * as dataTest from './dataTest'
import * as utils from './utils'

describe('siteDeployerCopyConfiguration test suite', () => {
  beforeEach(() => {
    utils.resizeObserverLoopErrRe()
    utils.startUp(dataTest.siteDeployerIconName)
    utils.mockGetConfigurationRequests()
    cy.intercept('POST', 'admin.createSite', { body: servicesDataTest.expectedGigyaResponseNoPartnerId }).as('admin.createSite')
    cy.get('[data-cy ="addParentButton"]').click()
    utils.writeParentSiteTable(dataTest.parentBaseDomain, dataTest.parentSiteDescription, 2)
  })

  it('should set site configuration on save', () => {
    utils.getAddSiteConfigButton().shadow().find('button').should('be.enabled')
    utils.getEditSiteConfigButton().should('not.exist')
    utils.getDeclineSiteConfigButton().should('not.exist')
    utils.getAddSiteConfigButton().click()
    cy.wait(15000)
    utils.fillSourceApiKeyInput()
    cy.wait(15000)
    utils.setConfigurationCheckBox('siteCopyConfigurationDialog')
    cy.get('[data-cy ="dialogMessageConfirmConfirmButton"]').click()
    utils.getAddSiteConfigButton().should('not.exist')
    utils.getEditSiteConfigButton().shadow().find('button').should('be.enabled')
    utils.getDeclineSiteConfigButton().shadow().find('button').should('be.enabled')
  })

  it('should not set a site configuration on cancel', () => {
    utils.getAddSiteConfigButton().click()
    cy.wait(15000)
    utils.fillSourceApiKeyInput()
    cy.wait(15000)
    utils.setConfigurationCheckBox()
    cy.get('[data-cy ="dialogMessageConfirmCancelButton"]').click()
    utils.getAddSiteConfigButton().shadow().find('button').should('be.enabled')
    utils.getEditSiteConfigButton().should('not.exist')
    utils.getDeclineSiteConfigButton().should('not.exist')
  })

  it('should remove a site configuration', () => {
    utils.getAddSiteConfigButton().click()
    cy.wait(15000)
    utils.fillSourceApiKeyInput()
    cy.wait(15000)
    utils.setConfigurationCheckBox('siteCopyConfigurationDialog')
    cy.get('[data-cy ="dialogMessageConfirmConfirmButton"]').click()
    utils.getDeclineSiteConfigButton().click()
    utils.getAddSiteConfigButton().shadow().find('button').should('be.enabled')
    utils.getEditSiteConfigButton().should('not.exist')
    utils.getDeclineSiteConfigButton().should('not.exist')
  })

  it('should update a site configuration on edit save', () => {
    utils.getAddSiteConfigButton().click()
    cy.wait(15000)
    utils.fillSourceApiKeyInput()
    cy.wait(15000)
    utils.setConfigurationCheckBox('siteCopyConfigurationDialog')
    cy.get('[data-cy ="dialogMessageConfirmConfirmButton"]').eq(0).click()
    cy.wait(15000)
    utils.getEditSiteConfigButton().click()
    cy.get('[data-cy="siteCopyConfigurationDialog"]').find('ui5-tree').eq(8).find('ui5-checkbox').eq(0).realClick()
    cy.get('[data-cy="siteCopyConfigurationDialog"]').find('ui5-tree').eq(8).find('ui5-tree-item-custom').shadow().find('.ui5-li-tree-toggle-box').realClick()
    cy.get('[data-cy="siteCopyConfigurationDialog"]')
      .find('ui5-tree')
      .eq(8)
      .find('ui5-tree-item-custom')
      .find('ui5-tree-item-custom')
      .eq(1)
      .find('div')
      .eq(0)
      .find('ui5-button')
      .eq(0)
      .click()
    cy.get('[data-cy="dataflowVariableInput"]').eq(0).shadow().find('[class = "ui5-input-inner"]').type('test')
    cy.get('[data-cy="dataflowVariableInput"]').eq(1).shadow().find('[class = "ui5-input-inner"]').type('user')
    cy.get('[data-cy="dataflowVariableInput"]').eq(2).shadow().find('[class = "ui5-input-inner"]').type('mobile')
    cy.get('[data-cy="dataflowVariableInput"]').eq(3).shadow().find('[class = "ui5-input-inner"]').type('number')
    cy.get('[data-cy="dataflowVariableInput"]').eq(4).shadow().find('[class = "ui5-input-inner"]').type('userKey')
    cy.get('[data-cy="dataflowVariableInput"]').eq(5).shadow().find('[class = "ui5-input-inner"]').type('accounts')
    cy.get('[data-cy="dataflowVariableInput"]').eq(6).shadow().find('[class = "ui5-input-inner"]').type('wrapField')
    cy.get('[data-cy="dataflowVariableInput"]').eq(7).shadow().find('[class = "ui5-input-inner"]').type('injectValue')
    cy.get('[data-cy="dialogMessageConfirmConfirmButton"]').eq(1).realClick()
    cy.get('[data-cy="dialogMessageConfirmCancelButton"]').eq(0).click()
  })
})
