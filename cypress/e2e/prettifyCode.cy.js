/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import * as utils from './utils'
import * as datatest from './dataTest'

describe('UI Builder - Prettify Code', () => {
  const liteRegistration = 'Default-LiteRegistration'
  const linkAccounts = 'Default-LinkAccounts'
  const organizationRegistration = 'Default-OrganizationRegistration'
  describe('Prettify Code - Single Screen', () => {
    context('Single Screen - No javascript on the screenSet', () => {
      beforeEach(() => {
        cy.visit(`/#/99999999/4_AAAAAAAAAAAAAAAAAAAAAA/user-interfacing/screen-sets-app/web/uiBuilder?screenSetId=${liteRegistration}`)
        utils.getScreenSets(datatest.mockedPrettierGetScreenSetResponse)
      })
      afterEach(() => {
        cy.clearAllCookies()
        cy.clearAllLocalStorage()
        cy.clearAllSessionStorage()
      })
      it('Should informe the user when there is no changes in the code', () => {
        cy.get('[data-cy="prettifySingleScreen"]').click()
        cy.get('[data-cy="noJavascriptPopUp"]').should('be.visible').should('contains.text', `${datatest.prettifySingleNoJavascript} ${liteRegistration}`)
      })
    })

    context('Single Screen - View Success PopUp', () => {
      beforeEach(() => {
        cy.visit(`/#/99999999/4_AAAAAAAAAAAAAAAAAAAAAA/user-interfacing/screen-sets-app/web/uiBuilder?screenSetId=${linkAccounts}`)
        utils.getScreenSets(datatest.mockedPrettierGetScreenSetResponse)
      })
      afterEach(() => {
        cy.clearAllCookies()
        cy.clearAllLocalStorage()
        cy.clearAllSessionStorage()
      })
      it('Should show success popUp', () => {
        cy.get('[data-cy="prettifySingleScreen"]').click()
        cy.get('[data-cy="prettierSuccessPopup"]').should('be.visible').should('contains.text', `${datatest.prettifySingleSuccess}${linkAccounts}`)
      })
    })

    context('Single Screen - View Error PopUp', () => {
      beforeEach(() => {
        cy.visit(`/#/99999999/4_AAAAAAAAAAAAAAAAAAAAAA/user-interfacing/screen-sets-app/web/uiBuilder?screenSetId=${organizationRegistration}`)
        utils.getScreenSets(datatest.mockedPrettierGetScreenSetResponse)
      })
      afterEach(() => {
        cy.clearAllCookies()
        cy.clearAllLocalStorage()
        cy.clearAllSessionStorage()
      })
      it('Should show error popUp when there is an error in the code', () => {
        cy.get('[data-cy="prettifySingleScreen"]').click()
        cy.get('[data-cy="errorPopup"]').should('be.visible').should('contains.text', `${datatest.prettifySingleError} ${organizationRegistration}:`)
      })
    })
  })

  describe('Prettify Code - All Screens', () => {
    context('All Screens - Success Prettier', () => {
      beforeEach(() => {
        cy.visit(`/#/99999999/4_AAAAAAAAAAAAAAAAAAAAAA/user-interfacing/screen-sets-app/web`)

        utils.getScreenSets(datatest.mockGetAllSuccessScreenSets)
      })
      afterEach(() => {
        cy.clearAllCookies()
        cy.clearAllLocalStorage()
        cy.clearAllSessionStorage()
      })
      it('Should show success popUp when there is javascript on the screenSets and no Error', () => {
        cy.get('[data-cy="prettifyAllCode"]').click()
        cy.get('[data-cy="prettierSuccessPopup"]')
          .should('be.visible')
          .should('contains.text', `${datatest.prettifySingleSuccess}${linkAccounts}${liteRegistration}${organizationRegistration}`)
      })
    })

    context('All Screens - No Javascript on any screen', () => {
      beforeEach(() => {
        cy.visit(`/#/99999999/4_AAAAAAAAAAAAAAAAAAAAAA/user-interfacing/screen-sets-app/web`)
        utils.removeJavascript(datatest.mockGetAllSuccessScreenSets)
        utils.getScreenSets(datatest.mockGetAllSuccessScreenSets)
      })
      afterEach(() => {
        cy.clearAllCookies()
        cy.clearAllLocalStorage()
        cy.clearAllSessionStorage()
      })
      it('Should show error popUp when there is no javascript in the code', () => {
        cy.get('[data-cy="prettifyAllCode"]').click()
        cy.get('[data-cy="errorPopup"]').should('be.visible').should('contains.text', `${datatest.prettifyMultipleScreensNoJavascript}`)
      })
    })
    context('All Screens - Javascript error on a single screenSet', () => {
      beforeEach(() => {
        cy.visit(`/#/99999999/4_AAAAAAAAAAAAAAAAAAAAAA/user-interfacing/screen-sets-app/web`)
        utils.getScreenSets(datatest.mockGetAllSuccessScreenSets)
        utils.addErrorOnJavascript(datatest.mockGetAllSuccessScreenSets, liteRegistration)
      })
      afterEach(() => {
        cy.clearAllCookies()
        cy.clearAllLocalStorage()
        cy.clearAllSessionStorage()
      })
      it('Should show error popUp when there is an error in the code', () => {
        cy.get('[data-cy="prettifyAllCode"]').click()
        cy.get('[data-cy="errorPopup"]').should('be.visible').should('contains.text', `${datatest.prettifySingleError} ${liteRegistration}:`)
      })
    })
  })
})
