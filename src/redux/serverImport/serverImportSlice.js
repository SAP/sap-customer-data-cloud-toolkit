/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import ServerImport from '../../services/serverImport/server-import'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getApiKey, getErrorAsArray } from '../utils'
import { clearAllValues, getConfigurationByKey } from './utils'

const SERVER_IMPORT_STATE_NAME = 'serverImport'
const GET_CONFIGURATIONS_ACTION = `${SERVER_IMPORT_STATE_NAME}/getConfigurations`
const SET_CONFIGURATIONS_ACTION = `${SERVER_IMPORT_STATE_NAME}/setConfigurations`

export const serverImportExtendedSlice = createSlice({
  name: SERVER_IMPORT_STATE_NAME,
  initialState: {
    currentSiteApiKey: getApiKey(window.location.hash),
    serverConfigurations: [],
    errors: [],
    isLoading: false,
    showSuccessMessage: false,
    currentSiteInformation: {},
  },
  reducers: {
    getServerConfiguration(state, action) {
      const configuration = state.serverConfigurations
      const option = getConfigurationByKey(configuration, action.payload.selectedOption)
      const initOption = option.filter((item) => item.id === action.payload.id)[0]
      initOption.value = action.payload.value
      state.accountType = action.payload.accountType
    },
    clearConfigurations(state) {
      const configuration = state.serverConfigurations
      clearAllValues(configuration)
    },
    setAccountType(state, action) {
      getConfigurationByKey(state.serverConfigurations, action.payload.serverType)
      state.accountType = action.payload.accountType
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getConfigurations.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getConfigurations.fulfilled, (state, action) => {
      state.isLoading = false
      state.serverConfigurations = action.payload
    })
    builder.addCase(getConfigurations.rejected, (state, action) => {
      state.isLoading = false
      state.errors = action.payload
    })
    builder.addCase(setDataflow.pending, (state) => {
      state.isLoading = true
      state.errors = []
      state.showSuccessMessage = false
    })
    builder.addCase(setDataflow.fulfilled, (state, action) => {
      state.isLoading = false
      state.showSuccessMessage = true
    })
    builder.addCase(setDataflow.rejected, (state, action) => {
      state.isLoading = false
      state.showSuccessMessage = false
      state.errors = action.payload
    })
  },
})

export const getConfigurations = createAsyncThunk(GET_CONFIGURATIONS_ACTION, async (_, { getState, rejectWithValue }) => {
  const state = getState()
  const credentials = { userKey: state.credentials.credentials.userKey, secret: state.credentials.credentials.secretKey, gigyaConsole: state.credentials.credentials.gigyaConsole }
  const currentSiteApiKey = state.copyConfigurationExtended.currentSiteApiKey
  const currentDataCenter = state.copyConfigurationExtended.currentSiteInformation.dataCenter

  try {
    return new ServerImport(credentials, currentSiteApiKey, currentDataCenter).getStructure()
  } catch (error) {
    return rejectWithValue(getErrorAsArray(error))
  }
})
export const setDataflow = createAsyncThunk(SET_CONFIGURATIONS_ACTION, async (option, { getState, rejectWithValue }) => {
  const state = getState()
  const credentials = { userKey: state.credentials.credentials.userKey, secret: state.credentials.credentials.secretKey, gigyaConsole: state.credentials.credentials.gigyaConsole }
  const currentSiteApiKey = state.copyConfigurationExtended.currentSiteApiKey
  const currentDataCenter = state.copyConfigurationExtended.currentSiteInformation.dataCenter

  try {
    return new ServerImport(credentials, currentSiteApiKey, currentDataCenter).setDataflow(state.serverImport.serverConfigurations, option, state.serverImport.accountType)
  } catch (error) {
    return rejectWithValue(getErrorAsArray(error))
  }
})

export const { getServerConfiguration, setAccountType, clearConfigurations } = serverImportExtendedSlice.actions
export const selectServerConfigurations = (state) => state.serverImport.serverConfigurations
export const selectAccountType = (state) => state.serverImport.accountType
export const selectShowSuccessDialog = (state) => state.serverImport.showSuccessMessage
export const serverImportExtendedSliceReducer = serverImportExtendedSlice.reducer
