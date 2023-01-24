import { createSlice } from '@reduxjs/toolkit'

import siteStructures from './sitesStructures.json'

const SITE_STRUCTURES_SLICE_STATE_NAME = 'siteStructures'

export const siteStructuresSlice = createSlice({
  name: SITE_STRUCTURES_SLICE_STATE_NAME,
  initialState: {
    siteStructures: siteStructures,
  },
})

export const selectSiteStructures = (state) => state.siteStructures.siteStructures

export default siteStructuresSlice.reducer
