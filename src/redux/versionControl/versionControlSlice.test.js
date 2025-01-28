import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import crypto from 'crypto-js'
import Cookies from 'js-cookie'
import reducer, { setGitToken, setOwner, fetchCommits, selectCommits, selectIsFetching, selectGitToken, selectOwner, selectError } from './versionControlSlice'
import { handleCommitListRequestServices } from '../../services/versionControl/versionControlService'

// Mocking js-cookie
jest.mock('js-cookie', () => ({
  set: jest.fn(),
  get: jest.fn(),
}))

// Mocking versionControlService
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
    const createEncryptedCookies = () => {
      const encryptedToken = encryptData('testToken', encryptionKey)
      const encryptedOwner = encryptData('testOwner', encryptionKey)
      Cookies.get.mockImplementation((name) => {
        switch (name) {
          case 'gitToken':
            return encryptedToken
          case 'owner':
            return encryptedOwner
          default:
            return undefined
        }
      })
    }

    beforeEach(() => {
      createEncryptedCookies()
      jest.clearAllMocks()
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
})
