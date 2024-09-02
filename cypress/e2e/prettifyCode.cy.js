/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import * as utils from './utils'

describe('UI Builder - Prettify Code', () => {
  const liteRegistration = 'Default-LiteRegistration'
  const linkAccounts = 'Default-LinkAccounts'
  context('Viewing informational PopUp', () => {
    beforeEach(() => {
      cy.visit(`http://localhost:3000/#/99999999/4_AAAAAAAAAAAAAAAAAAAAAA/user-interfacing/screen-sets-app/web/uiBuilder?screenSetId=${liteRegistration}`)
      utils.getScreenSets()
    })
    afterEach(() => {
      cy.clearAllCookies()
      cy.clearAllLocalStorage()
      cy.clearAllSessionStorage()
    })
    it('Should show information popUp when there is no changes in the code', () => {
      cy.get('[data-cy="prettifyCode"]').click()
      cy.get('#infoPopup').should('be.visible').should('contains.text', 'THERE WHERE NO CHANGES IN THE CODE')
    })
  })
  context('Viewing Successfull PopUp', () => {
    beforeEach(() => {
      cy.visit(`http://localhost:3000/#/99999999/4_AAAAAAAAAAAAAAAAAAAAAA/user-interfacing/screen-sets-app/web/uiBuilder?screenSetId=${linkAccounts}`)
      utils.getScreenSets()
    })
    afterEach(() => {
      cy.clearAllCookies()
      cy.clearAllLocalStorage()
      cy.clearAllSessionStorage()
    })
    it('Should show information popUp when there is no changes in the code', () => {
      cy.get('[data-cy="prettifyCode"]').click()
      cy.get('[data-cy="prettierSuccessPopup"]')
        .should('be.visible')
        .should('contains.text', 'Please report the successful usage to help us track usages and being able to continue improving this tool.')
    })
  })
})
