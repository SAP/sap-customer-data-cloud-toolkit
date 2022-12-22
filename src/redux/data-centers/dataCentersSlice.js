import { createSlice } from '@reduxjs/toolkit'

import dataCenters from '../../dataCenters.json'

const getDataCenters = (host = window.location.hostname) => dataCenters.filter((dataCenter) => dataCenter.console === host)[0].datacenters

export const dataCentersSlice = createSlice({
  name: 'dataCenters',
  initialState: {
    dataCenters: getDataCenters(),
  },
})

export const selectDataCenters = (state) => state.dataCenters.dataCenters

export default dataCentersSlice.reducer
