import {
	onHashChange,
	querySelectorAllShadows,
	watchElement,
	logStyles,
} from './utils'
import { state } from './chromeStorage'

const IS_SELECTED = 'is-selected'
const CDC_TOOLS_APP_CONTAINER = '.cdc-tools-app-container'

const init = () => {
	onHashChange(() => processHashChange())
	setTimeout(() => processHashChange(), 50)
}

const processHashChange = () => {
	const hash = window.location.hash.split('/')
	if (hash.length !== 5 || hash[3] !== 'cdc-tools') {
		hideTool()
	} else {
		const [, partnerId, apiKey, , tabName] = hash

		state.partnerId = partnerId
		state.apiKey = apiKey

		showTool({ partnerId, apiKey, tabName })
	}
}

const showTool = ({ partnerId, apiKey, tabName }) => {
	if (
		!document.querySelectorAll(CDC_TOOLS_APP_CONTAINER).length ||
		!document.querySelector(`.cdc-tools-app-container[name="${tabName}"]`)
	) {
		return
	}

	hideTool()

	// Remove is-selected from all menu links
	querySelectorAllShadows(
		'.fd-nested-list__link, .fd-nested-list__content',
	).forEach((el) => el.classList.remove(IS_SELECTED))

	// Show containers
	document
		.querySelector(`.cdc-tools-app-container[name="${tabName}"]`)
		.classList.add('show-cdc-tools-app-container')
	document.querySelector('.cdc-tools-app').classList.add('show-cdc-tools')

	// Set menu link as selected
	querySelectorAllShadows(
		`.cdc-tools--menu-item .fd-nested-list__link[name="${tabName}"]`,
	).forEach((el) => {
		el.classList.add(IS_SELECTED)
		// Set dropdown list selector as is-selected
		const menuParentElem = el.parentElement.parentElement.closest(
			'.fd-nested-list__item',
		)
		if (menuParentElem) {
			menuParentElem
				.querySelector('.fd-nested-list__content')
				.classList.add(IS_SELECTED)
		}
	})
}

const hideTool = () => {
	if (!document.querySelectorAll(CDC_TOOLS_APP_CONTAINER).length) {
		return
	}

	// Hide cdc-tools wrap container
	document.querySelector('.cdc-tools-app').classList.remove('show-cdc-tools')

	// Hide cdc-tools containers
	document
		.querySelectorAll(CDC_TOOLS_APP_CONTAINER)
		.forEach((el) => el.classList.remove('show-cdc-tools-app-container'))

	// Remove is-selected from all cdc-tools links
	querySelectorAllShadows(
		'.cdc-tools--menu-item .fd-nested-list__link',
	).forEach((el) => el.classList.remove(IS_SELECTED))
}

export const initNavigation = () => {
	watchElement({
		// elemSelector: '.fd-info-label__text', // Tenant ID
		elemSelector: CDC_TOOLS_APP_CONTAINER, // CDC Toolbox container
		onCreated: () => {
			init()
			console.log('CDC Toolbox Navigation - %cLoaded', logStyles.green)
		},
	})
}
