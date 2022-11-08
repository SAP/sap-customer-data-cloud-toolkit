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
  getPartnerId,
  createSites,
  clearErrors,
  setShowSuccessDialog,
  selectSiteById,
  setUserKey,
  setUserSecret,
} from './siteSlice'

const initialState = {
  sites: [],
  isLoading: false,
  credentials: {
    userKey: '',
    userSecret: '',
  },
  dataCenters: [
    {
      label: 'AU',
      value: 'au1',
    },
    {
      label: 'EU',
      value: 'eu1',
    },
    {
      label: 'US',
      value: 'us1',
    },
  ],
  errors: [],
  showSuccessDialog: false,
  sitesToDeleteManually: [],
}

const stateWithParentWithNoChild = {
  sites: [
    {
      parentSiteTempId: '',
      tempId: '1234',
      baseDomain: 'test domain',
      description: 'test description',
      dataCenter: 'test data center',
      childSites: [],
      isChildSite: false,
    },
  ],
  isLoading: false,
}

const stateWithParentWithChild = {
  sites: [
    {
      parentSiteTempId: '',
      tempId: '1234',
      baseDomain: 'test domain',
      description: 'test description',
      dataCenter: 'test data center',
      childSites: [
        {
          parentSiteTempId: '1234',
          tempId: '5678',
          baseDomain: 'test domain',
          description: 'test description',
          dataCenter: 'test data center',
          isChildSite: true,
        },
      ],
      isChildSite: false,
    },
  ],
  isLoading: false,
}

const stateWithError = {
  sites: [],
  isLoading: false,
  dataCenters: [],
  errors: [{ error: 'I am a dummy error!' }],
  showSuccessDialog: false,
}

const structure = {
  _id: '1',
  name: 'Structure 1',
  data: [
    {
      rootBaseDomain: 'test',
      baseDomain: 'dev.parent.{{dataCenter}}.{{baseDomain}}',
      description: 'test parent from strucure',
      dataCenter: 'AU',
      childSites: [
        {
          baseDomain: 'dev.{{dataCenter}}.{{baseDomain}}',
          description: 'test child from strucure',
          dataCenter: 'AU',
        },
      ],
    },
  ],
}

const parentToUpdate = {
  tempId: '1234',
  newBaseDomain: 'updated domain',
  newDescription: 'updated description',
  newDataCenter: 'updated data center',
}

const childToUpdate = {
  parentSiteTempId: '1234',
  tempId: '5678',
  newBaseDomain: 'updated domain',
  newDescription: 'updated description',
}

describe('Site slice test suite', () => {
  test('should return initial state', () => {
    expect(sitesReducer(undefined, { type: undefined })).toEqual(initialState)
  })

  test('should add a new Parent site', () => {
    const newState = sitesReducer(initialState, addNewParent())
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
    const newState = sitesReducer(initialState, addParentFromStructure(structure.data[0]))
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
    const parent = stateWithParentWithNoChild.sites[0]
    const newState = sitesReducer(stateWithParentWithNoChild, addChild({ tempId: parent.tempId }))
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
    const updatedParent = sitesReducer(stateWithParentWithNoChild, updateParentBaseDomain(parentToUpdate)).sites[0]
    expect(updatedParent.baseDomain).toEqual(parentToUpdate.newBaseDomain)
  })

  test('should update parent site Description', () => {
    const updatedParent = sitesReducer(stateWithParentWithNoChild, updateParentDescription(parentToUpdate)).sites[0]
    expect(updatedParent.description).toEqual(parentToUpdate.newDescription)
  })

  test('should update parent site Data Center', () => {
    const updatedParent = sitesReducer(stateWithParentWithChild, updateParentDataCenter(parentToUpdate)).sites[0]
    expect(updatedParent.dataCenter).toEqual(parentToUpdate.newDataCenter)
    updatedParent.childSites.forEach((childSite) => {
      expect(childSite.dataCenter).toEqual(parentToUpdate.newDataCenter)
    })
  })

  test('should update child site Base Domain', () => {
    const updatedChild = sitesReducer(stateWithParentWithChild, updateChildBaseDomain(childToUpdate)).sites[0].childSites[0]
    expect(updatedChild.baseDomain).toEqual(childToUpdate.newBaseDomain)
  })

  test('should update child site Description', () => {
    const updatedChild = sitesReducer(stateWithParentWithChild, updateChildDescription(childToUpdate)).sites[0].childSites[0]
    expect(updatedChild.description).toEqual(childToUpdate.newDescription)
  })

  test('should delete child site', () => {
    const newState = sitesReducer(
      stateWithParentWithChild,
      deleteChild({
        parentSiteTempId: '1234',
        tempId: '5678',
      })
    )
    expect(newState.sites[0].childSites.length).toEqual(0)
  })

  test('should delete parent site', () => {
    const newState = sitesReducer(
      stateWithParentWithChild,
      deleteParent({
        tempId: '1234',
      })
    )
    expect(newState.sites.length).toEqual(0)
  })

  test('should clear all sites', () => {
    const newState = sitesReducer(stateWithParentWithChild, clearSites())
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

  test('should set isLoading to true while createSites is pending', () => {
    const newState = sitesReducer(initialState, { type: createSites.pending.type })
    expect(newState.isLoading).toEqual(true)
    expect(newState.errors.length).toEqual(0)
    expect(newState.showSuccessDialog).toEqual(false)
  })

  test('should set isLoading to false when createSites is rejected', () => {
    const newState = sitesReducer(initialState, { type: createSites.rejected.type })
    expect(newState.isLoading).toEqual(false)
  })

  test('should clear errors', () => {
    const newState = sitesReducer(stateWithError, clearErrors())
    expect(newState.errors.length).toEqual(0)
  })

  test('should set showSuccessDialog to true', () => {
    const newState = sitesReducer(initialState, setShowSuccessDialog(true))
    expect(newState.showSuccessDialog).toEqual(true)
  })

  test('should have fulfilled createSites without errors', () => {
    const newState = sitesReducer(initialState, { type: createSites.fulfilled.type, payload: [] })
    expect(newState.isLoading).toEqual(false)
    expect(newState.sites.length).toEqual(0)
    expect(newState.showSuccessDialog).toEqual(true)
  })

  test('should have fulfilled createSites with errors', () => {
    const newState = sitesReducer(initialState, { type: createSites.fulfilled.type, payload: [{ errorCode: 400 }] })
    expect(newState.isLoading).toEqual(false)
    expect(newState.sites.length).toEqual(0)
    expect(newState.errors.length).toEqual(1)
    expect(newState.showSuccessDialog).toEqual(false)
  })

  test('should select a Parent site by id', () => {
    const parentSite = selectSiteById({ sites: stateWithParentWithChild }, '1234')
    expect(parentSite).not.toBe(undefined)
  })

  test('should select a Child site by id', () => {
    const childSite = selectSiteById({ sites: stateWithParentWithChild }, '5678')
    expect(childSite).not.toBe(undefined)
  })

  test('should return undefiend on getting site by unexisting id', () => {
    const site = selectSiteById({ sites: stateWithParentWithChild }, 'abc')
    expect(site).toBe(undefined)
  })

  test('should update credentials user key', () => {
    const testUserKey = 'dummyUserKey'
    const newState = sitesReducer(initialState, setUserKey(testUserKey))
    expect(newState.credentials.userKey).toEqual(testUserKey)
  })

  test('should update credentials user secret', () => {
    const testUserSecret = 'dummyUserSecret'
    const newState = sitesReducer(initialState, setUserSecret(testUserSecret))
    expect(newState.credentials.userSecret).toEqual(testUserSecret)
  })
})
