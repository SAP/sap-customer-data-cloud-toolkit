import { generateSubscriptionStrings } from '../schemaMatches'

export function getOptionsFromTree(items) {
  let ids = []

  items.forEach((item) => {
    if (item.value === true) {
      ids.push(item)
    }
    if (item.branches && item.branches.length > 0) {
      const { ids: childIds } = getOptionsFromTree(item.branches)
      ids = ids.concat(childIds)
    }
  })

  return ids
}
export function getOptions(configurations, parentFormattedId = '', parentOperation = '') {
  const result = []

  for (const configuration of configurations) {
    let currentId = configuration.id

    if (parentFormattedId) {
      currentId = `${parentFormattedId}.${configuration.name}`
    }

    if (parentOperation === 'array') {
      currentId = formatArrayId(currentId)
    }

    if (configuration.value) {
      if (configuration.switchId && configuration.switchId.operation === 'array' && configuration.branches.length === 0) {
        result.push(currentId)
      } else if (configuration.branches.length === 0) {
        result.push(currentId)
      }
    }

    if (configuration.branches) {
      const childResult = getOptions(configuration.branches, currentId, configuration.switchId ? configuration.switchId.operation : '')
      if (childResult) {
        result.push(...childResult)
      }
    }
  }
  return result
}

function formatArrayId(id) {
  const parts = id.split('.')
  const lastPart = parts.pop()
  return `${parts.join('.')}.0.${lastPart}`
}
export function getOptionsFromSchemaTree(structure) {
  const result = []

  const traverse = (node, path = '', parentOperation = '') => {
    let currentPath = path ? `${path}.${node.name}` : node.name

    if (parentOperation === 'array' && path) {
      currentPath = `${path}.0.${node.name}`
    }

    if (node.value === true && node.branches.length === 0) {
      result.push(currentPath)
    }

    if (node.value === true && node.branches && node.branches.length > 0) {
      node.branches.forEach((branch) => {
        const childOperation = branch.switchId ? branch.switchId : ''
        const nextParentOperation = node.switchId ? node.switchId : parentOperation

        if (nextParentOperation === 'array' && childOperation === 'object') {
          traverse(branch, currentPath, nextParentOperation)
        } else if (nextParentOperation === 'object' && childOperation === 'array') {
          traverse(branch, `${currentPath}`, nextParentOperation)
        } else if (nextParentOperation === 'array' && childOperation === 'array') {
          traverse(branch, `${currentPath}`, nextParentOperation)
        } else {
          traverse(branch, currentPath, nextParentOperation)
        }
      })
    }
  }

  structure.forEach((node) => traverse(node))
  return result
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
export function manipulateIds(items) {
  return items.map((item) => {
    const idParts = item.id.split('.')
    let newIdParts = []
    let parentIsArray = false

    for (let i = 0; i < idParts.length; i++) {
      const part = idParts[i]
      const currentItem = items.find((it) => it.id === idParts.slice(0, i + 1).join('.'))

      if (currentItem && currentItem.switchId.operation === 'array') {
        if (parentIsArray) {
          newIdParts.push(part)
        } else {
          newIdParts.push('0', part)
        }
        parentIsArray = true
      } else {
        if (parentIsArray) {
          newIdParts.push('0', part)
        } else {
          newIdParts.push(part)
        }
        parentIsArray = false
      }
    }

    return newIdParts.join('.')
  })
}
