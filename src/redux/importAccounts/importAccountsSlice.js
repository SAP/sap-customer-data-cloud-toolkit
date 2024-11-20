import ImportAccounts from '../../services/importAccounts/importAccounts'
import { clearConfigurationsErrors, clearTargetSitesErrors, findConfiguration, propagateConfigurationState } from '../copyConfigurationExtended/utils'
import { getApiKey } from '../utils'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
const IMPORT_ACCOUNTS_STATE_NAME = 'importAccounts'
const GET_CONFIGURATIONS_ACTION = `${IMPORT_ACCOUNTS_STATE_NAME}/getConfigurations`
const SET_CONFIGURATIONS_ACTION = `${IMPORT_ACCOUNTS_STATE_NAME}/setConfigurations`

export const importAccountsSlice = createSlice({
  name: IMPORT_ACCOUNTS_STATE_NAME,
  initialState: {
    currentSiteApiKey: getApiKey(window.location.hash),
    configurations: [],
    errors: [],
    isLoading: false,
    showSuccessMessage: false,
    currentSiteInformation: {},
    switchId: {},
  },
  reducers: {
    setConfigurationStatus(state, action) {
      const configuration = findConfiguration(state.configurations, action.payload.checkBoxId)
      propagateConfigurationState(configuration, action.payload.value)
    },
    clearErrors(state) {
      state.errors = []
      state.apiCardError = undefined
      clearConfigurationsErrors(state.configurations)
      clearTargetSitesErrors(state.targetSites)
    },
    setSwitchOptions(state, action) {
      const configuration = findConfiguration(state.configurations, action.payload.checkBoxId)
      configuration.switchId = action.payload
    },
    setSugestionSchema(state, action) {
      const configuration = findConfiguration(state.configurations, action.payload.inputValue)
      configuration.value = true
    },
    setSingleConfigurationStatus(state, action) {
      const configuration = findConfiguration(state.configurations, action.payload.checkBoxId)
      configuration.value = action.payload.value
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
const updateSwitchIdInBranches = (branches, switchId) => {
  branches.forEach((branch) => {
    branch.switchId = switchId
    if (branch.branches && branch.branches.length > 0) {
      updateSwitchIdInBranches(branch.branches, switchId)
    }
  })
}
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
export const { setConfigurationStatus, clearErrors, setSugestionSchema, setSingleConfigurationStatus, setSwitchOptions } = importAccountsSlice.actions

export const selectConfigurations = (state) => state.importAccounts.configurations
export const selectSwitchId = (state) => state.switchId

export default importAccountsSlice.reducer
