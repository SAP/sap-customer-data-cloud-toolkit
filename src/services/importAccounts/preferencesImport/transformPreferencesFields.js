/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { createNode, extractAndTransformFields, hasNestedObject, isFieldDetailObject } from '../utils'
import { addPreferencesBranches } from './aditionalStructure/preferencesAditionalBranches'

export function extractAndTransformPreferencesFields(preferencesData) {
  return extractAndTransformFields(preferencesData, transformField)
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
function transformPreferences(fields, parentKey) {
  const transformPreferences = []
  for (let key in fields) {
    if (fields.hasOwnProperty(key)) {
      const fieldDetail = fields[key]
      const splitKeys = key.split('.')
      let currentLevel = transformPreferences
      let accumulatedKey = parentKey
      createNode(splitKeys, fieldDetail, parentKey, currentLevel, accumulatedKey, true, {
        transformCallback: (existing, fieldDetail, parentKey) => {
          if (isFieldDetailObject(fieldDetail) && hasNestedObject(fieldDetail)) {
            existing.branches = transformPreferences(fieldDetail, parentKey)
          }
          addPreferencesBranches(existing.branches, existing.id)
        },
      })
    }
  }
  return transformPreferences
}
