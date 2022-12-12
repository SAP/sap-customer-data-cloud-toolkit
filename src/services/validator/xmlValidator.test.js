import XmlValidator from './xmlValidator'
import * as EmailsTestData from '../emails/data_test'

describe('html validator test suite', () => {
  const htmlString = '<a>a<b>b</b><c/></a>'

  test('success', () => {
    let error = XmlValidator.validate(EmailsTestData.emailTemplate)
    expect(error.length).toEqual(0)
    error = XmlValidator.validate(htmlString)
    expect(error.length).toEqual(0)
  })

  test('unknown tag', () => {
    const html = '<p> Hello, </tr1>\r\n'
    const error = XmlValidator.validate(html)
    expect(error.length).toBeGreaterThan(0)
  })

  test('several root elements', () => {
    const html = htmlString + '<d>d</d>'
    const error = XmlValidator.validate(html)
    expect(error.length).toBeGreaterThan(0)
  })

  test('case sensitive tags', () => {
    const html = htmlString.replace('</a>', '</A>')
    const error = XmlValidator.validate(html)
    expect(error.length).toBeGreaterThan(0)
  })

  test('prolog in the end', () => {
    const html = htmlString + '<?xml version="1.0" encoding="UTF-8"?>'
    const error = XmlValidator.validate(html)
    expect(error.length).toBeGreaterThan(0)
  })

  test('no closing tag', () => {
    const html = '<a><br></a>'
    const error = XmlValidator.validate(html)
    expect(error.length).toBeGreaterThan(0)
  })

  test('improper nesting', () => {
    const html = '<a><b></a></b>'
    const error = XmlValidator.validate(html)
    expect(error.length).toBeGreaterThan(0)
  })
})
