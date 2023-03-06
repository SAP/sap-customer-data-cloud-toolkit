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
  policiesPopoverText,
  mockedGetScreenSetResponse,
} from './dataTest'

export function startUp(pageName) {
  cy.visit('')
  mockResponse(siteConfigResponse, 'POST', 'admin.getSiteConfig')
  mockGetUserSitesRequest()
  mockGetPartnersRequest()
  cy.contains(pageName).click({ force: true })
  writeCredentials()
}

export function writeCredentials() {
  resizeObserverLoopErrRe()
  const openPopoverButton = cy.get('body').find('#openPopoverButton')
  openPopoverButton.click({ force: true })
  cy.get('#userKey').shadow().find('[class = "ui5-input-inner"]').focus().type('AFww+F466MSR', { force: true })
  cy.get('#secretKey').shadow().find('[class = "ui5-input-content"]').find('[class = "ui5-input-inner"]').type('dr8XCkty9Mu7yaPH94BfEgxP8lZXRTRP', { force: true })
  openPopoverButton.click({ force: true })
}

export function clearCredentials() {
  resizeObserverLoopErrRe()
  const openPopoverButton = cy.get('body').find('#openPopoverButton')
  openPopoverButton.click()
  cy.get('#userKey').shadow().find('[class = "ui5-input-inner"]').focus().clear()
  cy.get('#secretKey').shadow().find('[class = "ui5-input-inner"]').clear({ force: true })
  openPopoverButton.click()
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
  return cy.get('#cdctools-baseDomain', { timeout: timeout }).shadow().find('[class = "ui5-input-inner"]').type(baseDomain, { force: true }).should('have.value', baseDomain)
}

export function getDataCenters(chosenDataCenter, removeFirst, removeSecond) {
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

export function getSiteStructure(optionNumber) {
  cy.get('#cdctools-siteStructure').click()
  return cy.get('ui5-static-area-item').shadow().find('.ui5-select-popover').find('ui5-li').eq(optionNumber).click(1, 1) // Specify explicit coordinates because clickable text has a 66 characters limitation
}

export function deleteChildSite(length) {
  for (let i = length - 1; i >= 0; i--) {
    if (i % 2 === 0 && i > 0) {
      cy.get('ui5-responsive-popover').find(' [accessible-name="Delete Item 2 of 2"]').eq(0).click({ force: true })
    }
  }
  cy.get('[data-component-name ="ActionSheetMobileContent"]').find('[accessible-name="Delete Item 1 of 1"]').click({ force: true })
}

export function getCreateButton() {
  return cy.get('body').find('#createButton').shadow().find('.ui5-button-root')
}

export function getSaveButton() {
  return cy.get('ui5-card').eq(2).shadow().get('ui5-bar').eq(2).find('[class ="ui5-bar-content"]').find('#save-main')
}

export function clickPopUpOkButton(popUpId) {
  return cy.get('.show-cdc-tools-app-container').find(popUpId).find('ui5-bar').find('ui5-button').click({ force: true })
}

export function mockGetConfigurationRequests() {
  mockResponse(mockedGetSchemaResponse, 'POST', 'accounts.getSchema')
  mockResponse(mockedGetScreenSetResponse, 'POST', 'accounts.getScreenSets')
  mockResponse(mockedGetSmsConfigsResponse, 'POST', 'accounts.sms.templates.get')
  mockResponse(mockedGetSocialsConfigsResponse, 'POST', 'socialize.getProvidersConfig')
  mockResponse(mockedGetEmailTemplatesConfigsResponse, 'POST', 'accounts.policies.emailTemplates.getConfig')
}

export function mockSetConfigurationRequests() {
  mockResponse(mockedSetSchemaResponse, 'POST', 'accounts.setSchema')
  mockResponse(mockedSetSmsTemplatesResponse, 'POST', 'accounts.sms.templates.set')
  mockResponse(mockedSetSocialsConfigsResponse, 'POST', 'socialize.setProvidersConfig')
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
  cy.get('#targetApiKeyInput').shadow().find('[class = "ui5-input-inner"]').should('have.text', '')
  cy.get('ui5-tree').should('be.visible')
  cy.get('ui5-tree').eq(0).find('ui5-checkbox').should('not.be.checked')
  cy.get('ui5-tree').eq(2).find('#policiesTooltipIcon').should('exist')
  cy.get('ui5-tree').eq(2).find('#policiesTooltipIcon').realHover()
  cy.get('#policiesPopover').should('have.text', policiesPopoverText)
  cy.get('#saveButton').shadow().find('button').should('be.disabled')
  cy.get('#cancelButton').shadow().find('button').should('be.enabled')
}

export function setConfigurationCheckBox() {
  cy.get('ui5-tree').eq(0).find('ui5-checkbox').eq(0).realClick()
}

export function fillTargetApiKeyInput() {
  cy.get('#targetApiKeyInput').shadow().find('[class = "ui5-input-inner"]').type(dummyApiKey)
  cy.get('ui5-static-area-item').shadow().find('ui5-li-suggestion-item').click()
}
