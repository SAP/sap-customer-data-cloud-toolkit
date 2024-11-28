import { generateSubscriptionStrings } from '../schemaMatches'

export function getOptionsFromTree(items) {
  let ids = []
  let switchIds = []

  items.forEach((item) => {
    if (item.value === true) {
      if (item.switchId && item.branches.length === 0) {
        console.log('item', item)
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
export function getOptionsFromSchemaTree(items) {
  let ids = []
  let switchIds = []

  items.forEach((item) => {
    if (item.switchId && item.value === true) {
      switchIds.push(traverseStructure(item))
    } else {
      ids.push(item)
    }
    if (item.branches && item.branches.length > 0) {
      const { ids: childIds, switchIds: childSwitchIds } = getOptionsFromSchemaTree(item.branches)
      ids = ids.concat(childIds)
      switchIds = switchIds.concat(childSwitchIds)
    }
  })

  return { ids, switchIds }
}
export function traverseStructure(items) {
  const result = []

  const traverse = (node, path = '') => {
    const currentPath = path ? `${path}.${node.name}` : node.name

    if (node.switchId === 'object' && node.value === true && node.branches.length === 0) {
      result.push(currentPath)
    }

    if (node.branches && node.branches.length > 0) {
      node.branches.forEach((branch, index) => {
        const newPath = node.switchId === 'array' && node.value === true ? `${currentPath}.${index}` : currentPath
        traverse(branch, newPath)
      })
    }
  }

  if (Array.isArray(items)) {
    items.forEach((item) => traverse(item))
  } else {
    traverse(items)
  }

  return result
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
