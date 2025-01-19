/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

/**
 * @jest-environment jsdom
 */

import { initialState, initialStateWithServerConfigurations } from './dataTest'
import { clearConfigurations, getServerConfiguration } from './serverImportSlice'
import serverImportReducer from './serverImportSlice'
describe('serverImportSlice test suite', () => {
  const SERVER_TYPE = 'azure'
  const ACCOUNT_TYPE = 'Full'

  test('should return initial state', () => {
    expect(serverImportReducer(undefined, { type: undefined })).toEqual(initialState)
  })
  test('should return the configuration given an option', () => {
    expect(initialStateWithServerConfigurations.serverConfigurations.azure[0].value).toBe(undefined)
    const newState = serverImportReducer(
      initialStateWithServerConfigurations,
      getServerConfiguration({ selectedOption: SERVER_TYPE, id: '{{dataflowName}}', value: 'test', accountType: ACCOUNT_TYPE }),
    )
    expect(newState.serverConfigurations.azure[0].value).toBe('test')
  })
  test('should remove the values', () => {
    initialStateWithServerConfigurations.serverConfigurations.azure[0].value = 'testing'
    const newState = serverImportReducer(initialStateWithServerConfigurations, clearConfigurations())
    expect(newState.serverConfigurations.azure[0].value).toBe(undefined)
  })
})
