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

import dataCentersReducer from './dataCentersSlice'

const initialState = {
  dataCenters: [
    {
      label: 'AU',
      value: 'au1',
    },
    {
      label: 'EU',
      value: 'eu1',
    },
    {
      label: 'US',
      value: 'us1',
    },
  ],
}

describe('dataCenterSlice test suite', () => {
  test('should return initial state', () => {
    expect(dataCentersReducer(undefined, { type: undefined })).toEqual(initialState)
  })
})
