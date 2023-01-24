import { generateUUID } from '../../utils/generateUUID'

const DATA_CENTER_PLACEHOLDER = '{{dataCenter}}'
const BASE_DOMAIN_PLACEHOLDER = '{{baseDomain}}'
const HASH_SPLIT_SEPARATOR = '/'
const OK_RESPONSE_STATUS = 200
const SET_SITE_CONFIG_ENDPOINT = 'admin.setSiteConfig'

const getDataCenterValue = (dataCentersToGetValueFrom, dataCenterLabel) => dataCentersToGetValueFrom.find((dataCenter) => dataCenter.label === dataCenterLabel).value

const generatebaseDomain = (source, { dataCenter, baseDomain }) =>
  source.replaceAll(DATA_CENTER_PLACEHOLDER, dataCenter.toLowerCase()).replaceAll(BASE_DOMAIN_PLACEHOLDER, baseDomain)

const getChildsFromStructure = (parentSiteTempId, rootbaseDomain, dataCenter, structureChildSites, sourceDataCenters) =>
  structureChildSites.map(({ baseDomain, description }) =>
    getSiteFromStructure({ parentSiteTempId, rootbaseDomain, baseDomain, dataCenter, description, isChildSite: true }, sourceDataCenters)
  )

const getSiteFromStructure = ({ parentSiteTempId = '', childSites, isChildSite = false, rootbaseDomain, baseDomain, dataCenter, description }, sourceDataCenters) => {
  const tempId = generateUUID()
  const dataCenterValue = getDataCenterValue(sourceDataCenters, dataCenter)
  baseDomain = generatebaseDomain(baseDomain, { dataCenter, baseDomain: rootbaseDomain })

  const site = { parentSiteTempId, tempId, baseDomain, description, dataCenter: dataCenterValue, isChildSite, childSites }
  return isChildSite ? site : { ...site, childSites: getChildsFromStructure(tempId, rootbaseDomain, dataCenter, childSites, sourceDataCenters) }
}

const getNewSite = ({ parentSiteTempId = '', dataCenter = '', isChildSite = false } = {}) => {
  const site = { parentSiteTempId, tempId: generateUUID(), baseDomain: '', description: '', dataCenter, isChildSite }
  return isChildSite ? site : { ...site, childSites: [] }
}

const getNewSiteChild = (parentSiteTempId, dataCenter) => getNewSite({ parentSiteTempId, dataCenter, isChildSite: true })

const getPartnerId = (hash) => {
  const [, partnerId] = hash.split(HASH_SPLIT_SEPARATOR)
  return partnerId !== undefined ? partnerId : ''
}

const getSiteById = (sites, tempId) => sites.filter((site) => site.tempId === tempId)[0]

const addRequiredManualRemovalInformation = (state, action, selectSiteById) => {
  if (action.payload) {
    state.sitesToDeleteManually = action.payload.filter(requiredManualRemovalResponseFilter).map((siteToDeleteManually) => {
      return siteToDeleteManuallyMapper(siteToDeleteManually, state, selectSiteById)
    })
  }
}

const requiredManualRemovalResponseFilter = (response) => {
  return (
    (response.statusCode === OK_RESPONSE_STATUS && response.deleted === false) ||
    (response.errorCode !== 0 && response.endpoint === SET_SITE_CONFIG_ENDPOINT && response.deleted === false)
  )
}

const siteToDeleteManuallyMapper = (siteToDeleteManually, state, selectSiteById) => {
  const siteToDeletebaseDomain = selectSiteById({ sites: state }, siteToDeleteManually.tempId).baseDomain
  siteToDeleteManually = {
    baseDomain: siteToDeletebaseDomain,
    siteId: siteToDeleteManually.siteID,
    apiKey: siteToDeleteManually.apiKey,
  }
  return siteToDeleteManually
}

const errorMapper = (error, state, selectSiteById) => {
  error = { ...error, site: { ...selectSiteById({ sites: state }, error.tempId) } }
  delete error.tempId
  delete error.site.childSites
  return error
}

export { getNewSite, getSiteFromStructure, getSiteById, getNewSiteChild, addRequiredManualRemovalInformation, getPartnerId, errorMapper }
