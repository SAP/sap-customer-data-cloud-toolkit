/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import XmlValidator from './xmlValidator'
import * as EmailsTestData from '../emails/dataTest'

describe('html validator test suite', () => {
  const htmlString = '<a attr="<true">a<b>b</b><c/></a>'

  test('success', () => {
    let result = XmlValidator.validate(EmailsTestData.emailTemplate)
    expect(result).toBeTruthy()
    result = XmlValidator.validate(htmlString)
    expect(result).toBeTruthy()
  })

  test('unknown tag', () => {
    const html = '<p> Hello, </tr1>\r\n'
    const result = XmlValidator.validate(html)
    expect(result.err.code).toBeDefined()
    expect(result.err.msg).toBeDefined()
  })

  test('several root elements', () => {
    const html = htmlString + '<d>d</d>'
    const result = XmlValidator.validate(html)
    expect(result.err.code).toBeDefined()
    expect(result.err.msg).toBeDefined()
  })

  test('case sensitive tags', () => {
    const html = htmlString.replace('</a>', '</A>')
    const result = XmlValidator.validate(html)
    expect(result.err.code).toBeDefined()
    expect(result.err.msg).toBeDefined()
  })

  test('no closing tag', () => {
    const html = '<a><br></a>'
    const result = XmlValidator.validate(html)
    expect(result.err.code).toBeDefined()
    expect(result.err.msg).toBeDefined()
  })

  test('improper nesting', () => {
    const html = '<a><b></a></b>'
    const result = XmlValidator.validate(html)
    expect(result.err.code).toBeDefined()
    expect(result.err.msg).toBeDefined()
  })

  test('open tag character', () => {
    const html = '<a>Hello <World</a>'
    const result = XmlValidator.validate(html)
    expect(result.err.code).toBeDefined()
    expect(result.err.msg).toBeDefined()
  })
})
