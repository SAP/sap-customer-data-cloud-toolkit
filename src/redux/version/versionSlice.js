import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import GitHubManager from '../../services/github/gitHubManager'

export const versionSlice = createSlice({
  name: 'version',
  initialState: {
    isNewReleaseAvailable: false,
    latestReleaseUrl: '',
    latestReleaseVersion: '',
  },
  extraReducers: (builder) => {
    builder.addCase(checkNewVersion.pending, (state) => {
      clearState(state)
    })
    builder.addCase(checkNewVersion.fulfilled, (state, action) => {
      fillState(state, action.payload)
    })
    builder.addCase(checkNewVersion.rejected, (state) => {
      clearState(state)
    })
  },
})

const fillState = (state, versionData) => {
  state.isNewReleaseAvailable = versionData.isNewReleaseAvailable
  state.latestReleaseVersion = versionData.latestReleaseVersion
  state.latestReleaseUrl = versionData.latestReleaseUrl
}

const clearState = (state) => {
  state.isNewReleaseAvailable = false
  state.latestReleaseVersion = ''
  state.latestReleaseUrl = ''
}

export const checkNewVersion = createAsyncThunk('service/version', async (dummy, { rejectWithValue }) => {
  try {
    return await new GitHubManager().getNewReleaseAvailable()
  } catch (error) {
    rejectWithValue(error)
  }
})

export default versionSlice.reducer

export const selectIsNewReleaseAvailable = (state) => state.version.isNewReleaseAvailable

export const selectLatestReleaseVersion = (state) => state.version.latestReleaseVersion

export const selectLatestReleaseUrl = (state) => state.version.latestReleaseUrl
