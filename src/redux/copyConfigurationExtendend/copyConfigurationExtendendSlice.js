import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import ConfigManager from '../../services/copyConfig/configManager'
import { getApiKey } from '../utils'
import { findConfiguration, propagateConfigurationState } from './utils'

const COPY_CONFIGURATION_EXTENDED_STATE_NAME = 'copyConfigurationExtendend'
const GET_CONFIGURATIONS_ACTION = 'copyConfigurationExtendend/getConfigurations'
const SET_CONFIGURATIONS_ACTION = 'copyConfigurationExtendend/setConfigurations'
const GET_CURRENT_SITE_INFORMATION_ACTION = 'copyConfigurationExtendend/getCurrentSiteInformation'

export const copyConfigurationExtendendSlice = createSlice({
  name: COPY_CONFIGURATION_EXTENDED_STATE_NAME,
  initialState: {
    configurations: [],
    errors: [],
    isLoading: false,
    targetApiKeys: [],
    showSuccessMessage: false,
    currentSiteInformation: {},
  },
  reducers: {
    addTargetApiKey(state, action) {
      state.targetApiKeys.push(action.payload)
    },
    removeTargetApiKey(state, action) {
      state.targetApiKeys = state.targetApiKeys.filter((targetApiKey) => targetApiKey !== action.payload)
    },
    setConfigurationStatus(state, action) {
      const configuration = findConfiguration(state.configurations, action.payload.checkBoxId)
      propagateConfigurationState(configuration, action.payload.value)
    },
    clearConfigurations(state) {
      state.configurations.forEach((configuration) => {
        propagateConfigurationState(configuration, false)
      })
    },
    clearErrors(state) {
      state.errors = []
    },
    clearTargetApiKeys(state) {
      state.targetApiKeys = []
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getConfigurations.pending, (state) => {
      state.isLoading = true
      state.errors = []
      state.configurations = []
    })
    builder.addCase(getConfigurations.fulfilled, (state, action) => {
      console.log('getConfigurations.fulfilled')
      console.log(action.payload)
      state.configurations = action.payload
      state.isLoading = false
    })
    builder.addCase(getConfigurations.rejected, (state, action) => {
      console.log('getConfigurations.rejected')
      console.log(action.payload)
      state.errors = action.payload
      state.isLoading = false
    })
    builder.addCase(setConfigurations.pending, (state) => {
      state.isLoading = true
      state.errors = []
      state.showSuccessMessage = false
    })
    builder.addCase(setConfigurations.fulfilled, (state, action) => {
      console.log('setConfigurations.fulfilled')
      console.log(action.payload)
      state.showSuccessMessage = true
      state.isLoading = false
    })
    builder.addCase(setConfigurations.rejected, (state, action) => {
      console.log('setConfigurations.rejected')
      console.log(action.payload)
      state.errors = action.payload
      state.showSuccessMessage = false
      state.isLoading = false
    })
    builder.addCase(getCurrentSiteInformation.fulfilled, (state, action) => {
      console.log('getCurrentSiteInformation.fulfilled')
      console.log(action.payload)
      state.showSuccessMessage = false
      state.isLoading = false
      state.currentSiteInformation = action.payload.baseDomain
    })
    builder.addCase(getCurrentSiteInformation.rejected, (state, action) => {
      console.log('getCurrentSiteInformation.rejected')
      console.log(action.payload)
      state.errors = action.payload
      state.showSuccessMessage = false
      state.isLoading = false
    })
  },
})

export const getConfigurations = createAsyncThunk(GET_CONFIGURATIONS_ACTION, async (_, { getState, rejectWithValue }) => {
  const state = getState()
  const credentials = { userKey: state.credentials.credentials.userKey, secret: state.credentials.credentials.secretKey }
  try {
    return await new ConfigManager(credentials, getApiKey(window.location.hash)).getConfiguration()
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const getCurrentSiteInformation = createAsyncThunk(GET_CURRENT_SITE_INFORMATION_ACTION, async (_, { getState, rejectWithValue }) => {
  const state = getState()
  const credentials = { userKey: state.credentials.credentials.userKey, secret: state.credentials.credentials.secretKey }
  try {
    return await new ConfigManager(credentials, getApiKey(window.location.hash)).getSiteConfiguration(getApiKey(window.location.hash))
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const setConfigurations = createAsyncThunk(SET_CONFIGURATIONS_ACTION, async (_, { getState, rejectWithValue }) => {
  const state = getState()
  const credentials = { userKey: state.credentials.credentials.userKey, secret: state.credentials.credentials.secretKey }
  try {
    return await new ConfigManager(credentials, getApiKey(window.location.hash)).copy(
      state.copyConfigurationExtendend.targetApiKeys,
      state.copyConfigurationExtendend.configurations
    )
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const { addTargetApiKey, removeTargetApiKey, setConfigurationStatus, clearConfigurations, clearErrors, clearTargetApiKeys } = copyConfigurationExtendendSlice.actions

export const selectConfigurations = (state) => state.copyConfigurationExtendend.configurations

export const selectIsLoading = (state) => state.copyConfigurationExtendend.isLoading

export const selectErrors = (state) => state.copyConfigurationExtendend.selectErrors

export const selectShowSuccessDialog = (state) => state.copyConfigurationExtendend.showSuccessMessage

export const selectTargetApiKeys = (state) => state.copyConfigurationExtendend.targetApiKeys

export const selectCurrentSiteInformation = (state) => state.copyConfigurationExtendend.currentSiteInformation

export default copyConfigurationExtendendSlice.reducer
