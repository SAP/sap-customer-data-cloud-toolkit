/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import { createSlice } from '@reduxjs/toolkit'

const TARGET_SITES_TOOLTIP_ICON_STATE_NAME = 'targetSitesTooltipIcon'

const targetSitesTooltipIcon = createSlice({
  name: TARGET_SITES_TOOLTIP_ICON_STATE_NAME,
  initialState: {
    isMouseOverIcon: false,
  },
  reducers: {
    setIsMouseOverIcon(state, action) {
      state.isMouseOverIcon = action.payload
    },
  },
})

export const { setIsMouseOverIcon } = targetSitesTooltipIcon.actions

export default targetSitesTooltipIcon.reducer

export const selectIsMouseOverIcon = (state) => state.targetSitesTooltipIcon.isMouseOverIcon
