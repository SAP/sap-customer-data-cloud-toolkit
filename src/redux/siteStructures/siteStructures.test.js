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
