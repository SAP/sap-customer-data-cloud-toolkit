/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

/* eslint-disable no-undef */

import { expectedGetRbaPolicyResponseOk, expectedGetRiskAssessmentResponseOk, expectedGetUnknownLocationNotificationResponseOk } from '../../src/services/copyConfig/rba/dataTest'
import { expectedCommunicationResponse } from '../../src/services/importAccounts/communicationImport/dataTest'
import { mockPreferencesResponse } from '../../src/services/importAccounts/preferencesImport/dataTest'
import { expectedSchemaResponse } from '../../src/services/importAccounts/schemaImport/schemaDatatest'
import {
  dummyApiKey,
  mockedCreateDataflowResponse,
  mockedCreateExtensionExpectedResponse,
  mockedGetCommunicationChannelsExpectedResponse,
  mockedGetCommunicationTopicsExpectedResponse,
  mockedGetConsentStatementExpectedResponse,
  mockedGetEmailTemplatesConfigsResponse,
  mockedGetExtensionExpectedResponse,
  mockedGetPartnersResponse,
  mockedGetPolicyResponse,
  mockedGetSchemaResponse,
  mockedGetScreenSetResponse,
  mockedPrettierGetScreenSetResponse,
  mockedGetSmsConfigsResponse,
  mockedGetSocialsConfigsResponse,
  mockedGetWebhookExpectedResponse,
  mockedSearchDataflowsEmptyResponse,
  mockedSearchDataflowsResponse,
  mockedSetCommunicationResponse,
  mockedSetConsentResponse,
  mockedSetDataflowResponse,
  mockedSetExtensionResponse,
  mockedSetPolicyResponse,
  mockedSetRbaPolicyResponse,
  mockedSetRiskAssessmentResponse,
  mockedSetSchemaResponse,
  mockedSetSmsTemplatesResponse,
  mockedSetSocialsConfigsResponse,
  mockedSetUnknownLocationNotificationResponse,
  mockedSetWebhookResponse,
  mockedUserSitesResponse,
  policiesPopoverText,
  siteConfigResponse,
  targetSitePopoverText,
  getRecaptchaExpectedResponse,
  getRiskProvidersResponse,
  setCaptchaConfigMock,
  setPoliciesMock,
  setRiskProvidersMock,
} from './dataTest'

export function startUp(pageName) {
  cy.visit('')

  cy.clearAllCookies()
  cy.clearAllLocalStorage()
  cy.clearAllSessionStorage()

  cy.contains(pageName).realClick()
  cy.reload()
}
export function getImportAccountsInformation() {
  cy.get('#importAccountsTitle').should('contain.text', 'Import Data')
  cy.get('#importAccountsHeaderText').should('contain.text', 'Import accounts and generate csv with schema and legal fields')
  cy.get('ui5-card-header').eq(3).shadow().find('.ui5-card-header-first-line').should('contain.text', 'Download Template')
  cy.get('ui5-card-header')
    .eq(3)
    .shadow()
    .find('.ui5-card-header-subtitle')
    .should('contain.text', 'This will export the chosen fields to a CSV file. You can then import this file to create accounts.')
}

export function clearCredentials() {
  resizeObserverLoopErrRe()
  const openPopoverButton = cy.get('body').find('#openPopoverButton')
  openPopoverButton.realClick()
  cy.get('#userKey').shadow().find('[class = "ui5-input-inner"]').focus().clear()
  cy.get('#secretKey').shadow().find('[class = "ui5-input-inner"]').clear({ force: true })
  openPopoverButton.realClick()
}

export function mockResponse(response, method, url) {
  cy.intercept(method, url, { body: response })
}
export function mockCopyConfigRequests(response, method, url) {
  cy.intercept(method, url, { body: response }).as('schema')
  cy.wait('@schema')
}

let interceptCount = true
export function mockSearchResponse(response, method, url) {
  cy.intercept(method, url, (req) => {
    if (interceptCount) {
      interceptCount = false
      req.reply({ body: mockedSearchDataflowsResponse })
    } else {
      interceptCount = true
      req.reply({ body: mockedSearchDataflowsEmptyResponse })
    }
  })
}

export function resizeObserverLoopErrRe() {
  const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
  cy.on('uncaught:exception', (err) => {
    if (resizeObserverLoopErrRe.test(err.message)) {
      return false
    }
  })
}
export function removeJavascript(mockResponse) {
  for (const screenSet of mockResponse.screenSets) {
    delete screenSet.javascript
  }
  return mockResponse
}
export function addErrorOnJavascript(mockResponse, screenID) {
  for (const screenSet of mockResponse.screenSets) {
    if (screenSet.screenSetID === screenID) {
      screenSet.javascript = '{\n    // Called when an error occurs.\n    onError: function (event) {\n'
    }
  }
  return mockResponse
}
export function getScreenSets(mockedPrettierGetScreenSetResponse) {
  cy.intercept('POST', 'accounts.getScreenSets', { body: mockedPrettierGetScreenSetResponse }).as('getScreenSets')
}
export function getBaseDomain(baseDomain, timeout) {
  cy.wait(1000)
  cy.get('[data-cy ="cdctools-baseDomain"]').should('be.visible')
  return cy.get('[data-cy ="cdctools-baseDomain"]', { timeout: timeout }).shadow().find('[class = "ui5-input-inner"]').type(baseDomain).should('have.value', baseDomain)
}

export function getDataCenters(chosenDataCenter) {
  cy.wait(1000)
  cy.get('[data-cy ="cdctools-dataCenter"]').shadow().find('ui5-icon').realClick()
  cy.get('ui5-static-area-item').shadow().find('ui5-responsive-popover > ui5-list').find('ui5-li').eq(0).shadow().find('li > ui5-checkbox').click()
  cy.get('ui5-static-area-item').shadow().find('ui5-responsive-popover > ui5-list').find('ui5-li').eq(1).shadow().find('li > ui5-checkbox').click()
  return cy
    .get('[data-cy ="cdctools-dataCenter"]')
    .shadow()
    .find('.ui5-multi-combobox-tokenizer')
    .find(`[text = ${chosenDataCenter}]`)
    .shadow()
    .find('[class="ui5-token--text"]')
    .should('have.text', chosenDataCenter)
}

export function getSiteStructure(optionNumber, timeout) {
  cy.get('[data-cy ="cdctools-siteStructure"]').should('be.visible')
  cy.get('[data-cy ="cdctools-siteStructure"]', { timeout: timeout }).click()
  cy.wait(1000)
  return cy.get('ui5-static-area-item').shadow().find('.ui5-select-popover').find('ui5-li').eq(optionNumber).click(1, 1) // Specify explicit coordinates because clickable text has a 66 characters limitation
}

export function deleteChildSite(length) {
  cy.get('ui5-table-row').eq(length).find('ui5-table-cell').eq(4).find('ui5-button').shadow().find('button').click()
  cy.get('ui5-responsive-popover').find(' [accessible-name="Delete Item 2 of 2"]').eq(0).shadow().find('button').realClick()
}

export function getCreateButton() {
  return cy.get('[data-cy ="createButton"]').shadow().find('.ui5-button-root')
}

export function getSaveButton() {
  return cy.get('[data-cy ="save-main"]')
}

export function getCancelButton() {
  return cy.get('[data-cy ="cancel-main"]')
}

export function clickPopUpOkButton(popUpId) {
  cy.get(`[data-cy =${popUpId}]`).should('be.visible')
  return cy.get(`[data-cy =${popUpId}]`).find('ui5-bar').find('ui5-button').click()
}

export function mockGetConfigurationRequests() {
  cy.intercept('POST', 'admin.console.getPagedUserEffectiveSites', { body: mockedUserSitesResponse }).as('getPagedUserEffectiveSites')
  cy.intercept('POST', 'admin.console.getPartners', { body: mockedGetPartnersResponse }).as('getPartners')
  cy.intercept('POST', 'accounts.getSchema', { body: mockedGetSchemaResponse }).as('getSchema')
  cy.intercept('POST', 'accounts.getScreenSets', { body: mockedGetScreenSetResponse }).as('getScreenSets')
  cy.intercept('POST', 'accounts.getPolicies', { body: mockedGetPolicyResponse }).as('getPolicies')
  cy.intercept('POST', 'accounts.sms.templates.get', { body: mockedGetSmsConfigsResponse }).as('sms.templates.get')
  cy.intercept('POST', 'admin.getSiteConfig', { body: siteConfigResponse }).as('getSiteConfig')
  cy.intercept('POST', 'socialize.getProvidersConfig', { body: mockedGetSocialsConfigsResponse }).as('getProvidersConfig')
  cy.intercept('POST', 'accounts.policies.emailTemplates.getConfig', { body: mockedGetEmailTemplatesConfigsResponse }).as('policies.emailTemplates.getConfig')
  cy.intercept('POST', 'accounts.getConsentsStatements', { body: mockedGetConsentStatementExpectedResponse }).as('getConsentsStatements')
  cy.intercept('POST', 'accounts.communication.getChannels', { body: mockedGetCommunicationChannelsExpectedResponse }).as('communication.getChannels')
  cy.intercept('POST', 'accounts.communication.getTopicSettings', { body: mockedGetCommunicationTopicsExpectedResponse }).as('communication.getTopicSettings')
  cy.intercept('POST', 'accounts.webhooks.getAll', { body: mockedGetWebhookExpectedResponse }).as('webhooks.getAll')
  cy.intercept('POST', 'accounts.extensions.list', { body: mockedGetExtensionExpectedResponse }).as('extensions.list')
  cy.intercept('POST', 'accounts.extensions.create', { body: mockedCreateExtensionExpectedResponse }).as('extensions.create')
  cy.intercept('POST', 'idx.search', { body: mockedSearchDataflowsResponse }).as('idx.search')
  cy.intercept('POST', 'accounts.rba.riskAssessment.getConfig', { body: expectedGetRiskAssessmentResponseOk }).as('rba.riskAssessment.getConfig')
  cy.intercept('POST', 'accounts.rba.riskAssessment.getConfig', { body: expectedGetUnknownLocationNotificationResponseOk }).as('accounts.getPolicies')
  cy.intercept('POST', 'accounts.rba.getPolicy', { body: expectedGetRbaPolicyResponseOk }).as('rba.getPolicy')
  cy.intercept('POST', 'admin.captcha.getConfig', { body: getRecaptchaExpectedResponse }).as('captcha.getConfig')
  cy.intercept('POST', 'accounts.getPolicies', { body: mockedGetPolicyResponse }).as('accounts.getPolicies')
  cy.intercept('POST', 'admin.riskProviders.getConfig', { body: getRiskProvidersResponse }).as('riskProviders.getConfig')
}
export function mockConfigurationTreeFullAccount() {
  cy.intercept('POST', 'accounts.getSchema', { body: expectedSchemaResponse }).as('getSchema')
  cy.intercept('POST', 'accounts.getConsentsStatements', { body: mockPreferencesResponse }).as('getPreferences')
  cy.intercept('POST', 'accounts.communications.settings.search', { body: expectedCommunicationResponse }).as('getCommunication')
  cy.intercept('POST', 'admin.getSiteConfig', { body: siteConfigResponse }).as('getSiteConfig')
}

export function mockSetConfigurationRequests() {
  mockResponse(mockedSetSchemaResponse, 'POST', 'accounts.setSchema')
  mockResponse(mockedSetPolicyResponse, 'POST', 'accounts.setPolicies')
  mockResponse(mockedSetSmsTemplatesResponse, 'POST', 'accounts.sms.templates.set')
  mockResponse(mockedSetSocialsConfigsResponse, 'POST', 'socialize.setProvidersConfig')
  mockResponse(mockedSetConsentResponse, 'POST', 'accounts.setConsentsStatements')
  mockResponse(mockedSetConsentResponse, 'POST', 'accounts.setLegalStatements')
  mockResponse(mockedSetCommunicationResponse, 'POST', 'accounts.communication.setChannels')
  mockResponse(mockedSetWebhookResponse, 'POST', 'accounts.webhooks.set')
  mockResponse(mockedSetExtensionResponse, 'POST', 'accounts.extensions.modify')
  mockResponse(mockedSetDataflowResponse, 'POST', 'idx.setDataflow')
  mockSearchResponse(mockedCreateDataflowResponse, 'POST', 'idx.createDataflow')
  mockResponse(mockedSetRiskAssessmentResponse, 'POST', 'accounts.rba.riskAssessment.setConfig')
  mockResponse(mockedSetUnknownLocationNotificationResponse, 'POST', 'accounts.setPolicies')
  mockResponse(mockedSetRbaPolicyResponse, 'POST', 'accounts.rba.setPolicy')
  mockResponse(setCaptchaConfigMock, 'POST', 'admin.captcha.setConfig')
  mockResponse(setPoliciesMock, 'POST', 'accounts.setPolicies')
  mockResponse(setRiskProvidersMock, 'POST', 'admin.riskProviders.setConfig')
}

export function mockGetUserSitesRequest() {
  mockResponse(mockedUserSitesResponse, 'POST', 'admin.console.getPagedUserEffectiveSites')
}

export function mockGetPartnersRequest() {
  mockResponse(mockedGetPartnersResponse, 'POST', 'admin.console.getPartners')
}

export function checkErrors(expectedState) {
  cy.get('[icon = error]').should(expectedState)
  cy.get('[data-cy ="errorListContainer"]').should(expectedState)
}

export function checkElementsInitialState() {
  cy.get('[data-cy ="apiKeyInput"]').shadow().find('[class = "ui5-input-inner"]').should('have.text', '')
  cy.get('ui5-tree').should('be.visible')
  cy.get('ui5-tree').eq(0).find('ui5-checkbox').should('not.be.checked')
  cy.get('ui5-tree').eq(4).find('#policiesTooltipIcon').should('exist')
  cy.get('ui5-tree').eq(4).find('#policiesTooltipIcon').realHover()
  cy.get('#policiesPopover').should('have.text', policiesPopoverText)
  cy.get('[data-cy ="copyConfigExtendedSaveButton"]').shadow().find('button').should('be.disabled')
  cy.get('[data-cy ="copyConfigExtendedCancelButton"]').shadow().find('button').should('be.enabled')
  cy.get('[data-cy ="targetSiteTooltipIcon"]').should('exist')
  cy.get('[data-cy ="targetSiteTooltipIcon"]').realHover()
  cy.get('[data-cy ="targetSitePopover"]').should('have.text', targetSitePopoverText)
}

export function setConfigurationCheckBox() {
  cy.get('#siteCopyConfigurationDialog')
    .find('#siteConfigurationsCard')
    .find('ui5-tree')
    .then((tree) => {
      cy.wrap(tree).should('be.visible')
      cy.wrap(tree).find('#schema').click()
    })
}

export function setConfigurationCopyConfig() {
  cy.get('#siteConfigurationsCard')
    .find('ui5-tree')
    .then((tree) => {
      cy.wrap(tree).should('be.visible')
      cy.wrap(tree).find('#schema').click()
    })
}

export function fillTargetApiKeyInput() {
  cy.get('[data-cy ="copyConfigurationExtendedSearchSitesInputCard"]').find('#apiKeyInput').shadow().find('[class = "ui5-input-inner"]').type(dummyApiKey)
  cy.wait(1000)
  cy.get('#apiKeyInput').find('[id="addTargetSiteButton"]').click()
}

export function fillSourceApiKeyInput() {
  cy.get('[data-cy ="siteCopyConfigurationDialog"]')
    .find('#apiKeyInput')
    .then((input) => {
      cy.wrap(input).shadow().find('input').click().focus().type(`${dummyApiKey}`).should('have.value', dummyApiKey)
      cy.wait(1000)
      cy.get(':nth-child(2) > [data-cy="apiKeyInput"] > [data-cy="addTargetSiteButton"]').click()
    })
}

export function checkTargetSitesList() {
  cy.get('[data-cy ="selectedTargetApiKeysList"]').should('have.length', '1')
}

export function writeParentSiteTable(baseDomain, siteDescription, dataCenterOption) {
  cy.get('[data-cy ="baseDomainInput"]').shadow().find('[class = "ui5-input-inner"]').type(baseDomain).should('have.value', baseDomain)
  cy.get('[data-cy ="descriptionInput"]').shadow().find('[class = "ui5-input-inner"]').type(siteDescription).should('have.value', siteDescription)
  cy.wait(1000)
  cy.get('[data-cy ="dataCenterSelect"]').click()
  cy.get('ui5-static-area-item').shadow().find('.ui5-select-popover').eq(1).find('ui5-li').eq(dataCenterOption).realClick()
  cy.wait(500)
}

export function writeChildrenSiteTable(childrenDomain, childrenDescription) {
  cy.get('[data-cy ="childBaseDomainInput"]').shadow().find('[class = "ui5-input-inner"]').type(childrenDomain).should('have.value', childrenDomain)
  cy.get('[data-cy ="childDescriptionInput"]').shadow().find('[class = "ui5-input-inner"]').type(childrenDescription).should('have.value', childrenDescription)
}

export function createChild() {
  getIcon(0)
  cy.get('[data-cy="createChildSiteAction"]').click()
}
export function getIcon(iconNumber) {
  return cy.get('[icon ="overflow"]').eq(iconNumber).realClick()
}

function getSiteConfigButton(buttonId) {
  return cy.get('ui5-table-row').eq(0).find('[data-cy ="sitesCopyConfigurationButtonPannelGrid"]').find(`[data-cy =${buttonId}]`)
}

export function getAddSiteConfigButton() {
  return getSiteConfigButton('addSiteConfigButton')
}

export function getEditSiteConfigButton() {
  return getSiteConfigButton('editSiteConfigButton')
}

export function getDeclineSiteConfigButton() {
  return getSiteConfigButton('declineSiteConfigButton')
}

export function getSiteCopyConfigurationDialog() {
  return cy.get('[data-cy ="siteCopyConfigurationDialog"]')
}
