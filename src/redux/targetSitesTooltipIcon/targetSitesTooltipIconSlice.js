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
