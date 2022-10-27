import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { generateUUID } from '../utils/generateUUID'
import dataCenters from '../dataCenters.json'
import SiteManager from '../services/site/siteManager'

const getDataCenterValue = (dataCentersToGetValueFrom, dataCenterLabel) => dataCentersToGetValueFrom.find((dataCenter) => dataCenter.label === dataCenterLabel).value

const generateBaseDomain = (source, { dataCenter, baseDomain }) => source.replaceAll('{{dataCenter}}', dataCenter.toLowerCase()).replaceAll('{{baseDomain}}', baseDomain)

const getChildsFromStructure = (parentSiteTempId, rootBaseDomain, dataCenter, structureChildSites, sourceDataCenters) =>
  structureChildSites.map(({ baseDomain, description }) =>
    getSiteFromStructure({ parentSiteTempId, rootBaseDomain, baseDomain, dataCenter, description, isChildSite: true }, sourceDataCenters)
  )

const getSiteFromStructure = ({ parentSiteTempId = '', childSites, isChildSite = false, rootBaseDomain, baseDomain, dataCenter, description }, sourceDataCenters) => {
  const tempId = generateUUID()
  const dataCenterValue = getDataCenterValue(sourceDataCenters, dataCenter)
  baseDomain = generateBaseDomain(baseDomain, { dataCenter, baseDomain: rootBaseDomain })

  const site = { parentSiteTempId, tempId, baseDomain, description, dataCenter: dataCenterValue, isChildSite, childSites }
  return isChildSite ? site : { ...site, childSites: getChildsFromStructure(tempId, rootBaseDomain, dataCenter, childSites, sourceDataCenters) }
}

const getNewSite = ({ parentSiteTempId = '', dataCenter = '', isChildSite = false } = {}) => {
  const site = { parentSiteTempId, tempId: generateUUID(), baseDomain: '', description: '', dataCenter, isChildSite }
  return isChildSite ? site : { ...site, childSites: [] }
}

const getNewSiteChild = (parentSiteTempId, dataCenter) => getNewSite({ parentSiteTempId, dataCenter, isChildSite: true })

export const getPartnerId = (hash) => {
  const [, partnerId] = hash.split('/')
  return partnerId !== undefined ? partnerId : ''
}

const getDataCenters = (host = window.location.hostname) => dataCenters.filter((dataCenter) => dataCenter.console === host)[0].datacenters

const getSiteById = (sites, tempId) => sites.filter((site) => site.tempId === tempId)[0]

export const siteSlice = createSlice({
  name: 'sites',
  initialState: {
    sites: [],
    isLoading: false,
    dataCenters: getDataCenters(),
    errors: [],
    showSuccessDialog: false,
    credentials: {
      userKey: '',
      userSecret: '',
    },
  },
  reducers: {
    addNewParent: (state) => {
      state.sites.push(getNewSite())
    },
    addParentFromStructure: (state, action) => {
      if (action.payload) {
        state.sites.push(getSiteFromStructure(action.payload, state.dataCenters))
      }
    },
    deleteParent: (state, action) => {
      const parentSiteTempId = action.payload.tempId
      state.sites = state.sites.filter((site) => site.tempId !== parentSiteTempId)
    },
    updateParentBaseDomain: (state, action) => {
      const sourceParent = action.payload
      const parentSiteTempId = sourceParent.tempId
      const parentSite = getSiteById(state.sites, parentSiteTempId)
      parentSite.baseDomain = sourceParent.newBaseDomain
    },
    updateParentDescription: (state, action) => {
      const sourceParent = action.payload
      const parentSiteTempId = sourceParent.tempId
      const parentSite = getSiteById(state.sites, parentSiteTempId)
      parentSite.description = sourceParent.newDescription
    },
    updateParentDataCenter: (state, action) => {
      const sourceParent = action.payload
      const parentSiteTempId = sourceParent.tempId
      const parentSite = getSiteById(state.sites, parentSiteTempId)
      parentSite.dataCenter = sourceParent.newDataCenter
      parentSite.childSites.forEach((childSite) => (childSite.dataCenter = sourceParent.newDataCenter))
    },
    addChild: (state, action) => {
      const parentSiteTempId = action.payload.tempId
      const parentSite = getSiteById(state.sites, parentSiteTempId)
      const childSites = parentSite.childSites
      childSites.push(getNewSiteChild(parentSiteTempId, parentSite.dataCenter))
    },
    deleteChild: (state, action) => {
      const parentSiteTempId = action.payload.parentSiteTempId
      const childTempId = action.payload.tempId
      const parentSite = getSiteById(state.sites, parentSiteTempId)
      parentSite.childSites = parentSite.childSites.filter((childSite) => childSite.tempId !== childTempId)
    },
    updateChildBaseDomain: (state, action) => {
      const sourceChild = action.payload
      const parentSiteTempId = sourceChild.parentSiteTempId
      const childTempId = sourceChild.tempId
      const parentSite = getSiteById(state.sites, parentSiteTempId)
      const childSite = getSiteById(parentSite.childSites, childTempId)
      childSite.baseDomain = sourceChild.newBaseDomain
    },
    updateChildDescription: (state, action) => {
      const sourceChild = action.payload
      const parentSiteTempId = sourceChild.parentSiteTempId
      const childTempId = sourceChild.tempId
      const parentSite = getSiteById(state.sites, parentSiteTempId)
      const childSite = getSiteById(parentSite.childSites, childTempId)
      childSite.description = sourceChild.newDescription
    },
    clearSites: (state) => {
      state.sites = []
      state.errors = []
    },
    clearErrors: (state) => {
      state.errors = []
    },
    setShowSuccessDialog: (state, action) => {
      state.showSuccessDialog = action.payload
    },
    setUserKey: (state, action) => {
      state.credentials.userKey = action.payload
    },
    setUserSecret: (state, action) => {
      state.credentials.userSecret = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createSites.pending, (state) => {
      state.errors = []
      state.isLoading = true
      state.showSuccessDialog = false
    })
    builder.addCase(createSites.fulfilled, (state, action) => {
      state.isLoading = false

      // Check if has any error
      const errors = action.payload.filter(({ errorCode }) => errorCode !== 0)
      if (errors.length) {
        // Enrich errors w/ site information
        state.errors = errors.map((error) => {
          error = { ...error, site: { ...selectSiteById({ sites: state }, error.tempId) } }
          delete error.tempId
          delete error.site.childSites
          return error
        })
      }
      // Success
      else {
        state.showSuccessDialog = true
        state.sites = []
      }
    })
    builder.addCase(createSites.rejected, (state, action) => {
      state.isLoading = false
      state.errors = [action]
    })
  },
})

export const {
  addNewParent,
  addParentFromStructure,
  deleteParent,
  updateParentBaseDomain,
  updateParentDescription,
  updateParentDataCenter,
  updateChildBaseDomain,
  updateChildDescription,
  updateChildDataCenter,
  addChild,
  deleteChild,
  clearSites,
  clearErrors,
  setShowSuccessDialog,
  setUserKey,
  setUserSecret,
} = siteSlice.actions

export default siteSlice.reducer

export const createSites = createAsyncThunk('service/createSites', async (sites, { getState }) => {
  try {
    const state = getState()
    return await new SiteManager({
      // window.location.hash starts with #/<partnerId>/...
      partnerID: getPartnerId(window.location.hash),
      userKey: state.credentials.userKey,
      secret: state.credentials.secretKey,
    }).create({
      sites,
    })
  } catch (error) {
    return error
  }
})

export const selectSites = (state) => state.sites.sites

export const selectSiteById = (state, tempId) => {
  const sites = selectSites(state)

  for (const parentSite of sites) {
    if (parentSite.tempId === tempId) {
      return parentSite
    }
    if (parentSite.childSites && parentSite.childSites.length) {
      for (const childSite of parentSite.childSites) {
        if (childSite.tempId === tempId) {
          return childSite
        }
      }
    }
  }

  return undefined
}

export const selectErrors = (state) => state.sites.errors

export const selectErrorBySiteTempId = (state, tempId) => selectErrors(state).find((error) => error.site.tempId === tempId)

export const selectShowSuccessDialog = (state) => state.sites.showSuccessDialog
