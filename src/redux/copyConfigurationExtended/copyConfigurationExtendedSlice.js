/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import ConfigManager from '../../services/copyConfig/configManager'
import SiteFinderPaginated from '../../services/search/siteFinderPaginated'

import i18n from '../../i18n'

import { getApiKey, getErrorAsArray } from '../utils'

import {
  findConfiguration,
  propagateConfigurationState,
  clearConfigurationsErrors,
  clearTargetSitesErrors,
  addErrorToConfigurations,
  addErrorToTargetApiKey,
  isTargetSiteDuplicated,
  sourceEqualsTarget,
  writeAvailableTargetSitesToLocalStorage,
  getAvailableTargetSitesFromLocalStorage,
  removeCurrentSiteApiKeyFromAvailableTargetSites,
  checkDataflowVariables,
} from './utils'

const COPY_CONFIGURATION_EXTENDED_STATE_NAME = 'copyConfigurationExtended'
const GET_CONFIGURATIONS_ACTION = `${COPY_CONFIGURATION_EXTENDED_STATE_NAME}/getConfigurations`
const SET_CONFIGURATIONS_ACTION = `${COPY_CONFIGURATION_EXTENDED_STATE_NAME}/setConfigurations`
const GET_AVAILABLE_TARGET_API_KEYS = `${COPY_CONFIGURATION_EXTENDED_STATE_NAME}/getAvailableTargetApiKeys`
const GET_CURRENT_SITE_INFORMATION_ACTION = `${COPY_CONFIGURATION_EXTENDED_STATE_NAME}/getCurrentSiteInformation`
const GET_TARGET_SITE_INFORMATION_ACTION = `${COPY_CONFIGURATION_EXTENDED_STATE_NAME}/getTargetSiteInformation`

let areAvailableTargetSitesLoading = false

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
    unfilteredAvailableTargetSites: [],
  },

  reducers: {
    addTargetSite(state, action) {
      state.apiCardError = undefined
      const targetSite = action.payload.targetSite
      if (sourceEqualsTarget(targetSite.apiKey)) {
        state.apiCardError = { errorMessage: i18n.t('COPY_CONFIGURATION_EXTENDED.SOURCE_EQUALS_TARGET_WARNING_TEXT') }
      } else {
        if (!isTargetSiteDuplicated(action.payload.targetSite.apiKey, state.targetSites)) {
          state.targetSites.push(targetSite)
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
    setAvailableTargetSitesFromLocalStorage(state, action) {
      const availableTargetSitesFromLocalStorage = getAvailableTargetSitesFromLocalStorage(action.payload)
      if (availableTargetSitesFromLocalStorage) {
        state.unfilteredAvailableTargetSites = availableTargetSitesFromLocalStorage
        state.availableTargetSites = removeCurrentSiteApiKeyFromAvailableTargetSites(availableTargetSitesFromLocalStorage, state.currentSiteApiKey)
      }
      areAvailableTargetSitesLoading = true
    },
    setAvailableTargetSites(state, action) {
      state.availableTargetSites = action.payload.availableTargetSites
      areAvailableTargetSitesLoading = false
      writeAvailableTargetSitesToLocalStorage(action.payload.availableTargetSites, action.payload.secret)
    },
    setDataflowVariableValue(state, action) {
      const configuration = findConfiguration(state.configurations, action.payload.checkBoxId)
      const variable = configuration.variables.filter((variable) => variable.variable === action.payload.variable)[0]
      variable.value = action.payload.value
    },
    setDataflowVariableValues(state, action) {
      const configuration = findConfiguration(state.configurations, action.payload.checkBoxId)
      configuration.variables = action.payload.variables
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
    builder.addCase(getAvailableTargetSites.fulfilled, (state, action) => {
      if (action.payload.availableTargetSites) {
        state.unfilteredAvailableTargetSites = action.payload.availableTargetSites
        state.availableTargetSites = removeCurrentSiteApiKeyFromAvailableTargetSites(action.payload.availableTargetSites, state.currentSiteApiKey)
        writeAvailableTargetSitesToLocalStorage(action.payload.availableTargetSites, action.payload.secret)
      }
    })
    builder.addCase(getAvailableTargetSites.rejected, (state, action) => {
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
      state.errors = action.payload
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
  const credentials = { userKey: state.credentials.credentials.userKey, secret: state.credentials.credentials.secretKey, gigyaConsole: window.location.hostname }
  const currentSiteApiKey = state.copyConfigurationExtended.currentSiteApiKey

  try {
    return await new ConfigManager(credentials, currentSiteApiKey).getConfiguration()
  } catch (error) {
    return rejectWithValue(getErrorAsArray(error))
  }
})

export const setConfigurations = createAsyncThunk(SET_CONFIGURATIONS_ACTION, async (_, { getState, rejectWithValue }) => {
  const state = getState()
  const credentials = { userKey: state.credentials.credentials.userKey, secret: state.credentials.credentials.secretKey, gigyaConsole: window.location.hostname }
  const currentSiteApiKey = state.copyConfigurationExtended.currentSiteApiKey

  const responses = checkDataflowVariables(state.copyConfigurationExtended.configurations)

  if (responses.length) {
    return responses
  }

  try {
    return await new ConfigManager(credentials, currentSiteApiKey).copy(
      state.copyConfigurationExtended.targetSites.map((targetSite) => targetSite.apiKey),
      state.copyConfigurationExtended.configurations,
    )
  } catch (error) {
    return rejectWithValue(getErrorAsArray(error))
  }
})

export const getAvailableTargetSites = createAsyncThunk(GET_AVAILABLE_TARGET_API_KEYS, async (_, { getState, rejectWithValue }) => {
  try {
    if (!areAvailableTargetSitesLoading) {
      const parallelRequestsAllowed = 5
      const state = getState()
      const credentials = { userKey: state.credentials.credentials.userKey, secret: state.credentials.credentials.secretKey, gigyaConsole: window.location.hostname }
      const siteFinderPaginated = new SiteFinderPaginated(credentials, parallelRequestsAllowed)
      let response = await siteFinderPaginated.getFirstPage()
      const availableTargetSites = []
      availableTargetSites.push(...response)
      while ((response = await siteFinderPaginated.getNextPage()) !== undefined) {
        availableTargetSites.push(...response)
      }
      return { availableTargetSites: availableTargetSites, secret: credentials.secret }
    } else {
      return []
    }
  } catch (error) {
    return rejectWithValue(getErrorAsArray(error))
  }
})

export const getCurrentSiteInformation = createAsyncThunk(GET_CURRENT_SITE_INFORMATION_ACTION, async (_, { getState, rejectWithValue }) => {
  const state = getState()
  const credentials = { userKey: state.credentials.credentials.userKey, secret: state.credentials.credentials.secretKey, gigyaConsole: window.location.hostname }
  const currentSiteApiKey = state.copyConfigurationExtended.currentSiteApiKey

  try {
    return await new ConfigManager(credentials, currentSiteApiKey).getSiteInformation(currentSiteApiKey)
  } catch (error) {
    return rejectWithValue(getErrorAsArray(error))
  }
})

export const getTargetSiteInformation = createAsyncThunk(GET_TARGET_SITE_INFORMATION_ACTION, async (targetApiKey, { getState, rejectWithValue }) => {
  const state = getState()
  const credentials = { userKey: state.credentials.credentials.userKey, secret: state.credentials.credentials.secretKey, gigyaConsole: window.location.hostname }

  try {
    return await new ConfigManager(credentials, targetApiKey).getSiteInformation(targetApiKey)
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const {
  addTargetSite,
  removeTargetSite,
  setConfigurationStatus,
  clearConfigurations,
  clearErrors,
  clearTargetApiKeys,
  clearApiCardError,
  updateCurrentSiteApiKey,
  setAvailableTargetSitesFromLocalStorage,
  setAvailableTargetSites,
  setDataflowVariableValue,
  setDataflowVariableValues,
} = copyConfigurationExtendedSlice.actions

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

export const selectUnfilteredAvailableTargetSites = (state) => state.copyConfigurationExtended.unfilteredAvailableTargetSites

export default copyConfigurationExtendedSlice.reducer
