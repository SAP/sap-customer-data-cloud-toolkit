/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

const targetSiteContainsString = (string, availableTargetSite) => {
  return (
    availableTargetSite.baseDomain.includes(string) ||
    availableTargetSite.apiKey.includes(string) ||
    availableTargetSite.partnerName.includes(string) ||
    availableTargetSite.partnerId.toString().includes(string)
  )
}

export const filterTargetSites = (string, targetSites) => {
  if (string.length > 2) {
    const filteredTargetSites = targetSites.filter((targetSite) => targetSiteContainsString(string, targetSite))
    return filteredTargetSites
  } else {
    return []
  }
}

export const getTargetSiteByTargetApiKey = (targetApiKey, availableTargetSites) => {
  return availableTargetSites.filter((availableTargetSite) => availableTargetSite.apiKey === targetApiKey)[0]
}

export const findStringInAvailableTargetSites = (string, targetSites) => {
  return targetSites.filter((targetSite) => targetSiteContainsString(string, targetSite)).length !== 0
}
