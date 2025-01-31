/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

/**
 * @jest-environment jsdom
 */

import { mockConfigurationTree, mockConfigurationTreeTrue } from './dataTest'
import { getAllConfiguration, hasMandatoryFieldInSugestion, isParentMandatoryFields, propagateConfigurationState, updateMandatoryFields } from './utils'

describe('importAccountsSlice utils test suite', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('should propagate configuration state to first level configurations', () => {
    const configuration = mockConfigurationTree[0]
    expect(configuration.value).toEqual(false)
    expect(configuration.branches[0].value).toEqual(false)
    expect(configuration.branches[1].value).toEqual(false)
    propagateConfigurationState(configuration, true)
    expect(configuration.value).toEqual(true)
    expect(configuration.branches[0].value).toEqual(true)
    expect(configuration.branches[1].value).toEqual(true)
  })
  test('should propagate configuration state to second level configurations', () => {
    const configuration = mockConfigurationTreeTrue[0]
    expect(configuration.branches[1].branches[0].value).toEqual(true)
    expect(configuration.branches[1].value).toEqual(true)
    expect(configuration.branches[1].branches[0].value).toEqual(true)
    expect(configuration.branches[1].branches[1].value).toEqual(true)
    propagateConfigurationState(configuration, false)
    expect(configuration.branches[1].branches[0].value).toEqual(false)
    expect(configuration.branches[1].value).toEqual(false)
    expect(configuration.branches[1].branches[0].value).toEqual(false)
    expect(configuration.branches[1].branches[1].value).toEqual(false)
  })
  test('should get the configuration path when given an ID', () => {
    const configuration = mockConfigurationTreeTrue
    expect(configuration[0].branches.length).toEqual(4)
    const configPath = getAllConfiguration(configuration, ['data.loyalty.rewardPoints'])
    expect(configPath[0].branches.length).toEqual(1)
    expect(configPath[0].id).toEqual('data.loyalty')
    expect(configPath[0].branches[0].id).toEqual('data.loyalty.rewardPoints')
  })

  test('should update the mandatory fields if they exist', () => {
    const configuration = mockConfigurationTree[1]
    expect(configuration.branches[0].mandatory).toEqual(false)
    updateMandatoryFields(configuration, true)
    expect(configuration.branches[0].mandatory).toEqual(true)
  })
  test('should update the mandatory fields if they exist', () => {
    const configuration = mockConfigurationTree[1]
    let parentNode
    const parentId = ['subscriptions, newsletter ,commercial, tags']
    hasMandatoryFieldInSugestion(configuration, parentId, parentNode, true)
    expect(configuration.branches[0].mandatory).toEqual(true)
  })
  test('should return true check if parent has mandatory field', () => {
    expect(isParentMandatoryFields('subscriptions')).toEqual(true)
  })
  test('should return false if parent has no mandatory field', () => {
    expect(isParentMandatoryFields('data')).toEqual(false)
  })
})
