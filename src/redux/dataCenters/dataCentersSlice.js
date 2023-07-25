/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


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
