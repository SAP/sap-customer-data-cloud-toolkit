import { onElementExists } from '../../inject/utils'

export const cleanTreeVerticalScrolls = () => {
  onElementExists('ui5-tree', () => {
    document
      .querySelectorAll('ui5-tree')
      .forEach((element) => element.shadowRoot.querySelector('ui5-tree-list').shadowRoot.querySelectorAll('div')[1].classList.remove('ui5-list-scroll-container'))
  })
}

export const areConfigurationsFilled = (configurations) => {
  for (const configuration of configurations) {
    if (configuration.value === true) {
      return true
    }
    if (configuration.branches) {
      const foundConfiguration = areConfigurationsFilled(configuration.branches)
      if (foundConfiguration) {
        return true
      }
    }
  }
  return false
}

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

export const extractTargetApiKeyFromTargetSiteListItem = (targetSiteListItem) => {
  return targetSiteListItem.split(' ')[2]
}
