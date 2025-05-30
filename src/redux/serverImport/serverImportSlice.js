/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import ServerImport from '../../services/importAccounts/serverImport/server-import'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getApiKey, getErrorAsArray, getPartner } from '../utils'
import { clearAllValues, getConfigurationByKey, serverStructure } from './utils'
import TemplateManagerFactory from '../../services/importAccounts/templateFactory/templateManagerFactory'
import UrlBuilder from '../../services/gigya/urlBuilder'

const SERVER_IMPORT_STATE_NAME = 'serverImport'
const GET_CONFIGURATIONS_ACTION = `${SERVER_IMPORT_STATE_NAME}/getConfigurations`
const GET_REDIRECTION_URL_ACTION = `${SERVER_IMPORT_STATE_NAME}/getRedirectionURL`
const SET_CONFIGURATIONS_ACTION = `${SERVER_IMPORT_STATE_NAME}/setConfigurations`

export const serverImportExtendedSlice = createSlice({
  name: SERVER_IMPORT_STATE_NAME,
  initialState: {
    currentSiteApiKey: getApiKey(window.location.hash),
    currentSitePartner: getPartner(window.location.hash),
    serverConfigurations: [],
    errors: [],
    isLoading: false,
    showSuccessMessage: false,
    showErrorMessage: false,
    currentSiteInformation: {},
    serverProvider: '',
  },
  reducers: {
    getServerConfiguration(state, action) {
      const option = getConfigurationByKey(state.serverConfigurations, state.serverProvider)
      const initOption = option.filter((item) => item.id === action.payload.id)[0]
      initOption.value = action.payload.value
      state.accountType = action.payload.accountType
    },
    clearServerConfigurations(state) {
      clearAllValues(state.serverConfigurations)
    },
    clearErrors(state) {
      state.errors = []
    },
    setAccountType(state, action) {
      getConfigurationByKey(state.serverConfigurations, action.payload.serverType)
      state.accountType = action.payload.accountType
    },
    setServerProvider(state) {
      const SERVER_TYPE = 'azure'
      state.serverProvider = SERVER_TYPE
    },
    updateServerProvider(state, action) {
      state.serverProvider = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getConfigurations.fulfilled, (state, action) => {
      state.isLoading = false
      state.serverConfigurations = action.payload
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
      state.showErrorMessage = true
      state.errors = action.payload
    })
    builder.addCase(getDataflowRedirection.pending, (state) => {
      state.isLoading = true
      state.errors = []
      state.showSuccessMessage = false
    })
    builder.addCase(getDataflowRedirection.fulfilled, (state, action) => {
      state.isLoading = false
      state.showSuccessMessage = true
    })
    builder.addCase(getDataflowRedirection.rejected, (state, action) => {
      state.isLoading = false
      state.showSuccessMessage = false
      state.errors = action.payload
    })
  },
})

export const getConfigurations = createAsyncThunk(GET_CONFIGURATIONS_ACTION, async (_, { getState, rejectWithValue }) => {
  return serverStructure
})

export const getDataflowRedirection = createAsyncThunk(GET_REDIRECTION_URL_ACTION, async (_, { getState, rejectWithValue }) => {
  const state = getState()
  const credentials = { userKey: state.credentials.credentials.userKey, secret: state.credentials.credentials.secretKey, gigyaConsole: state.credentials.credentials.gigyaConsole }
  const currentSiteApiKey = state.copyConfigurationExtended.currentSiteApiKey
  const partnerId = state.serverImport.currentSitePartner
  const endpoint = 'orchestrate/etl-app'

  try {
    return UrlBuilder.buildGigyaPageUrl(credentials.gigyaConsole, currentSiteApiKey, partnerId, endpoint)
  } catch (error) {
    return rejectWithValue(getErrorAsArray(error))
  }
})

export const setDataflow = createAsyncThunk(SET_CONFIGURATIONS_ACTION, async (option, { getState, rejectWithValue }) => {
  const state = getState()
  const credentials = { userKey: state.credentials.credentials.userKey, secret: state.credentials.credentials.secretKey, gigyaConsole: state.credentials.credentials.gigyaConsole }
  const currentSiteApiKey = state.copyConfigurationExtended.currentSiteApiKey
  const currentDataCenter = state.copyConfigurationExtended.currentSiteInformation.dataCenter
  const storageProviderTemplate = TemplateManagerFactory.create(state.serverImport.accountType, option.option)
  try {
    return await new ServerImport(credentials, currentSiteApiKey, currentDataCenter, storageProviderTemplate).setDataflow(state.serverImport.serverConfigurations, option)
  } catch (error) {
    return rejectWithValue(getErrorAsArray(error))
  }
})

export const { getServerConfiguration, setAccountType, clearServerConfigurations, clearErrors, setServerProvider, updateServerProvider } = serverImportExtendedSlice.actions

export const selectServerConfigurations = (state) => state.serverImport.serverConfigurations

export const selectAccountType = (state) => state.serverImport.accountType

export const selectShowSuccessDialog = (state) => state.serverImport.showSuccessMessage
export const selectShowErrorDialog = (state) => state.serverImport.showErrorMessage
export const selectCurrentPartner = (state) => state.serverImport.currentSitePartner
export const selectServerProvider = (state) => state.serverImport.serverProvider
export const selectErrors = (state) => state.serverImport.errors
export default serverImportExtendedSlice.reducer
