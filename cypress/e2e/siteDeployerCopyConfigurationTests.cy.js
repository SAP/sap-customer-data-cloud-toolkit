/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

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
    cy.get('[data-cy ="addParentButton"]').click()
    utils.writeParentSiteTable(dataTest.parentBaseDomain, dataTest.parentSiteDescription, 2)
  })

  it('should set site configuration on save', () => {
    utils.getAddSiteConfigButton().shadow().find('button').should('be.enabled')
    utils.getEditSiteConfigButton().should('not.exist')
    utils.getDeclineSiteConfigButton().should('not.exist')
    utils.getAddSiteConfigButton().click()
    cy.wait(5000)
    utils.fillSourceApiKeyInput()
    cy.wait(1000)
    utils.setConfigurationCheckBox('siteCopyConfigurationDialog')
    cy.get('[data-cy ="dialogMessageConfirmConfirmButton"]').click()
    utils.getAddSiteConfigButton().should('not.exist')
    utils.getEditSiteConfigButton().shadow().find('button').should('be.enabled')
    utils.getDeclineSiteConfigButton().shadow().find('button').should('be.enabled')
  })

  it('should not set a site configuration on cancel', () => {
    utils.getAddSiteConfigButton().click()
    cy.wait(5000)
    utils.fillSourceApiKeyInput()
    cy.wait(1000)
    utils.setConfigurationCheckBox('siteCopyConfigurationDialog')
    cy.get('[data-cy ="dialogMessageConfirmCancelButton"]').click()
    utils.getAddSiteConfigButton().shadow().find('button').should('be.enabled')
    utils.getEditSiteConfigButton().should('not.exist')
    utils.getDeclineSiteConfigButton().should('not.exist')
  })

  it('should remove a site configuration', () => {
    utils.getAddSiteConfigButton().click()
    cy.wait(5000)
    utils.fillSourceApiKeyInput()
    cy.wait(1000)
    utils.setConfigurationCheckBox('siteCopyConfigurationDialog')
    cy.get('[data-cy ="dialogMessageConfirmConfirmButton"]').click()
    utils.getDeclineSiteConfigButton().click()
    utils.getAddSiteConfigButton().shadow().find('button').should('be.enabled')
    utils.getEditSiteConfigButton().should('not.exist')
    utils.getDeclineSiteConfigButton().should('not.exist')
  })

  it('should update a site configuration on edit save', () => {
    utils.getAddSiteConfigButton().click()
    cy.wait(5000)
    utils.fillSourceApiKeyInput()
    cy.wait(1000)
    utils.setConfigurationCheckBox('siteCopyConfigurationDialog')
    cy.get('[data-cy ="dialogMessageConfirmConfirmButton"]').eq(0).click()
    utils.getEditSiteConfigButton().click()
    cy.get('#selectAllCheckbox').realClick()
    cy.get('#selectAllCheckbox').should('have.prop', 'checked')
    cy.get('[data-cy ="dialogMessageConfirmConfirmButton"]').click()
    utils.getEditSiteConfigButton().click()
    cy.get('ui5-tree').each(($el) => cy.wrap($el).find('ui5-checkbox').should('have.prop', 'checked'))
  })

  it('should not update a site configuration on edit cancel', () => {
    utils.getAddSiteConfigButton().click()
    cy.wait(5000)
    utils.fillSourceApiKeyInput()
    cy.wait(1000)
    utils.setConfigurationCheckBox('siteCopyConfigurationDialog')
    cy.get('[data-cy ="dialogMessageConfirmConfirmButton"]').eq(0).click()
    utils.getEditSiteConfigButton().click()
    cy.get('[data-cy ="selectAllCheckbox"]').realClick()
    cy.get('[data-cy ="selectAllCheckbox"]').should('have.prop', 'checked')
    cy.get('[data-cy ="dialogMessageConfirmCancelButton"]').eq(0).click()
    utils.getEditSiteConfigButton().click()
    cy.get('ui5-tree').each(($el) => cy.wrap($el).find('ui5-checkbox').should('not.be.checked'))
  })

  it('should update the source site when adding a second source site', () => {
    utils.getAddSiteConfigButton().click()
    cy.wait(5000)
    utils.fillSourceApiKeyInput()
    utils.checkTargetSitesList()
    cy.get('[data-cy ="addTargetSiteButton"]').eq(1).click()
    utils.checkTargetSitesList()
  })

  it('should clear site configurations when removing the source site', () => {
    utils.getAddSiteConfigButton().click()
    cy.wait(5000)
    utils.fillSourceApiKeyInput()
    cy.wait(1000)
    utils.setConfigurationCheckBox('siteCopyConfigurationDialog')
    cy.get('[data-cy ="siteConfigurationsCard"]').should('be.visible')
    cy.get('[data-cy ="selectedTargetApiKeysList"]').find('ui5-li-custom').shadow().find('ui5-button').click()
    cy.get('[data-cy ="selectedTargetApiKeysList"]').should('not.exist')
    cy.get('[data-cy ="siteConfigurationsCard"]').should('not.be.visible')
  })

  it('should set dataflow configuration variables on save and not on cancel', () => {
    utils.getAddSiteConfigButton().shadow().find('button').should('be.enabled')
    utils.getEditSiteConfigButton().should('not.exist')
    utils.getDeclineSiteConfigButton().should('not.exist')
    utils.getAddSiteConfigButton().click()
    utils.getSiteCopyConfigurationDialog().should('be.visible')
    cy.wait(5000)
    utils.fillSourceApiKeyInput()
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
