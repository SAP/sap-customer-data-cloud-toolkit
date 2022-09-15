import sitesReducer, {
    addParent, deleteParent, updateParent,
    updateChild, addChild, deleteChild, clearSites
} from './siteSlice'


const initialState = { sites: [] }

const stateWithParentWithNoChild = {
    sites: [{
        parentSiteTempId: '',
        tempId: '1234',
        baseDomain: 'test domain',
        description: 'test description',
        dataCenter: 'test data center',
        childSites: [],
        isChildSite: false
    }]
}

const stateWithParentWithChild = {
    sites: [{
        parentSiteTempId: '',
        tempId: '1234',
        baseDomain: 'test domain',
        description: 'test description',
        dataCenter: 'test data center',
        childSites: [{
            parentSiteTempId: '1234',
            tempId: '5678',
            baseDomain: 'test domain',
            description: 'test description',
            dataCenter: 'test data center',
            isChildSite: true
        }],
        isChildSite: false
    }]
}

test('should return initial state', () => {
    expect(sitesReducer(undefined, { type: undefined })).toEqual(initialState)
})

test('should add a new Parent site', () => {
    const newState = sitesReducer(initialState, addParent())
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


test('should update parent site', () => {
    const parentToUpdate = {
        tempId: '1234',
        baseDomain: 'updated domain',
        description: 'updated description',
        dataCenter: 'updated data center'
    }

    const updatedParent = sitesReducer(stateWithParentWithNoChild, updateParent(parentToUpdate)).sites[0]
    expect(updatedParent.baseDomain).toEqual(parentToUpdate.baseDomain)
    expect(updatedParent.description).toEqual(parentToUpdate.description)
    expect(updatedParent.dataCenter).toEqual(parentToUpdate.dataCenter)
})


test('should update child site', () => {
    const childToUpdate = {
        parentSiteTempId: '1234',
        tempId: '5678',
        baseDomain: 'updated domain',
        description: 'updated description',
        dataCenter: 'updated data center'
    }

    const updatedChild = sitesReducer(stateWithParentWithChild, updateChild(childToUpdate)).sites[0].childSites[0]
    expect(updatedChild.baseDomain).toEqual(childToUpdate.baseDomain)
    expect(updatedChild.description).toEqual(childToUpdate.description)
    expect(updatedChild.dataCenter).toEqual(childToUpdate.dataCenter)
})

test('should delete child site', () => {
    const newState = sitesReducer(stateWithParentWithChild, deleteChild({
        parentSiteTempId: '1234',
        tempId: '5678'
    }))
    expect(newState.sites[0].childSites.length).toEqual(0)
})

test('should delete parent site', () => {
    const newState = sitesReducer(stateWithParentWithChild, deleteParent({
        tempId: '1234'
    }))
    expect(newState.sites.length).toEqual(0)
})

test('should clear all sites', () => {
    const newState = sitesReducer(stateWithParentWithChild, clearSites())
    expect(newState.sites.length).toEqual(0)})