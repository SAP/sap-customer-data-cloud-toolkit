/* eslint-disable no-undef */

export function startUp(url, pageName) {
  cy.visit(url)
  cy.contains(pageName).click({ force: true })
  writeCredentials()
}

export function writeCredentials() {
  resizeObserverLoopErrRe()
  const openPopoverButton = cy.get('body').find('#openPopoverButton')
  openPopoverButton.click({ force: true })
  cy.get('#userKey').shadow().find('[class = "ui5-input-inner"]').focus().type('AFww+F466MSR', { force: true })
  cy.get('#userSecret').shadow().find('[class = "ui5-input-content"]').find('[class = "ui5-input-inner"]').type('dr8XCkty9Mu7yaPH94BfEgxP8lZXRTRP', { force: true })
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

export function getSiteDomain(siteDomain, timeout) {
  return cy.get('#cdctools-siteDomain', { timeout: timeout }).shadow().find('[class = "ui5-input-inner"]').type(siteDomain).should('have.value', siteDomain)
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
  return cy.get('ui5-static-area-item').shadow().find('.ui5-select-popover').find('ui5-li').eq(optionNumber).click()
}

export function getCreateButton() {
  return cy.get('body').find('#createButton').shadow().find('.ui5-button-root')
}

export function getSaveButton() {
  return cy.get('ui5-card').eq(2).shadow().get('ui5-bar').eq(2).find('[class ="ui5-bar-content"]').find('#save-main')
}
