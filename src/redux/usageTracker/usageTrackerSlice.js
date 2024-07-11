/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import trackingTool from '@sap_oss/automated-usage-tracking-tool'
import { initTracker, setTrackUsageDialogStyles } from './utils'

const USAGE_TRACKER_STATE_NAME = 'usageTracker'
const REQUEST_CONSENT_CONFIRMATION_ACTION = 'requestConsentConfirmation'
const TRACK_USAGE_ACTION = 'trackUsage'

export const usageTrackerSlice = createSlice({
  name: USAGE_TRACKER_STATE_NAME,
  initialState: {
    trackerInitialized: false,
    consentGranted: localStorage.getItem('usageTracking') !== null,
  },
  reducers: {
    initializeTracker(state) {
      initTracker(trackingTool)
      state.trackerInitialized = true
    },
  },
  extraReducers: (builder) => {
    builder.addCase(requestConsentConfirmation.pending, () => {
      const dialog = document.getElementById('automated-usage-tracking-tool-dialog')
      if (dialog) {
        setTrackUsageDialogStyles(dialog)
      }
    })
    builder.addCase(requestConsentConfirmation.fulfilled, (state) => {
      state.consentGranted = true
    })
  },
})

export const requestConsentConfirmation = createAsyncThunk(REQUEST_CONSENT_CONFIRMATION_ACTION, async (_, { rejectWithValue }) => {
  try {
    return await trackingTool.requestConsentConfirmation({})
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const trackUsage = createAsyncThunk(TRACK_USAGE_ACTION, async (feature, { rejectWithValue }) => {
  try {
    trackingTool.trackUsage({
      toolName: 'cdc-toolkit',
      featureName: feature.featureName,
    })
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const { initializeTracker } = usageTrackerSlice.actions

export default usageTrackerSlice.reducer

export const selectTrackerInitialized = (state) => state.usageTracker.trackerInitialized

export const selectConsentGranted = (state) => state.usageTracker.consentGranted
