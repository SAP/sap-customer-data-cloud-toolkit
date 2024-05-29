/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import * as utils from './utils'
import SiteManager from '../../services/site/siteManager'
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
    progressIndicatorValue: 0,
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
    setProgressIndicatorValue: (state, action) => {
      state.progressIndicatorValue = action.payload
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createSites.pending, (state) => {
      state.errors = []
      state.isLoading = true
      state.showSuccessDialog = false
      state.progressIndicatorValue = 0
    })
    builder.addCase(createSites.fulfilled, (state, action) => {
      state.progressIndicatorValue = 100
      state.isLoading = false
      const errors = utils.getResponseErrors(action.payload.responses)
      if (!utils.isArrayEmpty(errors)) {
        utils.processSitesCreationErrors(state, errors, action.payload.responses)
      } else {
        utils.processSuccessSitesCreation(state, action.payload.responses, action.payload.copyConfigurationResponses)
      }
    })
    builder.addCase(createSites.rejected, (state, action) => {
      state.errors = action.payload.responses
      utils.addRequiredManualRemovalInformation(state, action.payload.responses)
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
  setProgressIndicatorValue,
  setIsLoading,
} = siteSlice.actions

export default siteSlice.reducer

export const createSites = createAsyncThunk(CREATE_SITES_ACTION, async (sites, { getState, rejectWithValue, dispatch }) => {
  try {
    const state = getState()
    dispatch(setProgressIndicatorValue(10))

    const responses = await new SiteManager({
      // window.location.hash starts with #/<partnerId>/...
      partnerID: utils.getPartnerId(window.location.hash),
      userKey: state.credentials.credentials.userKey,
      secret: state.credentials.credentials.secretKey,
      gigyaConsole: state.credentials.credentials.gigyaConsole,
    }).create({
      sites,
    })

    dispatch(setProgressIndicatorValue(20))

    const okResponses = utils.getOkResponses(responses)

    const parentSitesOkResponses = okResponses.filter((response) => response.isChildSite === false)
    const childSitesOkResponses = okResponses.filter((response) => response.isChildSite === true)

    const parentsCopyConfigurationPromises = utils.getCopyConfigurationPromises(getState(), parentSitesOkResponses, dispatch, setProgressIndicatorValue)
    const parentsCopyConfigurationResponses = await Promise.all(parentsCopyConfigurationPromises)

    const childsCopyConfigurationPromises = utils.getCopyConfigurationPromises(getState(), childSitesOkResponses, dispatch, setProgressIndicatorValue)
    const childsCopyConfigurationResponses = await Promise.all(childsCopyConfigurationPromises)

    return utils.buildSitesCreationFulfilledResponse(responses, [parentsCopyConfigurationResponses.flat(), childsCopyConfigurationResponses.flat()])
  } catch (error) {
    return rejectWithValue({ responses: getErrorAsArray(error) })
  }
})

export const selectSites = (state) => state.sites.sites

export const selectSiteById = (state, tempId) => utils.selectSiteById(state.sites, tempId)

export const selectErrors = (state) => state.sites.errors

export const selectErrorBySiteTempId = (state, tempId) =>
  selectErrors(state).find((error) => {
    if (error.site && error.site.tempId) {
      return error.site.tempId === tempId
    } else {
      return false
    }
  })

export const selectShowSuccessDialog = (state) => state.sites.showSuccessDialog

export const selectLoadingState = (state) => state.sites.isLoading

export const selectSitesToDeleteManually = (state) => state.sites.sitesToDeleteManually

export const selectProgressIndicatorValue = (state) => state.sites.progressIndicatorValue
