/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import EmailManager from '../../services/emails/emailManager'

import { getApiKey, getErrorAsArray } from '../utils'
import { ZIP_FILE_MIME_TYPE } from '../constants'
import { errorConditions } from '../errorConditions'
import { Tracker } from '../../tracker/tracker'
import { ERROR_SEVERITY_WARNING } from '../../services/errors/generateErrorResponse'

const EMAILS_SLICE_STATE_NAME = 'emails'
const EXPORT_EMAIL_TEMPLATES_FILE_NAME = 'email-templates'

const IMPORT_EMAIL_TEMPLATES_ACTION = 'service/importEmailTemplates'
const EXPORT_EMAIL_TEMPLATES_ACTION = 'service/exportEmailTemplates'
const VALIDATE_EMAIL_TEMPLATES_ACTION = 'service/validateEmailTemplates'

export const emailSlice = createSlice({
  name: EMAILS_SLICE_STATE_NAME,
  initialState: {
    exportFile: undefined,
    isLoading: false,
    errors: [],
    validationWarnings: [],
    isImportPopupOpen: false,
    showSuccessDialog: false,
    isImportFileValid: false,
    importedEmailTemplatesCount: 0,
    totalEmailTemplatesToImportCount: 0,
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
    clearValidationErrors(state) {
      state.validationWarnings = []
    },
    setIsImportFileValid(state, action) {
      state.isImportFileValid = action.payload
    },
    clearErrorCondition(state) {
      state.errorCondition = errorConditions.empty
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getEmailTemplatesArrayBuffer.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getEmailTemplatesArrayBuffer.fulfilled, (state, action) => {
      state.isLoading = false
      state.exportFile = new File([action.payload], EXPORT_EMAIL_TEMPLATES_FILE_NAME, { type: ZIP_FILE_MIME_TYPE })
      Tracker.reportUsage()
    })
    builder.addCase(getEmailTemplatesArrayBuffer.rejected, (state, action) => {
      state.isLoading = false
      state.errorCondition = errorConditions.exportError
      state.errors = action.payload
    })
    builder.addCase(sendEmailTemplatesArrayBuffer.pending, (state) => {
      state.isLoading = true
      state.importedEmailTemplatesCount = 0
      state.totalEmailTemplatesToImportCount = 0
    })
    builder.addCase(sendEmailTemplatesArrayBuffer.fulfilled, (state, action) => {
      state.isLoading = false
      const errors = action.payload.filter(({ errorCode }) => errorCode !== 0)
      if (errors.length) {
        state.errorCondition = errorConditions.importWithCountError
        state.errors = errors
        state.totalEmailTemplatesToImportCount = action.payload.length
        state.showSuccessDialog = false
      } else {
        state.importedEmailTemplatesCount = action.payload.length
        state.showSuccessDialog = true
        Tracker.reportUsage()
      }
      state.isImportPopupOpen = false
    })
    builder.addCase(sendEmailTemplatesArrayBuffer.rejected, (state, action) => {
      state.isLoading = false
      state.errorCondition = errorConditions.importWithoutCountError
      state.errors = action.payload
      state.isImportPopupOpen = false
      state.importedEmailTemplatesCount = 0
      state.totalEmailTemplatesToImportCount = 0
    })
    builder.addCase(validateEmailTemplates.fulfilled, (state) => {
      state.isLoading = false
      state.isImportFileValid = true
    })
    builder.addCase(validateEmailTemplates.rejected, (state, action) => {
      state.isLoading = false
      const warnings = action.payload.filter((error) => error.severity === ERROR_SEVERITY_WARNING)
      if (warnings.length !== 0) {
        state.validationWarnings = action.payload
      } else {
        state.errors = action.payload
      }
      state.isImportFileValid = false
    })
  },
})

export const getEmailTemplatesArrayBuffer = createAsyncThunk(EXPORT_EMAIL_TEMPLATES_ACTION, async (dummy, { getState, rejectWithValue }) => {
  try {
    const state = getState()
    return await new EmailManager({
      userKey: state.credentials.credentials.userKey,
      secret: state.credentials.credentials.secretKey,
    }).export(getApiKey(window.location.hash))
  } catch (error) {
    return rejectWithValue(getErrorAsArray(error))
  }
})

export const sendEmailTemplatesArrayBuffer = createAsyncThunk(IMPORT_EMAIL_TEMPLATES_ACTION, async (zipContent, { getState, rejectWithValue }) => {
  try {
    const state = getState()
    return await new EmailManager({
      userKey: state.credentials.credentials.userKey,
      secret: state.credentials.credentials.secretKey,
    }).import(getApiKey(window.location.hash), zipContent)
  } catch (error) {
    return rejectWithValue(getErrorAsArray(error))
  }
})

export const validateEmailTemplates = createAsyncThunk(VALIDATE_EMAIL_TEMPLATES_ACTION, async (zipContent, { getState, rejectWithValue }) => {
  try {
    const state = getState()
    return await new EmailManager({
      userKey: state.credentials.credentials.userKey,
      secret: state.credentials.credentials.secretKey,
    }).validateEmailTemplates(zipContent)
  } catch (error) {
    return rejectWithValue(getErrorAsArray(error))
  }
})

export const { setIsImportPopupOpen, clearExportFile, clearErrors, setIsImportFileValid, clearValidationErrors, clearErrorCondition } = emailSlice.actions

export default emailSlice.reducer

export const selectExportFile = (state) => state.emails.exportFile

export const selectImportFile = (state) => state.emails.importFile

export const selectIsLoading = (state) => state.emails.isLoading

export const selectErrors = (state) => state.emails.errors

export const selectIsImportPopupOpen = (state) => state.emails.isImportPopupOpen

export const selectShowSuccessDialog = (state) => state.emails.showSuccessDialog

export const selectIsImportFileValid = (state) => state.emails.isImportFileValid

export const selectValidationWarnings = (state) => state.emails.validationWarnings

export const selectImportedEmailTemplatesCount = (state) => state.emails.importedEmailTemplatesCount

export const selectTotalEmailTemplatesToImportCount = (state) => state.emails.totalEmailTemplatesToImportCount

export const selectErrorCondition = (state) => state.emails.errorCondition
