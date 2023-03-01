import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import ConfigManager from '../../services/copyConfig/configManager'
import SiteFinder from '../../services/search/siteFinder'

import i18n from '../../i18n'

import { getApiKey } from '../utils'
import {
  findConfiguration,
  propagateConfigurationState,
  clearConfigurationsErrors,
  clearTargetSitesErrors,
  addErrorToConfigurations,
  addErrorToTargetApiKey,
  isTargetSiteDuplicated,
  sourceEqualsTarget,
} from './utils'

const COPY_CONFIGURATION_EXTENDED_STATE_NAME = 'copyConfigurationExtended'
const GET_CONFIGURATIONS_ACTION = `${COPY_CONFIGURATION_EXTENDED_STATE_NAME}/getConfigurations`
const SET_CONFIGURATIONS_ACTION = `${COPY_CONFIGURATION_EXTENDED_STATE_NAME}/setConfigurations`
const GET_AVAILABLE_TARGET_API_KEYS = `${COPY_CONFIGURATION_EXTENDED_STATE_NAME}/getAvailableTargetApiKeys`
const GET_CURRENT_SITE_INFORMATION_ACTION = `${COPY_CONFIGURATION_EXTENDED_STATE_NAME}/getCurrentSiteInformation`
const GET_TARGET_SITE_INFORMATION_ACTION = `${COPY_CONFIGURATION_EXTENDED_STATE_NAME}/getTargetSiteInformation`

export const copyConfigurationExtendedSlice = createSlice({
  name: COPY_CONFIGURATION_EXTENDED_STATE_NAME,
  initialState: {
    currentSiteApiKey: getApiKey(window.location.hash),
    configurations: [],
    errors: [],
    apiCardError: undefined,
    isLoading: false,
    targetSites: [],
    showSuccessMessage: false,
    availableTargetSites: [],
    currentSiteInformation: {},
    isTargetInfoLoading: false,
  },

  reducers: {
    addTargetSite(state, action) {
      state.apiCardError = undefined
      if (sourceEqualsTarget(action.payload.apiKey)) {
        state.apiCardError = { errorMessage: i18n.t('COPY_CONFIGURATION_EXTENDED.SOURCE_EQUALS_TARGET_WARNING_TEXT') }
      } else {
        if (!isTargetSiteDuplicated(action.payload.apiKey, state.targetSites)) {
          state.targetSites.push(action.payload)
        } else {
          state.apiCardError = { errorMessage: i18n.t('COPY_CONFIGURATION_EXTENDED.DUPLICATED_WARNING_TEXT') }
        }
      }
    },
    removeTargetSite(state, action) {
      state.targetSites = state.targetSites.filter((targetSite) => targetSite.apiKey !== action.payload)
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
      state.apiCardError = undefined
      clearConfigurationsErrors(state.configurations)
      clearTargetSitesErrors(state.targetSites)
    },
    clearTargetApiKeys(state) {
      state.targetSites = []
    },
    clearApiCardError(state) {
      state.apiCardError = undefined
    },
    updateCurrentSiteApiKey(state) {
      state.currentSiteApiKey = getApiKey(window.location.hash)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getConfigurations.pending, (state) => {
      state.isLoading = true
      state.errors = []
      state.configurations = []
    })
    builder.addCase(getConfigurations.fulfilled, (state, action) => {
      state.isLoading = false
      state.configurations = action.payload
    })
    builder.addCase(getConfigurations.rejected, (state, action) => {
      state.isLoading = false
      state.errors = action.payload
    })
    builder.addCase(setConfigurations.pending, (state) => {
      state.isLoading = true
      state.errors = []
      state.showSuccessMessage = false
    })
    builder.addCase(setConfigurations.fulfilled, (state, action) => {
      state.isLoading = false
      const errors = action.payload.filter((response) => response.errorCode !== 0)
      if (errors.length) {
        state.showSuccessMessage = false
        state.errors = errors
        addErrorToConfigurations(state.configurations, errors)
        addErrorToTargetApiKey(state.targetSites, errors)
      } else {
        state.showSuccessMessage = true
      }
    })
    builder.addCase(setConfigurations.rejected, (state, action) => {
      state.isLoading = false
      state.showSuccessMessage = false
      state.errors = action.payload
    })
    builder.addCase(getAvailableTargetSites.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getAvailableTargetSites.fulfilled, (state, action) => {
      state.isLoading = false
      state.availableTargetSites = action.payload.filter((site) => site.apiKey !== getApiKey(window.location.hash))
    })
    builder.addCase(getAvailableTargetSites.rejected, (state, action) => {
      state.isLoading = false
      state.availableTargetSites = []
      state.apiCardError = action.payload
    })
    builder.addCase(getCurrentSiteInformation.fulfilled, (state, action) => {
      state.isLoading = false
      state.currentSiteInformation = action.payload
    })
    builder.addCase(getCurrentSiteInformation.rejected, (state, action) => {
      state.isLoading = false
      state.showSuccessMessage = false
      state.errors = [action.payload]
    })
    builder.addCase(getTargetSiteInformation.pending, (state) => {
      state.isTargetInfoLoading = true
    })
    builder.addCase(getTargetSiteInformation.fulfilled, (state, action) => {
      state.isTargetInfoLoading = false
      state.apiCardError = undefined
      if (sourceEqualsTarget(action.payload.context.targetApiKey)) {
        state.apiCardError = { errorMessage: i18n.t('COPY_CONFIGURATION_EXTENDED.SOURCE_EQUALS_TARGET_WARNING_TEXT') }
      } else {
        if (!isTargetSiteDuplicated(action.payload.context.targetApiKey, state.targetSites)) {
          state.targetSites.push({
            baseDomain: action.payload.baseDomain,
            apiKey: action.payload.context.targetApiKey,
            dataCenter: action.payload.dataCenter,
            partnerName: action.payload.partnerName,
            partnerId: action.payload.partnerId,
          })
        } else {
          state.apiCardError = { errorMessage: i18n.t('COPY_CONFIGURATION_EXTENDED.DUPLICATED_WARNING_TEXT') }
        }
      }
    })
    builder.addCase(getTargetSiteInformation.rejected, (state, action) => {
      state.showSuccessMessage = false
      state.isTargetInfoLoading = false
      state.apiCardError = action.payload
    })
  },
})

export const getConfigurations = createAsyncThunk(GET_CONFIGURATIONS_ACTION, async (_, { getState, rejectWithValue }) => {
  const state = getState()
  const credentials = { userKey: state.credentials.credentials.userKey, secret: state.credentials.credentials.secretKey }
  const currentSiteApiKey = state.copyConfigurationExtended.currentSiteApiKey

  try {
    return await new ConfigManager(credentials, currentSiteApiKey).getConfiguration()
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const setConfigurations = createAsyncThunk(SET_CONFIGURATIONS_ACTION, async (_, { getState, rejectWithValue }) => {
  const state = getState()
  const credentials = { userKey: state.credentials.credentials.userKey, secret: state.credentials.credentials.secretKey }
  const currentSiteApiKey = state.copyConfigurationExtended.currentSiteApiKey

  try {
    return await new ConfigManager(credentials, currentSiteApiKey).copy(
      state.copyConfigurationExtended.targetSites.map((targetSite) => targetSite.apiKey),
      state.copyConfigurationExtended.configurations
    )
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const getCurrentSiteInformation = createAsyncThunk(GET_CURRENT_SITE_INFORMATION_ACTION, async (_, { getState, rejectWithValue }) => {
  const state = getState()
  const credentials = { userKey: state.credentials.credentials.userKey, secret: state.credentials.credentials.secretKey }
  const currentSiteApiKey = state.copyConfigurationExtended.currentSiteApiKey

  try {
    return await new ConfigManager(credentials, currentSiteApiKey).getSiteInformation(currentSiteApiKey)
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const getTargetSiteInformation = createAsyncThunk(GET_TARGET_SITE_INFORMATION_ACTION, async (targetApiKey, { getState, rejectWithValue }) => {
  const state = getState()
  const credentials = { userKey: state.credentials.credentials.userKey, secret: state.credentials.credentials.secretKey }

  try {
    return await new ConfigManager(credentials, targetApiKey).getSiteInformation(targetApiKey)
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const getAvailableTargetSites = createAsyncThunk(GET_AVAILABLE_TARGET_API_KEYS, async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState()
    const credentials = { userKey: state.credentials.credentials.userKey, secret: state.credentials.credentials.secretKey }
    return await new SiteFinder(credentials).getAllSites()
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const { addTargetSite, removeTargetSite, setConfigurationStatus, clearConfigurations, clearErrors, clearTargetApiKeys, clearApiCardError, updateCurrentSiteApiKey } =
  copyConfigurationExtendedSlice.actions

export const selectConfigurations = (state) => state.copyConfigurationExtended.configurations

export const selectIsLoading = (state) => state.copyConfigurationExtended.isLoading

export const selectErrors = (state) => state.copyConfigurationExtended.errors

export const selectShowSuccessDialog = (state) => state.copyConfigurationExtended.showSuccessMessage

export const selectTargetSites = (state) => state.copyConfigurationExtended.targetSites

export const selectAvailableTargetSites = (state) => state.copyConfigurationExtended.availableTargetSites

export const selectCurrentSiteInformation = (state) => state.copyConfigurationExtended.currentSiteInformation

export const selectApiCardError = (state) => state.copyConfigurationExtended.apiCardError

export const selectIsTargetInfoLoading = (state) => state.copyConfigurationExtended.isTargetInfoLoading

export const selectCurrentSiteApiKey = (state) => state.copyConfigurationExtended.currentSiteApiKey

export default copyConfigurationExtendedSlice.reducer
