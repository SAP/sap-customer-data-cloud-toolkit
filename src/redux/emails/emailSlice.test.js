import emailReducer, { getApiKey, setIsImportPopupOpen, clearExportFile, clearErrors, getEmailTemplatesArrayBuffer, sendEmailTemplatesArrayBuffer } from './emailSlice'
import EmailManager from '../../services/emails/emailManager'
import { Buffer } from 'buffer'
import * as data from './testData'

jest.mock('../../services/emails/emailManager')

describe('Site slice test suite', () => {
  test('should return initial state', () => {
    expect(emailReducer(undefined, { type: undefined })).toEqual(data.initialState)
  })

  test('should get API Key from URL', () => {
    expect(getApiKey(data.testHash)).toEqual(data.testAPIKey)
    expect(getApiKey('')).toEqual('')
  })

  test('should set isImportPopupOpen', () => {
    const newState = emailReducer(data.initialState, setIsImportPopupOpen(true))
    expect(newState.isImportPopupOpen).toEqual(true)
  })

  test('should clear export file', () => {
    const newState = emailReducer(data.initialStateWithExportFile, clearExportFile())
    expect(newState.exportFile).toBe(undefined)
  })

  test('should clear errors', () => {
    const newState = emailReducer(data.initialStateWithErrors, clearErrors())
    expect(newState.errors).toEqual([])
  })

  test('should return a mocked array buffer', async () => {
    EmailManager.mockResolvedValueOnce(Buffer.from('test').buffer)
    const dispatch = jest.fn()
    await getEmailTemplatesArrayBuffer()(dispatch)
    expect(dispatch).toBeCalled()
  })

  test('should update isLoading while getEmailTemplatesArrayBuffer is pending', async () => {
    const action = getEmailTemplatesArrayBuffer.pending
    const newState = emailReducer(data.initialState, action)
    expect(newState.isLoading).toEqual(true)
  })

  test('should update isLoading when getEmailTemplatesArrayBuffer is rejected', async () => {
    const action = getEmailTemplatesArrayBuffer.rejected
    const newState = emailReducer(data.initialState, action)
    expect(newState.isLoading).toEqual(false)
  })

  // test('should update isLoading on fulfilled', async () => {
  //   const action = getEmailTemplatesArrayBuffer.fulfilled
  //   const newState = emailReducer(initialState, action)
  //   expect(newState.isLoading).toEqual(false)
  // })

  test('should update isLoading while sendEmailTemplatesArrayBuffer is pending', async () => {
    const action = sendEmailTemplatesArrayBuffer.pending
    const newState = emailReducer(data.initialState, action)
    expect(newState.isLoading).toEqual(true)
  })

  test('should update isLoading when sendEmailTemplatesArrayBuffer is rejected', async () => {
    const action = sendEmailTemplatesArrayBuffer.rejected
    const newState = emailReducer(data.initialState, action)
    expect(newState.isLoading).toEqual(false)
  })
})
