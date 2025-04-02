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
    const fieldsToRemove = ['callId', 'time']
    const output = removeIgnoredFields(input, fieldsToRemove)
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
})
