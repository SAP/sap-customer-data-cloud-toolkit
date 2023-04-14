import { generateUUID } from '../../utils/generateUUID'
import i18n from '../../i18n'

const DATA_CENTER_PLACEHOLDER = '{{dataCenter}}'
const BASE_DOMAIN_PLACEHOLDER = '{{baseDomain}}'
const HASH_SPLIT_SEPARATOR = '/'
const OK_RESPONSE_STATUS = 200
const SET_SITE_CONFIG_ENDPOINT = 'admin.setSiteConfig'

const getDataCenterValue = (dataCentersToGetValueFrom, dataCenterLabel) => dataCentersToGetValueFrom.find((dataCenter) => dataCenter.label === dataCenterLabel).value

const generateBaseDomain = (source, { dataCenter, baseDomain }) =>
  source.replaceAll(DATA_CENTER_PLACEHOLDER, dataCenter.toLowerCase()).replaceAll(BASE_DOMAIN_PLACEHOLDER, baseDomain)

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

const getPartnerId = (hash) => {
  const [, partnerId] = hash.split(HASH_SPLIT_SEPARATOR)
  return partnerId !== undefined ? partnerId : ''
}

const getSiteById = (sites, tempId) => sites.filter((site) => site.tempId === tempId)[0]

const addRequiredManualRemovalInformation = (state, responses) => {
  if (responses) {
    state.sitesToDeleteManually = responses.filter(requiredManualRemovalResponseFilter).map((siteToDeleteManually) => {
      return siteToDeleteManuallyMapper(siteToDeleteManually, state.sites)
    })
  }
}

const requiredManualRemovalResponseFilter = (response) => {
  return (
    (response.statusCode === OK_RESPONSE_STATUS && response.deleted === false) ||
    (response.errorCode !== 0 && response.endpoint === SET_SITE_CONFIG_ENDPOINT && response.deleted === false)
  )
}

const siteToDeleteManuallyMapper = (siteToDeleteManually, sites) => {
  const siteToDeleteBaseDomain = selectSiteById(sites, siteToDeleteManually.tempId).baseDomain
  siteToDeleteManually = {
    baseDomain: siteToDeleteBaseDomain,
    siteId: siteToDeleteManually.siteID,
    apiKey: siteToDeleteManually.apiKey,
  }
  return siteToDeleteManually
}

const errorMapper = (error, sites) => {
  error = { ...error, site: { ...selectSiteById(sites, error.tempId) } }
  delete error.tempId
  delete error.site.childSites
  return error
}

const getCreationSuccessMessage = () => {
  return {
    errorMessage: i18n.t('SITE_DEPLOYER_COMPONENT.SUCCESS_WITH_COPY_CONFIG_ERRORS'),
    severity: 'Success',
  }
}

const selectSiteById = (sites, tempId) => {
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

const addSiteDomainToCopyConfigError = (copyConfigErrors, siteResponses, sites) => {
  for (const copyConfigError of copyConfigErrors) {
    const tempId = siteResponses.filter((siteResponse) => siteResponse.apiKey === copyConfigError.context.targetApiKey)[0].tempId
    const siteDomain = selectSiteById(sites, tempId).baseDomain
    copyConfigError.errorMessage = `${siteDomain} - ${copyConfigError.errorMessage}`
  }
}

export {
  getNewSite,
  getSiteFromStructure,
  getSiteById,
  getNewSiteChild,
  addRequiredManualRemovalInformation,
  getPartnerId,
  errorMapper,
  getCreationSuccessMessage,
  addSiteDomainToCopyConfigError,
  selectSiteById,
}
