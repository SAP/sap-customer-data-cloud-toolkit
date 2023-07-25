/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import { onElementExists, watchElement, querySelectorAllShadows, htmlToElem } from './utils'
import { TENANT_ID_CLASS, TOPBAR_MENU_CONTAINER_PLACEHOLDER_CLASS, TOPBAR_MENU_ITEM_PLACEHOLDER_CLASS, TOPBAR_ACTIONS_SELECTOR } from './constants'

const topBarCustomMenuContainerSpacing = `<span class="${TOPBAR_MENU_CONTAINER_PLACEHOLDER_CLASS}"></span>`
const topBarCustomMenuItemSpacing = `<span class="header-menu-item ${TOPBAR_MENU_ITEM_PLACEHOLDER_CLASS}" style="display: inline-block; width: 36px; margin: 0 8px;"></span>`

const numberOfMenuItems = 1

export const setTopBarMinWidth = (width = '620px') => {
  const topBarActions = querySelectorAllShadows(TOPBAR_ACTIONS_SELECTOR)[0]
  topBarActions.style.width = width
  topBarActions.style.minWidth = width
}

export const initTopBarMenuPlaceholder = (onCreated) => {
  if (querySelectorAllShadows(`.${TOPBAR_MENU_CONTAINER_PLACEHOLDER_CLASS}`).length) {
    return
  }
  const searchInput = querySelectorAllShadows('global-search')[0]

  const menuContainerSpacing = htmlToElem(topBarCustomMenuContainerSpacing)
  for (let i = 0; i < numberOfMenuItems; i++) {
    menuContainerSpacing.appendChild(htmlToElem(topBarCustomMenuItemSpacing))
  }

  // Insert custom menu after search input
  searchInput.after(menuContainerSpacing)

  // Fix topBar min-width when window resizes too small
  setTopBarMinWidth()

  if (typeof onCreated == 'function') {
    onCreated()
  }

  // If the injected element is removed, inject it again
  watchElement({
    elemSelector: `.${TOPBAR_MENU_CONTAINER_PLACEHOLDER_CLASS}`,
    onRemoved: () => {
      onElementExists(`.${TENANT_ID_CLASS}`, () => {
        initTopBarMenuPlaceholder(onCreated)
      })
    },
  })
}

export const destroyTopBarMenuPlaceholder = () => querySelectorAllShadows(`.${TOPBAR_MENU_CONTAINER_PLACEHOLDER_CLASS}`).forEach((container) => container.remove())

export const injectTopBarMenuPlaceholder = (onCreated) => onElementExists(`.${TENANT_ID_CLASS}`, () => initTopBarMenuPlaceholder(onCreated))
