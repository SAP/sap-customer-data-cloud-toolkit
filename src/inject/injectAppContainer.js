import { onElementExists, htmlToElem } from './utils'
import { TENANT_ID_CLASS, MAIN_CONTAINER_CLASS, MAIN_CONTAINER_SHOW_CLASS } from './constants'

export const initAppContainer = (onCreated) => {
  document.querySelector('body').append(htmlToElem(`<div class="${MAIN_CONTAINER_CLASS} ${MAIN_CONTAINER_SHOW_CLASS}"></div>`))

  if (typeof onCreated == 'function') {
    onCreated()
  }
}

export const destroyAppContainer = () => document.querySelector(`.${MAIN_CONTAINER_CLASS}`).remove()

export const injectAppContainer = (onCreated) => onElementExists(`.${TENANT_ID_CLASS}`, () => initAppContainer(onCreated))
