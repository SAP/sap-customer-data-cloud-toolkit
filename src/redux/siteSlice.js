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

const getUserKeyFromLocalStorage = () => {
  const userKeyFromLocalStorage = localStorage.getItem('userKey')
  if (userKeyFromLocalStorage) {
    return userKeyFromLocalStorage
  }
  return ''
}

const getUserSecretFromLocalStorage = () => {
  const userSecretFromLocalStorage = localStorage.getItem('userSecret')
  if (userSecretFromLocalStorage) {
    return userSecretFromLocalStorage
  }
  return ''
}

export const siteSlice = createSlice({
  name: 'sites',
  initialState: {
    sites: [],
    isLoading: false,
    dataCenters: getDataCenters(),
    errors: [],
    showSuccessDialog: false,
    credentials: {
      userKey: getUserKeyFromLocalStorage(),
      userSecret: getUserSecretFromLocalStorage(),
    },
    sitesToDeleteManually: [],
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
    clearSitesToDeleteManually: (state) => {
      state.sitesToDeleteManually = []
    },
    setShowSuccessDialog: (state, action) => {
      state.showSuccessDialog = action.payload
    },
    setUserKey: (state, action) => {
      state.credentials.userKey = action.payload
      localStorage.setItem('userKey', action.payload)
    },
    setUserSecret: (state, action) => {
      state.credentials.userSecret = action.payload
      localStorage.setItem('userSecret', action.payload)
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

        addRequiredManualRemovalInformation(state, action)
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
      addRequiredManualRemovalInformation(state, action)
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
  clearSitesToDeleteManually,
} = siteSlice.actions

export default siteSlice.reducer

export const createSites = createAsyncThunk('service/createSites', async (sites, { getState }) => {
  try {
    const state = getState()
    return await new SiteManager({
      // window.location.hash starts with #/<partnerId>/...
      partnerID: getPartnerId(window.location.hash),
      userKey: state.sites.credentials.userKey,
      secret: state.sites.credentials.userSecret,
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

const addRequiredManualRemovalInformation = (state, action) => {
  if (action.payload) {
    state.sitesToDeleteManually = action.payload
      .filter((response) => {
        return (
          (response.statusCode === 200 && response.deleted === false) || (response.errorCode !== 0 && response.endpoint === 'admin.setSiteConfig' && response.deleted === false)
        )
      })
      .map((siteToDeleteManually) => {
        const siteToDeleteBaseDomain = selectSiteById({ sites: state }, siteToDeleteManually.tempId).baseDomain
        siteToDeleteManually = {
          baseDomain: siteToDeleteBaseDomain,
          siteId: siteToDeleteManually.siteID,
          apiKey: siteToDeleteManually.apiKey,
        }
        return siteToDeleteManually
      })
  }
}

export const selectErrors = (state) => state.sites.errors

export const selectErrorBySiteTempId = (state, tempId) => selectErrors(state).find((error) => error.site.tempId === tempId)

export const selectShowSuccessDialog = (state) => state.sites.showSuccessDialog

export const selectCredentials = (state) => state.sites.credentials

export const selectDataCenters = (state) => state.sites.dataCenters

export const selectLoadingState = (state) => state.sites.isLoading

export const selectSitesToDeleteManually = (state) => state.sites.sitesToDeleteManually
