import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import * as utils from './utils'
import SiteManager from '../../services/site/siteManager'
import ConfigManager from '../../services/copyConfig/configManager'
import { Tracker } from '../../tracker/tracker'
import { getErrorAsArray } from '../utils'

const SITES_SLICE_STATE_NAME = 'sites'
const CREATE_SITES_ACTION = 'service/createSites'

export const siteSlice = createSlice({
  name: SITES_SLICE_STATE_NAME,
  initialState: {
    sites: [],
    isLoading: false,
    errors: [],
    showSuccessDialog: false,
    sitesToDeleteManually: [],
  },
  reducers: {
    addNewParent: (state) => {
      state.sites.push(utils.getNewSite())
    },
    addParentFromStructure: (state, action) => {
      if (action.payload) {
        state.sites.push(utils.getSiteFromStructure(action.payload.parentFromStructure, action.payload.dataCenters))
      }
    },
    deleteParent: (state, action) => {
      const parentSiteTempId = action.payload.tempId
      state.sites = state.sites.filter((site) => site.tempId !== parentSiteTempId)
    },
    updateParentBaseDomain: (state, action) => {
      const sourceParent = action.payload
      const parentSiteTempId = sourceParent.tempId
      const parentSite = utils.getSiteById(state.sites, parentSiteTempId)
      parentSite.baseDomain = sourceParent.newBaseDomain
    },
    updateParentDescription: (state, action) => {
      const sourceParent = action.payload
      const parentSiteTempId = sourceParent.tempId
      const parentSite = utils.getSiteById(state.sites, parentSiteTempId)
      parentSite.description = sourceParent.newDescription
    },
    updateParentDataCenter: (state, action) => {
      const sourceParent = action.payload
      const parentSiteTempId = sourceParent.tempId
      const parentSite = utils.getSiteById(state.sites, parentSiteTempId)
      parentSite.dataCenter = sourceParent.newDataCenter
      parentSite.childSites.forEach((childSite) => (childSite.dataCenter = sourceParent.newDataCenter))
    },
    addChild: (state, action) => {
      const parentSiteTempId = action.payload.tempId
      const parentSite = utils.getSiteById(state.sites, parentSiteTempId)
      const childSites = parentSite.childSites
      childSites.push(utils.getNewSiteChild(parentSiteTempId, parentSite.dataCenter))
    },
    deleteChild: (state, action) => {
      const parentSiteTempId = action.payload.parentSiteTempId
      const childTempId = action.payload.tempId
      const parentSite = utils.getSiteById(state.sites, parentSiteTempId)
      parentSite.childSites = parentSite.childSites.filter((childSite) => childSite.tempId !== childTempId)
    },
    updateChildBaseDomain: (state, action) => {
      const sourceChild = action.payload
      const parentSiteTempId = sourceChild.parentSiteTempId
      const childTempId = sourceChild.tempId
      const parentSite = utils.getSiteById(state.sites, parentSiteTempId)
      const childSite = utils.getSiteById(parentSite.childSites, childTempId)
      childSite.baseDomain = sourceChild.newBaseDomain
    },
    updateChildDescription: (state, action) => {
      const sourceChild = action.payload
      const parentSiteTempId = sourceChild.parentSiteTempId
      const childTempId = sourceChild.tempId
      const parentSite = utils.getSiteById(state.sites, parentSiteTempId)
      const childSite = utils.getSiteById(parentSite.childSites, childTempId)
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
  },
  extraReducers: (builder) => {
    builder.addCase(createSites.pending, (state) => {
      state.errors = []
      state.isLoading = true
      state.showSuccessDialog = false
    })
    builder.addCase(createSites.fulfilled, (state, action) => {
      state.isLoading = false
      const errors = action.payload.filter(({ errorCode }) => errorCode !== 0)
      if (errors.length) {
        state.errors = errors.map((error) => {
          return utils.errorMapper(error, state, selectSiteById)
        })
        utils.addRequiredManualRemovalInformation(state, action, selectSiteById)
      } else {
        state.showSuccessDialog = true
        state.sites = []
        Tracker.reportUsage()
      }
    })
    builder.addCase(createSites.rejected, (state, action) => {
      state.isLoading = false
      state.errors = action.payload
      utils.addRequiredManualRemovalInformation(state, action, selectSiteById)
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
  clearSitesToDeleteManually,
} = siteSlice.actions

export default siteSlice.reducer

export const createSites = createAsyncThunk(CREATE_SITES_ACTION, async (sites, { getState, rejectWithValue }) => {
  try {
    const state = getState()
    const sitesConfigurations = state.siteDeployerCopyConfiguration.sitesConfigurations
    let responses = await new SiteManager({
      // window.location.hash starts with #/<partnerId>/...
      partnerID: utils.getPartnerId(window.location.hash),
      userKey: state.credentials.credentials.userKey,
      secret: state.credentials.credentials.secretKey,
    }).create({
      sites,
    })

    const copyConfigPromises = []
    const credentials = { userKey: state.credentials.credentials.userKey, secret: state.credentials.credentials.secretKey }

    responses
      .filter(({ errorCode }) => errorCode === 0)
      .forEach((okResponse) => {
        const siteConfiguration = sitesConfigurations.filter((siteConfiguration) => siteConfiguration.siteId === okResponse.tempId)[0]
        if (siteConfiguration) {
          copyConfigPromises.push(new ConfigManager(credentials, siteConfiguration.sourceSites[0].apiKey).copy([okResponse.apiKey], siteConfiguration.configurations))
        }
      })

    const copyConfigurationResponses = await Promise.all(copyConfigPromises)

    return [...responses, ...copyConfigurationResponses].flat()
  } catch (error) {
    return rejectWithValue(getErrorAsArray(error))
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

export const selectLoadingState = (state) => state.sites.isLoading

export const selectSitesToDeleteManually = (state) => state.sites.sitesToDeleteManually
