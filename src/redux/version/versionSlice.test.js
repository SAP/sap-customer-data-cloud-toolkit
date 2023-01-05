import versionReducer, { checkNewVersion } from './versionSlice'
import * as data from './dataTest'

const EMPTY_STRING = ''

describe('Version Slice test suite', () => {
  it('should return initial state', () => {
    expect(versionReducer(undefined, { type: undefined })).toEqual(data.initialState)
  })

  it('should update newVersion while checkNewVersion is pedding', () => {
    const action = checkNewVersion.pending
    const newState = versionReducer(data.initialState, action)
    expect(newState.newVersion).toEqual(EMPTY_STRING)
  })

  it('should update newVersion when checkNewVersion is fulfilled with a new version', () => {
    const action = checkNewVersion.fulfilled(data.newVersion)
    const newState = versionReducer(data.initialState, action)
    expect(newState.newVersion).toEqual(data.newVersion)
  })

  it('should update newVersion when checkNewVersion is fulfilled without a new version', () => {
    const action = checkNewVersion.fulfilled(EMPTY_STRING)
    const newState = versionReducer(data.initialState, action)
    expect(newState.newVersion).toEqual(EMPTY_STRING)
  })

  it('should update newVersion when checkNewVersion is rejected', () => {
    const action = checkNewVersion.rejected
    const newState = versionReducer(data.initialState, action)
    expect(newState.newVersion).toEqual(EMPTY_STRING)
  })
})
