import { onElementExists, htmlToElem } from './utils'

export const TENANT_ID_CLASS = 'fd-info-label__text'
export const CDC_TOOLS_APP_CLASS = 'cdc-tools-app'

export const initAppContainer = (onCreated) => {
	document
		.querySelector('body')
		.append(htmlToElem(`<div class="${CDC_TOOLS_APP_CLASS}"></div>`))

  if (typeof onCreated == 'function') {
    onCreated()
  }
}

export const destroyAppContainer = () =>
	document.querySelector(`.${CDC_TOOLS_APP_CLASS}`).remove()

export const injectAppContainer = (onCreated) =>
	onElementExists(`.${TENANT_ID_CLASS}`, () => initAppContainer(onCreated))
