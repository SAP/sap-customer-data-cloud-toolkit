import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createVersionControlInstance, handleCommitListRequestServices } from '../../services/versionControl/versionControlService'
import { getApiKey } from '../utils'
import Cookies from 'js-cookie'
import crypto from 'crypto-js'

const FETCH_COMMITS_ACTION = 'versionControl/fetchCommits'

const encryptionKey = process.env.ENCRYPTION_KEY || 'some-random-encryption-key'
const signingKey = process.env.SIGNING_KEY || 'some-random-signing-key'

const encryptData = (dataToEncrypt, key) => {
  try {
    const encryptedJsonString = crypto.AES.encrypt(JSON.stringify(dataToEncrypt), key).toString()
    return encryptedJsonString
  } catch (error) {
    console.error('Error encrypting data:', error)
    return undefined
  }
}

const signData = (data, key) => {
  try {
    return crypto.HmacSHA256(data, key).toString()
  } catch (error) {
    console.error('Error signing data:', error)
    return undefined
  }
}

const getSignedCookie = (name) => {
  const encryptedValue = Cookies.get(name)
  const signature = Cookies.get(`${name}_sig`)
  if (!encryptedValue || !signature) {
    console.error(`No ${name} found in cookies or signature is missing`)
    return undefined
  }
  const expectedSignature = signData(encryptedValue, signingKey)
  if (signature !== expectedSignature) {
    console.error(`Invalid signature for ${name}`)
    return undefined
  }
  return encryptedValue
}

export const fetchCommits = createAsyncThunk(FETCH_COMMITS_ACTION, async (_, { getState, rejectWithValue }) => {
  const state = getState()
  const credentials = state.credentials.credentials
  const apiKey = getApiKey(window.location.hash)
  const currentSite = state.copyConfigurationExtended.currentSiteInformation
  const gitToken = getSignedCookie('gitToken') // Retrieve the signed and encrypted token
  const owner = getSignedCookie('owner') // Retrieve the signed and encrypted owner

  if (!gitToken || !owner) {
    return rejectWithValue('Git token or owner is missing')
  }

  const versionControl = createVersionControlInstance(credentials, apiKey, currentSite, owner)

  try {
    const { commitList } = await handleCommitListRequestServices(versionControl, apiKey)
    return commitList
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const versionControlSlice = createSlice({
  name: 'versionControl',
  initialState: {
    commits: [],
    gitToken: getSignedCookie('gitToken') || '',
    owner: getSignedCookie('owner') || '',
    isFetching: false,
    error: null,
  },
  reducers: {
    setGitToken(state, action) {
      state.gitToken = action.payload
      const encryptedToken = encryptData(action.payload, encryptionKey)
      const signature = signData(encryptedToken, signingKey)
      if (encryptedToken && signature) {
        Cookies.set('gitToken', encryptedToken, { secure: true, sameSite: 'strict' })
        Cookies.set('gitToken_sig', signature, { secure: true, sameSite: 'strict' })
      }
    },
    setOwner(state, action) {
      state.owner = action.payload
      const encryptedOwner = encryptData(action.payload, encryptionKey)
      const signature = signData(encryptedOwner, signingKey)
      if (encryptedOwner && signature) {
        Cookies.set('owner', encryptedOwner, { secure: true, sameSite: 'strict' })
        Cookies.set('owner_sig', signature, { secure: true, sameSite: 'strict' })
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCommits.pending, (state) => {
      state.isFetching = true
      state.error = null
    })
    builder.addCase(fetchCommits.fulfilled, (state, action) => {
      state.isFetching = false
      state.commits = action.payload
    })
    builder.addCase(fetchCommits.rejected, (state, action) => {
      state.isFetching = false
      state.error = action.payload
    })
  },
})

export const { setGitToken, setOwner } = versionControlSlice.actions

export const selectCommits = (state) => state.versionControl.commits
export const selectIsFetching = (state) => state.versionControl.isFetching
export const selectGitToken = (state) => state.versionControl.gitToken
export const selectOwner = (state) => state.versionControl.owner
export const selectError = (state) => state.versionControl.error

export default versionControlSlice.reducer
