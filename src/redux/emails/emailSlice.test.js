import emailReducer, {
  setIsImportPopupOpen,
  clearExportFile,
  clearErrors,
  getEmailTemplatesArrayBuffer,
  sendEmailTemplatesArrayBuffer,
  setIsImportFileValid,
  validateEmailTemplates,
  clearValidationErrors,
  clearErrorCondition,
} from './emailSlice'

import EmailManager from '../../services/emails/emailManager'
import { Buffer } from 'buffer'
import * as data from './dataTest'
import { errorConditions } from '../errorConditions'
import { Tracker } from '../../tracker/tracker'

jest.mock('../../services/emails/emailManager')

describe('Email slice test suite', () => {
  let tracker

  beforeEach(() => {
    tracker = jest.spyOn(Tracker, 'reportUsage')
  })

  test('should return initial state', () => {
    expect(emailReducer(undefined, { type: undefined })).toEqual(data.initialState)
  })

  test('should set isImportPopupOpen', () => {
    const newState = emailReducer(data.initialState, setIsImportPopupOpen(true))
    expect(newState.isImportPopupOpen).toEqual(true)
  })

  test('should set isImportFileValid', () => {
    const newState = emailReducer(data.initialState, setIsImportFileValid(true))
    expect(newState.isImportFileValid).toEqual(true)
  })

  test('should clear export file', () => {
    const newState = emailReducer(data.initialStateWithExportFile, clearExportFile())
    expect(newState.exportFile).toBe(undefined)
  })

  test('should clear errors', () => {
    const newState = emailReducer(data.initialStateWithErrors, clearErrors())
    expect(newState.errors).toEqual([])
  })

  test('should clear validation errors', () => {
    const newState = emailReducer(data.initialStateWithErrors, clearValidationErrors())
    expect(newState.validationWarnings).toEqual([])
  })

  test('should clear error condition', () => {
    const newState = emailReducer(data.initialStateWithErrors, clearErrorCondition())
    expect(newState.errorCondition).toEqual(errorConditions.empty)
  })

  test('should return a mocked array buffer', async () => {
    EmailManager.mockResolvedValueOnce(Buffer.from('test').buffer)
    const dispatch = jest.fn()
    await getEmailTemplatesArrayBuffer()(dispatch)
    expect(dispatch).toBeCalled()
    //expect(tracker).toHaveBeenCalled() can't verify because the caller is being mocked due to the File object
  })

  test('should update isLoading while getEmailTemplatesArrayBuffer is pending', async () => {
    const action = getEmailTemplatesArrayBuffer.pending
    const newState = emailReducer(data.initialState, action)
    expect(newState.isLoading).toEqual(true)
    expect(tracker).not.toHaveBeenCalled()
  })

  test('should update state when getEmailTemplatesArrayBuffer is rejected', async () => {
    const action = getEmailTemplatesArrayBuffer.rejected
    const newState = emailReducer(data.initialState, action)
    expect(newState.isLoading).toEqual(false)
    expect(newState.errorCondition).toEqual(errorConditions.exportError)
    expect(tracker).not.toHaveBeenCalled()
  })

  test('should update state while sendEmailTemplatesArrayBuffer is pending', () => {
    const action = sendEmailTemplatesArrayBuffer.pending
    const newState = emailReducer(data.initialState, action)
    expect(newState.isLoading).toEqual(true)
    expect(newState.importedEmailTemplatesCount).toEqual(0)
    expect(newState.totalEmailTemplatesToImportCount).toEqual(0)
    expect(tracker).not.toHaveBeenCalled()
  })

  test('should update state when sendEmailTemplatesArrayBuffer is rejected', () => {
    const action = sendEmailTemplatesArrayBuffer.rejected
    const newState = emailReducer(data.initialState, action)
    expect(newState.isLoading).toEqual(false)
    expect(newState.isImportPopupOpen).toEqual(false)
    expect(newState.errorCondition).toEqual(errorConditions.importWithoutCountError)
    expect(newState.importedEmailTemplatesCount).toEqual(0)
    expect(newState.totalEmailTemplatesToImportCount).toEqual(0)
    expect(tracker).not.toHaveBeenCalled()
  })

  test('should update state when sendEmailTemplatesArrayBuffer is fullfilled with errors', () => {
    const action = sendEmailTemplatesArrayBuffer.fulfilled(data.payloadWithErrors.payload)
    const newState = emailReducer(data.initialState, action)
    expect(newState.isLoading).toEqual(false)
    expect(newState.errors).toEqual(data.payloadWithErrors.payload)
    expect(newState.isImportPopupOpen).toEqual(false)
    expect(newState.showSuccessDialog).toEqual(false)
    expect(newState.totalEmailTemplatesToImportCount).toEqual(1)
    expect(newState.errorCondition).toEqual(errorConditions.importWithCountError)
    expect(tracker).not.toHaveBeenCalled()
  })

  test('should update state when sendEmailTemplatesArrayBuffer is fullfilled without errors', () => {
    const action = sendEmailTemplatesArrayBuffer.fulfilled(data.payloadWithoutErrors.payload)
    const newState = emailReducer(data.initialState, action)
    expect(newState.isLoading).toEqual(false)
    expect(newState.errors).toEqual([])
    expect(newState.isImportPopupOpen).toEqual(false)
    expect(newState.showSuccessDialog).toEqual(true)
    expect(tracker).toHaveBeenCalled()
  })

  test('should update state when validateEmailTemplates is fullfilled', () => {
    const action = validateEmailTemplates.fulfilled()
    const newState = emailReducer(data.initialState, action)
    expect(newState.isLoading).toEqual(false)
    expect(newState.isImportFileValid).toEqual(true)
    expect(tracker).not.toHaveBeenCalled()
  })

  test('should update state when validateEmailTemplates is rejected', () => {
    const action = validateEmailTemplates.rejected('', '', '', data.payloadWithErrors.payload) // payload must be the 4th argument
    const newState = emailReducer(data.initialState, action)
    expect(newState.isLoading).toEqual(false)
    expect(newState.isImportPopupOpen).toEqual(false)
    expect(newState.isImportFileValid).toEqual(false)
    expect(tracker).not.toHaveBeenCalled()
  })
})
