import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getCredentials, shouldUpdateCredentials, getAccountURL } from './utils'

const CREDENTIALS_SLICE_STATE_NAME = 'credentials'
const UPDATE_CREDENTIALS_ACTION = 'updateCredentials'

export const credentialsSlice = createSlice({
  name: CREDENTIALS_SLICE_STATE_NAME,
  initialState: {
    credentials: {
      userKey: '',
      secretKey: '',
    },
    isPopUpOpen: false,
  },
  reducers: {
    setUserKey: (state, action) => {
      state.credentials.userKey = action.payload
    },
    setSecretKey: (state, action) => {
      state.credentials.secretKey = action.payload
    },
    setIsPopUpOpen: (state, action) => {
      state.isPopUpOpen = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateCredentialsAsync.fulfilled, (state, action) => {
      if (action.payload) {
        state.credentials = action.payload
      }
    })
  },
})

export const updateCredentialsAsync = createAsyncThunk(UPDATE_CREDENTIALS_ACTION, async (dummy, { getState }) => {
  const credentialsState = getState().credentials
  if (shouldUpdateCredentials(credentialsState.credentials, credentialsState.isPopUpOpen)) {
    window.location.href = getAccountURL()
    try {
      return await getCredentials()
    } catch (error) {
      window.history.back()
    }
  }
})

export const { setUserKey, setSecretKey, setIsPopUpOpen, updateCredentials } = credentialsSlice.actions

export const selectCredentials = (state) => state.credentials.credentials

export default credentialsSlice.reducer
