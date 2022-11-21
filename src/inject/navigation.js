import { onHashChange, querySelectorAllShadows, watchElement } from './utils'
import { MENU_ELEMENT_CLASS, ROUTE_CONTAINER_CLASS } from './constants'
import { chromeStorageState } from './chromeStorage'

export const ROUTE_CONTAINER_SHOW_CLASS = 'show-cdc-tools-app-container'
export const IS_SELECTED_CLASS = 'is-selected'

const init = () => {
  onHashChange(() => processHashChange(window.location.hash))
  setTimeout(() => processHashChange(window.location.hash), 50)

  // Overwrite .is-selected management behaviour for menu buttons in CDC Console (fix behaviour when user selects an extension tab and goes back to the previous tab)
  const menuElements = querySelectorAllShadows('.fd-nested-list__link, .fd-nested-list__content')
  menuElements.forEach((element) =>
    element.addEventListener('click', (e) => {
      clearSelectionMenuLinks()
      setSelectedMenuElement(e.currentTarget)
    })
  )
}

export const getRouteFromHash = (locationHash = window.location.hash) =>
  locationHash.split('/').reduce((route, hashPart, index) => (index > 2 && hashPart.length ? `${route}/${hashPart}` : route), '')

export const processHashChange = (locationHash) => {
  locationHash = locationHash.endsWith('/') ? locationHash.slice(0, -1) : locationHash

  const route = getRouteFromHash(locationHash)
  const containers = querySelectorAllShadows(`[route="${route}"]`)
  const hashSplit = locationHash.split('/')

  if (hashSplit.length >= 3) {
    const [, partnerId, apiKey] = hashSplit
    chromeStorageState.partnerId = partnerId
    chromeStorageState.apiKey = apiKey
  }

  // Check if this route is supported by our app
  if (hashSplit.length < 4 || !containers.length) {
    hideContainer()
  } else {
    showContainer(locationHash)
  }
}

const showContainer = (locationHash) => {
  const route = getRouteFromHash(locationHash)

  hideContainer()
  clearSelectionMenuLinks()

  // Show containers
  querySelectorAllShadows(`[route="${route}"]`).forEach((container) => container.classList.add(ROUTE_CONTAINER_SHOW_CLASS))

  setSelectedMenuLinks(locationHash)
}

const hideContainer = () => {
  if (!document.querySelectorAll(`.${ROUTE_CONTAINER_CLASS}`).length) {
    return
  }

  // Hide cdc-tools containers
  document.querySelectorAll(`.${ROUTE_CONTAINER_CLASS}`).forEach((el) => el.classList.remove(ROUTE_CONTAINER_SHOW_CLASS))

  // Remove is-selected from all cdc-tools links
  querySelectorAllShadows(`.${MENU_ELEMENT_CLASS} .fd-nested-list__link`).forEach((el) => el.classList.remove(IS_SELECTED_CLASS))
}

// Remove is-selected from all menu links
const clearSelectionMenuLinks = () => {
  querySelectorAllShadows('.fd-nested-list__link, .fd-nested-list__content').forEach((el) => el.classList.remove(IS_SELECTED_CLASS))
}

// Set menu links as selected
const setSelectedMenuLinks = (locationHash) => {
  querySelectorAllShadows(`[href="${locationHash}"]`).forEach((menuElement) => setSelectedMenuElement(menuElement))
}

const setSelectedMenuElement = (menuElement) => {
  menuElement.classList.add(IS_SELECTED_CLASS)
  // Set dropdown list header button as is-selected
  const menuParentElem = menuElement.parentElement.parentElement.closest('.fd-nested-list__item')
  if (menuParentElem) {
    menuParentElem.querySelector('.fd-nested-list__content').classList.add(IS_SELECTED_CLASS)
  }
}

export const initNavigation = () => {
  watchElement({
    elemSelector: `.${ROUTE_CONTAINER_CLASS}`, // CDC Toolbox container
    onCreated: () => {
      init()
    },
  })
}
