const fs = require('fs')
const path = require('path')
const html = fs.readFileSync(
	path.resolve(__dirname, '../../public/index.html'),
	'utf8',
)
jest.dontMock('fs')
jest.useFakeTimers()

const { htmlToElem } = require('./utils')
const {
	injectAppContainer,
	initAppContainer,
	destroyAppContainer,
	CDC_TOOLS_APP_CLASS,
	TENANT_ID_CLASS,
} = require('./injectAppContainer')

const tenantIdDivMock = `\
<span class="${TENANT_ID_CLASS}" title="Tenant ID">000000000999999999</span>`

it('CDC Toolbox container is injected to the DOM', () => {
	document.documentElement.innerHTML = html.toString()
	initAppContainer()
	const injectedContainer = document.querySelectorAll(`.${CDC_TOOLS_APP_CLASS}`)
	expect(injectedContainer.length).toBe(1)
})

it('CDC Toolbox menu buttons are removed from the DOM', () => {
	document.documentElement.innerHTML = html.toString()
	initAppContainer()
	destroyAppContainer()
	const injectedContainer = document.querySelectorAll(`.${CDC_TOOLS_APP_CLASS}`)
	expect(injectedContainer.length).toBe(0)
})

it('CDC Toolbox container is injected only when tenant ID is present on the DOM', () => {
	document.documentElement.innerHTML = html.toString()

	let tenantId, tenantIdParent, injectedContainer

	tenantId = document.querySelectorAll(`.${TENANT_ID_CLASS}`)
	expect(tenantId.length).toBe(1)

	// Remove tenant ID
	tenantIdParent = tenantId[0].parentNode
	tenantId[0].remove()

	tenantId = document.querySelectorAll(`.${TENANT_ID_CLASS}`)
	expect(tenantId.length).toBe(0)

	injectAppContainer()
	jest.runOnlyPendingTimers()

	injectedContainer = document.querySelectorAll(`.${CDC_TOOLS_APP_CLASS}`)
	expect(injectedContainer.length).toBe(0)

	// After tenant id div added, the container should be injected
	tenantIdParent.appendChild(htmlToElem(tenantIdDivMock))
	jest.runOnlyPendingTimers()

	injectedContainer = document.querySelectorAll(`.${CDC_TOOLS_APP_CLASS}`)
	expect(injectedContainer.length).toBe(1)
})
