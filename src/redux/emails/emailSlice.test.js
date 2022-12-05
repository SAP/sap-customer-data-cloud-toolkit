import emailReducer, { getApiKey, getEmailTemplatesArrayBuffer } from './emailSlice'
import EmailManager from '../../services/emails/emailManager'
import { Buffer } from 'buffer'

jest.mock('../../services/emails/emailManager')

const initialState = {
  exportFile: {},
  isLoading: false,
  errors: [],
}

const testAPIKey = 'aabbccddeeffgghhiijjkk'

const testHash = `/1234567/${testAPIKey}/user-interfacing/email-templates/`

describe('Site slice test suite', () => {
  test('should return initial state', () => {
    expect(emailReducer(undefined, { type: undefined })).toEqual(initialState)
  })

  test('should get API Key from URL', () => {
    expect(getApiKey(testHash)).toEqual(testAPIKey)
    expect(getApiKey('')).toEqual('')
  })

  test('should return a mocked array buffer', async () => {
    EmailManager.mockResolvedValueOnce(Buffer.from('test').buffer)
    const dispatch = jest.fn()
    await getEmailTemplatesArrayBuffer()(dispatch)
    expect(dispatch).toBeCalled()
  })

  test('should update isLoading while pending', async () => {
    const action = getEmailTemplatesArrayBuffer.pending
    const newState = emailReducer(initialState, action)
    expect(newState.isLoading).toEqual(true)
  })

  test('should update isLoading on rejected', async () => {
    const action = getEmailTemplatesArrayBuffer.rejected
    const newState = emailReducer(initialState, action)
    expect(newState.isLoading).toEqual(false)
  })

  // test('should update isLoading on fulfilled', async () => {
  //   const action = getEmailTemplatesArrayBuffer.fulfilled
  //   const newState = emailReducer(initialState, action)
  //   expect(newState.isLoading).toEqual(false)
  // })
})
