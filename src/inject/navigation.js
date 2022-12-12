import { onHashChange, querySelectorAllShadows, watchElement } from './utils'
import {
  MENU_ELEMENT_CLASS,
  ROUTE_CONTAINER_CLASS,
  TENANT_ID_CLASS,
  ROUTE_CONTAINER_SHOW_CLASS,
  INCOMPATIBLE_ROUTE_FRAGMENTS,
  MENU_ELEMENTS,
  MAIN_CONTAINER_CLASS,
} from './constants'
import { chromeStorageState } from './chromeStorage'

import { initAppReact } from '../initAppReact'
import { initAppContainer, destroyAppContainer } from './injectAppContainer'

export const IS_SELECTED_CLASS = 'is-selected'

let incompatibleRouteLoaded = false
let isAppInitialized = false

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

export const processHashChange = (locationHash) => {
  locationHash = locationHash.endsWith('/') ? locationHash.slice(0, -1) : locationHash

  const route = getRouteFromHash(locationHash)

  const hashSplit = locationHash.split('/')
  if (hashSplit.length >= 3) {
    const [, partnerId, apiKey] = hashSplit
    chromeStorageState.partnerId = partnerId
    chromeStorageState.apiKey = apiKey
  }

  // Check if we are loading an incompatiable route
  incompatibleRouteLoaded = incompatibleRouteLoaded || isRouteIncompatible(route)

  if (!incompatibleRouteLoaded && !isAppInitialized) {
    // Init React App
    initAppContainer()
    initAppReact(document.querySelector(`.${MAIN_CONTAINER_CLASS}`))
    isAppInitialized = true
  }

  // Check if this route is from CDC Console or CDC Toolbox extension
  if (!isRouteFromExtension(route)) {
    // Show CDC Console route
    hideContainer()

    if (incompatibleRouteLoaded && isAppInitialized) {
      // Destroy React App
      destroyAppContainer()
      isAppInitialized = false
    }
  } else {
    // Show CDC Toolbox extension route
    if (incompatibleRouteLoaded) {
      return window.location.reload(true)
    }

    showContainer(locationHash)
  }
}

export const getRouteFromHash = (locationHash = window.location.hash) =>
  locationHash.split('/').reduce((route, hashPart, index) => (index > 2 && hashPart.length ? `${route}/${hashPart}` : route), '')

const isRouteIncompatible = (route) => !!INCOMPATIBLE_ROUTE_FRAGMENTS.find((incompatibleRoute) => route.indexOf(incompatibleRoute) !== -1)

const isRouteFromExtension = (route) => (MENU_ELEMENTS.find((menuElement) => route === menuElement.route) ? true : false)

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
    elemSelector: `.${TENANT_ID_CLASS}`,
    onCreated: () => {
      init()
    },
  })
}
