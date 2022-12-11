import { onElementExists, watchElement, querySelectorAllShadows, htmlToElem } from './utils'
import { TENANT_ID_CLASS, TOPBAR_MENU_CONTAINER_PLACEHOLDER_CLASS, TOPBAR_MENU_ITEM_PLACEHOLDER_CLASS } from './constants'

const topBarCustomMenuContainerSpacing = `<span class="${TOPBAR_MENU_CONTAINER_PLACEHOLDER_CLASS}"></span>`
const topBarCustomMenuItemSpacing = `<span class="header-menu-item ${TOPBAR_MENU_ITEM_PLACEHOLDER_CLASS}" style="display: inline-block; width: 36px; margin: 0 8px;"></span>`

const numberOfMenuItems = 1

export const initTopBarMenuPlaceholder = (onCreated) => {
  const searchInput = querySelectorAllShadows('global-search')[0]

  const menuContainerSpacing = htmlToElem(topBarCustomMenuContainerSpacing)
  for (let i = 0; i < numberOfMenuItems; i++) {
    menuContainerSpacing.appendChild(htmlToElem(topBarCustomMenuItemSpacing))
  }

  // Insert custom menu after search input
  searchInput.after(menuContainerSpacing)

  if (typeof onCreated == 'function') {
    onCreated()
  }

  // If the injected element is removed, inject it again
  watchElement({
    elemSelector: `.${TOPBAR_MENU_CONTAINER_PLACEHOLDER_CLASS}`,
    onRemoved: () => {
      initTopBarMenuPlaceholder(onCreated)
    },
  })
}

export const destroyTopBarMenuPlaceholder = () => document.querySelector(`.${TOPBAR_MENU_CONTAINER_PLACEHOLDER_CLASS}`).remove()

export const injectTopBarMenuPlaceholder = (onCreated) => onElementExists(`.${TENANT_ID_CLASS}`, () => initTopBarMenuPlaceholder(onCreated))
