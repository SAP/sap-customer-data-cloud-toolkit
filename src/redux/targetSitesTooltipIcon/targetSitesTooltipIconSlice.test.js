/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import targetSitesTooltipIconReducer, { setIsMouseOverIcon } from './targetSitesTooltipIconSlice'
import { initialState } from './dataTest'

describe('targetSitesTooltipIconSlice test suite', () => {
  test('should set isMouseOverIcon to true', () => {
    const newState = targetSitesTooltipIconReducer(initialState, setIsMouseOverIcon(true))
    expect(newState.isMouseOverIcon).toEqual(true)
  })
})
