import { onElementExists, htmlToElem } from './utils'

export const TENANT_ID_CLASS = 'fd-info-label__text'
export const MAIN_CONTAINER_CLASS = 'cdc-tools-app'
export const MAIN_CONTAINER_SHOW_CLASS = 'show-cdc-tools'

export const initAppContainer = (onCreated) => {
  document.querySelector('body').append(htmlToElem(`<div class="${MAIN_CONTAINER_CLASS}"></div>`))

  if (typeof onCreated == 'function') {
    onCreated()
  }
}

export const destroyAppContainer = () => document.querySelector(`.${MAIN_CONTAINER_CLASS}`).remove()

export const injectAppContainer = (onCreated) => onElementExists(`.${TENANT_ID_CLASS}`, () => initAppContainer(onCreated))
