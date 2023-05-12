/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import { areConfigurationsFilled } from './utils'
import { configurationsMockedResponse } from '../../redux/copyConfigurationExtended/dataTest'

describe('copyConfigurationExtended utils test suite', () => {
  test('return false if no checkboxes are filled', () => {
    configurationsMockedResponse[0].value = false
    configurationsMockedResponse[0].branches[0].value = false
    configurationsMockedResponse[0].branches[1].value = false
    expect(areConfigurationsFilled(configurationsMockedResponse)).toEqual(false)
  })
  test('return true if a first level checkbox is filled', () => {
    configurationsMockedResponse[1].value = true
    expect(areConfigurationsFilled(configurationsMockedResponse)).toEqual(true)
  })
  test('return true if a second level checkbox is filled', () => {
    configurationsMockedResponse[0].branches[0].value = true
    expect(areConfigurationsFilled(configurationsMockedResponse)).toEqual(true)
  })
  test('return true if a third level checkbox is filled', () => {
    configurationsMockedResponse[2].branches[0].branches[0].value = true
    expect(areConfigurationsFilled(configurationsMockedResponse)).toEqual(true)
  })
})
