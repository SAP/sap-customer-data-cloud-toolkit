/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

/**
 * @jest-environment jsdom
 */

// import { AccountType } from '../../services/importAccounts/accountManager/accountType'
// import { initialState, initialStateWithServerConfigurations } from './dataTest'
// import serverImportReducer, { clearServerConfigurations, getConfigurations, getServerConfiguration, setAccountType, setDataflow, updateServerProvider } from './serverImportSlice'

// describe('serverImportSlice test suite', () => {
//   const SERVER_TYPE = 'azure'

//   test('should return initial state', () => {
//     expect(serverImportReducer(undefined, { type: undefined })).toEqual(initialState)
//   })

// test('should return the configuration given an option', () => {
//   expect(initialStateWithServerConfigurations.serverConfigurations.azure[0].value).toBe(undefined)
//   const newState = serverImportReducer(
//     initialStateWithServerConfigurations,
//     getServerConfiguration({ selectedOption: SERVER_TYPE, id: '{{dataflowName}}', value: 'test', accountType: AccountType.Full }),
//   )
//   expect(newState.serverConfigurations.azure[0].value).toBe('test')
// })

// test('should remove the values', () => {
//   initialStateWithServerConfigurations.serverConfigurations.azure[0].value = 'testing'
//   const newState = serverImportReducer(initialStateWithServerConfigurations, clearServerConfigurations())
//   expect(newState.serverConfigurations.azure[0].value).toBe(undefined)
// })
// test('should update state when getConfigurations is rejected', () => {
//   const action = getConfigurations.rejected('', '', '', 'Failed to revert configurations')
//   const newState = serverImportReducer(initialStateWithServerConfigurations, action)
//   expect(newState.errors).toEqual('Failed to revert configurations')
//   expect(newState.isLoading).toEqual(false)
// })
// test('should update state when setDataflow is rejected', () => {
//   const action = setDataflow.rejected('', '', '', 'Failed to revert configurations')
//   const newState = serverImportReducer(initialStateWithServerConfigurations, action)
//   expect(newState.errors).toEqual('Failed to revert configurations')
//   expect(newState.isLoading).toEqual(false)
//   expect(newState.showSuccessMessage).toEqual(false)
// })
// test('should update state when getDataflowRedirection is rejected', () => {
//   const action = setDataflow.rejected('', '', '', 'Failed to revert configurations')
//   const newState = serverImportReducer(initialStateWithServerConfigurations, action)
//   expect(newState.errors).toEqual('Failed to revert configurations')
//   expect(newState.isLoading).toEqual(false)
//   expect(newState.showSuccessMessage).toEqual(false)
// })

// test('should set account type', () => {
//   expect(initialStateWithServerConfigurations.accountType).toBe(undefined)
//   const newState = serverImportReducer(initialStateWithServerConfigurations, setAccountType({ accountType: AccountType.Full }))
//   expect(newState.accountType).toBe(AccountType.Full)
// })
// test('should update server provider', () => {
//   expect(initialStateWithServerConfigurations.serverProvider).toBe('azure')
//   const newState = serverImportReducer(initialStateWithServerConfigurations, updateServerProvider('testProvider'))
//   expect(newState.serverProvider).toBe('testProvider')
// })
// })
