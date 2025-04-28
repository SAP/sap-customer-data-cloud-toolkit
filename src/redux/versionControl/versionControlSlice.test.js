/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import Cookies from 'js-cookie'
import reducer, {
  setGitToken,
  setOwner,
  fetchCommits,
  selectCommits,
  selectIsFetching,
  selectGitToken,
  selectOwner,
  selectErrors,
  getEncryptedCookie,
  revertBackup,
  createBackup,
  prepareFilesForUpdate,
  validateVersionControlCredentials,
} from './versionControlSlice'

jest.mock('js-cookie', () => ({
  set: jest.fn(),
  get: jest.fn(),
}))

jest.mock('../../services/versionControl/versionControlService')

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('versionControlSlice', () => {
  const originalWindow = { ...global.window }
  const credentials = { secretKey: 'testSecretKey' }
  const initialState = {
    credentials: { credentials },
    copyConfigurationExtended: { currentSiteInformation: { dataCenter: 'testDataCenter' } },
    versionControl: {
      commits: [],
      gitToken: '',
      owner: '',
      isFetching: false,
      errors: [],
      repo: '',
      revert: false,
      filesToUpdate: [],
      isValidCredentials: null,
      validationError: null,
    },
  }

  beforeAll(() => {
    if (typeof global.window === 'undefined') {
      global.window = {}
    }
    global.window.location = {
      hash: '',
    }
  })

  afterAll(() => {
    global.window = originalWindow
  })

  describe('reducers', () => {
    it('should handle initial state', () => {
      const state = reducer(undefined, {})
      expect(state).toEqual({
        commits: [],
        gitToken: '',
        owner: '',
        isFetching: false,
        errors: [],
        repo: '',
        revert: false,
        filesToUpdate: [],
        areCredentialsValid: false,
        openConfirmDialog: false,
        showErrorDialog: false,
        showSuccessDialog: false,
        successMessage: '',
        validationError: null,
        credentials: null,
      })
    })

    it('should handle setGitToken', () => {
      const token = 'testToken'
      const state = reducer(initialState.versionControl, setGitToken(token))
      expect(state.gitToken).toEqual(token)
    })

    it('should handle setOwner', () => {
      const owner = 'testOwner'
      const state = reducer(initialState.versionControl, setOwner(owner))
      expect(state.owner).toEqual(owner)
    })

    it('should update state to fetching when fetching commits', async () => {
      const store = mockStore({ ...initialState, versionControl: { ...initialState.versionControl } })
      await store.dispatch(fetchCommits())

      const actions = store.getActions()
      expect(actions[0].type).toBe(fetchCommits.pending.type)

      const expectedState = { ...initialState.versionControl, isFetching: true, errors: [] }
      const state = reducer(initialState.versionControl, actions[0])
      expect(state).toEqual(expectedState)
    })
    it('should update state to revert when reverting changes', async () => {
      const store = mockStore({ ...initialState, versionControl: { ...initialState.versionControl } })
      await store.dispatch(revertBackup('testSha'))
      const actions = store.getActions()
      expect(actions[0].type).toBe(revertBackup.pending.type)

      const expectedState = { ...initialState.versionControl, isFetching: true, errors: [] }
      const state = reducer(initialState.versionControl, actions[0])
      expect(state).toEqual(expectedState)
    })
    it('should update state when getting services', async () => {
      const store = mockStore({ ...initialState, versionControl: { ...initialState.versionControl } })
      await store.dispatch(createBackup('test message'))
      const actions = store.getActions()
      expect(actions[0].type).toBe(createBackup.pending.type)

      const expectedState = { ...initialState.versionControl, isFetching: true, errors: [], showErrorDialog: false, showSuccessDialog: false }
      const state = reducer(initialState.versionControl, actions[0])
      expect(state).toEqual(expectedState)
    })

    it('should update state with commits on fetchCommits fulfilled', () => {
      const action = { type: fetchCommits.fulfilled.type, payload: ['commit1'] }
      const state = reducer({ ...initialState.versionControl, isFetching: true }, action)
      expect(state).toEqual({ ...initialState.versionControl, isFetching: false, commits: action.payload })
    })

    it('should handle error state when rejected', () => {
      const action = { type: fetchCommits.rejected.type, payload: 'Some error' }
      const state = reducer(initialState.versionControl, action)
      expect(state).toEqual({ ...initialState.versionControl, isFetching: false, errors: action.payload, showErrorDialog: true })
    })
    it('should update state with areCredentialsValid as false and set the error', () => {
      const action = { type: validateVersionControlCredentials.rejected.type, payload: 'Invalid credentials' }
      const state = reducer(initialState.versionControl, action)

      expect(state.areCredentialsValid).toBe(false)
      expect(state.validationError).toBe('Invalid credentials')
    })
  })

  describe('selectors', () => {
    const state = {
      versionControl: {
        commits: ['commit1', 'commit2'],
        gitToken: 'testToken',
        owner: 'testOwner',
        isFetching: true,
        errors: ['testError'],
      },
    }

    it('should select commits', () => {
      expect(selectCommits(state)).toEqual(['commit1', 'commit2'])
    })

    it('should select isFetching', () => {
      expect(selectIsFetching(state)).toEqual(true)
    })

    it('should select gitToken', () => {
      expect(selectGitToken(state)).toEqual('testToken')
    })

    it('should select owner', () => {
      expect(selectOwner(state)).toEqual('testOwner')
    })

    it('should select error', () => {
      expect(selectErrors(state)).toEqual(['testError'])
    })
  })

  describe('setCookiesForGitData', () => {
    it('should set encrypted cookies for gitToken and owner', () => {
      const state = {
        gitToken: 'testToken',
        owner: 'testOwner',
        credentials: { secretKey: 'testSecretKey' },
        repo: 'testRepo',
      }
      reducer(state, setGitToken(state.gitToken))
      reducer(state, setOwner(state.owner))
      expect(Cookies.set).toHaveBeenCalledWith('gitToken', expect.any(String), { secure: true, sameSite: 'strict' })
      expect(Cookies.set).toHaveBeenCalledWith('owner', expect.any(String), { secure: true, sameSite: 'strict' })
    })
  })

  describe('errorHandlingForCookies', () => {
    it('should log an error and return undefined for missing cookies', () => {
      console.error = jest.fn()

      const name = 'missingCookie'
      const encryptedValue = undefined

      Cookies.get.mockReturnValueOnce(encryptedValue)

      const result = getEncryptedCookie(name, 'testSecretKey')
      expect(console.error).toHaveBeenCalledWith(`No ${name} found in cookies`)
      expect(result).toBeUndefined()
    })
  })
  describe('Async thunk', () => {
    it('should update state when getRevertChanges is fulfilled', async () => {
      const action = revertBackup.fulfilled(true)
      const newState = reducer(initialState, action)
      expect(newState.revert).toEqual(true)
      expect(newState.isFetching).toEqual(false)
    })
    it('should update state when getRevertChanges is pending', async () => {
      const action = revertBackup.pending
      const newState = reducer(initialState, action)
      expect(newState.isFetching).toEqual(true)
      expect(newState.errors).toEqual([])
      expect(newState.versionControl.commits.length).toEqual(0)
    })
    it('should update state when getRevertChanges is rejected', async () => {
      const action = revertBackup.rejected('', '', '', 'Failed to revert configurations')
      const newState = reducer(initialState, action)
      expect(newState.errors).toEqual('Failed to revert configurations')
      expect(newState.isFetching).toEqual(false)
    })
    it('should update state when fetchCommits is fulfilled', async () => {
      const commits = [
        {
          login: 'testOwner',
          id: 48961605,

          site_admin: false,
        },
      ]
      const action = fetchCommits.fulfilled(commits)
      const newState = reducer(initialState, action)
      expect(newState.commits[0].login).toEqual('testOwner')
      expect(newState.isFetching).toEqual(false)
    })
    it('should update state when fetchCommits is pending', async () => {
      const action = fetchCommits.pending
      const newState = reducer(initialState, action)
      expect(newState.isFetching).toEqual(true)
      expect(newState.errors).toEqual([])
      expect(newState.versionControl.commits.length).toEqual(0)
    })

    it('should update state when fetchCommits is rejected', async () => {
      const action = fetchCommits.rejected('', '', '', 'Failed to fetch commits for branch: testApiKey')
      const newState = reducer(initialState, action)
      expect(newState.errors).toEqual(`Failed to fetch commits for branch: testApiKey`)
      expect(newState.isFetching).toEqual(false)
    })
    it('should update state when getServices is fulfilled', async () => {
      const action = createBackup.fulfilled(true)
      const newState = reducer(initialState, action)
      expect(newState.isFetching).toEqual(false)
    })
    it('should update state when getServices is pending', async () => {
      const action = createBackup.pending
      const newState = reducer(initialState, action)
      expect(newState.isFetching).toEqual(true)
      expect(newState.errors).toEqual([])
      expect(newState.versionControl.commits.length).toEqual(0)
    })
    it('should update state when getServices is rejected', async () => {
      const action = createBackup.rejected('', '', '', 'Failed to get services')
      const newState = reducer(initialState, action)
      expect(newState.errors).toEqual('Failed to get services')
      expect(newState.isFetching).toEqual(false)
    })
    it('should update state when prepareFilesForUpdate is fulfilled', async () => {
      const formattedFiles = ['Dataflow', 'WebSdk']
      const action = prepareFilesForUpdate.fulfilled(formattedFiles)
      const newState = reducer(initialState, action)
      expect(newState.isFetching).toEqual(false)
    })

    it('should update state when prepareFilesForUpdate is pending', async () => {
      const action = prepareFilesForUpdate.pending
      const newState = reducer(initialState, action)
      expect(newState.isFetching).toEqual(true)
      expect(newState.errors).toEqual([])
      expect(newState.versionControl.commits.length).toEqual(0)
    })

    it('should update state when prepareFilesForUpdate is rejected', async () => {
      const action = prepareFilesForUpdate.rejected('', '', '', 'Failed to prepare files')
      const newState = reducer(initialState, action)
      expect(newState.errors).toEqual('Failed to prepare files')
      expect(newState.isFetching).toEqual(false)
    })
  })
})
