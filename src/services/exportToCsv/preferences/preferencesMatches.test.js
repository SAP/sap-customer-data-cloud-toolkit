/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { propagateConfigurationState } from '../../../redux/importAccounts/utils'
import { expectedPreferencesOptions, expectedPreferencesResponse } from './dataTest'
import { exportPreferencesData } from './preferencesMatches'

jest.mock('axios')
jest.setTimeout(10000)
describe('Import Account - SchemaImport test suite', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })
  test('Export schema Data', () => {
    const configuration = propagateConfigurationState(expectedPreferencesOptions, true)
    const preferences = exportPreferencesData([configuration])
    expect(preferences).toEqual(expectedPreferencesResponse)
  })
})
