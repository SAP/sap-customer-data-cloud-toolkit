/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

const CONFIGURATIONS = 'configurations'
const SOURCE_SITES = 'sourceSites'

export const filterConfiguration = (sitesConfigurations, siteId) => {
  return sitesConfigurations.filter((sitesConfiguration) => sitesConfiguration.siteId !== siteId)
}

export const getConfiguration = (sitesConfigurations, siteId) => {
  return sitesConfigurations.filter((sitesConfiguration) => sitesConfiguration.siteId === siteId)[0]
}

export const returnSourceConfigurations = (sitesConfigurations, siteId) => {
  return returnSitesProperty(sitesConfigurations, siteId, CONFIGURATIONS)
}

export const returnSourceSites = (sitesConfigurations, siteId) => {
  return returnSitesProperty(sitesConfigurations, siteId, SOURCE_SITES)
}

const returnSitesProperty = (sitesConfigurations, siteId, property) => {
  if (sitesConfigurations && sitesConfigurations.length) {
    const siteConfiguration = getConfiguration(sitesConfigurations, siteId)
    if (siteConfiguration && siteConfiguration[property]) {
      return siteConfiguration[property]
    }
  }
  return []
}

export const addSourceSiteInternal = (sitesConfigurations, siteId, sourceSite) => {
  const siteConfiguration = getConfiguration(sitesConfigurations, siteId)
  if (!siteConfiguration) {
    sitesConfigurations.push({
      siteId: siteId,
      sourceSites: [sourceSite],
      configurations: [],
    })
  } else {
    siteConfiguration.sourceSites = [sourceSite]
  }
}
