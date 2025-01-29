import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createVersionControlInstance, handleCommitListRequestServices } from '../../services/versionControl/versionControlService'
import { getApiKey } from '../utils'
import Cookies from 'js-cookie'
import { encryptData, decryptData } from '../encryptionUtils'

const FETCH_COMMITS_ACTION = 'versionControl/fetchCommits'

export const getEncryptedCookie = (name, secretKey) => {
  const encryptedValue = Cookies.get(name)
  if (!encryptedValue) {
    console.error(`No ${name} found in cookies`)
    return undefined
  }
  const decryptedValue = decryptData(encryptedValue, secretKey)
  // console.log(`Decrypted value for ${name}: ${decryptedValue}`)
  return decryptedValue
}

const setCookies = (state) => {
  const credentials = state.credentials
  if (state.gitToken && state.owner && credentials?.secretKey) {
    const encryptedToken = encryptData(state.gitToken, credentials.secretKey)
    const encryptedOwner = encryptData(state.owner, credentials.secretKey)
    if (encryptedToken && encryptedOwner) {
      Cookies.set('gitToken', encryptedToken, { secure: true, sameSite: 'strict' })
      Cookies.set('owner', encryptedOwner, { secure: true, sameSite: 'strict' })
    }
  }
}

export const fetchCommits = createAsyncThunk(FETCH_COMMITS_ACTION, async (_, { getState, rejectWithValue }) => {
  const state = getState()
  const credentials = state.credentials.credentials
  const apiKey = getApiKey(window.location.hash)
  const currentSite = state.copyConfigurationExtended.currentSiteInformation
  const gitToken = getEncryptedCookie('gitToken', credentials.secretKey) // Retrieve the encrypted token
  const owner = getEncryptedCookie('owner', credentials.secretKey) // Retrieve the encrypted owner

  if (!gitToken || !owner) {
    return rejectWithValue('Git token or owner is missing')
  }

  const versionControl = createVersionControlInstance(credentials, apiKey, currentSite, gitToken, owner)

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
    gitToken: '',
    owner: '',
    isFetching: false,
    error: null,
  },
  reducers: {
    setGitToken(state, action) {
      state.gitToken = action.payload
      setCookies(state)
    },
    setOwner(state, action) {
      state.owner = action.payload
      setCookies(state)
    },
    setCredentials(state, action) {
      state.credentials = action.payload
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

export const { setGitToken, setOwner, setCredentials } = versionControlSlice.actions

export const selectCommits = (state) => state.versionControl.commits
export const selectIsFetching = (state) => state.versionControl.isFetching
export const selectGitToken = (state) => state.versionControl.gitToken
export const selectOwner = (state) => state.versionControl.owner
export const selectError = (state) => state.versionControl.error

export default versionControlSlice.reducer
