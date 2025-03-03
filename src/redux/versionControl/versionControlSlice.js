/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import VersionControlService from '../../services/versionControl/versionControlService'
import { getApiKey, getErrorAsArray } from '../utils'
import Cookies from 'js-cookie'
import { encryptData, decryptData } from '../encryptionUtils'
import VersionControlFactory from '../../services/versionControl/versionControlManager/versionControlFactory'

const VERSION_CONTROL_STATE_NAME = 'versionControl'
const FETCH_COMMITS_ACTION = `${VERSION_CONTROL_STATE_NAME}/fetchCommits`
const GET_SERVICES_ACTION = `${VERSION_CONTROL_STATE_NAME}/getServices`
const PREPARE_FILES_FOR_UPDATE_ACTION = `${VERSION_CONTROL_STATE_NAME}/prepareFilesForUpdate`
const GET_REVERT_CHANGES = `${VERSION_CONTROL_STATE_NAME}/revertChanges`
const versionControlSlice = createSlice({
  name: 'versionControl',
  initialState: {
    commits: [],
    gitToken: '',
    owner: '',
    repo: '',
    isFetching: false,
    error: null,
    revert: false,
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
    setRepo(state, action) {
      state.repo = action.payload
      setCookies(state)
    },
    setCredentials(state, action) {
      state.credentials = action.payload
    },
    clearCommits(state) {
      state.commits = []
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
    builder.addCase(getRevertChanges.pending, (state) => {
      state.isFetching = true
      state.error = null
    })
    builder.addCase(getRevertChanges.fulfilled, (state, action) => {
      state.isFetching = false
      state.revert = action.payload
    })
    builder.addCase(getRevertChanges.rejected, (state, action) => {
      state.isFetching = false
      state.error = action.payload
    })
    builder.addCase(getServices.pending, (state) => {
      state.isFetching = true
      state.error = null
    })
    builder.addCase(getServices.fulfilled, (state, action) => {
      state.isFetching = false
      state.revert = action.payload
    })
    builder.addCase(getServices.rejected, (state, action) => {
      state.isFetching = false
      state.error = action.payload
    })
    builder.addCase(prepareFilesForUpdate.pending, (state) => {
      state.isFetching = true
      state.error = null
    })
    builder.addCase(prepareFilesForUpdate.fulfilled, (state, action) => {
      state.isFetching = false
      state.revert = action.payload
    })
    builder.addCase(prepareFilesForUpdate.rejected, (state, action) => {
      state.isFetching = false
      state.error = action.payload
    })
  },
})

export const getRevertChanges = createAsyncThunk(GET_REVERT_CHANGES, async (sha, { getState, rejectWithValue }) => {
  const state = getState()
  const credentials = { userKey: state.credentials.credentials.userKey, secret: state.credentials.credentials.secretKey, gigyaConsole: state.credentials.credentials.gigyaConsole }
  const currentSiteApiKey = state.copyConfigurationExtended.currentSiteApiKey
  const currentSiteInfo = state.copyConfigurationExtended.currentSiteInformation
  const currentDataCenter = currentSiteInfo.dataCenter
  const gitToken = getEncryptedCookie('gitToken', credentials.secret)
  const owner = getEncryptedCookie('owner', credentials.secret)
  const repo = Cookies.get('repo')
  const versionControl = VersionControlFactory.getVersionControlFactory('github', gitToken, owner, repo)
  try {
    return await new VersionControlService(credentials, currentSiteApiKey, versionControl, currentDataCenter, currentSiteInfo).handleCommitRevertServices(sha)
  } catch (error) {
    return rejectWithValue(getErrorAsArray(error))
  }
})
export const getServices = createAsyncThunk(GET_SERVICES_ACTION, async (commitMessage, { getState, rejectWithValue }) => {
  const state = getState()
  const credentials = { userKey: state.credentials.credentials.userKey, secret: state.credentials.credentials.secretKey, gigyaConsole: state.credentials.credentials.gigyaConsole }
  const currentSiteApiKey = state.copyConfigurationExtended.currentSiteApiKey
  const currentSiteInfo = state.copyConfigurationExtended.currentSiteInformation
  const currentDataCenter = currentSiteInfo.dataCenter
  const gitToken = getEncryptedCookie('gitToken', credentials.secret)
  const owner = getEncryptedCookie('owner', credentials.secret)
  const repo = Cookies.get('repo')
  const versionControl = VersionControlFactory.getVersionControlFactory('github', gitToken, owner, repo)
  try {
    return await new VersionControlService(credentials, currentSiteApiKey, versionControl, currentDataCenter, currentSiteInfo).handleGetServices(commitMessage)
  } catch (error) {
    return rejectWithValue(getErrorAsArray(error))
  }
})

export const getEncryptedCookie = (name, secretKey) => {
  const encryptedValue = Cookies.get(name)
  if (!encryptedValue) {
    console.error(`No ${name} found in cookies`)
    return undefined
  }
  const decryptedValue = decryptData(encryptedValue, secretKey)
  return decryptedValue
}
const getCommonData = (state) => {
  const credentials = {
    userKey: state.credentials.credentials.userKey,
    secret: state.credentials.credentials.secretKey,
    gigyaConsole: state.credentials.credentials.gigyaConsole,
  }
  const apiKey = getApiKey(window.location.hash)
  const currentSiteInfo = state.copyConfigurationExtended.currentSiteInformation
  const currentDataCenter = currentSiteInfo.dataCenter
  const gitToken = getEncryptedCookie('gitToken', credentials.secret) // Retrieve the encrypted token
  const owner = getEncryptedCookie('owner', credentials.secret) // Retrieve the encrypted owner
  const repo = Cookies.get('repo')
  const versionControl = VersionControlFactory.getVersionControlFactory('github', gitToken, owner, repo)

  if (!gitToken || !owner) {
    throw new Error('Git token or owner is missing')
  }

  return { credentials, apiKey, currentSiteInfo, currentDataCenter, versionControl }
}

export const fetchCommits = createAsyncThunk(FETCH_COMMITS_ACTION, async (_, { getState, rejectWithValue }) => {
  const state = getState()
  try {
    const { credentials, apiKey, currentSiteInfo, currentDataCenter, versionControl } = getCommonData(state)
    const { commitList } = await new VersionControlService(credentials, apiKey, versionControl, currentDataCenter, currentSiteInfo).handleCommitListRequestServices()
    return commitList.filter((commit) => commit.parents.length > 0)
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const prepareFilesForUpdate = createAsyncThunk(PREPARE_FILES_FOR_UPDATE_ACTION, async (_, { getState, rejectWithValue }) => {
  const state = getState()
  try {
    const { credentials, apiKey, currentSiteInfo, currentDataCenter, versionControl } = getCommonData(state)
    return await new VersionControlService(credentials, apiKey, versionControl, currentDataCenter, currentSiteInfo).prepareFilesForUpdate()
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const setCookies = (state) => {
  const credentials = state.credentials
  if (state.gitToken && state.owner && state.repo && credentials?.secretKey) {
    const encryptedToken = encryptData(state.gitToken, credentials.secretKey)
    const encryptedOwner = encryptData(state.owner, credentials.secretKey)
    if (encryptedToken && encryptedOwner) {
      Cookies.set('gitToken', encryptedToken, { secure: true, sameSite: 'strict' })
      Cookies.set('owner', encryptedOwner, { secure: true, sameSite: 'strict' })
    }
  }
  Cookies.set('repo', state.repo, { secure: true, sameSite: 'strict' }) // Set repo cookie without encryption
}

export const { setGitToken, setOwner, setRepo, setCredentials, clearCommits } = versionControlSlice.actions

export const selectCommits = (state) => state.versionControl.commits
export const selectIsFetching = (state) => state.versionControl.isFetching
export const selectGitToken = (state) => state.versionControl.gitToken
export const selectOwner = (state) => state.versionControl.owner
export const selectRepo = (state) => state.versionControl.repo
export const selectError = (state) => state.versionControl.error

export default versionControlSlice.reducer
