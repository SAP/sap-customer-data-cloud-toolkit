/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import trackingTool from '@sap_oss/automated-usage-tracking-tool'

const USAGE_TRACKER_STATE_NAME = 'usageTracker'
const REQUEST_CONSENT_CONFIRMATION_ACTION = 'requestConsentConfirmation'
const TRACK_USAGE_ACTION = 'trackUsage'

export const usageTrackerSlice = createSlice({
  name: USAGE_TRACKER_STATE_NAME,
  initialState: {
    isTrackerInitialized: false,
    isConsentGranted: false,
  },
  reducers: {
    initializeTracker(state) {
      trackingTool.init({
        apiKey: '4_TCuGT23_GS-FxSIFf3YNdQ',
        dataCenter: 'eu1',
        storageName: 'usageTracking',
      })
      state.isTrackerInitialized = true
      state.isConsentGranted = trackingTool.isConsentGranted()
    },
  },
})

export const requestConsentConfirmation = createAsyncThunk(REQUEST_CONSENT_CONFIRMATION_ACTION, async (_, { rejectWithValue }) => {
  try {
    return await trackingTool.requestConsentConfirmation()
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const trackUsage = createAsyncThunk(TRACK_USAGE_ACTION, async (feature, { rejectWithValue }) => {
  try {
    trackingTool.trackUsage({
      toolName: 'sap-customer-data-cloud-toolkit',
      featureName: feature.featureName,
    })
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const { initializeTracker } = usageTrackerSlice.actions

export default usageTrackerSlice.reducer

export const selectIsTrackerInitialized = (state) => state.usageTracker.isTrackerInitialized
export const selectIsConsentGranted = (state) => state.usageTracker.isConsentGranted
