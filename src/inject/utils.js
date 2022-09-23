export const getInnerText = (domElement) =>
	domElement?.textContent.trim().replaceAll('  ', '').replaceAll('\n', ' ')

/**
 * Finds all elements in the entire page matching `selector`, even if they are in shadowRoots.
 * Just like `querySelectorAll`, but automatically expand on all child `shadowRoot` elements.
 * @see https://stackoverflow.com/a/71692555/2228771
 */
export function querySelectorAllShadows(selector, element = document.body) {
	// recurse on childShadows
	const childShadows = Array.from(element.querySelectorAll('*'))
		.map((el) => el.shadowRoot)
		.filter(Boolean)

	const childResults = childShadows.map((child) =>
		querySelectorAllShadows(selector, child),
	)

	// fuse all results into singular, flat array
	const result = Array.from(element.querySelectorAll(selector))
	return result.concat(childResults).flat()
}

// Create a New DOM Element from HTML String - https://www.w3docs.com/snippets/javascript/how-to-create-a-new-dom-element-from-html-string.html
export function htmlToElem(html) {
	const temp = document.createElement('template')
	html = html.trim() // Never return a space text node as a result
	temp.innerHTML = html
	return temp.content.firstChild
}

// Run function when element exists
export const onElementExists = (elemSelector, onExists) => {
	const elem = querySelectorAllShadows(elemSelector)
	if (!elem.length) {
		return setTimeout(() => onElementExists(elemSelector, onExists), 75)
	} else {
		if (typeof onExists == 'function') {
			onExists(elem)
		}
	}
}

// Watch changes to element: created, removed
export const watchElement = (args) => {
	const { onCreated, onRemoved, elemSelector } = args

	if (querySelectorAllShadows(elemSelector).length) {
		if (!args.exists) {
			args.exists = true
			if (typeof onCreated == 'function') {
				onCreated(args)
			}
		}
	} else {
		if (args.exists) {
			args.exists = false
			if (typeof onRemoved == 'function') {
				onRemoved(args)
			}
		}
	}

	setTimeout(() => watchElement(args), 75)
}

// Created this function because CDC is blocking window.addEventListener("onhashchange",..
export const onHashChange = (onChange, prevHash) => {
	if (window.location.hash !== prevHash) {
		prevHash = window.location.hash
		if (typeof onChange == 'function') {
			onChange()
		}
	}
	setTimeout(() => onHashChange(onChange, prevHash), 75)
}

// Console.log styles
export const logStyles = {
	green: [
		'color: #fff',
		'background-color: green',
		'padding: 2px 4px',
		'border-radius: 2px',
	].join(';'),
	gray: [
		'color: #fff',
		'background-color: #444',
		'padding: 2px 4px',
		'border-radius: 2px',
	].join(';'),
}
