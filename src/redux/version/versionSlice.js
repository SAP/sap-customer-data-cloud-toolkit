import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import GitHubManager from '../../services/github/gitHubManager'

export const versionSlice = createSlice({
  name: 'version',
  initialState: {
    newVersion: '',
  },
  extraReducers: (builder) => {
    builder.addCase(checkNewVersion.pending, (state) => {
      state.newVersion = ''
    })
    builder.addCase(checkNewVersion.fulfilled, (state, action) => {
      state.newVersion = action.payload
    })
    builder.addCase(checkNewVersion.rejected, (state) => {
      state.newVersion = ''
    })
  },
})

export const checkNewVersion = createAsyncThunk('service/version', async (dummy, { rejectWithValue }) => {
  try {
    return await new GitHubManager().getNewReleaseAvailable()
  } catch (error) {
    rejectWithValue(error)
  }
})

export default versionSlice.reducer

export const selectNewVersion = (state) => state.version.newVersion

export const selectHasNewVersion = (state) => selectNewVersion(state) !== ''
