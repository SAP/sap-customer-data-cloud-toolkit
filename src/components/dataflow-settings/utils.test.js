/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import { areAllVariablesSet } from './utils'
import { dataflowWithAllVariablesSet, dataflowWithSomeVariablesSet, dataflowWithNoneVariablesSet } from './dataTest'

describe('dataflow settings component utils test suite', () => {
  test('should return true when all variables are set', () => {
    expect(areAllVariablesSet(dataflowWithAllVariablesSet.variables)).toEqual(true)
  })

  test('should return false when none of the variables are set', () => {
    expect(areAllVariablesSet(dataflowWithNoneVariablesSet.variables)).toEqual(false)
  })

  test('should return false when some of the variables are set', () => {
    expect(areAllVariablesSet(dataflowWithSomeVariablesSet.variables)).toEqual(false)
  })
})
