import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createVersionControlInstance, handleCommitListRequestServices } from '../../services/versionControl/versionControlService'
import { getApiKey } from '../utils'
import Cookies from 'js-cookie'

const FETCH_COMMITS_ACTION = 'versionControl/fetchCommits'

export const fetchCommits = createAsyncThunk(FETCH_COMMITS_ACTION, async (_, { getState, rejectWithValue }) => {
  const state = getState()
  const credentials = state.credentials.credentials
  const apiKey = getApiKey(window.location.hash)
  const currentSite = state.copyConfigurationExtended.currentSiteInformation
  const gitToken = state.versionControl.gitToken
  const owner = state.versionControl.owner

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
    gitToken: Cookies.get('gitToken') || '',
    owner: Cookies.get('owner') || '',
    isFetching: false,
    error: null,
  },
  reducers: {
    setGitToken(state, action) {
      state.gitToken = action.payload
      Cookies.set('gitToken', action.payload, { secure: true, httpOnly: true, sameSite: 'strict' })
    },
    setOwner(state, action) {
      state.owner = action.payload
      Cookies.set('owner', action.payload, { secure: true, httpOnly: true, sameSite: 'strict' })
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
