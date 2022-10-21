import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { generateUUID } from '../utils/generateUUID'
import { chromeStorageState } from '../inject/chromeStorage'
import dataCenters from '../dataCenters.json'
import SiteManager from '../services/site/siteManager'

const getDataCenterValue = (dataCentersToGetValueFrom, dataCenterLabel) => {
  return dataCentersToGetValueFrom.filter((dataCenter) => dataCenter.label === dataCenterLabel)[0].value
}

const addChildsFromStructure = (parentSiteTempId, rootBaseDomain, dataCenter, structureChildSites, sourceDataCenters) => {
  const childSites = []
  const importedRootBaseDomain = rootBaseDomain
  structureChildSites.forEach((structureChildSite) => {
    childSites.push({
      parentSiteTempId: parentSiteTempId,
      tempId: generateUUID(),
      baseDomain: `${structureChildSite.baseDomain}.${importedRootBaseDomain}`,
      description: structureChildSite.description,
      dataCenter: getDataCenterValue(sourceDataCenters, dataCenter),
      isChildSite: true,
    })
  })
  return childSites
}

const getParentFromStructure = (structure, sourceDataCenters) => {
  const tempId = generateUUID()
  return {
    parentSiteTempId: '',
    tempId: tempId,
    baseDomain: `${structure.baseDomain}.${structure.rootBaseDomain}`,
    description: structure.description,
    dataCenter: getDataCenterValue(sourceDataCenters, structure.dataCenter),
    childSites: addChildsFromStructure(tempId, structure.rootBaseDomain, structure.dataCenter, structure.childSites, sourceDataCenters),
    isChildSite: false,
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
    isChildSite: false,
  }
}

const getNewChild = (parentSiteTempId, dataCenter) => {
  return {
    parentSiteTempId: parentSiteTempId,
    tempId: generateUUID(),
    baseDomain: '',
    description: '',
    dataCenter: dataCenter,
    isChildSite: true,
  }
}

const getSiteById = (sites, tempId) => {
  return sites.filter((site) => site.tempId === tempId)[0]
}

export const getPartnerId = (hash) => {
  const [, partnerId] = hash.split('/')
  return partnerId !== undefined ? partnerId : ''
}

const getDataCenters = () => {
  const host = window.location.hostname
  return dataCenters.filter((dataCenter) => dataCenter.console === host)[0].datacenters
}

export const siteSlice = createSlice({
  name: 'sites',
  initialState: {
    sites: [],
    isLoading: false,
    dataCenters: getDataCenters(),
    errors: [],
    showSuccessDialog: false,
  },
  reducers: {
    addNewParent: (state) => {
      state.sites.push(getNewParent())
    },
    addParentFromStructure: (state, action) => {
      if (action.payload) {
        state.sites.push(getParentFromStructure(action.payload, state.dataCenters))
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
      childSites.push(getNewChild(parentSiteTempId, parentSite.dataCenter))
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
    },
    setShowSuccessDialog: (state, action) => {
      state.showSuccessDialog = action.payload
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
      console.log('createSites.rejected', { action })
      state.isLoading = false
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
  setShowSuccessDialog,
} = siteSlice.actions

export default siteSlice.reducer

export const createSites = createAsyncThunk('service/createSites', async (sites) => {
  try {
    return await new SiteManager({
      // window.location.hash starts with #/<partnerId>/...
      partnerID: getPartnerId(window.location.hash),
      userKey: chromeStorageState.userKey,
      secret: chromeStorageState.secretKey,
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
