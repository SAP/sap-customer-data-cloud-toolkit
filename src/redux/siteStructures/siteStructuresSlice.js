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
