import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import SiteManager from '../services/site/siteManager'

import { generateUUID } from '../utils/generateUUID'

import { state } from '../inject/chromeStorage'

const addChildsFromStructure = (parentSiteTempId, rootBaseDomain, dataCenter, structureChildSites) => {
  const childSites = []
  const importedRootBaseDomain = rootBaseDomain
  structureChildSites.forEach((structureChildSite) => {
    childSites.push({
      parentSiteTempId: parentSiteTempId,
      tempId: generateUUID(),
      baseDomain: `${structureChildSite.baseDomain}.${importedRootBaseDomain}`,
      description: structureChildSite.description,
      dataCenter: dataCenter,
      isChildSite: true,
    })
  })
  return childSites
}

const getParentFromStructure = (structure) => {
  const tempId = generateUUID()
  return {
    parentSiteTempId: '',
    tempId: tempId,
    baseDomain: `${structure.baseDomain}.${structure.rootBaseDomain}`,
    description: structure.description,
    dataCenter: structure.dataCenter,
    childSites: addChildsFromStructure(tempId, structure.rootBaseDomain, structure.dataCenter, structure.childSites),
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

export const createSitesThunk = createAsyncThunk('service/createSites', async (sites) => {
  console.log('createSitesThunk')
  try {
    const response = await new SiteManager({
      partnerID: '79597568',
      userKey: state.userKey,
      secret: state.secretKey,
    }).create({
      sites,
    })
    console.log('response')
    console.log(response)
    return response
  } catch (error) {
    console.log('error')
    console.log(error)
    return error
  }
})

export const siteSlice = createSlice({
  name: 'sites',
  initialState: {
    sites: [],
    isLoading: false,
  },
  reducers: {
    addNewParent: (state) => {
      state.sites.push(getNewParent())
    },
    addParentFromStructure: (state, action) => {
      if (action.payload) {
        state.sites.push(getParentFromStructure(action.payload))
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
  },
  extraReducers: (builder) => {
    builder.addCase(createSitesThunk.pending, (state) => {
      console.log('pending')
      state.isLoading = true
    })
    builder.addCase(createSitesThunk.fulfilled, (state) => {
      console.log('fullfiled')
      state.isLoading = false
    })
    builder.addCase(createSitesThunk.rejected, (state) => {
      console.log('rejected')
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
} = siteSlice.actions

export default siteSlice.reducer
