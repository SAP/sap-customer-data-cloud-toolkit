/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
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
      isPrimary: true,
    },
  ],
}

describe('dataCenterSlice test suite', () => {
  test('should return initial state', () => {
    expect(dataCentersReducer(undefined, { type: undefined })).toEqual(initialState)
  })
})
