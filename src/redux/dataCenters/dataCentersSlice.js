import { createSlice } from '@reduxjs/toolkit'

import { getDataCenters } from './utils'

const DATA_CENTERS_SLICE_STATE_NAME = 'dataCenters'

export const dataCentersSlice = createSlice({
  name: DATA_CENTERS_SLICE_STATE_NAME,
  initialState: {
    dataCenters: getDataCenters(),
  },
})

export const selectDataCenters = (state) => state.dataCenters.dataCenters

export default dataCentersSlice.reducer
