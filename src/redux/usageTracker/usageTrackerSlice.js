/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import trackingTool from 'automated-usage-tracking-tool' // TODO: update this import after automated-usage-tracking-tool' is published
import { initTracker, setTrackUsageDialogStyles } from './utils'

const USAGE_TRACKER_STATE_NAME = 'usageTracker'
const REQUEST_CONSENT_CONFIRMATION_ACTION = 'requestConsentConfirmation'
const TRACK_USAGE_ACTION = 'trackUsage'

export const usageTrackerSlice = createSlice({
  name: USAGE_TRACKER_STATE_NAME,
  initialState: {},
  extraReducers: (builder) => {
    builder.addCase(requestConsentConfirmation.pending, () => {
      const dialog = document.getElementById('automated-usage-tracking-tool-dialog')
      if (dialog) {
        setTrackUsageDialogStyles(dialog)
      }
    })
  },
})

export const requestConsentConfirmation = createAsyncThunk(REQUEST_CONSENT_CONFIRMATION_ACTION, async () => {
  try {
    initTracker(trackingTool)
    return await trackingTool.requestConsentConfirmation({})
  } catch (error) {
    console.log(error)
  }
})

export const trackUsage = createAsyncThunk(TRACK_USAGE_ACTION, async (feature) => {
  debugger
  try {
    initTracker(trackingTool)
    trackingTool.trackUsage({
      toolName: 'cdc-toolkit',
      featureName: feature.featureName,
    })
  } catch (error) {
    console.log(error)
  }
})

export default usageTrackerSlice.reducer
