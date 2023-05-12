/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
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
