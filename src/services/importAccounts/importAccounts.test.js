/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import ImportAccounts from './importAccounts'
import { credentials } from '../servicesDataTest'
import { expectedSchemaResponse } from './schemaImport/schemaDatatest'
import axios from 'axios'
import { mockCleanPreferencesResponse } from './preferencesImport/dataTest'
import { expectedCommunicationResponse } from './communicationImport/dataTest'
import { expectedPasswordResponse } from './passwordImport/dataTest'
import { getRootElementsStructure } from './rootOptions/rootLevelFields'
import { expectedFullAccount } from './importAccountsDatatest'

jest.mock('axios')
jest.setTimeout(10000)
describe('Import Account - SchemaImport test suite', () => {
  const targetDataCenter = 'eu1'
  const targetApiKey = 'targetApiKey'
  const fullAccount = 'Full'
  const liteAccount = 'Lite'
  let importAccounts

  beforeEach(() => {
    jest.restoreAllMocks()
    importAccounts = new ImportAccounts(credentials, targetApiKey, targetDataCenter)
  })

  test('Import Full Accounts', async () => {
    axios
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: mockCleanPreferencesResponse })
      .mockResolvedValueOnce({ data: expectedCommunicationResponse })
      .mockResolvedValueOnce({ data: expectedPasswordResponse })
      .mockResolvedValueOnce({ data: getRootElementsStructure() })
    const importAccount = await importAccounts.importAccountToConfigTree(fullAccount)
    expect(importAccount).toEqual(expectedFullAccount)
  })
})
