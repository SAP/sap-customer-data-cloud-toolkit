import ImportAccounts from '../../services/importAccounts/importAccounts'
import { clearConfigurationsErrors, clearTargetSitesErrors, findConfiguration } from '../copyConfigurationExtended/utils'
import { getApiKey } from '../utils'
import { setParentsTrue, propagateConfigurationState, propagateConfigurationSelectBox, propagateSugestionState, getAllConfiguration } from './utils'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
const IMPORT_ACCOUNTS_STATE_NAME = 'importAccounts'
const GET_CONFIGURATIONS_ACTION = `${IMPORT_ACCOUNTS_STATE_NAME}/getConfigurations`
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
      const configuration = findConfiguration(state.configurations, action.payload.checkBoxId)
      setParentsTrue(state.configurations, action.payload.checkBoxId)
      propagateConfigurationState(configuration, action.payload.value)
    },
    getConfiguration(state, action) {
      const configuration = findConfiguration(state.configurations, action.payload.checkBoxId)
      state.configurations = [configuration]
    },
    clearErrors(state) {
      state.errors = []
      state.apiCardError = undefined
      clearConfigurationsErrors(state.configurations)
      clearTargetSitesErrors(state.targetSites)
    },
    setSwitchOptions(state, action) {
      const configuration = findConfiguration(state.configurations, action.payload.checkBoxId)
      propagateConfigurationSelectBox(configuration, action.payload)
    },
    setSugestionSchema(state, action) {
      const configuration = findConfiguration(state.selectedConfiguration, action.payload.checkBoxId)
      setParentsTrue(state.selectedConfiguration, action.payload.checkBoxId)
      propagateConfigurationState(configuration, action.payload.value)
    },
    setSingleConfigurationStatus(state, action) {
      const configuration = findConfiguration(state.configurations, action.payload.checkBoxId)
      configuration.value = action.payload.value
    },
    getParentBranch(state, action) {
      const configuration = findConfiguration(state.configurations, action.payload.checkBoxId)
      state.configurations = [configuration]
    },
    getParentBranchById(state, action) {
      const configuration = findConfiguration(state.configurations, action.payload.checkBoxId)
      state.parentNode = [configuration]
    },
    setMandatoryStatus(state, action) {
      const configuration = findConfiguration(state.configurations, action.payload.checkBoxId)
      configuration.mandatory = true
      configuration.value = true
    },
    setSelectedConfiguration(state, action) {
      const configuration = getAllConfiguration(state.configurations, action.payload)
      state.selectedConfiguration = configuration
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
      state.showSuccessMessage = true
    })
    builder.addCase(setConfigurations.rejected, (state, action) => {
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
    if (currentDataCenter) {
      return await new ImportAccounts(credentials, currentSiteApiKey, currentDataCenter).importAccountToConfigTree()
    }
  } catch (error) {}
})

export const setConfigurations = createAsyncThunk(SET_CONFIGURATIONS_ACTION, async (_, { getState, rejectWithValue }) => {
  const state = getState()
  const credentials = { userKey: state.credentials.credentials.userKey, secret: state.credentials.credentials.secretKey, gigyaConsole: state.credentials.credentials.gigyaConsole }
  const currentSiteApiKey = state.copyConfigurationExtended.currentSiteApiKey
  const currentDataCenter = state.copyConfigurationExtended.currentSiteInformation.dataCenter

  try {
    return await new ImportAccounts(credentials, currentSiteApiKey, currentDataCenter).exportDataToCsv(state.importAccounts.configurations)
  } catch (error) {}
})
export const {
  setMandatoryStatus,
  setSelectedConfiguration,
  setConfigurationStatus,
  clearErrors,
  setSugestionSchema,
  setSingleConfigurationStatus,
  getParentBranchById,
  getParentBranch,
  setSwitchOptions,
} = importAccountsSlice.actions

export const selectConfigurations = (state) => state.importAccounts.configurations
export const selectSugestionConfigurations = (state) => state.importAccounts.selectedConfiguration
export const selectParentNode = (state) => state.importAccounts.parentNode
export const selectSwitchId = (state) => state.switchId

export default importAccountsSlice.reducer
