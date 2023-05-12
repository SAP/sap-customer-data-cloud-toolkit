/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import targetSitesTooltipIconReducer, { setIsMouseOverIcon } from './targetSitesTooltipIconSlice'
import { initialState } from './dataTest'

describe('targetSitesTooltipIconSlice test suite', () => {
  test('should set isMouseOverIcon to true', () => {
    const newState = targetSitesTooltipIconReducer(initialState, setIsMouseOverIcon(true))
    expect(newState.isMouseOverIcon).toEqual(true)
  })
})
