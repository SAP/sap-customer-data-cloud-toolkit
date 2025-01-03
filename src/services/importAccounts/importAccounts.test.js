import ImportAccounts from './importAccounts'
import { credentials } from '../servicesDataTest'
import { expectedSchemaResponse } from './schemaImport/schemaDatatest'
import axios from 'axios'
import { mockCleanPreferencesResponse } from './preferencesImport/dataTest'
import { expectedCommunicationResponse } from './communicationImport/dataTest'
import { expectedPasswordResponse } from './passwordImport/dataTest'
import { getRootElementsStructure } from './rootOptions/rootLevelFields'
import { expectedFullAccount, expectedLiteAccount } from './importAccountsDatatest'

jest.mock('axios')
jest.setTimeout(10000)
describe('Import Account - SchemaImport test suite', () => {
  const targetDataCenter = 'eu1'
  const targetApiKey = 'targetApiKey'
  const importAccounts = new ImportAccounts(credentials, targetApiKey, targetDataCenter)
  const fullAccount = 'Full'
  const liteAccount = 'Lite'
  beforeEach(() => {
    jest.restoreAllMocks()
  })
  beforeEach(() => {
    jest.restoreAllMocks()
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
  test('Import Lite Accounts', async () => {
    axios.mockResolvedValueOnce({ data: expectedSchemaResponse }).mockResolvedValueOnce({ data: mockCleanPreferencesResponse })
    const importAccount = await importAccounts.importAccountToConfigTree(liteAccount)
    expect(importAccount).toEqual(expectedLiteAccount)
  })
})
