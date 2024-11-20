import { getOptionsFromTree, processArray } from './utils/utils'

export function exportPreferencesData(items, preferencesData) {
  const { ids: options, switchIds: switchOptions } = getOptionsFromTree(items)
  const optionKeys = findMatches(preferencesData, options)

  let switchRemoveFields = []
  if (switchOptions.length > 0) {
    const switchKeys = findMatches(preferencesData, switchOptions)
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
      if (key === 'preferences') {
        resultKeys.push(...preferencesKeys(value, match, key))
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
