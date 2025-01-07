/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { propagateConfigurationState } from '../../../redux/importAccounts/utils'
import { expectedPasswordObject, expectedPasswordResponse } from './dataTest'
import { exportPasswordData } from './passwordMatches'

jest.mock('axios')
jest.setTimeout(10000)
describe('Import Account - SchemaImport test suite', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })
  test('Export schema Data', () => {
    const configuration = propagateConfigurationState(expectedPasswordObject, true)
    const passwordData = exportPasswordData([configuration])
    expect(passwordData).toEqual(expectedPasswordResponse)
  })
})
