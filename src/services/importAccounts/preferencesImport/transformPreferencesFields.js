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
  console.log('fieldsTransformed', fieldsTransformed)
  return fieldsTransformed
}
function transformField(key, value) {
  if (key === 'preferences') {
    return {
      id: key,
      name: 'consent statements',
      value: false,
      branches: transformSchema(value, key),
    }
  }

  return null
}
function transformSchema(fields, parentKey, skipFields = true) {
  const transformedSchema = []
  for (let key in fields) {
    if (fields.hasOwnProperty(key)) {
      const fieldDetail = fields[key]
      const splitKeys = key.split('.')
      let currentLevel = transformedSchema
      console.log('splitKeys', splitKeys)

      splitKeys.forEach((part, index) => {
        let id = splitKeys.slice(0, index + 1).join('.')
        let existing = currentLevel.find((item) => item.id === id)
        if (!existing) {
          existing = {
            id: id,
            name: part,
            value: false,
            branches: [],
          }
          currentLevel.push(existing)
        }

        if (index === splitKeys.length - 1) {
          if (isFieldDetailObject(fieldDetail, skipFields) && hasNestedObject(fieldDetail)) {
            existing.branches = transformSchema(fieldDetail, parentKey, skipFields)
          }
          if (parentKey === 'preferences') {
            addPreferencesBranches(existing.branches, existing.id)
          }
        } else {
          currentLevel = existing.branches
        }
      })
    }
  }
  return transformedSchema
}
