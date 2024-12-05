import { getOptionsFromSchemaTree } from './utils/utils'

export function exportSchemaData(items) {
  const options = getOptionsFromSchemaTree(items)

  const fields = new Set()

  fields.add([...options])
  return fields
}

export function generateSubscriptionStrings(schema, str, fullKey) {
  const result = []

  let current = schema.fields
  const cleanfullKey = fullKey.replace('Schema', '')
  const cleanString = str.replace('.subscriptionsSchema', '')
  if (current[cleanString]) {
    result.push(`${cleanfullKey}.${cleanString}.tags`)
    result.push(`${cleanfullKey}.${cleanString}.doubleOptIn.isExternallyVerified`)
    result.push(`${cleanfullKey}.${cleanString}.lastUpdatedSubscriptionState`)
    result.push(`${cleanfullKey}.${cleanString}.isSubscribed`)
  }
  return result
}
