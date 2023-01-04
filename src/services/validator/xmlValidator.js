import { XMLValidator } from 'fast-xml-parser'

class XmlValidator {
  static validate(xmlString) {
    return XMLValidator.validate(xmlString, { allowBooleanAttributes: true, ignoreAttributes: false })
  }
}

export default XmlValidator
