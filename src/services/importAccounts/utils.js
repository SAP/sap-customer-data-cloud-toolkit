/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

export const preferencesFieldId = 'preferences'
export const communicationFieldId = 'communications'
export const communicationMandatoryFieldId = 'status'

export const getRootElements = [
  'uid',
  'dataCenter',
  'phoneNumber',
  'loginIds',
  'isActive',
  'isRegistered',
  'isVerified',
  'verified',
  'email',
  'regSource',
  'registered',
  'context',
  'lang',
]

export function hasNestedObject(field) {
  for (let key in field) {
    if (typeof field[key] === 'object' && field[key] !== null) {
      return true
    }
  }
  return false
}

export function isFieldDetailObject(fieldDetail, skipFields = true) {
  if (fieldDetail && typeof fieldDetail === 'object') {
    const stopFields = ['required', 'type', 'allowNull', 'writeAccess', 'tags']
    return skipFields ? !stopFields.some((field) => field in fieldDetail) : true
  }
  return false
}

export function extractAndTransformFields(data, transformsFields) {
  const fieldsTransformed = []
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'object') {
      const transformedField = transformsFields(key, value)
      if (transformedField) {
        fieldsTransformed.push(transformedField)
      }
    }
  })
  return fieldsTransformed
}

export function createNode(splitKeys, fieldDetail, parentKey, currentLevel, accumulatedKey, skipSwitch, options = {}) {
  const { skipFields = true, transformCallback, checkTreeBranchCallback } = options

  splitKeys.forEach((part, index) => {
    accumulatedKey = accumulatedKey ? `${accumulatedKey}.${part}` : part
    let existing = currentLevel.find((item) => item.id === accumulatedKey)
    if (!existing) {
      if (skipSwitch) {
        existing = {
          id: accumulatedKey,
          name: part,
          value: false,
          branches: [],
        }
      } else {
        existing = {
          id: accumulatedKey,
          name: part,
          value: false,
          branches: [],
          switchId: 'object',
        }
      }
      currentLevel.push(existing)
    }
    if (index === splitKeys.length - 1) {
      if (transformCallback) {
        transformCallback(existing, fieldDetail, parentKey, skipFields)
      }
      if (checkTreeBranchCallback) {
        checkTreeBranchCallback(fieldDetail, skipFields, currentLevel, existing, parentKey)
      }
    } else {
      currentLevel = existing.branches
    }
  })
  return currentLevel
}
