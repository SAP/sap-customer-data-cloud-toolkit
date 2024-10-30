import ConfigManager from '../../services/copyConfig/configManager'
import { schemaConfiguration } from '../../services/importAccounts/importAccounts'
import ImportAccounts from '../../services/importAccounts/importAccounts'
import { selectCurrentSiteInformation } from '../copyConfigurationExtended/copyConfigurationExtendedSlice'
import { clearConfigurationsErrors, clearTargetSitesErrors, findConfiguration, propagateConfigurationState } from '../copyConfigurationExtended/utils'
import { getApiKey } from '../utils'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
const IMPORT_ACCOUNTS_STATE_NAME = 'importAccounts'
const GET_CONFIGURATIONS_ACTION = `${IMPORT_ACCOUNTS_STATE_NAME}/getConfigurations`
const SET_CONFIGURATIONS_ACTION = `${IMPORT_ACCOUNTS_STATE_NAME}/setConfigurations`
const GET_CURRENT_SITE_INFORMATION_ACTION = `${IMPORT_ACCOUNTS_STATE_NAME}/getCurrentSiteInformation`

export const importAccountsSlice = createSlice({
  name: IMPORT_ACCOUNTS_STATE_NAME,
  initialState: {
    currentSiteApiKey: getApiKey(window.location.hash),
    configurations: [],
    errors: [],
    isLoading: false,
    showSuccessMessage: false,
    currentSiteInformation: {},
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
    builder.addCase(getCurrentSiteInformation.fulfilled, (state, action) => {
      state.isLoading = false
      console.log('action->', action)
      state.currentSiteInformation = action.payload
    })
    builder.addCase(getCurrentSiteInformation.rejected, (state, action) => {
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
export const getCurrentSiteInformation = createAsyncThunk(GET_CURRENT_SITE_INFORMATION_ACTION, async (_, { getState, rejectWithValue }) => {
  const state = getState()
  const credentials = { userKey: state.credentials.credentials.userKey, secret: state.credentials.credentials.secretKey, gigyaConsole: state.credentials.credentials.gigyaConsole }
  const currentSiteApiKey = state.copyConfigurationExtended.currentSiteApiKey

  const getSite = await new ConfigManager(credentials, currentSiteApiKey).getSiteInformation(currentSiteApiKey)
  try {
    return getSite
  } catch (error) {
    return 'Cant complete the request because' + error
  }
})
export const { setConfigurationStatus, clearErrors } = importAccountsSlice.actions

export const selectConfigurations = (state) => state.importAccounts

export default importAccountsSlice.reducer
