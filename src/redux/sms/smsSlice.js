import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import SmsManager from '../../services/sms/smsManager'

import EXPORT_SMS_TEMPLATES_FILE_NAME from '../../constants'

export const smsSlice = createSlice({
  name: 'sms',
  initialState: {
    exportFile: undefined,
    isLoading: false,
    errors: [],
    isImportPopupOpen: false,
    showSuccessDialog: false,
  },
  reducers: {
    setIsImportPopupOpen(state, action) {
      state.isImportPopupOpen = action.payload
    },
    clearExportFile(state) {
      state.exportFile = undefined
    },
    clearErrors(state) {
      state.errors = []
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSmsTemplatesArrayBuffer.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getSmsTemplatesArrayBuffer.fulfilled, (state, action) => {
      state.isLoading = false
      state.exportFile = new File([action.payload], EXPORT_SMS_TEMPLATES_FILE_NAME, { type: 'application/zip' })
    })
    builder.addCase(getSmsTemplatesArrayBuffer.rejected, (state, action) => {
      state.isLoading = false
      state.errors = [action.payload]
    })
    builder.addCase(sendSmsTemplatesArrayBuffer.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(sendSmsTemplatesArrayBuffer.fulfilled, (state, action) => {
      state.isLoading = false
      debugger
      if (action.payload.errorCode !== 0) {
        state.errors = [action.payload]
        state.showSuccessDialog = false
      } else {
        state.showSuccessDialog = true
      }
      state.isImportPopupOpen = false
    })
    builder.addCase(sendSmsTemplatesArrayBuffer.rejected, (state, action) => {
      state.isLoading = false
      state.errors = [action.payload]
      state.isImportPopupOpen = false
    })
  },
})

export const getApiKey = (hash) => {
  const [, , apiKey] = hash.split('/')
  return apiKey !== undefined ? apiKey : ''
}

export const getSmsTemplatesArrayBuffer = createAsyncThunk('service/exportSms', async (dummy, { getState, rejectWithValue }) => {
  try {
    const state = getState()
    return await new SmsManager({
      userKey: state.credentials.credentials.userKey,
      secret: state.credentials.credentials.secretKey,
    }).export(getApiKey(window.location.hash))
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const sendSmsTemplatesArrayBuffer = createAsyncThunk('service/importSms', async (zipContent, { getState, rejectWithValue }) => {
  try {
    const state = getState()
    return await new SmsManager({
      userKey: state.credentials.credentials.userKey,
      secret: state.credentials.credentials.secretKey,
    }).import(getApiKey(window.location.hash), zipContent)
  } catch (error) {
    return rejectWithValue(error)
  }
})

export default smsSlice.reducer

export const { setIsImportPopupOpen, clearExportFile, clearErrors } = smsSlice.actions

export const selectExportFile = (state) => state.sms.exportFile

export const selectImportFile = (state) => state.sms.importFile

export const selectIsLoading = (state) => state.sms.isLoading

export const selectErrors = (state) => state.sms.errors

export const selectIsImportPopupOpen = (state) => state.sms.isImportPopupOpen

export const selectShowSuccessDialog = (state) => state.sms.showSuccessDialog
