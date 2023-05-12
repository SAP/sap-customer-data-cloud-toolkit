/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import * as data from '../redux/emails/dataTest'
import { testErrorArray, testErrorObject } from './dataTest'
import { getApiKey, getErrorAsArray } from './utils'

describe('Redux utils test suite', () => {
  test('should get API Key from URL', () => {
    expect(getApiKey(data.testHash)).toEqual(data.testAPIKey)
    expect(getApiKey('')).toEqual('')
  })

  test('should return an error array if error is an array', () => {
    expect(getErrorAsArray(testErrorArray)).toEqual(testErrorArray)
  })

  test('should return an error array if error is an object', () => {
    expect(getErrorAsArray(testErrorObject)).toEqual(testErrorArray)
  })
})
