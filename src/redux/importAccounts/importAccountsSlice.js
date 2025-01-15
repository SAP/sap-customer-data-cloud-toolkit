import ImportAccounts from '../../services/importAccounts/importAccounts'
import { clearConfigurationsErrors, clearTargetSitesErrors, findConfiguration } from '../copyConfigurationExtended/utils'
import { getApiKey, getErrorAsArray } from '../utils'
import { setParentsValue, propagateConfigurationSelectBox, getAllConfiguration, clearConfigurationsState, getConfigurationPath } from './utils'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
const IMPORT_ACCOUNTS_STATE_NAME = 'importAccounts'
const GET_CONFIGURATIONS_ACTION = `${IMPORT_ACCOUNTS_STATE_NAME}/getConfigurationTree`
const SET_CONFIGURATIONS_ACTION = `${IMPORT_ACCOUNTS_STATE_NAME}/setConfigurations`

export const importAccountsSlice = createSlice({
  name: IMPORT_ACCOUNTS_STATE_NAME,
  initialState: {
    currentSiteApiKey: getApiKey(window.location.hash),
    configurations: [],
    parentNode: [],
    errors: [],
    isLoading: false,
    showSuccessMessage: false,
    currentSiteInformation: {},
    switchId: {},
    selectedConfiguration: [],
  },
  reducers: {
    setConfigurationStatus(state, action) {
      setParentsValue(state.configurations, action.payload.checkBoxId, action.payload.value)
    },
    setMandatoryField(state, action) {
      const configuration = findConfiguration(state.configurations, action.payload.checkBoxId)
      configuration.value = action.payload.value
      configuration.mandatory = action.payload.mandatory
    },
    setSugestionMandatoryField(state, action) {
      const configuration = findConfiguration(state.selectedConfiguration, action.payload.checkBoxId)
      if (configuration) {
        configuration.value = action.payload.value
        configuration.mandatory = action.payload.mandatory
      }
    },

    clearErrors(state) {
      state.errors = []
      state.apiCardError = undefined
      clearConfigurationsErrors(state.configurations)
      clearTargetSitesErrors(state.targetSites)
    },
    clearConfigurations(state) {
      state.configurations.forEach((configuration) => {
        clearConfigurationsState(configuration, false)
      })
      state.selectedConfiguration.forEach((configuration) => {
        clearConfigurationsState(configuration, false)
      })
    },
    setSwitchOptions(state, action) {
      const configuration = findConfiguration(state.configurations, action.payload.checkBoxId)
      propagateConfigurationSelectBox(configuration, action.payload)
    },
    setSugestionSchema(state, action) {
      setParentsValue(state.selectedConfiguration, action.payload.checkBoxId, action.payload.value)
    },
    setSuggestionClickConfiguration(state, action) {
      const config = getConfigurationPath(state.selectedConfiguration, action.payload.checkBoxId)
      if (config) {
        state.selectedConfiguration = [config]
      }
    },
    setSelectedConfiguration(state, action) {
      const configuration = getAllConfiguration(state.configurations, action.payload)
      state.selectedConfiguration = configuration
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getConfigurationTree.pending, (state) => {
      state.isLoading = true
      state.errors = []
      state.configurations = []
    })
    builder.addCase(getConfigurationTree.fulfilled, (state, action) => {
      state.isLoading = false
      state.configurations = action.payload
    })
    builder.addCase(getConfigurationTree.rejected, (state, action) => {
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
      state.showSuccessMessage = true
    })
    builder.addCase(setConfigurations.rejected, (state, action) => {
      state.isLoading = false
      state.showSuccessMessage = false
      state.errors = action.payload
    })
  },
})

export const getConfigurationTree = createAsyncThunk(GET_CONFIGURATIONS_ACTION, async (selectedValue, { getState, rejectWithValue }) => {
  const state = getState()
  const credentials = { userKey: state.credentials.credentials.userKey, secret: state.credentials.credentials.secretKey, gigyaConsole: state.credentials.credentials.gigyaConsole }
  const currentSiteApiKey = state.copyConfigurationExtended.currentSiteApiKey
  const currentDataCenter = state.copyConfigurationExtended.currentSiteInformation.dataCenter
  try {
    if (currentDataCenter) {
      return await new ImportAccounts(credentials, currentSiteApiKey, currentDataCenter).importAccountToConfigTree(selectedValue)
    }
  } catch (error) {
    return rejectWithValue(getErrorAsArray(error))
  }
})

export const setConfigurations = createAsyncThunk(SET_CONFIGURATIONS_ACTION, async (accountOption, { getState, rejectWithValue }) => {
  const state = getState()
  const credentials = { userKey: state.credentials.credentials.userKey, secret: state.credentials.credentials.secretKey, gigyaConsole: state.credentials.credentials.gigyaConsole }
  const currentSiteApiKey = state.copyConfigurationExtended.currentSiteApiKey
  const currentDataCenter = state.copyConfigurationExtended.currentSiteInformation.dataCenter

  try {
    return await new ImportAccounts(credentials, currentSiteApiKey, currentDataCenter).exportDataToCsv(state.importAccounts.configurations, accountOption)
  } catch (error) {
    return rejectWithValue(getErrorAsArray(error))
  }
})
export const {
  setSelectedConfiguration,
  setSuggestionClickConfiguration,
  setConfigurationStatus,
  setMandatoryField,
  setSugestionMandatoryField,
  clearErrors,
  setSugestionSchema,
  setSwitchOptions,
  clearConfigurations,
} = importAccountsSlice.actions

export const selectConfigurations = (state) => state.importAccounts.configurations
export const selectIsLoading = (state) => state.importAccounts.isLoading
export const selectSugestionConfigurations = (state) => state.importAccounts.selectedConfiguration
export const selectParentNode = (state) => state.importAccounts.parentNode
export const selectSwitchId = (state) => state.switchId

export default importAccountsSlice.reducer
