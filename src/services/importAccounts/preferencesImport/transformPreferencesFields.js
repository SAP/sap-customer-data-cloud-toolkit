/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { hasNestedObject, isFieldDetailObject } from '../utils'
import { addPreferencesBranches } from './aditionalStructure/preferencesAditionalBranches'

export function extractAndTransformPreferencesFields(preferencesData) {
  const fieldsTransformed = []
  Object.entries(preferencesData).forEach(([key, value]) => {
    if (value && typeof value === 'object') {
      const transformed = transformField(key, value)
      if (transformed) {
        fieldsTransformed.push(transformed)
      }
    }
  })
  return fieldsTransformed
}
function transformField(key, value) {
  if (key === 'preferences') {
    return {
      id: key,
      name: 'preferences',
      value: false,
      branches: transformPreferences(value, key),
    }
  }

  return null
}
function transformPreferences(fields, parentKey, skipFields = true) {
  const transformedSchema = []
  for (let key in fields) {
    if (fields.hasOwnProperty(key)) {
      const fieldDetail = fields[key]
      const splitKeys = key.split('.')
      let currentLevel = transformedSchema
      let accumulatedKey = parentKey
      createNode(splitKeys, fieldDetail, parentKey, skipFields, currentLevel, accumulatedKey)
    }
  }
  return transformedSchema
}
function createNode(splitKeys, fieldDetail, parentKey, skipFields, currentLevel, accumulatedKey) {
  splitKeys.forEach((part, index) => {
    let id = splitKeys.slice(0, index + 1).join('.')
    let existing = currentLevel.find((item) => item.id === id)
    accumulatedKey = accumulatedKey ? `${accumulatedKey}.${part}` : part
    if (!existing) {
      existing = {
        id: accumulatedKey,
        name: part,
        value: false,
        branches: [],
      }
      currentLevel.push(existing)
    }

    if (index === splitKeys.length - 1) {
      if (isFieldDetailObject(fieldDetail, skipFields) && hasNestedObject(fieldDetail)) {
        existing.branches = transformPreferences(fieldDetail, parentKey, skipFields)
      }
      if (parentKey === 'preferences') {
        addPreferencesBranches(existing.branches, existing.id)
      }
    } else {
      currentLevel = existing.branches
    }
  })
  console.log('currentLevel END ', currentLevel)
  return currentLevel
}
