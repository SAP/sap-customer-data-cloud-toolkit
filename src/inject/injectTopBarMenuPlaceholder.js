/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import { onElementExists, watchElement, querySelectorAllShadows, htmlToElem } from './utils'
import { TENANT_ID_CLASS, TOPBAR_MENU_CONTAINER_PLACEHOLDER_CLASS, TOPBAR_MENU_ITEM_PLACEHOLDER_CLASS } from './constants'

const topBarCustomMenuContainerSpacing = `<span class="${TOPBAR_MENU_CONTAINER_PLACEHOLDER_CLASS}"></span>`
const topBarCustomMenuItemSpacing = `<span class="header-menu-item ${TOPBAR_MENU_ITEM_PLACEHOLDER_CLASS}" style="display: inline-block; width: 36px; margin: 0 8px;"></span>`

const numberOfMenuItems = 1

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

  if (typeof onCreated == 'function') {
    onCreated()
  }
  const shellBarActions = querySelectorAllShadows('fd-shellbar-actions')[0]
  shellBarActions.style.cssText += 'width: 620px;min-width: 620px;';

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
