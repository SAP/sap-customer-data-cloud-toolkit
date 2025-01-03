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
  return fieldsTransformed
}
function transformSchemaField(key, value) {
  if (value.fields && key === 'addressesSchema') {
    return {
      id: key.replace('Schema', ''),
      name: key.replace('Schema', ''),
      value: false,
      branches: accumulateKeys(value.fields, key.replace('Schema', '')),
      switchId: 'object',
    }
  } else if (value.fields) {
    return {
      id: key.replace('Schema', ''),
      name: key.replace('Schema', ''),
      value: false,
      branches: transformSchema(value.fields, key.replace('Schema', '')),
      switchId: 'object',
    }
  }
}
function accumulateKeys(fields, parentKey) {
  const branches = []
  for (const [key, value] of Object.entries(fields)) {
    const id = `${parentKey}.${key}`
    if (value.type) {
      branches.push({
        id: id,
        name: key,
        value: false,
        branches: [],
      })
    } else {
      branches.push({
        id: id,
        name: key,
        value: false,
        branches: accumulateKeys(value, id),
      })
    }
  }
  return branches
}

function transformSchema(fields, parentKey) {
  const transformedSchema = []
  for (let key in fields) {
    if (fields.hasOwnProperty(key)) {
      const fieldDetail = fields[key]
      const splitKeys = key.split('.')
      let currentLevel = transformedSchema
      let accumulatedKey = parentKey

      if (parentKey === 'subscriptions' && splitKeys.length > 0) {
        const existing = transformSubscriptions(splitKeys, currentLevel, accumulatedKey)
        if (isFieldDetailObject(fieldDetail, parentKey) && hasNestedObject(fieldDetail)) {
          existing.branches = transformSchema(fieldDetail, parentKey)
        }
        continue
      }

      splitKeys.forEach((part, index) => {
        accumulatedKey = accumulatedKey ? `${accumulatedKey}.${part}` : part // Incrementally build the id

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
