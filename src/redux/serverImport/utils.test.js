/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

/**
 * @jest-environment jsdom
 */

import { getConfigurationByKey, addProperty, removeValueIfExists, clearAllValues } from './utils'

describe('utils test suite', () => {
  test('should get configuration by key', () => {
    const structure = {
      key1: { name: 'config1' },
      key2: { name: 'config2' },
    }
    const result = getConfigurationByKey(structure, 'key1')
    expect(result).toEqual({ name: 'config1' })
  })

  test('should add property to each option', () => {
    const options = [{ name: 'option1' }, { name: 'option2' }]
    const accountType = 'Premium'
    addProperty(options, accountType)
    expect(options[0].accountType).toEqual('Premium')
    expect(options[1].accountType).toEqual('Premium')
  })

  test('should remove value if exists', () => {
    const configurations = [{ name: 'config1', value: 'value1' }, { name: 'config2' }]
    removeValueIfExists(configurations)
    expect(configurations[0].value).toBeUndefined()
    expect(configurations[1].value).toBeUndefined()
  })

  test('should clear all values in structure', () => {
    const structure = {
      key1: [{ name: 'config1', value: 'value1' }],
      key2: [{ name: 'config2', value: 'value2' }],
    }
    clearAllValues(structure)
    expect(structure.key1[0].value).toBeUndefined()
    expect(structure.key2[0].value).toBeUndefined()
  })
})
