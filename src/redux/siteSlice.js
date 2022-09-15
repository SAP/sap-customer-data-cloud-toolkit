import { createSlice } from '@reduxjs/toolkit'

import { generateUUID } from '../utils/generateUUID';
// import siteStructures from '../sitesStructures.json';


const addChildsFromStructure = (parentSiteTempId, dataCenter, structureChildSites) => {
    const childSites = []
    structureChildSites.forEach(structureChildSite => {
        childSites.push({
            parentSiteTempId: parentSiteTempId,
            tempId: generateUUID(),
            baseDomain: structureChildSite.baseDomain,
            description: structureChildSite.description,
            dataCenter: dataCenter,
            isChildSite: true
        })
    })
    return childSites
}

const getParentFromStructure = (structure) => {
    const tempId = generateUUID()
     return {
        parentSiteTempId: '',
        tempId: tempId,
        baseDomain: structure.baseDomain,
        description: structure.description,
        dataCenter: structure.dataCenter,
        childSites: addChildsFromStructure(tempId, structure.dataCenter, structure.childSites),
        isChildSite: false
    }
}

const getNewParent = () => {
    return {
        parentSiteTempId: '',
        tempId: generateUUID(),
        baseDomain: '',
        description: '',
        dataCenter: '',
        childSites: [],
        isChildSite: false
    }
}

const getNewChild = (parentSiteTempId, dataCenter) => {
    return {
        parentSiteTempId: parentSiteTempId,
        tempId: generateUUID(),
        baseDomain: '',
        description: '',
        dataCenter: dataCenter,
        isChildSite: true
    }
}

const getSiteById = (sites, tempId) => {
    return sites.filter(site => site.tempId === tempId)[0]
}

export const siteSlice = createSlice({
    name: 'sites',
    initialState: {
        sites: [],
        // structures: siteStructures
    },
    reducers: {
        addParent: (state, action) => {
            if(action.payload) {
                state.sites.push(getParentFromStructure(action.payload))
            } else {
                state.sites.push(getNewParent())
            }
        },
        deleteParent: (state, action) => {
            const parentSiteTempId = action.payload.tempId
            state.sites = state.sites.filter(site => site.tempId !== parentSiteTempId)
        },
        updateParent: (state, action) => {
            const sourceParent = action.payload
            const parentSiteTempId = sourceParent.tempId
            const parentSite = getSiteById(state.sites, parentSiteTempId)
            parentSite.baseDomain = sourceParent.baseDomain
            parentSite.description = sourceParent.description
            parentSite.dataCenter = sourceParent.dataCenter
            parentSite.childSites.forEach(childSite => childSite.dataCenter = sourceParent.dataCenter)
        },
        addChild: (state, action) => {
            const parentSiteTempId = action.payload.tempId
            const parentSite = getSiteById(state.sites, parentSiteTempId)
            const childSites = parentSite.childSites
            childSites.push(getNewChild(parentSiteTempId, parentSite.dataCenter))
        },
        deleteChild: (state, action) => {
            const parentSiteTempId = action.payload.parentSiteTempId
            const childTempId = action.payload.tempId
            const parentSite = getSiteById(state.sites, parentSiteTempId)
            parentSite.childSites = parentSite.childSites.filter(childSite => childSite.tempId !== childTempId)
        },
        updateChild: (state, action) => {
            const sourceChild = action.payload
            const parentSiteTempId = sourceChild.parentSiteTempId
            const childTempId = sourceChild.tempId
            const parentSite = getSiteById(state.sites, parentSiteTempId)
            const childSite = getSiteById(parentSite.childSites, childTempId)
            childSite.baseDomain = sourceChild.baseDomain
            childSite.description = sourceChild.description
            childSite.dataCenter = parentSite.dataCenter
        },
        clearSites: (state) => {
            state.sites = []
        },
        // addStructure: (state, action) => {
        //     state.structures.push(action.payload)
        // }
    },
})

export const { addParent, deleteParent, updateParent,
    updateChild, addChild, deleteChild, clearSites, 
    // addStructure 
} = siteSlice.actions

export default siteSlice.reducer