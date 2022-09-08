import { createSlice } from '@reduxjs/toolkit'

import { generateUUID } from '../utils/generateUUID';

export const siteSlice = createSlice({
    name: 'sites',
    initialState: {
        sites: [],
    },
    reducers: {
        addParent: state => {
            state.sites.push({
                parentSiteTempId: '',
                tempId: generateUUID(),
                baseDomain: '',
                description: '',
                dataCenter: '',
                childSites: [],
                isChildSite: false
            }
            )
        },
        deleteParent: (state, action) => {
            const parentSiteTempId = action.payload.tempId
            state.sites = state.sites.filter(site => site.tempId !== parentSiteTempId)
        },
        updateParent: (state, action) => {
            const parentSiteTempId = action.payload.tempId
            const parentSite = state.sites.filter(site => site.tempId === parentSiteTempId)[0]
            parentSite.baseDomain = action.payload.baseDomain
            parentSite.description = action.payload.description
            parentSite.dataCenter = action.payload.dataCenter
        },
        addChild: (state, action) => {
            const parentSiteTempId = action.payload.tempId
            const parentSite = state.sites.filter(site => site.tempId === parentSiteTempId)[0]
            const childSites = parentSite.childSites

            // if (!childSites)
            //     childSites = []

            childSites.push({
                parentSiteTempId: parentSiteTempId,
                tempId: generateUUID(),
                baseDomain: "",
                description: "",
                dataCenter: parentSite.dataCenter,
                isChildSite: true
            })

        },
        deleteChild: (state, action) => {
            const parentSiteTempId = action.payload.parentSiteTempId
            const childTempId = action.payload.tempId
            const parentSite = state.sites.filter(site => site.tempId === parentSiteTempId)[0]

            parentSite.childSites = parentSite.childSites.filter(childSite => childSite.tempId !== childTempId)
        },
        updateChild: (state, action) => {
            const parentSiteTempId = action.payload.parentSiteTempId
            const childTempId = action.payload.tempId
            const parentSite = state.sites.filter(site => site.tempId === parentSiteTempId)[0]
            const childSite = parentSite.childSites.filter(childSite => childSite.tempId !== childTempId)[0]
            childSite.baseDomain = action.payload.baseDomain
            childSite.description = action.payload.description
            childSite.dataCenter = action.payload.dataCenter
        }
    },
})

export const { addParent, deleteParent, updateParent,
    updateChild, addChild, deleteChild } = siteSlice.actions

export default siteSlice.reducer