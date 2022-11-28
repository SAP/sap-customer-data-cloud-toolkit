import jsdom from 'jsdom'

class XmlValidator {
  static validate(htmlString) {
    const { window } = new jsdom.JSDOM()
    const parser = new window.DOMParser()
    const doc = parser.parseFromString(htmlString, 'text/xml')
    const error = doc.querySelector('parsererror')
    return error == null ? '' : error.textContent
  }
}

export default XmlValidator
