import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import ConfigManager from '../../services/copyConfig/configManager'
import { findConfiguration, propagateConfigurationState } from '../copyConfigurationExtended/utils'

import { filterConfiguration, getConfiguration, returnSourceConfigurations, returnSourceSites } from './utils'

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
      const siteConfiguration = getConfiguration(state.sitesConfigurations, action.payload.siteId)
      if (!siteConfiguration) {
        state.sitesConfigurations.push({
          siteId: action.payload.siteId,
          sourceSites: [action.payload.targetSite],
          configurations: [],
        })
      } else {
        if (siteConfiguration.sourceSites) {
          siteConfiguration.sourceSites = []
          siteConfiguration.sourceSites.push(action.payload.targetSite)
        } else {
          siteConfiguration.sourceSites = [action.payload.targetSite]
        }
      }
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
    clearApiCardError(state) {
      state.apiCardError = undefined
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSourceSiteConfigurations.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getSourceSiteConfigurations.fulfilled, (state, action) => {
      state.isLoading = false
      const siteConfiguration = getConfiguration(state.sitesConfigurations, action.payload.siteId)
      siteConfiguration.configurations = action.payload.configurations
    })
    builder.addCase(getSourceSiteConfigurations.rejected, (state, action) => {
      state.isLoading = false
      state.errors = action.payload
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

      const siteConfiguration = getConfiguration(state.sitesConfigurations, action.payload.siteId)
      if (!siteConfiguration) {
        state.sitesConfigurations.push({
          siteId: action.payload.siteId,
          sourceSites: [sourceSite],
          configurations: [],
        })
      } else {
        if (siteConfiguration.sourceSites) {
          siteConfiguration.sourceSites = []
          siteConfiguration.sourceSites.push(sourceSite)
        } else {
          siteConfiguration.sourceSites = [sourceSite]
        }
      }
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
    return rejectWithValue(error)
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
} = siteDeployerCopyConfigurationSlice.actions

export default siteDeployerCopyConfigurationSlice.reducer

export const selectSitesConfigurations = (state) => state.siteDeployerCopyConfiguration.sitesConfigurations

export const selectSourceConfigurations = (siteId) => (state) => returnSourceConfigurations(state.siteDeployerCopyConfiguration.sitesConfigurations, siteId)

export const selectSourceSites = (siteId) => (state) => returnSourceSites(state.siteDeployerCopyConfiguration.sitesConfigurations, siteId)

export const selectIsLoading = (state) => state.siteDeployerCopyConfiguration.isLoading

export const selectApiCardError = (state) => state.siteDeployerCopyConfiguration.apiCardError

export const selectIsSourceInfoLoading = (state) => state.siteDeployerCopyConfiguration.isSourceInfoLoading

export const selectErrors = (state) => state.siteDeployerCopyConfiguration.errors
