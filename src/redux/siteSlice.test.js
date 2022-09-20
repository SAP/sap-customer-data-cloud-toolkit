import sitesReducer, {
    addParent, deleteParent, updateParentBaseDomain, updateParentDescription, updateParentDataCenter,
    updateChildBaseDomain, updateChildDescription, addChild, deleteChild, clearSites
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

const structure = {
    "_id": "1",
    "name": "Structure 1",
    "data": [
        {
            "baseDomain": "a.com",
            "description": "test parent from strucure",
            "dataCenter": "AU",
            "childSites": [
                {
                    "baseDomain": "dev.a.com",
                    "description": "test child from strucure",
                    "dataCenter": "AU"
                }
            ]
        }
    ]
}

const parentToUpdate = {
    tempId: '1234',
    baseDomain: 'updated domain',
    description: 'updated description',
    dataCenter: 'updated data center'
}

const childToUpdate = {
    parentSiteTempId: '1234',
    tempId: '5678',
    baseDomain: 'updated domain',
    description: 'updated description',
    dataCenter: 'updated data center'
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

test('should add a Parent site with a child from a Structure', () => {
    const newState = sitesReducer(initialState, addParent(structure.data[0]))
    expect(newState.sites.length).toEqual(1)

    const newParent = newState.sites[0]
    expect(newState.sites.length).toEqual(1)
    expect(newParent.parentSiteTempId).toEqual('')
    expect(newParent.tempId).not.toEqual('')
    expect(newParent.baseDomain).toEqual('a.com')
    expect(newParent.description).toEqual('test parent from strucure')
    expect(newParent.dataCenter).toEqual('AU')
    expect(newParent.childSites.length).toEqual(1)
    expect(newParent.isChildSite).toEqual(false)

    const newChild = newParent.childSites[0]
    expect(newChild.parentSiteTempId).toEqual(newParent.tempId)
    expect(newChild.tempId).not.toEqual('')
    expect(newChild.baseDomain).toEqual('dev.a.com')
    expect(newChild.description).toEqual('test child from strucure')
    expect(newChild.dataCenter).toEqual('AU')
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
    expect(updatedParent.baseDomain).toEqual(parentToUpdate.baseDomain)
})

test('should update parent site Description', () => {
    const updatedParent = sitesReducer(stateWithParentWithNoChild, updateParentDescription(parentToUpdate)).sites[0]
    expect(updatedParent.description).toEqual(parentToUpdate.description)
})

test('should update parent site Data Center', () => {
    const updatedParent = sitesReducer(stateWithParentWithNoChild, updateParentDataCenter(parentToUpdate)).sites[0]
    expect(updatedParent.dataCenter).toEqual(parentToUpdate.dataCenter)
})

test('should update child site Base Domain', () => {


    const updatedChild = sitesReducer(stateWithParentWithChild, updateChildBaseDomain(childToUpdate)).sites[0].childSites[0]
    expect(updatedChild.baseDomain).toEqual(childToUpdate.baseDomain)
})

test('should update child site Description', () => {
    const updatedChild = sitesReducer(stateWithParentWithChild, updateChildDescription(childToUpdate)).sites[0].childSites[0]
    expect(updatedChild.description).toEqual(childToUpdate.description)
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
    expect(newState.sites.length).toEqual(0)
})