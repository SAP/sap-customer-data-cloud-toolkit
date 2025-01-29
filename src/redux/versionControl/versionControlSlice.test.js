/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import Cookies from 'js-cookie'
import crypto from 'crypto-js'
import reducer, { setGitToken, setOwner, fetchCommits, selectCommits, selectIsFetching, selectGitToken, selectOwner, selectError, getEncryptedCookie } from './versionControlSlice'
import { handleCommitListRequestServices } from '../../services/versionControl/versionControlService'
import { encryptData } from '../encryptionUtils'

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
  const encryptionKey = credentials.secretKey
  const initialState = {
    credentials: { credentials },
    copyConfigurationExtended: { currentSiteInformation: { dataCenter: 'testDataCenter' } },
    versionControl: {
      commits: [],
      gitToken: '',
      owner: '',
      isFetching: false,
      error: null,
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

  const encryptData = (dataToEncrypt, key) => {
    try {
      return crypto.AES.encrypt(JSON.stringify(dataToEncrypt), key).toString()
    } catch (error) {
      console.error('Error encrypting data:', error)
      return undefined
    }
  }

  describe('reducers', () => {
    it('should handle initial state', () => {
      const state = reducer(undefined, {})
      expect(state).toEqual({
        commits: [],
        gitToken: '',
        owner: '',
        isFetching: false,
        error: null,
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

      const expectedState = { ...initialState.versionControl, isFetching: true, error: null }
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
      expect(state).toEqual({ ...initialState.versionControl, isFetching: false, error: action.payload })
    })
  })

  describe('selectors', () => {
    const state = {
      versionControl: {
        commits: ['commit1', 'commit2'],
        gitToken: 'testToken',
        owner: 'testOwner',
        isFetching: true,
        error: 'testError',
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
      expect(selectError(state)).toEqual('testError')
    })
  })

  describe('async thunk fetchCommits', () => {
    const credentials = { secretKey: 'testSecretKey' }
    const apiKey = 'testApiKey'
    const currentSite = { dataCenter: 'testDataCenter' }
    beforeEach(() => {
      Cookies.get.mockImplementation((name) => {
        if (name === 'gitToken') return encryptData('testToken', encryptionKey)
        if (name === 'owner') return encryptData('testOwner', encryptionKey)
        return undefined
      })
    })

    it('should dispatch pending and fulfilled actions on successful fetch', async () => {
      const commitList = ['commit1', 'commit2']
      handleCommitListRequestServices.mockResolvedValue({ commitList })
      const store = mockStore(initialState)

      await store.dispatch(fetchCommits())

      const actions = store.getActions()
      expect(actions[0].type).toBe(fetchCommits.pending.type)
      expect(actions[1].type).toBe(fetchCommits.fulfilled.type)
      expect(actions[1].payload).toEqual(commitList)
    })

    it('should dispatch pending and rejected actions on failed fetch', async () => {
      const errorMessage = 'Error fetching commits'
      handleCommitListRequestServices.mockRejectedValue(new Error(errorMessage))
      const store = mockStore(initialState)

      await store.dispatch(fetchCommits())

      const actions = store.getActions()
      expect(actions[0].type).toBe(fetchCommits.pending.type)
      expect(actions[1].type).toBe(fetchCommits.rejected.type)
      expect(actions[1].payload).toEqual(errorMessage)
    })
  })

  describe('setCookiesForGitData', () => {
    it('should set encrypted cookies for gitToken and owner', () => {
      const state = {
        gitToken: 'testToken',
        owner: 'testOwner',
        credentials: { secretKey: 'testSecretKey' },
      }

      // const encryptedToken = crypto.AES.encrypt(JSON.stringify(state.gitToken), state.credentials.secretKey).toString()
      // const encryptedOwner = crypto.AES.encrypt(JSON.stringify(state.owner), state.credentials.secretKey).toString()

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
      const encryptedValue = undefined // Simulate missing cookie

      // Add this mock before invoking the function
      Cookies.get.mockReturnValueOnce(encryptedValue)

      const result = getEncryptedCookie(name, 'testSecretKey')
      expect(console.error).toHaveBeenCalledWith(`No ${name} found in cookies`)
      expect(result).toBeUndefined()
    })
  })
})
