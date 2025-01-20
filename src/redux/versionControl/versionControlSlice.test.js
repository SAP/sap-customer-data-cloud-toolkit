import reducer, { setGitToken, setOwner, fetchCommits, selectCommits, selectIsFetching, selectGitToken, selectOwner, selectError } from './versionControlSlice'
import { handleCommitListRequestServices } from '../../services/versionControl/versionControlService'
import Cookies from 'js-cookie'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

jest.mock('js-cookie')
jest.mock('../../services/versionControl/versionControlService')

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('versionControlSlice', () => {
  const originalWindow = { ...global.window }

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
      const action = setGitToken(token)
      const state = reducer(initialState, action)
      expect(state.gitToken).toEqual(token)
      expect(Cookies.set).toHaveBeenCalledWith('gitToken', token, { httpOnly: true, secure: true, sameSite: 'strict' })
    })

    it('should handle setOwner', () => {
      const owner = 'testOwner'
      const action = setOwner(owner)
      const state = reducer(initialState, action)
      expect(state.owner).toEqual(owner)
      expect(Cookies.set).toHaveBeenCalledWith('owner', owner, { httpOnly: true, secure: true, sameSite: 'strict' })
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

      await store.dispatch(fetchCommits())

      const actions = store.getActions()
      expect(actions[0].type).toBe(fetchCommits.pending.type)
      expect(actions[1].type).toBe(fetchCommits.rejected.type)

      const errorPayload = actions[1].payload || actions[1].error.message
      expect(errorPayload).toEqual(errorMessage)
    })
  })
})
