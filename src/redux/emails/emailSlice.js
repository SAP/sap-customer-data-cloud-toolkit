import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import EmailManager from '../../services/emails/emailManager'
import pkg from '../../../package.json'

export const emailSlice = createSlice({
  name: 'emails',
  initialState: {
    exportFile: {},
    isLoading: false,
    errors: [],
    isImportPopupOpen: false,
  },
  reducers: {
    setIsImportPopupOpen(state, action) {
      state.isImportPopupOpen = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getEmailTemplatesArrayBuffer.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getEmailTemplatesArrayBuffer.fulfilled, (state, action) => {
      state.isLoading = false
      state.exportEmail = new File([action.payload], pkg.name, { type: 'application/zip' })
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
    })
    builder.addCase(sendEmailTemplatesArrayBuffer.rejected, (state, action) => {
      state.isLoading = false
      state.errors = [action.payload]
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

export const { setIsImportPopupOpen } = emailSlice.actions

export default emailSlice.reducer

export const selectExportFile = (state) => state.emails.exportEmail

export const selectImportFile = (state) => state.emails.importFile

export const selectIsLoading = (state) => state.emails.isLoading

export const selectErrors = (state) => state.emails.errors

export const selectIsImportPopupOpen = (state) => {
  return state.emails.isImportPopupOpen
}
