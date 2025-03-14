/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import * as dataTest from './dataTest'
import * as utils from './utils'

describe('Server Import test suite', () => {
  context('Import Full for Azure local storage', () => {
    beforeEach(() => {
      utils.startUp(dataTest.importAccounts)
      cy.get('#serverImportPanel').click()
      utils.checkServerImportState('Full')
    })
    it('Import Full account', () => {
      cy.intercept('POST', 'idx.createDataflow', {
        body: dataTest.mockedGigyaResponseOk,
      })
      cy.intercept('POST', 'idx.search', {
        body: dataTest.mockedSearchDataflowsResponse,
      })

      cy.get('#serverImportSaveButton').should('have.attr', 'disabled', 'disabled')
      cy.get('#\\{\\{dataflowName\\}\\}').shadow().find('.ui5-input-inner').type('dataflowName')
      cy.get('#\\{\\{accountName\\}\\}').shadow().find('.ui5-input-inner').type('accountName')
      cy.get('#\\{\\{accountKey\\}\\}').shadow().find('.ui5-input-inner').type('accountKey')
      cy.get('#\\{\\{container\\}\\}').shadow().find('.ui5-input-inner').type('container')
      cy.get('#\\{\\{readFileNameRegex\\}\\}').shadow().find('.ui5-input-inner').should('have.value', '')
      cy.get('#\\{\\{blobPrefix\\}\\}').shadow().find('.ui5-input-inner').should('have.value', '')
      cy.get('#serverImportSaveButton').should('not.be.disabled').click()
      cy.get('#serverImportSuccessPopup').find('span').eq(0).should('have.text', dataTest.serverImportSuccessMessage)
      cy.get('[data-cy="serverImportSuccessPopup"] > ui5-bar > #closeButton').click()
    })

    it('Import Lite account', () => {
      cy.intercept('POST', 'idx.createDataflow', {
        body: dataTest.mockedGigyaResponseOk,
      })
      cy.intercept('POST', 'idx.search', {
        body: dataTest.mockedSearchDataflowsResponse,
      })

      cy.get('#selectAccountType').click()
      cy.get('ui5-static-area-item').shadow().find('ui5-responsive-popover').eq(6).find('ui5-li').eq(1).click()
      cy.get('#serverImportSaveButton').should('have.attr', 'disabled', 'disabled')
      cy.get('#\\{\\{dataflowName\\}\\}').shadow().find('.ui5-input-inner').type('dataflowName')
      cy.get('#\\{\\{accountName\\}\\}').shadow().find('.ui5-input-inner').type('accountName')
      cy.get('#\\{\\{accountKey\\}\\}').shadow().find('.ui5-input-inner').type('accountKey')
      cy.get('#\\{\\{container\\}\\}').shadow().find('.ui5-input-inner').type('container')
      cy.get('#\\{\\{readFileNameRegex\\}\\}').shadow().find('.ui5-input-inner').should('have.value', '')
      cy.get('#\\{\\{blobPrefix\\}\\}').shadow().find('.ui5-input-inner').should('have.value', '')
      cy.get('#serverImportSaveButton').should('not.be.disabled').click()
      cy.get('#serverImportSuccessPopup').find('span').eq(0).should('have.text', dataTest.serverImportSuccessMessage)
      cy.get('[data-cy="serverImportSuccessPopup"] > ui5-bar > #closeButton').click()
    })

    it('Should clear the input fields when the user clicks on cancel', () => {
      cy.intercept('POST', 'idx.createDataflow', {
        body: dataTest.mockedGigyaResponseOk,
      })
      cy.intercept('POST', 'idx.search', {
        body: dataTest.mockedSearchDataflowsResponse,
      })

      cy.get('#serverImportSaveButton').should('have.attr', 'disabled', 'disabled')
      cy.get('#\\{\\{dataflowName\\}\\}').shadow().find('.ui5-input-inner').type('dataflowName')
      cy.get('#\\{\\{accountName\\}\\}').shadow().find('.ui5-input-inner').type('accountName')
      cy.get('#\\{\\{accountKey\\}\\}').shadow().find('.ui5-input-inner').type('accountKey')
      cy.get('#\\{\\{container\\}\\}').shadow().find('.ui5-input-inner').type('container')
      cy.get('#\\{\\{readFileNameRegex\\}\\}').shadow().find('.ui5-input-inner').should('have.value', '')
      cy.get('#\\{\\{blobPrefix\\}\\}').shadow().find('.ui5-input-inner').should('have.value', '')
      cy.get('[data-cy="serverImportCancelButton"]').click()
      cy.get('#\\{\\{dataflowName\\}\\}').shadow().find('.ui5-input-inner').should('have.value', '')
      cy.get('#\\{\\{accountName\\}\\}').shadow().find('.ui5-input-inner').should('have.value', '')
      cy.get('#\\{\\{accountKey\\}\\}').shadow().find('.ui5-input-inner').should('have.value', '')
      cy.get('#\\{\\{container\\}\\}').shadow().find('.ui5-input-inner').should('have.value', '')
      cy.get('#\\{\\{readFileNameRegex\\}\\}').shadow().find('.ui5-input-inner').should('have.value', '')
      cy.get('#\\{\\{blobPrefix\\}\\}').shadow().find('.ui5-input-inner').should('have.value', '')
    })
  })
})
