import {
	onHashChange,
	querySelectorAllShadows,
	watchElement,
	logStyles,
} from './utils'
import { state } from './chromeStorage'

const init = () => {
	onHashChange(() => processHashChange())
	setTimeout(() => processHashChange(), 50)
}

const processHashChange = () => {
	const hash = window.location.hash.split('/')
	if (hash.length !== 5 || hash[3] !== 'cdc-tools') return hideTool()

	const [, partnerId, apiKey, , tabName] = hash

	state.partnerId = partnerId
	state.apiKey = apiKey

	showTool({ partnerId, apiKey, tabName })
}

const showTool = ({ partnerId, apiKey, tabName }) => {
	if (
		!document.querySelectorAll('.cdc-tools-app-container').length ||
		!document.querySelector(`.cdc-tools-app-container[name="${tabName}"]`)
	)
		return

	hideTool()

	// Remove is-selected from all menu links
	querySelectorAllShadows(
		'.fd-nested-list__link, .fd-nested-list__content',
	).forEach((el) => el.classList.remove('is-selected'))

	// Show containers
	document
		.querySelector(`.cdc-tools-app-container[name="${tabName}"]`)
		.classList.add('show-cdc-tools-app-container')
	document.querySelector('.cdc-tools-app').classList.add('show-cdc-tools')

	// Set menu link as selected
	querySelectorAllShadows(
		`.cdc-tools--menu-item .fd-nested-list__link[name="${tabName}"]`,
	).forEach((el) => {
		el.classList.add('is-selected')
		// Set dropdown list selector as is-selected
		let menuParentElem = el.parentElement.parentElement.closest(
			'.fd-nested-list__item',
		)
		if (menuParentElem)
			menuParentElem
				.querySelector('.fd-nested-list__content')
				.classList.add('is-selected')
	})
}

const hideTool = () => {
	if (!document.querySelectorAll('.cdc-tools-app-container').length) return

	// Hide cdc-tools wrap container
	document.querySelector('.cdc-tools-app').classList.remove('show-cdc-tools')

	// Hide cdc-tools containers
	document
		.querySelectorAll('.cdc-tools-app-container')
		.forEach((el) => el.classList.remove('show-cdc-tools-app-container'))

	// Remove is-selected from all cdc-tools links
	querySelectorAllShadows(
		'.cdc-tools--menu-item .fd-nested-list__link',
	).forEach((el) => el.classList.remove('is-selected'))
}

export const initNavigation = () => {
	watchElement({
		// elemSelector: '.fd-info-label__text', // Tenant ID
		elemSelector: '.cdc-tools-app-container', // CDC Toolbox container
		onCreated: () => {
			init()
			console.log('CDC Toolbox Navigation - %cLoaded', logStyles.green)
		},
	})
}
