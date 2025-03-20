/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

/**
 * @jest-environment jsdom
 */
import { initialState, initialStateWithConfigurations } from './dataTest'
import importAccountsReducer, { clearConfigurations, setConfigurationStatus, setMandatoryField, setSwitchOptions } from './importAccountsSlice'
import { propagateConfigurationState } from './utils'

describe('importAccountsSlice test suite', () => {
  test('should return initial state', () => {
    expect(importAccountsReducer(undefined, { type: undefined })).toEqual(initialState)
  })
  test('should set a configuration status to true', () => {
    expect(initialStateWithConfigurations.configurations[0].value).toBe(false)
    expect(initialStateWithConfigurations.configurations[0].branches[0].value).toBe(false)
    const newState = importAccountsReducer(initialStateWithConfigurations, setConfigurationStatus({ checkBoxId: 'data.loyalty.rewardPoints', value: true }))
    expect(newState.configurations[0].value).toBe(true)
    expect(newState.configurations[0].branches[0].value).toBe(true)
  })
  test('should set a mandatory field to true', () => {
    expect(initialStateWithConfigurations.configurations[1].branches[0].mandatory).toBe(false)
    const newState = importAccountsReducer(
      initialStateWithConfigurations,
      setMandatoryField({ checkBoxId: 'subscriptions.newsletter.commercial.isSubscribed', value: true, mandatory: true }),
    )
    expect(newState.configurations[1].branches[0].mandatory).toBe(true)
  })
  test('should change all values from true to false', () => {
    const configurationTree = initialStateWithConfigurations.configurations[0]
    expect(initialStateWithConfigurations.configurations[0].value).toBe(false)
    expect(initialStateWithConfigurations.configurations[0].branches[0].value).toBe(false)
    const newConfigurationTree = propagateConfigurationState([configurationTree], true)
    expect(newConfigurationTree.value).toBe(true)
    const newState = importAccountsReducer(initialStateWithConfigurations, clearConfigurations())
    expect(newState.configurations[0].value).toBe(false)
    expect(newState.configurations[0].branches[0].value).toBe(false)
  })
  test('should propagate the property type to children', () => {
    expect(initialStateWithConfigurations.configurations[0].switchId).toBe('object')
    expect(initialStateWithConfigurations.configurations[0].branches[0].switchId).toBe('object')
    const newState = importAccountsReducer(initialStateWithConfigurations, setSwitchOptions({ checkBoxId: 'data.loyalty', operation: 'array' }))
    expect(newState.configurations[0].switchId).toBe('array')
    expect(newState.configurations[0].branches[0].switchId).toBe('array')
  })
})
