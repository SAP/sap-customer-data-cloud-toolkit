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
