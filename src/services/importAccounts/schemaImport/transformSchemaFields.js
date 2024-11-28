import { hasNestedObject, isFieldDetailObject } from '../utils'
import { subscriptionObjectStructure } from './subscriptionFields/subscriptionFields'

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
      id: key.replace('Schema', ''),
      name: key.replace('Schema', ''),
      value: false,
      branches: transformSchema(value.fields, key.replace('Schema', '')),
      switchId: 'object',
    }
  }
}
function transformSchema(fields, parentKey) {
  const transformedSchema = []
  for (let key in fields) {
    console.log('key', key)
    if (fields.hasOwnProperty(key)) {
      const fieldDetail = fields[key]
      const splitKeys = key.split('.')
      let currentLevel = transformedSchema
      let accumulatedKey = parentKey

      if (parentKey === 'subscriptions' && splitKeys.length > 0) {
        const existing = transformSubscriptions(splitKeys, currentLevel, accumulatedKey)
        if (isFieldDetailObject(fieldDetail, parentKey) && hasNestedObject(fieldDetail)) {
          console.log('existing', existing)
          existing.branches = transformSchema(fieldDetail, parentKey)
        }
        continue
      }

      if (parentKey === 'addressSchema' && splitKeys.length > 1) {
        currentLevel = transformAddresses(splitKeys, currentLevel, accumulatedKey)
        continue
      }
      splitKeys.forEach((part, index) => {
        let id
        accumulatedKey = accumulatedKey ? `${accumulatedKey}.${part}` : part // Incrementally build the id

        id = `${parentKey}.${part}`
        let existing = currentLevel.find((item) => item.id === accumulatedKey)
        if (!existing) {
          existing = {
            id: accumulatedKey,
            name: part,
            value: false,
            branches: [],
            switchId: 'object',
          }
          currentLevel.push(existing)
        }

        if (index === splitKeys.length - 1) {
          if (isFieldDetailObject(fieldDetail) && hasNestedObject(fieldDetail)) {
            existing.branches = transformSchema(fieldDetail, parentKey)
          }
        } else {
          currentLevel = existing.branches
        }
      })
    }
  }
  return transformedSchema
}

function transformSubscriptions(splitKeys, currentLevel, accumulatedKey) {
  const id = splitKeys.join('.')
  accumulatedKey = accumulatedKey ? `${accumulatedKey}.${id}` : id
  let existing = currentLevel.find((item) => item.id === id)
  if (!existing) {
    existing = {
      id: accumulatedKey,
      name: id,
      value: false,
      branches: subscriptionObjectStructure(accumulatedKey),
      switchId: 'object',
    }
    currentLevel.push(existing)
  }
  return existing
}
function transformAddresses(splitKeys, currentLevel, accumulatedKey) {
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
        id: accumulatedKey ? `${accumulatedKey}.${id}` : id,
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
