/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

/**
 * @jest-environment jsdom
 */

import siteStructuresReducer from './siteStructuresSlice'
import siteStructures from './sitesStructures.json'

const initialState = {
  siteStructures: siteStructures,
}

describe('siteStructuresSlice test suite', () => {
  test('should return initial state', () => {
    expect(siteStructuresReducer(undefined, { type: undefined })).toEqual(initialState)
  })
})
