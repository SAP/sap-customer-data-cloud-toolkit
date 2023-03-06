import versionReducer, { checkNewVersion } from './versionSlice'
import * as data from './dataTest'

describe('Version Slice test suite', () => {
  it('should return initial state', () => {
    expect(versionReducer(undefined, { type: undefined })).toEqual(data.initialState)
  })

  it('should update state while checkNewVersion is pedding', () => {
    const action = checkNewVersion.pending
    const newState = versionReducer(data.initialState, action)
    expect(newState).toEqual(data.initialState)
  })

  it('should update state when checkNewVersion is fulfilled with a new version', () => {
    const action = checkNewVersion.fulfilled(data.versionData)
    const newState = versionReducer(data.initialState, action)
    expect(newState).toEqual(data.versionData)
  })

  it('should update state when checkNewVersion is rejected', () => {
    const action = checkNewVersion.rejected
    const newState = versionReducer(data.initialState, action)
    expect(newState).toEqual(data.initialState)
  })
})