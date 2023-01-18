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
