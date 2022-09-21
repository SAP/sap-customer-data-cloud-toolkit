import { onElementExists, htmlToElem, logStyles } from './utils'

// Menu elements
export const appContainers = [
	{
		tabName: 'site-deployer',
		html: `<div class="cdc-tools-app-container" name="site-deployer"><h1 style="text-align: center;">site-deployer</h1></div>`,
	},
	{
		tabName: 'copy-configuration-extended',
		html: `<div class="cdc-tools-app-container" name="copy-configuration-extended"><h1 style="text-align: center;">copy-configuration-extended</h1></div>`,
	},
]

export const initAppContainer = (onCreated) => {
	const tabList = appContainers.map((container) => container.html).join('')

	document
		.querySelector('body')
		.append(htmlToElem(`<div class="cdc-tools-app">${tabList}</div>`))

	console.log('CDC Toolbox App - %cLoaded', logStyles.green)

	if (typeof onCreated == 'function') {
		onCreated()
	}
}

export const destroyAppContainer = () => {
	document.querySelector('.cdc-tools-app').remove()
	console.log('CDC Toolbox App - %cRemoved', logStyles.gray)
}

export const injectAppContainer = (onCreated) => {
	// use Tenant ID
	onElementExists('.fd-info-label__text', () => initAppContainer(onCreated))
}
