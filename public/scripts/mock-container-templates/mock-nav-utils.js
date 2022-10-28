/**
 * Finds all elements in the entire page matching `selector`, even if they are in shadowRoots.
 * Just like `querySelectorAll`, but automatically expand on all child `shadowRoot` elements.
 * @see https://stackoverflow.com/a/71692555/2228771
 */
function querySelectorAllShadows(selector, element = document.body) {
  // recurse on childShadows
  const childShadows = Array.from(element.querySelectorAll('*'))
    .map((el) => el.shadowRoot)
    .filter(Boolean)

  const childResults = childShadows.map((child) => querySelectorAllShadows(selector, child))

  // fuse all results into singular, flat array
  const result = Array.from(element.querySelectorAll(selector))
  return result.concat(childResults).flat()
}

// Create a New DOM Element from HTML String - https://www.w3docs.com/snippets/javascript/how-to-create-a-new-dom-element-from-html-string.html
function htmlToElem(html) {
  const temp = document.createElement('template')
  html = html.trim() // Never return a space text node as a result
  temp.innerHTML = html
  return temp.content.firstChild
}

// Run function when element exists
const onElementExists = (elemSelector, onExists) => {
  const elem = querySelectorAllShadows(elemSelector)
  if (!elem.length) {
    setTimeout(() => onElementExists(elemSelector, onExists), 75)
  } else {
    if (typeof onExists == 'function') {
      onExists(elem)
    }
  }
}
