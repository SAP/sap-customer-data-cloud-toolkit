/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { expectedPreferencesOptions, expectedPreferencesResponse } from './dataTest'
import { exportPreferencesData } from './preferencesMatches'

jest.mock('axios')
jest.setTimeout(10000)
describe('Import Account - SchemaImport test suite', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })
  test('Export schema Data', () => {
    const preferences = exportPreferencesData(expectedPreferencesOptions)
    expect(preferences).toEqual(expectedPreferencesResponse)
  })
})
