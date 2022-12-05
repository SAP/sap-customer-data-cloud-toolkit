/* eslint-disable no-undef */
describe('Email Templates Test Suite', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/#')
    cy.contains('Email Templates').click({ force: true })
    writeCredentials()
  })

  it('should display Export All and Import All buttons', () => {
    cy.get('#exportAllButton').should('not.be.disabled')
    cy.get('#importAllButton').should('not.be.disabled')
  })

  it('should show error messages', () => {})
})

function writeCredentials() {
  resizeObserverLoopErrRe()
  const openPopoverButton = cy.get('body').find('#openPopoverButton')
  openPopoverButton.click({ force: true })
  cy.get('#userKey').shadow().find('[class = "ui5-input-inner"]').focus().type('dummyuserkey', { force: true })
  cy.get('#secretKey').shadow().find('[class = "ui5-input-content"]').find('[class = "ui5-input-inner"]').type('dummyusersecret', { force: true })
  openPopoverButton.click({ force: true })
}

function resizeObserverLoopErrRe() {
  const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
  cy.on('uncaught:exception', (err) => {
    if (resizeObserverLoopErrRe.test(err.message)) {
      return false
    }
  })
}
