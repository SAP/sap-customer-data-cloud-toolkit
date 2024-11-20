export async function exportToCSV(items, combinedData) {
  const { ids: options, switchIds: switchOptions } = getOptionsFromTree(items)

  console.log('options', options)
  console.log('combinedData', combinedData)
  console.log('switchOptions', switchOptions)

  const optionKeys = matchKeys(combinedData, options)

  let switchRemoveFields = []
  if (switchOptions.length > 0) {
    const switchKeys = matchKeys(combinedData, switchOptions)
    switchRemoveFields = switchKeys.map((item) => {
      return item.replace('.fields', '').replace('Schema', '')
    })
    switchRemoveFields = processArray(switchRemoveFields)
  }

  const removeFields = [...new Set([...optionKeys, ...switchRemoveFields])]
  console.log('removeFields', removeFields)

  createCSVFile(removeFields)
}
const matchKeys = (schema, matchArray) => {
  return findMatches(schema, matchArray)
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
      if (key === 'subscriptionsSchema') {
        resultKeys.push(...generateSubscriptionStrings(value, match, fullKey))
      }
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
function generateSubscriptionStrings(schema, str, fullKey) {
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

const processNestedObject = (obj, parentKey, indexKey, resultKeys) => {
  const allowedKeys = [
    'isConsentGranted',
    'actionTimestamp',
    'lastConsentModified',
    'language',
    'isActive',
    'isMandatory',
    'docVersion',
    'docDate',
    'customData',
    'tags',
    'entitlements',
    'locales',
    'langs',
  ]
  Object.entries(obj).forEach(([key, value]) => {
    if (allowedKeys.includes(key)) {
      if (key === 'customData' && Array.isArray(value)) {
        value.forEach((item, index) => {
          Object.entries(item).forEach(([subKey, subValue]) => {
            const fullKey = `${indexKey}.${parentKey}.${index}.${key}`
            resultKeys.push(fullKey)
          })
        })
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          const fullKey = `${indexKey}.${parentKey}.${index}.${key}`
          resultKeys.push(fullKey)
        })
      } else {
        const fullKey = `${indexKey}.${parentKey}.${key}`
        resultKeys.push(fullKey)
        if (typeof value === 'object' && value !== null) {
          processNestedObject(value, fullKey, resultKeys)
        }
      }
    }
  })
}

const getAllNestedKeys = (obj, parentKey, includeValues = false, specificKeys = []) => {
  const keys = []
  Object.entries(obj).forEach(([key, value]) => {
    const fullKey = `${parentKey}.${key}`
    if (Array.isArray(value) && includeValues) {
      value.forEach((item) => {
        if (typeof item === 'object' && item !== null) {
          Object.entries(item).forEach(([itemKey, itemValue]) => {
            keys.push(`${fullKey}.${itemKey}.${itemValue}`)
          })
        } else {
          keys.push(`${fullKey}.${value}`)
        }
      })
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      if (specificKeys.length > 0 && specificKeys.includes(key)) {
        keys.push(fullKey)
      } else if (specificKeys.length === 0) {
        keys.push(...getAllNestedKeys(value, fullKey, includeValues, specificKeys))
      }
    } else {
      keys.push(includeValues ? `${fullKey}.${value}` : fullKey)
    }
  })
  return keys
}
function createCSVFile(resultKeys) {
  console.log('RESULT-KEYS', resultKeys)
  const csvData = new Blob([resultKeys], { type: 'text/csv' })
  const csvURL = URL.createObjectURL(csvData)
  const link = document.createElement('a')
  link.href = csvURL
  link.download = 'csv_File.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function getOptionsFromTree(items) {
  let ids = []
  let switchIds = []

  items.forEach((item) => {
    if (item.value === true) {
      if (item.switchId && item.switchId.operation === 'array') {
        switchIds.push(item.switchId.checkBoxId)
      } else {
        ids.push(item.id)
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
function valueToCSV(headers) {
  const importAccountsData = [headers]

  const csvData = new Blob([importAccountsData], { type: 'text/csv' })
  const csvURL = URL.createObjectURL(csvData)
  const link = document.createElement('a')
  link.href = csvURL
  link.download = `csv_File.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function processArray(inputArray) {
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
