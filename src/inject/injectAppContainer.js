/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import { onElementExists, htmlToElem } from './utils'
import { TENANT_ID_CLASS, MAIN_CONTAINER_CLASS, MAIN_CONTAINER_SHOW_CLASS, MAIN_LOADING_CLASS, MAIN_LOADING_SHOW_CLASS } from './constants'

export const initAppContainer = (onCreated) => {
  document.querySelector('body').append(htmlToElem(`<div class="${MAIN_CONTAINER_CLASS} ${MAIN_CONTAINER_SHOW_CLASS}"></div>`))

  document.querySelector('body').append(
    htmlToElem(`<div class="${MAIN_LOADING_CLASS} ${MAIN_LOADING_SHOW_CLASS}">
  <div class="fd-busy-indicator fd-busy-indicator--m fd-busy-indicator--absolute"><div class="fd-busy-indicator__circle"></div><div class="fd-busy-indicator__circle"></div><div class="fd-busy-indicator__circle"></div></div>
</div>`)
  )

  if (typeof onCreated == 'function') {
    onCreated()
  }
}

export const destroyAppContainer = () => document.querySelector(`.${MAIN_CONTAINER_CLASS}`).remove()

export const injectAppContainer = (onCreated) => onElementExists(`.${TENANT_ID_CLASS}`, () => initAppContainer(onCreated))
