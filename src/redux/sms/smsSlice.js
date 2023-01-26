import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { getApiKey } from '../utils'
import SmsManager from '../../services/sms/smsManager'

import { errorConditions } from '../errorConditions'
import { ZIP_FILE_MIME_TYPE } from '../constants'

const SMS_SLICE_STATE_NAME = 'sms'
const EXPORT_SMS_TEMPLATES_FILE_NAME = 'sms-templates'

const IMPORT_SMS_TEMPLATES_ACTION = 'service/importSmsTemplates'
const EXPORT_SMS_TEMPLATES_ACTION = 'service/exportSmsTemplates'

export const smsSlice = createSlice({
  name: SMS_SLICE_STATE_NAME,
  initialState: {
    exportFile: undefined,
    isLoading: false,
    errors: [],
    isImportPopupOpen: false,
    showSuccessDialog: false,
    errorCondition: errorConditions.empty,
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
    clearErrorCondition(state) {
      state.errorCondition = errorConditions.empty
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSmsTemplatesArrayBuffer.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getSmsTemplatesArrayBuffer.fulfilled, (state, action) => {
      state.isLoading = false
      state.exportFile = new File([action.payload], EXPORT_SMS_TEMPLATES_FILE_NAME, { type: ZIP_FILE_MIME_TYPE })
    })
    builder.addCase(getSmsTemplatesArrayBuffer.rejected, (state, action) => {
      state.isLoading = false
      state.errorCondition = errorConditions.exportError
      state.errors = action.payload
    })
    builder.addCase(sendSmsTemplatesArrayBuffer.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(sendSmsTemplatesArrayBuffer.fulfilled, (state, action) => {
      state.isLoading = false
      if (action.payload.errorCode !== 0) {
        state.errorCondition = errorConditions.importWithoutCountError
        state.errors = action.payload
        state.showSuccessDialog = false
      } else {
        state.showSuccessDialog = true
      }
      state.isImportPopupOpen = false
    })
    builder.addCase(sendSmsTemplatesArrayBuffer.rejected, (state, action) => {
      state.isLoading = false
      state.errorCondition = errorConditions.importWithoutCountError
      state.errors = action.payload
      state.isImportPopupOpen = false
    })
  },
})

export const getSmsTemplatesArrayBuffer = createAsyncThunk(EXPORT_SMS_TEMPLATES_ACTION, async (dummy, { getState, rejectWithValue }) => {
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

export const sendSmsTemplatesArrayBuffer = createAsyncThunk(IMPORT_SMS_TEMPLATES_ACTION, async (zipContent, { getState, rejectWithValue }) => {
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

export const { setIsImportPopupOpen, clearExportFile, clearErrors, clearErrorCondition } = smsSlice.actions

export const selectExportFile = (state) => state.sms.exportFile

export const selectImportFile = (state) => state.sms.importFile

export const selectIsLoading = (state) => state.sms.isLoading

export const selectErrors = (state) => state.sms.errors

export const selectIsImportPopupOpen = (state) => state.sms.isImportPopupOpen

export const selectShowSuccessDialog = (state) => state.sms.showSuccessDialog

export const selectErrorCondition = (state) => state.sms.errorCondition
