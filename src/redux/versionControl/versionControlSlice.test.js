import reducer, { setGitToken, setOwner, fetchCommits, selectCommits, selectIsFetching, selectGitToken, selectOwner, selectError } from './versionControlSlice'
import { handleCommitListRequestServices } from '../../services/versionControl/versionControlService'
import Cookies from 'js-cookie'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import crypto from 'crypto-js'

jest.mock('js-cookie')
jest.mock('../../services/versionControl/versionControlService')

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('versionControlSlice', () => {
  const originalWindow = { ...global.window }
  const encryptionKey = process.env.ENCRYPTION_KEY || 'some-random-encryption-key'

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

  // Mocking crypto.AES.encrypt to produce consistent encrypted string for tests
  jest.spyOn(crypto.AES, 'encrypt').mockImplementation((dataToEncrypt, key) => {
    return crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(dataToEncrypt))
  })

  const encryptData = (dataToEncrypt, key) => {
    try {
      const encryptedJsonString = crypto.AES.encrypt(JSON.stringify(dataToEncrypt), key).toString()
      return encryptedJsonString
    } catch (error) {
      console.error('Error encrypting data:', error)
      return undefined
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Reducers
  describe('reducers', () => {
    const initialState = {
      commits: [],
      gitToken: '',
      owner: '',
      isFetching: false,
      error: null,
    }

    it('should handle initial state', () => {
      expect(reducer(undefined, {})).toEqual(initialState)
    })

    it('should handle setGitToken', () => {
      const token = 'testToken'
      const encryptedToken = encryptData(token, encryptionKey)
      const action = setGitToken(token)
      const state = reducer(initialState, action)
      expect(state.gitToken).toEqual(token)
      expect(Cookies.set).toHaveBeenCalledTimes(1)
      expect(Cookies.set).toHaveBeenCalledWith('gitToken', encryptedToken, { secure: true, sameSite: 'strict' })
    })

    it('should handle setOwner', () => {
      const owner = 'testOwner'
      const encryptedOwner = encryptData(owner, encryptionKey)
      const action = setOwner(owner)
      const state = reducer(initialState, action)
      expect(state.owner).toEqual(owner)
      expect(Cookies.set).toHaveBeenCalledTimes(1)
      expect(Cookies.set).toHaveBeenCalledWith('owner', encryptedOwner, { secure: true, sameSite: 'strict' })
    })
  })

  // Selectors
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

  // Async Thunk fetchCommits
  describe('async thunk fetchCommits', () => {
    const initialState = {
      credentials: { credentials: 'testCredentials' },
      copyConfigurationExtended: { currentSiteInformation: 'testSite' },
      versionControl: { gitToken: 'testToken', owner: 'testOwner' },
    }

    it('should dispatch pending and fulfilled actions on successful fetch', async () => {
      const store = mockStore(initialState)
      const commitList = ['commit1', 'commit2']
      handleCommitListRequestServices.mockResolvedValue({ commitList })

      const encryptedToken = encryptData('testToken', encryptionKey)
      const encryptedOwner = encryptData('testOwner', encryptionKey)
      Cookies.get.mockImplementation((name) => {
        if (name === 'gitToken') return encryptedToken
        if (name === 'owner') return encryptedOwner
        return undefined
      })

      await store.dispatch(fetchCommits())

      const actions = store.getActions()
      expect(actions[0].type).toBe(fetchCommits.pending.type)
      expect(actions[1].type).toBe(fetchCommits.fulfilled.type)
      expect(actions[1].payload).toEqual(commitList)
    })

    it('should dispatch pending and rejected actions on failed fetch', async () => {
      const store = mockStore(initialState)
      const errorMessage = 'Error fetching commits'
      handleCommitListRequestServices.mockRejectedValue(new Error(errorMessage))

      const encryptedToken = encryptData('testToken', encryptionKey)
      const encryptedOwner = encryptData('testOwner', encryptionKey)
      Cookies.get.mockImplementation((name) => {
        if (name === 'gitToken') return encryptedToken
        if (name === 'owner') return encryptedOwner
        return undefined
      })

      await store.dispatch(fetchCommits())

      const actions = store.getActions()
      expect(actions[0].type).toBe(fetchCommits.pending.type)
      expect(actions[1].type).toBe(fetchCommits.rejected.type)

      const errorPayload = actions[1].payload || actions[1].error.message
      expect(errorPayload).toEqual(errorMessage)
    })
  })
})
