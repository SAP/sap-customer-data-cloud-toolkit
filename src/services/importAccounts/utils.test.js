/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { hasNestedObject, isFieldDetailObject } from './utils'

describe('Utils functions test suite', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('hasNestedObject should return true for nested objects', () => {
    const field = {
      key1: 'value1',
      key2: {
        nestedKey: 'nestedValue',
      },
    }
    const result = hasNestedObject(field)
    expect(result).toBe(true)
  })

  test('hasNestedObject should return false for non-nested objects', () => {
    const field = {
      key1: 'value1',
      key2: 'value2',
    }
    const result = hasNestedObject(field)
    expect(result).toBe(false)
  })

  test('isFieldDetailObject should return true for valid field detail object', () => {
    const fieldDetail = {
      customField: 'customValue',
    }
    const result = isFieldDetailObject(fieldDetail)
    expect(result).toBe(true)
  })

  test('isFieldDetailObject should return false for invalid field detail object', () => {
    const fieldDetail = {
      required: true,
      type: 'string',
    }
    const result = isFieldDetailObject(fieldDetail)
    expect(result).toBe(false)
  })

  test('isFieldDetailObject should return true for valid field detail object when skipFields is false', () => {
    const fieldDetail = {
      required: true,
      type: 'string',
    }
    const result = isFieldDetailObject(fieldDetail, false)
    expect(result).toBe(true)
  })
})
