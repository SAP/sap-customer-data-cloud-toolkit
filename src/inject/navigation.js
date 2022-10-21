import { onHashChange, querySelectorAllShadows, watchElement } from './utils'
import { MAIN_CONTAINER_CLASS, MAIN_CONTAINER_SHOW_CLASS } from './injectAppContainer'
import { MENU_ELEMENT_CLASS, COMMON_URL_PART } from './injectMenu'
import { chromeStorageState } from './chromeStorage'

export const ROUTE_CONTAINER_CLASS = 'cdc-tools-app-container'
export const ROUTE_CONTAINER_SHOW_CLASS = 'show-cdc-tools-app-container'
export const IS_SELECTED_CLASS = 'is-selected'

const init = () => {
  onHashChange(() => processHashChange(window.location.hash))
  setTimeout(() => processHashChange(window.location.hash), 50)
}

export const processHashChange = (locationHash) => {
  const hash = locationHash.split('/')
  if (hash.length !== 5 || hash[3] !== COMMON_URL_PART) {
    hideContainer()
  } else {
    const [, partnerId, apiKey, , tabName] = hash

    chromeStorageState.partnerId = partnerId
    chromeStorageState.apiKey = apiKey

    showContainer({ tabName })
  }
}

const showContainer = ({ tabName }) => {
  if (!document.querySelectorAll(`.${ROUTE_CONTAINER_CLASS}`).length || !document.querySelector(`.${ROUTE_CONTAINER_CLASS}[name="${tabName}"]`)) {
    return
  }

  hideContainer()

  // Remove is-selected from all menu links
  querySelectorAllShadows('.fd-nested-list__link, .fd-nested-list__content').forEach((el) => el.classList.remove(IS_SELECTED_CLASS))

  // Show containers
  document.querySelector(`.${ROUTE_CONTAINER_CLASS}[name="${tabName}"]`).classList.add(ROUTE_CONTAINER_SHOW_CLASS)
  document.querySelector(`.${MAIN_CONTAINER_CLASS}`).classList.add(MAIN_CONTAINER_SHOW_CLASS)

  // Set menu link as selected
  querySelectorAllShadows(`.${MENU_ELEMENT_CLASS} .fd-nested-list__link[name="${tabName}"]`).forEach((el) => {
    el.classList.add(IS_SELECTED_CLASS)
    // Set dropdown list selector as is-selected
    const menuParentElem = el.parentElement.parentElement.closest('.fd-nested-list__item')
    if (menuParentElem) {
      menuParentElem.querySelector('.fd-nested-list__content').classList.add(IS_SELECTED_CLASS)
    }
  })
}

const hideContainer = () => {
  if (!document.querySelectorAll(`.${ROUTE_CONTAINER_CLASS}`).length) {
    return
  }

  // Hide cdc-tools wrap container
  document.querySelector(`.${MAIN_CONTAINER_CLASS}`).classList.remove(MAIN_CONTAINER_SHOW_CLASS)

  // Hide cdc-tools containers
  document.querySelectorAll(`.${ROUTE_CONTAINER_CLASS}`).forEach((el) => el.classList.remove(ROUTE_CONTAINER_SHOW_CLASS))

  // Remove is-selected from all cdc-tools links
  querySelectorAllShadows(`.${MENU_ELEMENT_CLASS} .fd-nested-list__link`).forEach((el) => el.classList.remove(IS_SELECTED_CLASS))
}

export const initNavigation = () => {
  watchElement({
    elemSelector: `.${ROUTE_CONTAINER_CLASS}`, // CDC Toolbox container
    onCreated: () => {
      init()
    },
  })
}
