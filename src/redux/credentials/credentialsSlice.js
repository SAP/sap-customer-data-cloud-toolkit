/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getAccountURL, getCredentials, shouldUpdateCredentials } from './utils'

const CREDENTIALS_SLICE_STATE_NAME = 'credentials'
const UPDATE_CREDENTIALS_ACTION = 'updateCredentials'

export const credentialsSlice = createSlice({
  name: CREDENTIALS_SLICE_STATE_NAME,
  initialState: {
    credentials: {
      userKey: process.env.NODE_ENV === 'development' ? `${process.env.REACT_APP_USERKEY}` : '',
      secretKey: process.env.NODE_ENV === 'development' ? `${process.env.REACT_APP_SECRET}` : '',
      gigyaConsole: '',
    },
  },
  reducers: {
    setUserKey: (state, action) => {
      state.credentials.userKey = action.payload
    },
    setSecretKey: (state, action) => {
      state.credentials.secretKey = action.payload
    },
    setGigyaConsole: (state, action) => {
      state.credentials.gigyaConsole = action.payload
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

export const updateCredentialsAsync = createAsyncThunk(UPDATE_CREDENTIALS_ACTION, async (_, { getState }) => {
  const credentialsState = getState().credentials
  if (shouldUpdateCredentials(credentialsState.credentials)) {
    window.location.href = getAccountURL()
    try {
      return await getCredentials()
    } catch (error) {
      window.history.back()
    }
  }
})

export const { setUserKey, setSecretKey, setGigyaConsole, updateCredentials } = credentialsSlice.actions

export const selectCredentials = (state) => state.credentials.credentials

export default credentialsSlice.reducer
