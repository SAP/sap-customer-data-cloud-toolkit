import { getOptionsFromTree, processArray } from './utils/utils'

export function exportSchemaData(items, schemaData) {
  const { ids: options, switchIds: switchOptions } = getOptionsFromTree(items)
  const optionKeys = findMatches(schemaData, options)

  let switchRemoveFields = []
  if (switchOptions.length > 0) {
    const switchKeys = findMatches(schemaData, switchOptions)
    switchRemoveFields = switchKeys.map((item) => {
      return item.replace('.fields', '').replace('Schema', '')
    })
    switchRemoveFields = processArray(switchRemoveFields)
  }
  const removeFields = [...new Set([...optionKeys, ...switchRemoveFields])]
  console.log('removeFields', removeFields)
  return removeFields
}

const findMatches = (obj, matchArray, parentKey = '', resultKeys = []) => {
  Object.entries(obj).forEach(([key, value]) => {
    const fullKey = parentKey ? `${parentKey}.${key}` : key
    const keySegments = fullKey.split('.')
    const lastSegment = keySegments[keySegments.length - 1]
    matchArray.forEach((match) => {
      const [matchKey, matchParentKey] = match.split('.')

      if (key === 'subscriptionsSchema') {
        resultKeys.push(...generateSubscriptionStrings(value, match, fullKey))
      }

      if (lastSegment === matchKey && parentKey.includes(matchParentKey)) {
        resultKeys.push(fullKey.replace('.fields', '').replace('Schema', ''))
      }
    })

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      findMatches(value, matchArray, fullKey, resultKeys)
    }
  })

  return resultKeys
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
