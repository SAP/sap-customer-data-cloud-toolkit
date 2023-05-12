/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import GitHubManager from '../../services/github/gitHubManager'

import { fillState, clearState } from './utils'

const VERSION_SLICE_STATE_NAME = 'version'
const CHECK_NEW_VERSION_ACTION = 'service/version'

export const versionSlice = createSlice({
  name: VERSION_SLICE_STATE_NAME,
  initialState: {
    isNewReleaseAvailable: false,
    latestReleaseUrl: '',
    latestReleaseVersion: '',
  },
  extraReducers: (builder) => {
    builder.addCase(checkNewVersion.pending, (state) => {
      clearState(state)
    })
    builder.addCase(checkNewVersion.fulfilled, (state, action) => {
      fillState(state, action.payload)
    })
    builder.addCase(checkNewVersion.rejected, (state) => {
      clearState(state)
    })
  },
})

export const checkNewVersion = createAsyncThunk(CHECK_NEW_VERSION_ACTION, async (dummy, { rejectWithValue }) => {
  try {
    return await new GitHubManager().getNewReleaseAvailable()
  } catch (error) {
    rejectWithValue(error)
  }
})

export default versionSlice.reducer

export const selectIsNewReleaseAvailable = (state) => state.version.isNewReleaseAvailable

export const selectLatestReleaseVersion = (state) => state.version.latestReleaseVersion

export const selectLatestReleaseUrl = (state) => state.version.latestReleaseUrl
