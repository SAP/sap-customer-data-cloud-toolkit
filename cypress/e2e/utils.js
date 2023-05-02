/* eslint-disable no-undef */

import {
  siteConfigResponse,
  mockedGetSchemaResponse,
  mockedSetSchemaResponse,
  mockedGetSmsConfigsResponse,
  mockedSetSmsTemplatesResponse,
  mockedGetSocialsConfigsResponse,
  mockedSetSocialsConfigsResponse,
  mockedUserSitesResponse,
  mockedGetPartnersResponse,
  dummyApiKey,
  mockedGetEmailTemplatesConfigsResponse,
  mockPolicyResponse,
  policiesPopoverText,
  mockedGetScreenSetResponse,
  targetSitePopoverText,
  mockedSetPolicyResponse,
  mockedGetConsentStatementExpectedResponse,
  mockedSetConsentResponse,
  mockedGetPolicyResponse,
  mockedGetCommunicationTopicsExpectedResponse,
  mockedSetCommunicationResponse,
  mockedGetCommunicationChannelsExpectedResponse,
} from './dataTest'

export function startUp(pageName) {
  cy.visit('', {
    onBeforeLoad(window) {
      cy.stub(window, 'open').as('windowOpenStub')
    },
  })
  mockResponse(siteConfigResponse, 'POST', 'admin.getSiteConfig')
  mockResponse(mockPolicyResponse, 'POST', 'accounts.getPolicies')
  mockGetUserSitesRequest()
  mockGetPartnersRequest()
  cy.contains(pageName).realClick()
  writeCredentials()
}

export function writeCredentials() {
  resizeObserverLoopErrRe()
  const openPopoverButton = cy.get('body').find('#openPopoverButton')
  openPopoverButton.realClick()
  cy.get('#userKey').shadow().find('[class = "ui5-input-inner"]').focus().type('AFww+F466MSR', { force: true })
  cy.get('#secretKey').shadow().find('[class = "ui5-input-content"]').find('[class = "ui5-input-inner"]').type('dr8XCkty9Mu7yaPH94BfEgxP8lZXRTRP', { force: true })
  openPopoverButton.realClick()
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
  cy.intercept(method, url, {
    body: response,
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

export function getBaseDomain(baseDomain, timeout) {
  cy.get('#cdctools-baseDomain').should('be.visible')
  return cy.get('#cdctools-baseDomain', { timeout: timeout }).shadow().find('[class = "ui5-input-inner"]').type(baseDomain, { force: true }).should('have.value', baseDomain)
}

export function getDataCenters(chosenDataCenter) {
  cy.get('#cdctools-dataCenter').shadow().find('ui5-icon').realClick()
  cy.get('ui5-static-area-item').shadow().find('ui5-responsive-popover > ui5-list').find('ui5-li').eq(0).shadow().find('li > ui5-checkbox').click()
  cy.get('ui5-static-area-item').shadow().find('ui5-responsive-popover > ui5-list').find('ui5-li').eq(1).shadow().find('li > ui5-checkbox').click()
  return cy
    .get('#cdctools-dataCenter')
    .shadow()
    .find('.ui5-multi-combobox-tokenizer')
    .find(`[text = ${chosenDataCenter}]`)
    .shadow()
    .find('[class="ui5-token--text"]')
    .should('have.text', chosenDataCenter)
}

export function getSiteStructure(optionNumber, timeout) {
  cy.get('#cdctools-siteStructure', { timeout: timeout }).should('be.visible')
  cy.get('#cdctools-siteStructure', { timeout: timeout }).click()
  return cy.get('ui5-static-area-item').shadow().find('.ui5-select-popover').find('ui5-li').eq(optionNumber).click(1, 1) // Specify explicit coordinates because clickable text has a 66 characters limitation
}

export function deleteChildSite(length) {
  cy.get('ui5-table-row').eq(0).find('ui5-table-cell').eq(4).find('ui5-button').shadow().find('button').click()
  cy.get('ui5-responsive-popover').find(' [accessible-name="Delete Item 2 of 2"]').eq(0).shadow().find('button').realClick()
}

export function getCreateButton() {
  return cy.get('body').find('#createButton').shadow().find('.ui5-button-root')
}

export function getSaveButton() {
  return cy.get('#saveCancelCard').find('#save-main')
}

export function getCancelButton() {
  return cy.get('#saveCancelCard').find('#cancel-main')
}

export function clickPopUpOkButton(popUpId) {
  cy.get('.show-cdc-tools-app-container').find(popUpId).should('be.visible')
  return cy.get('.show-cdc-tools-app-container').find(popUpId).find('ui5-bar').find('ui5-button').realClick()
}

export function mockGetConfigurationRequests() {
  mockResponse(mockedGetSchemaResponse, 'POST', 'accounts.getSchema')
  mockResponse(mockedGetScreenSetResponse, 'POST', 'accounts.getScreenSets')
  mockResponse(mockedGetPolicyResponse, 'POST', 'accounts.getPolicies')
  mockResponse(mockedGetSmsConfigsResponse, 'POST', 'accounts.sms.templates.get')
  mockResponse(siteConfigResponse, 'POST', 'admin.getSiteConfig')
  mockResponse(mockedGetSocialsConfigsResponse, 'POST', 'socialize.getProvidersConfig')
  mockResponse(mockedGetEmailTemplatesConfigsResponse, 'POST', 'accounts.policies.emailTemplates.getConfig')
  mockResponse(mockedGetConsentStatementExpectedResponse, 'POST', 'accounts.getConsentsStatements')
  mockResponse(mockedGetCommunicationChannelsExpectedResponse, 'POST', 'accounts.communication.getChannels')
  mockResponse(mockedGetCommunicationTopicsExpectedResponse, 'POST', 'accounts.communication.getTopicSettings')
}

export function mockSetConfigurationRequests() {
  mockResponse(mockedSetSchemaResponse, 'POST', 'accounts.setSchema')
  mockResponse(mockedSetPolicyResponse, 'POST', 'accounts.setPolicies')
  mockResponse(mockedSetSmsTemplatesResponse, 'POST', 'accounts.sms.templates.set')

  mockResponse(mockedSetSocialsConfigsResponse, 'POST', 'socialize.setProvidersConfig')
  mockResponse(mockedSetConsentResponse, 'POST', 'accounts.setConsentsStatements')
  mockResponse(mockedSetConsentResponse, 'POST', 'accounts.setLegalStatements')
  mockResponse(mockedSetCommunicationResponse, 'POST', 'accounts.communication.setChannels')
  mockResponse(mockedSetCommunicationResponse, 'POST', 'accounts.communication.setTopicSettings')
}

export function mockGetUserSitesRequest() {
  mockResponse(mockedUserSitesResponse, 'POST', 'admin.console.getPagedUserEffectiveSites')
}

export function mockGetPartnersRequest() {
  mockResponse(mockedGetPartnersResponse, 'POST', 'admin.console.getPartners')
}

export function checkErrors(expectedState) {
  cy.get('[icon = error]').should(expectedState)
  cy.get('#errorListContainer').should(expectedState)
}

export function checkElementsInitialState() {
  cy.get('#apiKeyInput').shadow().find('[class = "ui5-input-inner"]').should('have.text', '')
  cy.get('ui5-tree').should('be.visible')
  cy.get('ui5-tree').eq(0).find('ui5-checkbox').should('not.be.checked')
  cy.get('ui5-tree').eq(2).find('#policiesTooltipIcon').should('exist')
  cy.get('ui5-tree').eq(2).find('#policiesTooltipIcon').realHover()
  cy.get('#policiesPopover').should('have.text', policiesPopoverText)
  cy.get('#copyConfigExtendedSaveButton').shadow().find('button').should('be.disabled')
  cy.get('#copyConfigExtendedCancelButton').shadow().find('button').should('be.enabled')
  cy.get('#targetSiteTooltipIcon').should('exist')
  cy.get('#targetSiteTooltipIcon').realHover()
  cy.get('#targetSitePopover').should('have.text', targetSitePopoverText)
}

export function setConfigurationCheckBox() {
  cy.get('ui5-tree').eq(0).find('ui5-checkbox').eq(0).realClick()
}

export function fillTargetApiKeyInput() {
  cy.get('#copyConfigurationExtendedSearchSitesInputCard').find('#apiKeyInput').shadow().find('[class = "ui5-input-inner"]').type(dummyApiKey)
  cy.get('ui5-static-area-item').shadow().find('ui5-li-suggestion-item').click()
}

export function fillSourceApiKeyInput() {
  cy.get('#siteCopyConfigurationDialog').find('#apiKeyInput').shadow().find('[class = "ui5-input-inner"]').click().type(dummyApiKey)
  cy.get('ui5-static-area-item').shadow().find('ui5-li-suggestion-item').click()
}

export function checkTargetSitesList() {
  cy.get('#selectedTargetApiKeysList').should('have.length', '1')
}

export function writeParentSiteTable(baseDomain, siteDescription, dataCenterOption) {
  cy.get('#baseDomainInput').shadow().find('[class = "ui5-input-inner"]').type(baseDomain).should('have.value', baseDomain)
  cy.get('#descriptionInput').shadow().find('[class = "ui5-input-inner"]').type(siteDescription).should('have.value', siteDescription)
  cy.get('#dataCenterSelect').click()
  cy.get('ui5-static-area-item').shadow().find('.ui5-select-popover').eq(1).find('ui5-li').eq(dataCenterOption).realClick()
}

export function writeChildrenSiteTable(childrenDomain, childrenDescription) {
  cy.get('#childBaseDomainInput').shadow().find('[class = "ui5-input-inner"]').type(childrenDomain).should('have.value', childrenDomain)
  cy.get('#childDescriptionInput').shadow().find('[class = "ui5-input-inner"]').type(childrenDescription).should('have.value', childrenDescription)
}

export function createChild() {
  getIcon(0)
  cy.get('ui5-responsive-popover').find('[data-component-name = "ActionSheetMobileContent"] ').find('[accessible-name="Create Child Site Item 1 of 2"]').realClick()
}
export function getIcon(iconNumber) {
  return cy.get('[icon ="overflow"]').eq(iconNumber).realClick()
}

function getSiteConfigButton(buttonId) {
  return cy.get('ui5-table-row').eq(0).find('#sitesCopyConfigurationButtonPannelGrid').find(buttonId)
}

export function getAddSiteConfigButton() {
  return getSiteConfigButton('#addSiteConfigButton')
}

export function getEditSiteConfigButton() {
  return getSiteConfigButton('#editSiteConfigButton')
}

export function getDeclineSiteConfigButton() {
  return getSiteConfigButton('#declineSiteConfigButton')
}

export function getSiteCopyConfigurationDialog() {
  return cy.get('#siteCopyConfigurationDialog')
}
