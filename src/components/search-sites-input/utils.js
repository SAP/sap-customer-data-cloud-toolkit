/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
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
