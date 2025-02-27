/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */ 
import { removeIgnoredFields, cleanEmailResponse, cleanResponse } from './dataSanitization'

describe('Data sanitization tests', () => {
  test('removeIgnoredFields removes specified fields from objects', () => {
    const input = {
      field1: 'value1',
      callId: 'callIdValue',
      time: 'timeValue',
      nested: { field2: 'value2', callId: 'nestedCallId', time: 'nestedTime' },
    }
    const output = removeIgnoredFields(input)
    expect(output).toEqual({ field1: 'value1', nested: { field2: 'value2' } })
  })

  test('cleanEmailResponse removes specific fields from response', () => {
    const input = {
      doubleOptIn: { nextURL: 'url', nextExpiredURL: 'expiredURL' },
      emailVerification: { nextURL: 'verifyURL' },
      callId: 'callIdValue',
      context: 'contextValue',
      errorCode: 'errorCodeValue',
      statusCode: 'statusCodeValue',
      statusReason: 'statusReasonValue',
      time: 'timeValue',
      apiVersion: 'apiVersionValue',
    }
    cleanEmailResponse(input)
    expect(input).toEqual({
      doubleOptIn: {},
      emailVerification: {},
    })
  })

  test('cleanResponse removes specific fields from response', () => {
    const input = {
      rba: 'rbaValue',
      security: { accountLockout: 'accountValue', captcha: 'captchaValue', ipLockout: 'ipValue' },
      passwordReset: { resetURL: 'resetURLValue' },
      preferencesCenter: { redirectURL: 'redirectURLValue' },
    }
    cleanResponse(input)
    expect(input).toEqual({
      security: {},
      passwordReset: {},
      preferencesCenter: {},
    })
  })
  
  //  describe('deepEqual tests', () => {
  //    test('deepEqual returns true for identical objects', () => {
  //      const obj1 = { a: 1, b: { c: 2, d: 3 } }
  //      const obj2 = { a: 1, b: { c: 2, d: 3 } }
  //      expect(deepEqual(obj1, obj2)).toBe(true)
  //    })

  //    test('deepEqual returns false for different objects', () => {
  //      const obj1 = { a: 1, b: { c: 2, d: 3 } }
  //      const obj2 = { a: 1, b: { c: 2, d: 4 } }
  //      expect(deepEqual(obj1, obj2)).toBe(false)
  //    })

  //    test('deepEqual returns true for objects with different key order', () => {
  //      const obj1 = { a: 1, b: { c: 2, d: 3 } }
  //      const obj2 = { b: { d: 3, c: 2 }, a: 1 }
  //      expect(deepEqual(obj1, obj2)).toBe(true)
  //    })

  //    test('deepEqual returns false for objects with different keys', () => {
  //      const obj1 = { a: 1, b: { c: 2, d: 3 } }
  //      const obj2 = { a: 1, b: { c: 2, e: 3 } }
  //      expect(deepEqual(obj1, obj2)).toBe(false)
  //    })

  //    test('deepEqual returns true for identical arrays', () => {
  //      const arr1 = [1, 2, { a: 3, b: 4 }]
  //      const arr2 = [1, 2, { a: 3, b: 4 }]
  //      expect(deepEqual(arr1, arr2)).toBe(true)
  //    })

  //    test('deepEqual returns false for different arrays', () => {
  //      const arr1 = [1, 2, { a: 3, b: 4 }]
  //      const arr2 = [1, 2, { a: 3, b: 5 }]
  //      expect(deepEqual(arr1, arr2)).toBe(false)
  //    })

  //    test('deepEqual returns true for identical primitive values', () => {
  //      expect(deepEqual(1, 1)).toBe(true)
  //      expect(deepEqual('test', 'test')).toBe(true)
  //      expect(deepEqual(null, null)).toBe(true)
  //    })

  //    test('deepEqual returns false for different primitive values', () => {
  //      expect(deepEqual(1, 2)).toBe(false)
  //      expect(deepEqual('test', 'Test')).toBe(false)
  //      expect(deepEqual(null, undefined)).toBe(false)
  //    })

  //    test('deepEqual returns true for nested objects with different key order', () => {
  //      const obj1 = { a: 1, b: { c: 2, d: { e: 3, f: 4 } } }
  //      const obj2 = { b: { d: { f: 4, e: 3 }, c: 2 }, a: 1 }
  //      expect(deepEqual(obj1, obj2)).toBe(true)
  //    })
  //  })
})
