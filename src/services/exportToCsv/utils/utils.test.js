/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { propagateConfigurationState } from '../../../redux/importAccounts/utils'
import { getOptionsFromSchemaTree } from './utils'
import {
  expectedNormalResult,
  expectedParentArrayChildObjectResult,
  expectedParentChildArrayResult,
  expectedParentObjectChildArrayResult,
  expectedSchemaStucture,
} from './utilsDatatest'

jest.mock('axios')
jest.setTimeout(10000)

describe('Utils - Should get options from schema tree test suite', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('Should get options where parent and child have switchid objects', () => {
    const configuration = propagateConfigurationState(expectedSchemaStucture, true)
    const result = getOptionsFromSchemaTree([configuration])
    expect(result).toEqual(expectedNormalResult)
  })
  test('Should get options where parent has switchId array and child has switchid object', () => {
    let configuration = propagateConfigurationState(expectedSchemaStucture, true)
    changeSwitchId(configuration, 'data.loyalty', 'array')
    const result = getOptionsFromSchemaTree([configuration])
    expect(result).toEqual(expectedParentArrayChildObjectResult)
  })
  test('Should get options where parent and child has switchid array', () => {
    let configuration = propagateConfigurationState(expectedSchemaStucture, true)
    changeSwitchId(configuration, 'data.loyalty', 'array')
    changeSwitchId(configuration, 'data.loyalty.rewardRedemption', 'array')
    const result = getOptionsFromSchemaTree([configuration])
    expect(result).toEqual(expectedParentChildArrayResult)
  })
  test('Should get options where parent has switchId object and child has switchid array', () => {
    let configuration = propagateConfigurationState(expectedSchemaStucture, true)
    changeSwitchId(configuration, 'data.loyalty', 'object')
    changeSwitchId(configuration, 'data.loyalty.rewardRedemption', 'array')
    const result = getOptionsFromSchemaTree([configuration])
    expect(result).toEqual(expectedParentObjectChildArrayResult)
  })
})
const changeSwitchId = (configuration, targetId, newSwitchId) => {
  if (configuration.id === targetId) {
    configuration.switchId = newSwitchId
  }
  if (configuration.branches) {
    configuration.branches.forEach((branch) => {
      changeSwitchId(branch, targetId, newSwitchId)
    })
  }
  return configuration
}
