import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import EmailManager from '../../services/emails/emailManager'
import pkg from '../../../package.json'

export const emailSlice = createSlice({
  name: 'emails',
  initialState: {
    exportFile: {},
    importFile: {},
    isLoading: false,
  },
  extraReducers: (builder) => {
    builder.addCase(getEmailTemplatesArrayBuffer.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getEmailTemplatesArrayBuffer.fulfilled, (state, action) => {
      state.isLoading = false
      state.exportEmail = new File([action.payload], pkg.name, { type: 'application/zip' })
    })
    builder.addCase(getEmailTemplatesArrayBuffer.rejected, (state) => {
      state.isLoading = false
    })
  },
})

export const getApiKey = (hash) => {
  const [, , apiKey] = hash.split('/')
  return apiKey !== undefined ? apiKey : ''
}

export const getEmailTemplatesArrayBuffer = createAsyncThunk('service/exportEmail', async (dummy, { getState }) => {
  try {
    const state = getState()
    return await new EmailManager({
      userKey: state.sites.credentials.userKey,
      secret: state.sites.credentials.secretKey,
    }).export(getApiKey(window.location.hash))
  } catch (error) {
    console.log(`error: ${error}`)
    return error
  }
})

export default emailSlice.reducer

export const selectExportFile = (state) => state.emails.exportEmail

export const selectImportFile = (state) => state.emails.importFile

export const selectIsLoading = (state) => state.emails.isLoading
