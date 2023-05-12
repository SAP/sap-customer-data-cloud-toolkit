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

import ConfigManager from '../../services/copyConfig/configManager'
import { findConfiguration, propagateConfigurationState } from '../copyConfigurationExtended/utils'

import { filterConfiguration, getConfiguration, returnSourceConfigurations, returnSourceSites, addSourceSiteInternal } from './utils'
import { getErrorAsArray } from '../utils'

const SITE_DEPLOYER_COPY_CONFIGURATION_STATE_NAME = 'siteDeployerCopyConfiguration'
const GET_SOURCE_SITE_INFORMATION_ACTION = 'siteDeployerCopyConfiguration/getSourceSiteInformation'
const GET_SOURCE_SITE_INFORMATION_CONFIGURATIONS = 'siteDeployerCopyConfiguration/getSourceSiteConfigurations'

export const siteDeployerCopyConfigurationSlice = createSlice({
  name: SITE_DEPLOYER_COPY_CONFIGURATION_STATE_NAME,
  initialState: {
    sitesConfigurations: [],
    isLoading: false,
    isSourceInfoLoading: false,
    errors: [],
    apiCardError: undefined,
    siteId: '',
    edit: false,
    isCopyConfigurationDialogOpen: false,
    sourceSiteAdded: false,
  },
  reducers: {
    removeSiteConfigurations(state, action) {
      state.sitesConfigurations = filterConfiguration(state.sitesConfigurations, action.payload)
    },
    clearSourceConfigurations(state, action) {
      const siteConfiguration = getConfiguration(state.sitesConfigurations, action.payload)
      siteConfiguration.configurations = []
    },
    addSourceSite(state, action) {
      state.apiCardError = undefined
      addSourceSiteInternal(state.sitesConfigurations, action.payload.siteId, action.payload.targetSite)
      state.sourceSiteAdded = true
    },
    setConfigurationStatus(state, action) {
      const siteConfiguration = getConfiguration(state.sitesConfigurations, action.payload.siteId)
      const configuration = findConfiguration(siteConfiguration.configurations, action.payload.checkBoxId)
      propagateConfigurationState(configuration, action.payload.value)
    },
    removeSourceSite(state, action) {
      const siteConfiguration = getConfiguration(state.sitesConfigurations, action.payload)
      siteConfiguration.sourceSites = []
    },
    setSourceConfigurations(state, action) {
      const siteConfiguration = getConfiguration(state.sitesConfigurations, action.payload.siteId)
      siteConfiguration.configurations = action.payload.configurations
    },
    setSourceSites(state, action) {
      const siteConfiguration = getConfiguration(state.sitesConfigurations, action.payload.siteId)
      siteConfiguration.sourceSites = action.payload.sourceSites
    },
    clearErrors(state) {
      state.errors = []
    },
    clearApiCardError(state) {
      state.apiCardError = undefined
    },
    setSiteId(state, action) {
      state.siteId = action.payload
    },
    setEdit(state, action) {
      state.edit = action.payload
    },
    setIsCopyConfigurationDialogOpen(state, action) {
      state.isCopyConfigurationDialogOpen = action.payload
    },
    setDataflowVariableValue(state, action) {
      const siteConfiguration = getConfiguration(state.sitesConfigurations, state.siteId)
      const configuration = findConfiguration(siteConfiguration.configurations, action.payload.checkBoxId)
      const variable = configuration.variables.filter((variable) => variable.variable === action.payload.variable)[0]
      variable.value = action.payload.value
    },
    setDataflowVariableValues(state, action) {
      const siteConfiguration = getConfiguration(state.sitesConfigurations, state.siteId)
      const configuration = findConfiguration(siteConfiguration.configurations, action.payload.checkBoxId)
      configuration.variables = action.payload.variables
    },
    setErrors(state, action) {
      state.errors = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSourceSiteConfigurations.pending, (state) => {
      state.isLoading = true
      state.sourceSiteAdded = false
    })
    builder.addCase(getSourceSiteConfigurations.fulfilled, (state, action) => {
      state.isLoading = false
      state.sourceSiteAdded = false
      const siteConfiguration = getConfiguration(state.sitesConfigurations, action.payload.siteId)
      siteConfiguration.configurations = action.payload.configurations
    })
    builder.addCase(getSourceSiteConfigurations.rejected, (state, action) => {
      state.isLoading = false
      state.errors = action.payload.error
      const siteConfiguration = getConfiguration(state.sitesConfigurations, action.payload.siteId)
      siteConfiguration.configurations = []
      state.sourceSiteAdded = false
    })
    builder.addCase(getSourceSiteInformation.pending, (state) => {
      state.isSourceInfoLoading = true
    })
    builder.addCase(getSourceSiteInformation.fulfilled, (state, action) => {
      state.apiCardError = undefined
      state.isSourceInfoLoading = false
      const sourceSite = {
        baseDomain: action.payload.siteInformation.baseDomain,
        apiKey: action.payload.siteInformation.context.targetApiKey,
        dataCenter: action.payload.siteInformation.dataCenter,
        partnerName: action.payload.siteInformation.partnerName,
        partnerId: action.payload.siteInformation.partnerId,
      }
      addSourceSiteInternal(state.sitesConfigurations, action.payload.siteId, sourceSite)
      state.sourceSiteAdded = true
    })
    builder.addCase(getSourceSiteInformation.rejected, (state, action) => {
      state.isSourceInfoLoading = false
      state.apiCardError = action.payload
    })
  },
})

export const getSourceSiteInformation = createAsyncThunk(GET_SOURCE_SITE_INFORMATION_ACTION, async (props, { getState, rejectWithValue }) => {
  const state = getState()
  const credentials = { userKey: state.credentials.credentials.userKey, secret: state.credentials.credentials.secretKey }
  const apiKey = props.apiKey
  const siteId = props.siteId
  try {
    const siteInformation = await new ConfigManager(credentials, props.apiKey).getSiteInformation(apiKey)
    return { siteId, siteInformation }
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const getSourceSiteConfigurations = createAsyncThunk(GET_SOURCE_SITE_INFORMATION_CONFIGURATIONS, async (siteId, { getState, rejectWithValue }) => {
  const state = getState()
  const credentials = { userKey: state.credentials.credentials.userKey, secret: state.credentials.credentials.secretKey }
  const sourceSiteApiKey = getConfiguration(state.siteDeployerCopyConfiguration.sitesConfigurations, siteId).sourceSites[0].apiKey

  try {
    const configurations = await new ConfigManager(credentials, sourceSiteApiKey).getConfiguration()
    return { siteId: siteId, configurations: configurations }
  } catch (error) {
    return rejectWithValue({ siteId: siteId, error: getErrorAsArray(error) })
  }
})

export const {
  clearSourceConfigurations,
  addSourceSite,
  setConfigurationStatus,
  removeSourceSite,
  removeSiteConfigurations,
  setSourceConfigurations,
  setSourceSites,
  clearApiCardError,
  setSiteId,
  setEdit,
  setIsCopyConfigurationDialogOpen,
  clearErrors,
  setDataflowVariableValue,
  setDataflowVariableValues,
  setErrors,
} = siteDeployerCopyConfigurationSlice.actions

export default siteDeployerCopyConfigurationSlice.reducer

export const selectSitesConfigurations = (state) => state.siteDeployerCopyConfiguration.sitesConfigurations

export const selectSourceConfigurations = (siteId) => (state) => returnSourceConfigurations(state.siteDeployerCopyConfiguration.sitesConfigurations, siteId)

export const selectSourceSites = (siteId) => (state) => returnSourceSites(state.siteDeployerCopyConfiguration.sitesConfigurations, siteId)

export const selectIsLoading = (state) => state.siteDeployerCopyConfiguration.isLoading

export const selectApiCardError = (state) => state.siteDeployerCopyConfiguration.apiCardError

export const selectIsSourceInfoLoading = (state) => state.siteDeployerCopyConfiguration.isSourceInfoLoading

export const selectErrors = (state) => state.siteDeployerCopyConfiguration.errors

export const selectSiteId = (state) => state.siteDeployerCopyConfiguration.siteId

export const selectEdit = (state) => state.siteDeployerCopyConfiguration.edit

export const selectIsCopyConfigurationDialogOpen = (state) => state.siteDeployerCopyConfiguration.isCopyConfigurationDialogOpen

export const selectSourceSiteAdded = (state) => state.siteDeployerCopyConfiguration.sourceSiteAdded
