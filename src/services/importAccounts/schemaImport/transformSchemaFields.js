/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { createNode, extractAndTransformFields, hasNestedObject, isFieldDetailObject } from '../utils'
import { subscriptionObjectStructure } from './subscriptionFields/subscriptionFields'
const SCHEMA = 'Schema'
const ADDRESSESSCHEMA = 'addressesSchema'
export function extractAndTransformSchemaFields(schemaData) {
  return extractAndTransformFields(schemaData, transformSchemaField)
}

function transformSchemaField(key, value) {
  const removeSchemaWord = key.replace(SCHEMA, '')
  if (value.fields && key === ADDRESSESSCHEMA) {
    return {
      id: removeSchemaWord,
      name: removeSchemaWord,
      value: false,
      branches: accumulateKeys(value.fields, removeSchemaWord),
      switchId: 'object',
    }
  } else if (value.fields) {
    return {
      id: removeSchemaWord,
      name: removeSchemaWord,
      value: false,
      branches: transformSchema(value.fields, removeSchemaWord),
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

      createNode(splitKeys, fieldDetail, parentKey, currentLevel, accumulatedKey, false, {
        transformCallback: (existing, fieldDetail, parentKey) => {
          if (isFieldDetailObject(fieldDetail) && hasNestedObject(fieldDetail)) {
            existing.branches = transformSchema(fieldDetail, parentKey)
          }
        },
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
