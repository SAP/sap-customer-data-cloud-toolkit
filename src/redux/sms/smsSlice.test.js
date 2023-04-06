import smsReducer, { setIsImportPopupOpen, clearExportFile, clearErrors, getSmsTemplatesArrayBuffer, sendSmsTemplatesArrayBuffer, clearErrorCondition } from './smsSlice'
import SmsManager from '../../services/sms/smsManager'
import { Buffer } from 'buffer'
import * as data from './dataTest'
import { errorConditions } from '../errorConditions'
import { Tracker } from '../../tracker/tracker'

jest.mock('../../services/sms/smsManager')

describe('Site slice test suite', () => {
  let tracker

  beforeEach(() => {
    tracker = jest.spyOn(Tracker, 'reportUsage')
  })

  test('should return initial state', () => {
    expect(smsReducer(undefined, { type: undefined })).toEqual(data.initialState)
  })

  test('should set isImportPopupOpen', () => {
    const newState = smsReducer(data.initialState, setIsImportPopupOpen(true))
    expect(newState.isImportPopupOpen).toEqual(true)
  })

  test('should clear export file', () => {
    const newState = smsReducer(data.initialStateWithExportFile, clearExportFile())
    expect(newState.exportFile).toBe(undefined)
  })

  test('should clear errors', () => {
    const newState = smsReducer(data.initialStateWithErrors, clearErrors())
    expect(newState.errors).toEqual([])
  })

  test('should clear error condition', () => {
    const newState = smsReducer(data.initialStateWithErrors, clearErrorCondition())
    expect(newState.errorCondition).toEqual(errorConditions.empty)
  })

  test('should return a mocked array buffer', async () => {
    SmsManager.mockResolvedValueOnce(Buffer.from('test').buffer)
    const dispatch = jest.fn()
    await getSmsTemplatesArrayBuffer()(dispatch)
    expect(dispatch).toBeCalled()
    //expect(tracker).toHaveBeenCalled() can't verify because the caller is being mocked due to the File object
  })

  test('should update isLoading while getSmsTemplatesArrayBuffer is pending', async () => {
    const action = getSmsTemplatesArrayBuffer.pending
    const newState = smsReducer(data.initialState, action)
    expect(newState.isLoading).toEqual(true)
    expect(tracker).not.toHaveBeenCalled()
  })

  test('should update state when getSmsTemplatesArrayBuffer is rejected', async () => {
    const action = getSmsTemplatesArrayBuffer.rejected
    const newState = smsReducer(data.initialState, action)
    expect(newState.isLoading).toEqual(false)
    expect(newState.errorCondition).toEqual(errorConditions.exportError)
    expect(tracker).not.toHaveBeenCalled()
  })

  test('should update state while sendSmsTemplatesArrayBuffer is pending', () => {
    const action = sendSmsTemplatesArrayBuffer.pending
    const newState = smsReducer(data.initialState, action)
    expect(newState.isLoading).toEqual(true)
    expect(tracker).not.toHaveBeenCalled()
  })

  test('should update state when sendSmsTemplatesArrayBuffer is rejected', () => {
    const action = sendSmsTemplatesArrayBuffer.rejected
    const newState = smsReducer(data.initialState, action)
    expect(newState.isLoading).toEqual(false)
    expect(newState.isImportPopupOpen).toEqual(false)
    expect(newState.errorCondition).toEqual(errorConditions.importWithoutCountError)
    expect(tracker).not.toHaveBeenCalled()
  })

  test('should update state when sendSmsTemplatesArrayBuffer is fullfilled with errors', () => {
    const action = sendSmsTemplatesArrayBuffer.fulfilled(data.payloadWithErrors.payload)
    const newState = smsReducer(data.initialState, action)
    expect(newState.isLoading).toEqual(false)
    expect(newState.errors).toEqual(data.payloadWithErrors.payload)
    expect(newState.isImportPopupOpen).toEqual(false)
    expect(newState.showSuccessDialog).toEqual(false)
    expect(newState.errorCondition).toEqual(errorConditions.importWithoutCountError)
    expect(tracker).not.toHaveBeenCalled()
  })

  test('should update state when sendSmsTemplatesArrayBuffer is fullfilled without errors', () => {
    const action = sendSmsTemplatesArrayBuffer.fulfilled(data.payloadWithoutErrors.payload)
    const newState = smsReducer(data.initialState, action)
    expect(newState.isLoading).toEqual(false)
    expect(newState.errors).toEqual([])
    expect(newState.isImportPopupOpen).toEqual(false)
    expect(newState.showSuccessDialog).toEqual(true)
    expect(tracker).toHaveBeenCalled()
  })
})
