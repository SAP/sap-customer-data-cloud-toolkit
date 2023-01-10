import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import EmailManager from '../../services/emails/emailManager'
import EXPORT_EMAIL_TEMPLATES_FILE_NAME from '../../constants'

export const emailSlice = createSlice({
  name: 'emails',
  initialState: {
    exportFile: undefined,
    isLoading: false,
    errors: [],
    validationErrors: [],
    isImportPopupOpen: false,
    showSuccessDialog: false,
    isImportFileValid: false,
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
    clearValidationErrors(state) {
      state.validationErrors = []
    },
    setIsImportFileValid(state, action) {
      state.isImportFileValid = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getEmailTemplatesArrayBuffer.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getEmailTemplatesArrayBuffer.fulfilled, (state, action) => {
      state.isLoading = false
      state.exportFile = new File([action.payload], EXPORT_EMAIL_TEMPLATES_FILE_NAME, { type: 'application/zip' })
    })
    builder.addCase(getEmailTemplatesArrayBuffer.rejected, (state, action) => {
      state.isLoading = false
      state.errors = [action.payload]
    })
    builder.addCase(sendEmailTemplatesArrayBuffer.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(sendEmailTemplatesArrayBuffer.fulfilled, (state, action) => {
      state.isLoading = false
      const errors = action.payload.filter(({ errorCode }) => errorCode !== 0)
      if (errors.length) {
        state.errors = errors
        state.showSuccessDialog = false
      } else {
        state.showSuccessDialog = true
      }
      state.isImportPopupOpen = false
    })
    builder.addCase(sendEmailTemplatesArrayBuffer.rejected, (state, action) => {
      state.isLoading = false
      state.errors = [action.payload]
      state.isImportPopupOpen = false
    })
    builder.addCase(validateEmailTemplates.fulfilled, (state) => {
      state.isLoading = false
      state.isImportFileValid = true
    })
    builder.addCase(validateEmailTemplates.rejected, (state, action) => {
      state.isLoading = false
      state.validationErrors = action.payload
      state.isImportFileValid = false
    })
  },
})

export const getApiKey = (hash) => {
  const [, , apiKey] = hash.split('/')
  return apiKey !== undefined ? apiKey : ''
}

export const getEmailTemplatesArrayBuffer = createAsyncThunk('service/exportEmail', async (dummy, { getState, rejectWithValue }) => {
  try {
    const state = getState()
    return await new EmailManager({
      userKey: state.credentials.credentials.userKey,
      secret: state.credentials.credentials.secretKey,
    }).export(getApiKey(window.location.hash))
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const sendEmailTemplatesArrayBuffer = createAsyncThunk('service/importEmail', async (zipContent, { getState, rejectWithValue }) => {
  try {
    const state = getState()
    return await new EmailManager({
      userKey: state.credentials.credentials.userKey,
      secret: state.credentials.credentials.secretKey,
    }).import(getApiKey(window.location.hash), zipContent)
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const validateEmailTemplates = createAsyncThunk('service/validateEmailTemplates', async (zipContent, { getState, rejectWithValue }) => {
  try {
    const state = getState()
    return await new EmailManager({
      userKey: state.credentials.credentials.userKey,
      secret: state.credentials.credentials.secretKey,
    }).validateEmailTemplates(zipContent)
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const { setIsImportPopupOpen, clearExportFile, clearErrors, setIsImportFileValid, clearValidationErrors } = emailSlice.actions

export default emailSlice.reducer

export const selectExportFile = (state) => state.emails.exportFile

export const selectImportFile = (state) => state.emails.importFile

export const selectIsLoading = (state) => state.emails.isLoading

export const selectErrors = (state) => state.emails.errors

export const selectIsImportPopupOpen = (state) => state.emails.isImportPopupOpen

export const selectShowSuccessDialog = (state) => state.emails.showSuccessDialog

export const selectIsImportFileValid = (state) => state.emails.isImportFileValid

export const selectValidationErrors = (state) => state.emails.validationErrors
