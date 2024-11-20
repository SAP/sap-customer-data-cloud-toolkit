import { getOptionsFromTree, processArray } from './utils/utils'

export function exportCommunicationData(items, communicationData) {
  const { ids: options, switchIds: switchOptions } = getOptionsFromTree(items)
  const optionKeys = findMatches(communicationData, options)

  let switchRemoveFields = []
  if (switchOptions.length > 0) {
    const switchKeys = findMatches(communicationData, switchOptions)
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
      if (key === 'communications') {
        resultKeys.push(...generateCommunicationStrings(value, match, fullKey))
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
const preferencesKeys = (obj, matchString, indexKey, resultKeys = []) => {
  const part = matchString.split('.')
  const matchingKeys = Object.keys(obj).filter((key) => key.startsWith(part[0]))
  if (matchingKeys.length > 0 && part.length > 1) {
    resultKeys.push(`${indexKey}.${matchString}`)
    console.log('resultKeys', resultKeys)

    return resultKeys
  }

  return resultKeys
}
const generateCommunicationStrings = (communications, str) => {
  const result = []

  const parts = str.split('.')
  const topicChannelId = parts[1]
  const matchedItem = Object.values(communications).find((item) => item.topicChannelId === topicChannelId)
  if (parts[0] === 'status') {
    result.push(`communications.${topicChannelId}.status`)
  }
  if (matchedItem) {
    let fullKey = `communications.${matchedItem.topicChannelId}`

    if (matchedItem.schema && matchedItem.schema.properties && matchedItem.schema.properties.optIn) {
      const optInProperties = matchedItem.schema.properties.optIn.properties
      const optInKey = parts[0]

      if (optInProperties[optInKey]) {
        result.push(`${fullKey}.optIn.${optInKey}`)
      } else {
        Object.keys(optInProperties).forEach((key) => {
          result.push(`${fullKey}.optIn.${key}`)
        })
      }
    }
  }

  return result
}
