import { hasNestedObject, isFieldDetailObject } from '../utils'

export function extractAndTransformSchemaFields(schemaData) {
  const fieldsTransformed = []
  Object.entries(schemaData).forEach(([key, value]) => {
    if (value && typeof value === 'object') {
      const transformed = transformSchemaField(key, value)
      if (transformed) {
        fieldsTransformed.push(transformed)
      }
    }
  })
  console.log('fieldsTransformed', fieldsTransformed)
  return fieldsTransformed
}
function transformSchemaField(key, value) {
  if (value.fields) {
    return {
      id: key,
      name: key.replace('Schema', ''),
      value: false,
      branches: transformSchema(value.fields, key),
    }
  }
}
function transformSchema(fields, parentKey, skipFields = true) {
  const transformedSchema = []
  for (let key in fields) {
    if (fields.hasOwnProperty(key)) {
      const fieldDetail = fields[key]
      const splitKeys = key.split('.')
      let currentLevel = transformedSchema
      if (parentKey === 'subscriptionsSchema' && splitKeys.length > 1) {
        const existing = transformSubscriptions(splitKeys, currentLevel)
        if (isFieldDetailObject(fieldDetail, parentKey, skipFields) && hasNestedObject(fieldDetail)) {
          existing.branches = transformSchema(fieldDetail, parentKey, skipFields)
        }
        continue
      }

      if (parentKey === 'addressSchema' && splitKeys.length > 1) {
        currentLevel = transformAddresses(splitKeys, currentLevel)
        continue
      }
      splitKeys.forEach((part, index) => {
        let id

        id = `${part}.${parentKey}`
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
        } else {
          currentLevel = existing.branches
        }
      })
    }
  }
  return transformedSchema
}
function transformSubscriptions(splitKeys, currentLevel) {
  const id = splitKeys.join('.')
  let existing = currentLevel.find((item) => item.id === id)
  if (!existing) {
    existing = {
      id: id,
      name: id,
      value: false,
      branches: [],
    }
    currentLevel.push(existing)
  }
  return existing
}
function transformAddresses(splitKeys, currentLevel) {
  for (let index = 0; index < splitKeys.length; index++) {
    let id
    if (index === 0) {
      id = splitKeys[index] // First level id
    } else {
      id = splitKeys.slice(0, index + 1).join('.') // Subsequent levels id
    }

    let existing = currentLevel.find((item) => item.id === id)
    if (!existing) {
      existing = {
        id: id,
        name: id,
        value: false,
        branches: [],
      }
      currentLevel.push(existing)
    }
    currentLevel = existing.branches
  }
  return currentLevel
}
