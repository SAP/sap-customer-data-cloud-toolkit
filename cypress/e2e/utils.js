/* eslint-disable no-undef */

export function startUp(pageName) {
  cy.visit('http://localhost:3000')
  cy.contains(pageName).click({ force: true })
  writeCredentials()
}

export function writeCredentials() {
  resizeObserverLoopErrRe()
  const openPopoverButton = cy.get('body').find('#openPopoverButton')
  openPopoverButton.click({ force: true })
  cy.get('#userKey').shadow().find('[class = "ui5-input-inner"]').focus().type('dummyuserkey', { force: true })
  cy.get('#secretKey').shadow().find('[class = "ui5-input-content"]').find('[class = "ui5-input-inner"]').type('dummyusersecret', { force: true })
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
