/**
 * @jest-environment jsdom
 */

import sitesReducer, {
  addNewParent,
  addParentFromStructure,
  deleteParent,
  updateParentBaseDomain,
  updateParentDescription,
  updateParentDataCenter,
  updateChildBaseDomain,
  updateChildDescription,
  addChild,
  deleteChild,
  clearSites,
  createSites,
  clearErrors,
  setShowSuccessDialog,
  selectSiteById,
  clearSitesToDeleteManually,
  setProgressIndicatorValue,
  setIsLoading,
} from './siteSlice'

import { getPartnerId, getCreationSuccessMessage } from './utils'

import * as data from './dataTest'
import { Tracker } from '../../tracker/tracker'

describe('Site slice test suite', () => {
  let tracker

  beforeEach(() => {
    tracker = jest.spyOn(Tracker, 'reportUsage')
  })

  test('should return initial state', () => {
    expect(sitesReducer(undefined, { type: undefined })).toEqual(data.initialState)
  })

  test('should add a new Parent site', () => {
    const newState = sitesReducer(data.initialState, addNewParent())
    expect(newState.sites.length).toEqual(1)

    const newParent = newState.sites[0]
    expect(newState.sites.length).toEqual(1)
    expect(newParent.parentSiteTempId).toEqual('')
    expect(newParent.tempId).not.toEqual('')
    expect(newParent.baseDomain).toEqual('')
    expect(newParent.description).toEqual('')
    expect(newParent.dataCenter).toEqual('')
    expect(newParent.childSites.length).toEqual(0)
    expect(newParent.isChildSite).toEqual(false)
  })

  test('should add a Parent site with a child from a Structure', () => {
    const newState = sitesReducer(data.initialState, addParentFromStructure(data.dataToAddParentFromStructure))
    expect(newState.sites.length).toEqual(1)

    const newParent = newState.sites[0]
    expect(newState.sites.length).toEqual(1)
    expect(newParent.parentSiteTempId).toEqual('')
    expect(newParent.tempId).not.toEqual('')
    expect(newParent.baseDomain).toEqual('dev.parent.au.test')
    expect(newParent.description).toEqual('test parent from strucure')
    expect(newParent.dataCenter).toEqual('au1')
    expect(newParent.childSites.length).toEqual(1)
    expect(newParent.isChildSite).toEqual(false)

    const newChild = newParent.childSites[0]
    expect(newChild.parentSiteTempId).toEqual(newParent.tempId)
    expect(newChild.tempId).not.toEqual('')
    expect(newChild.baseDomain).toEqual('dev.au.test')
    expect(newChild.description).toEqual('test child from strucure')
    expect(newChild.dataCenter).toEqual('au1')
    expect(newChild.isChildSite).toEqual(true)
  })

  test('should add a new child site', () => {
    const parent = data.stateWithParentWithNoChild.sites[0]
    const newState = sitesReducer(data.stateWithParentWithNoChild, addChild({ tempId: parent.tempId }))
    expect(newState.sites[0].childSites.length).toEqual(1)

    const newChild = newState.sites[0].childSites[0]
    expect(newChild.parentSiteTempId).toEqual('1234')
    expect(newChild.tempId).not.toEqual('')
    expect(newChild.baseDomain).toEqual('')
    expect(newChild.description).toEqual('')
    expect(newChild.dataCenter).toEqual('test data center')
    expect(newChild.isChildSite).toEqual(true)
  })

  test('should update parent site Base Domain', () => {
    const updatedParent = sitesReducer(data.stateWithParentWithNoChild, updateParentBaseDomain(data.parentToUpdate)).sites[0]
    expect(updatedParent.baseDomain).toEqual(data.parentToUpdate.newBaseDomain)
  })

  test('should update parent site Description', () => {
    const updatedParent = sitesReducer(data.stateWithParentWithNoChild, updateParentDescription(data.parentToUpdate)).sites[0]
    expect(updatedParent.description).toEqual(data.parentToUpdate.newDescription)
  })

  test('should update parent site Data Center', () => {
    const updatedParent = sitesReducer(data.stateWithParentWithChild, updateParentDataCenter(data.parentToUpdate)).sites[0]
    expect(updatedParent.dataCenter).toEqual(data.parentToUpdate.newDataCenter)
    updatedParent.childSites.forEach((childSite) => {
      expect(childSite.dataCenter).toEqual(data.parentToUpdate.newDataCenter)
    })
  })

  test('should update child site Base Domain', () => {
    const updatedChild = sitesReducer(data.stateWithParentWithChild, updateChildBaseDomain(data.childToUpdate)).sites[0].childSites[0]
    expect(updatedChild.baseDomain).toEqual(data.childToUpdate.newBaseDomain)
  })

  test('should update child site Description', () => {
    const updatedChild = sitesReducer(data.stateWithParentWithChild, updateChildDescription(data.childToUpdate)).sites[0].childSites[0]
    expect(updatedChild.description).toEqual(data.childToUpdate.newDescription)
  })

  test('should delete child site', () => {
    const newState = sitesReducer(
      data.stateWithParentWithChild,
      deleteChild({
        parentSiteTempId: '1234',
        tempId: '5678',
      })
    )
    expect(newState.sites[0].childSites.length).toEqual(0)
  })

  test('should delete parent site', () => {
    const newState = sitesReducer(
      data.stateWithParentWithChild,
      deleteParent({
        tempId: '1234',
      })
    )
    expect(newState.sites.length).toEqual(0)
  })

  test('should clear all sites', () => {
    const newState = sitesReducer(data.stateWithParentWithChild, clearSites())
    expect(newState.sites.length).toEqual(0)
  })

  test('get partner id successfull', () => {
    const expectedPartnerId = '12345678'
    const hash = `#/${expectedPartnerId}/3_oAyqEurF4Kk/sites/site-selector`
    expect(getPartnerId(hash)).toEqual(expectedPartnerId)
  })

  test('get partner id empty', () => {
    const expectedPartnerId = ''
    const hash = `#/`
    expect(getPartnerId(hash)).toEqual(expectedPartnerId)
  })

  test('get partner id undefined', () => {
    const expectedPartnerId = ''
    const hash = ''
    expect(getPartnerId(hash)).toEqual(expectedPartnerId)
  })

  test('should update state while createSites is pending', () => {
    const action = createSites.pending
    const newState = sitesReducer(data.initialState, action)
    expect(newState.isLoading).toEqual(true)
    expect(newState.errors.length).toEqual(0)
    expect(newState.showSuccessDialog).toEqual(false)
    expect(newState.progressIndicatorValue).toEqual(0)
    expect(tracker).not.toHaveBeenCalled()
  })

  test('should update state when createSites is rejected', () => {
    const action = createSites.rejected('', '', '', { responses: [data.dummyError] })
    const newState = sitesReducer(data.initialState, action)
    expect(newState.errors.length).toEqual(1)
    expect(newState.errors[0]).toEqual(data.dummyError)
    expect(tracker).not.toHaveBeenCalled()
  })

  test('should clear errors', () => {
    const newState = sitesReducer(data.stateWithError, clearErrors())
    expect(newState.errors.length).toEqual(0)
  })

  test('should set showSuccessDialog to true', () => {
    const newState = sitesReducer(data.initialState, setShowSuccessDialog(true))
    expect(newState.showSuccessDialog).toEqual(true)
  })

  test('should have fulfilled createSites with errors', () => {
    const action = createSites.fulfilled({ responses: [data.dummyError], copyConfigurationResponses: [] })
    const newState = sitesReducer(data.initialState, action)
    expect(newState.sites.length).toEqual(0)
    expect(newState.errors.length).toEqual(1)
    expect(newState.errors[0].errorCode).toEqual(data.dummyError.errorCode)
    expect(newState.showSuccessDialog).toEqual(false)
    expect(tracker).not.toHaveBeenCalled()
  })

  test('should have fulfilled createSites with copyConfigurationResponses errors', () => {
    const action = createSites.fulfilled({ responses: [data.dummySiteResponse], copyConfigurationResponses: [data.dummyCopyConfigurationResponse] })
    const newState = sitesReducer(data.stateWithParentWithNoChild, action)
    expect(newState.sites.length).toEqual(1)
    expect(newState.errors.length).toEqual(2)
    expect(newState.errors[0].errorMessage).toEqual(getCreationSuccessMessage().errorMessage)
    expect(newState.errors[1].errorCode).toEqual(data.dummyError.errorCode)
    expect(newState.showSuccessDialog).toEqual(false)
    expect(newState.sitesToDeleteManually).toEqual([])
    expect(tracker).not.toHaveBeenCalled()
  })

  test('should have fulfilled createSites without errors', () => {
    const action = createSites.fulfilled({ responses: [], copyConfigurationResponses: [] })
    const newState = sitesReducer(data.initialState, action)
    expect(newState.sites.length).toEqual(0)
    expect(newState.showSuccessDialog).toEqual(true)
    expect(newState.progressIndicatorValue).toEqual(100)
    expect(tracker).toHaveBeenCalled()
  })

  test('should select a Parent site by id', () => {
    const parentSite = selectSiteById({ sites: data.stateWithParentWithChild.sites }, '1234')
    expect(parentSite).not.toBe(undefined)
  })

  test('should select a Child site by id', () => {
    const childSite = selectSiteById({ sites: data.stateWithParentWithChild.sites }, '5678')
    expect(childSite).not.toBe(undefined)
  })

  test('should return undefiend on getting site by unexisting id', () => {
    const site = selectSiteById({ sites: data.stateWithParentWithChild.sites }, 'abc')
    expect(site).toBe(undefined)
  })

  test('should clear sites to delete manually', () => {
    expect(data.stateWithSitesToRemoveManually.sitesToDeleteManually).not.toEqual([])
    const newState = sitesReducer(data.stateWithSitesToRemoveManually, clearSitesToDeleteManually())
    expect(newState.sitesToDeleteManually).toEqual([])
  })

  test('should set progress indicator value', () => {
    const testProgressIndicatorValue = 50
    const newState = sitesReducer(data.initialState, setProgressIndicatorValue(testProgressIndicatorValue))
    expect(newState.progressIndicatorValue).toEqual(testProgressIndicatorValue)
  })

  test('should set isLoading to true', () => {
    const newState = sitesReducer(data.initialState, setIsLoading(true))
    expect(newState.isLoading).toEqual(true)
  })
})
