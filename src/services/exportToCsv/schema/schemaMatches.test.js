/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { propagateConfigurationState } from '../../../redux/importAccounts/utils'
import { expectedOptions, expectedSchemaResult } from './dataTest'
import { exportSchemaData } from './schemaMatches'

jest.mock('axios')
jest.setTimeout(10000)
describe('Import Account - SchemaImport test suite', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })
  test('Export schema Data', () => {
    const configuration = propagateConfigurationState(expectedOptions, true)
    const schemaData = exportSchemaData([configuration])
    expect(schemaData).toEqual(expectedSchemaResult)
  })
})
