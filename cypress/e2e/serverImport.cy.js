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
      utils.checkServerImportState('Full')
    })
    it('Import Full account', () => {
      cy.get('#serverImportSaveButton').should('be.disabled')
      cy.get('#{{dataflowName}}').type('dataflowName')
      cy.get('#{{accountName}}').type('accountName')
      cy.get('#{{container}}').type('container')
      cy.get('#serverImportSaveButton').should('not.be.disabled')
    })
  })
})
