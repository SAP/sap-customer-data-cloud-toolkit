/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { expectedPasswordObject, expectedPasswordResponse } from './dataTest'
import { exportPasswordData } from './passwordMatches'

jest.mock('axios')
jest.setTimeout(10000)
describe('Import Account - SchemaImport test suite', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })
  test('Export schema Data', () => {
    const passwordData = exportPasswordData(expectedPasswordObject)
    expect(passwordData).toEqual(expectedPasswordResponse)
  })
})
