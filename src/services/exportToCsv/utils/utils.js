import { generateSubscriptionStrings } from '../schemaMatches'

export function getOptionsFromTree(items) {
  let ids = []
  let switchIds = []

  items.forEach((item) => {
    if (item.value === true) {
      if (item.switchId && item.branches.length === 0) {
        switchIds.push(item)
      } else {
        ids.push(item)
      }
    }
    if (item.branches && item.branches.length > 0) {
      const { ids: childIds, switchIds: childSwitchIds } = getOptionsFromTree(item.branches)
      ids = ids.concat(childIds)
      switchIds = switchIds.concat(childSwitchIds)
    }
  })

  return { ids, switchIds }
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
export function exportArrayData(inputArray) {
  return inputArray.map((item) => {
    let parts = item.split('.')
    let result = []
    for (let i = 0; i < parts.length; i++) {
      result.push(parts[i])
      if (i > 0 && i < parts.length - 1 && isNaN(parts[i + 1])) {
        result.push('0')
      }
    }
    return result.join('.')
  })
}
export function processArray(items, parentKey = '') {
  const resultArray = []
  const objectArray = []
  items.forEach((item) => {
    const { id, switchId, branches } = item
    const newParentKey = parentKey ? `${parentKey}.${id.split('.').pop()}` : id

    if (switchId.operation === 'array') {
      resultArray.push(id)
    } else {
      objectArray.push(id)
    }
  })

  return { resultArray, objectArray }
}
