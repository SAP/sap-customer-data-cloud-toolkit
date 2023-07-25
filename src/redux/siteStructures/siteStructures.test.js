/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
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
