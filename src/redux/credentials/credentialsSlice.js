/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getCredentials, shouldUpdateCredentials, getAccountURL } from './utils'

const CREDENTIALS_SLICE_STATE_NAME = 'credentials'
const UPDATE_CREDENTIALS_ACTION = 'updateCredentials'

export const credentialsSlice = createSlice({
  name: CREDENTIALS_SLICE_STATE_NAME,
  initialState: {
    credentials: {
      userKey: process.env.NODE_ENV === 'development' ? `${process.env.REACT_APP_USERKEY}` : '',
      secretKey: process.env.NODE_ENV === 'development' ? `${process.env.REACT_APP_SECRET}` : '',
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
