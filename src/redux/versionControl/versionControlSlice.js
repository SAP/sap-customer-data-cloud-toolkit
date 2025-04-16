/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import VersionControlService from '../../services/versionControl/versionControlService'
import Cookies from 'js-cookie'
import { encryptData, decryptData } from '../encryptionUtils'
import VersionControlFactory from '../../services/versionControl/versionControlManager/versionControlFactory'
import VersionControlProviderFactory from '../../services/versionControl/versionControlManager/versionControlProviderFactory'
import i18n from '../../i18n'

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
    validationError: null,
    revert: false,
    filesToUpdate: [],
    areCredentialsValid: false,
    openConfirmDialog: false,
    showErrorDialog: false,
    showSuccessDialog: false,
    successMessage: '',
    credentials: null,
  },
  reducers: {
    setGitToken(state, action) {
      state.gitToken = action.payload
      state.areCredentialsValid = false
      setCookies(state)
    },
    setOwner(state, action) {
      state.owner = action.payload
      state.areCredentialsValid = false
      setCookies(state)
    },
    setRepo(state, action) {
      state.repo = action.payload
      state.areCredentialsValid = false
      setCookies(state)
    },
    setCredentials(state, action) {
      state.credentials = action.payload
    },
    setOpenConfirmDialog(state, action) {
      state.openConfirmDialog = action.payload
    },
    setShowErrorDialog(state, action) {
      state.showErrorDialog = action.payload
    },
    setShowSuccessDialog(state, action) {
      state.showSuccessDialog = action.payload
    },
    setSuccessMessage(state, action) {
      state.successMessage = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCommits.pending, (state) => {
      state.isFetching = true
      state.error = null
    })
    builder.addCase(fetchCommits.fulfilled, (state, action) => {
      state.isFetching = false
      state.error = null
      state.commits = action.payload
    })
    builder.addCase(fetchCommits.rejected, (state, action) => {
      state.isFetching = false
      state.commits = []
      state.error = action.payload
      state.showErrorDialog = true
    })
    builder.addCase(getRevertChanges.pending, (state) => {
      state.isFetching = true
      state.error = null
    })
    builder.addCase(getRevertChanges.fulfilled, (state, action) => {
      state.isFetching = false
      state.revert = action.payload
      state.successMessage = i18n.t('VERSION_CONTROL.REVERT.SUCCESS.MESSAGE')
      state.showSuccessDialog = true
    })
    builder.addCase(getRevertChanges.rejected, (state, action) => {
      state.isFetching = false
      state.error = action.payload
      state.showErrorDialog = true
    })
    builder.addCase(createBackup.pending, (state) => {
      state.isFetching = true
      state.error = null
      state.showSuccessDialog = false
      state.showErrorDialog = false
    })
    builder.addCase(createBackup.fulfilled, (state, action) => {
      state.isFetching = false
      state.successMessage = i18n.t('VERSION_CONTROL.BACKUP.SUCCESS.MESSAGE')
      state.showSuccessDialog = true
      state.commits = action.payload
    })
    builder.addCase(createBackup.rejected, (state, action) => {
      state.isFetching = false
      state.error = action.payload
      state.showErrorDialog = true
    })
    builder.addCase(prepareFilesForUpdate.pending, (state) => {
      state.isFetching = true
      state.error = null
    })
    builder.addCase(prepareFilesForUpdate.fulfilled, (state, action) => {
      state.isFetching = false
      state.filesToUpdate = action.payload
      state.openConfirmDialog = true
    })
    builder.addCase(prepareFilesForUpdate.rejected, (state, action) => {
      state.isFetching = false
      state.error = action.payload
      state.showErrorDialog = true
    })
    builder.addCase(validateVersionControlCredentials.pending, (state) => {
      state.areCredentialsValid = false
      state.validationError = null
      state.commits = []
    })
    builder.addCase(validateVersionControlCredentials.fulfilled, (state, action) => {
      state.areCredentialsValid = action.payload
      state.validationError = null
    })
    builder.addCase(validateVersionControlCredentials.rejected, (state, action) => {
      state.areCredentialsValid = false
      state.validationError = action.payload
    })
  },
})

export const getRevertChanges = createAsyncThunk(GET_REVERT_CHANGES, async (sha, { getState, rejectWithValue }) => {
  const state = getState()
  const { credentials, apiKey, currentSiteInfo, currentDataCenter, versionControl } = getCommonData(state)
  try {
    return await new VersionControlService(credentials, apiKey, versionControl, currentDataCenter, currentSiteInfo).revertBackup(sha)
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const createBackup = createAsyncThunk(GET_SERVICES_ACTION, async (commitMessage, { getState, rejectWithValue }) => {
  const state = getState()
  const { credentials, apiKey, currentSiteInfo, currentDataCenter, versionControl } = getCommonData(state)
  try {
    const commitList = await new VersionControlService(credentials, apiKey, versionControl, currentDataCenter, currentSiteInfo).createBackup(commitMessage)
    return commitList.filter((commit) => commit.parents.length > 0)
  } catch (error) {
    return rejectWithValue(error.messages)
  }
})

export const getEncryptedCookie = (name, secretKey) => {
  const encryptedValue = Cookies.get(name)
  if (!encryptedValue) {
    console.error(`No ${name} found in cookies`)
    return undefined
  }
  return decryptData(encryptedValue, secretKey)
}
const getCommonData = (state) => {
  const credentials = {
    userKey: state.credentials.credentials.userKey,
    secret: state.credentials.credentials.secretKey,
    gigyaConsole: state.credentials.credentials.gigyaConsole,
  }
  const apiKey = state.copyConfigurationExtended.currentSiteApiKey
  const currentSiteInfo = state.copyConfigurationExtended.currentSiteInformation
  const currentDataCenter = currentSiteInfo.dataCenter
  const gitToken = getEncryptedCookie('gitToken', credentials.secret)
  const owner = getEncryptedCookie('owner', credentials.secret)
  const repo = Cookies.get('repo')
  const versionControlProviderFactory = VersionControlProviderFactory.getVersionControlProviderFactory('github', gitToken)
  const versionControl = VersionControlFactory.getVersionControlFactory('github', versionControlProviderFactory, owner, repo)
  if (!gitToken || !owner) {
    throw new Error('Git token or owner is missing')
  }

  return { credentials, apiKey, currentSiteInfo, currentDataCenter, versionControl }
}

export const validateVersionControlCredentials = createAsyncThunk('versionControl/validateVersionControlCredentials', async (_, { getState, rejectWithValue }) => {
  const state = getState()
  const { versionControl } = getCommonData(state)

  try {
    const areCredentialsValid = await versionControl.validateVersionControlCredentials()
    if(!areCredentialsValid) {
      return rejectWithValue(i18n.t('VERSION_CONTROL.INVALID_CREDENTIALS'))
    } else {
      return true
    }
  } catch (error) {
    return rejectWithValue(i18n.t('VERSION_CONTROL.REPOSITORY_ERROR_MESSAGE'))
  }
})

export const fetchCommits = createAsyncThunk(FETCH_COMMITS_ACTION, async (_, { getState, rejectWithValue }) => {
  const state = getState()
  try {
    const { credentials, apiKey, currentSiteInfo, currentDataCenter, versionControl } = getCommonData(state)
    const { commitList } = await new VersionControlService(credentials, apiKey, versionControl, currentDataCenter, currentSiteInfo).getCommitsFromBranch()
    return commitList.filter((commit) => commit.parents.length > 0)
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const prepareFilesForUpdate = createAsyncThunk(PREPARE_FILES_FOR_UPDATE_ACTION, async (_, { getState, rejectWithValue }) => {
  const state = getState()
  try {
    const { credentials, apiKey, currentSiteInfo, currentDataCenter, versionControl } = getCommonData(state)
    return await new VersionControlService(credentials, apiKey, versionControl, currentDataCenter, currentSiteInfo).getFilesForBackup()
  } catch (error) {
    return rejectWithValue(i18n.t('VERSION_CONTROL.BACKUP.ERROR.MESSAGE'))
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
  Cookies.set('repo', state.repo, { secure: true, sameSite: 'strict' })
}

export const { setGitToken, setOwner, setRepo, setCredentials, clearCommits, setOpenConfirmDialog, setShowErrorDialog, setShowSuccessDialog, setSuccessMessage } =
  versionControlSlice.actions

export const selectCommits = (state) => state.versionControl.commits
export const selectIsFetching = (state) => state.versionControl.isFetching
export const selectGitToken = (state) => state.versionControl.gitToken
export const selectOwner = (state) => state.versionControl.owner
export const selectRepo = (state) => state.versionControl.repo
export const selectError = (state) => state.versionControl.error
export const selectFilesToUpdate = (state) => state.versionControl.filesToUpdate
export const selectValidationError = (state) => state.versionControl.validationError
export const selectOpenConfirmDialog = (state) => state.versionControl.openConfirmDialog
export const selectShowErrorDialog = (state) => state.versionControl.showErrorDialog
export const selectShowSuccessDialog = (state) => state.versionControl.showSuccessDialog
export const selectSuccessMessage = (state) => state.versionControl.successMessage
export const selectAreCredentialsValid = (state) => state.versionControl.areCredentialsValid

export default versionControlSlice.reducer
