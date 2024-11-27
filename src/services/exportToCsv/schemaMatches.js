import { exportArrayData, getOptionsFromTree, processArray } from './utils/utils'

export function exportSchemaData(items) {
  const { ids: options, switchIds: switchOptions } = getOptionsFromTree(items)
  const optionKeys = findMatches(options)
  console.log('switchOptions', switchOptions)
  console.log('options', options)
  console.log('optionKeys', optionKeys)
  let exportNested = []
  if (switchOptions.length > 0) {
    const { resultArray: arrayData, objectArray: objectData } = processArray(switchOptions)
    const exportArray = exportArrayData(arrayData)
    exportNested = transformObjectData(exportArray, optionKeys)
    return exportNested
  }
  const removeFields = [...new Set([...optionKeys])]
  console.log('removeFields', removeFields)
  return removeFields
}
function transformObjectData(arrayData, objectData) {
  const transformedData = objectData.map((objItem) => {
    for (const arrItem of arrayData) {
      const parentNode = arrItem.split('.').slice(0, 2).join('.') // Extract 'data.loyalty'
      if (objItem.startsWith(parentNode)) {
        const nestedPath = objItem.replace(parentNode, '') // Extract '.rewardRedemption.redemptionDate'
        return `${parentNode}.0${nestedPath}` // Combine to form 'data.loyalty.0.rewardRedemption.redemptionDate'
      }
    }
    return objItem
  })
  return [...arrayData, ...transformedData]
}

// const findMatches = (obj, matchArray, parentKey = '', resultKeys = []) => {
//   Object.entries(obj).forEach(([key, value]) => {
//     const fullKey = parentKey ? `${parentKey}.${key}` : key
//     const keySegments = fullKey.split('.')
//     const lastSegment = keySegments[keySegments.length - 1]
//     matchArray.forEach((match) => {
//       const [matchParentKey, matchKey] = match.split('.')

//       if (key === 'subscriptionsSchema') {
//         resultKeys.push(...generateSubscriptionStrings(value, match, fullKey))
//       }

//       if (lastSegment === matchKey && parentKey.includes(matchParentKey)) {
//         resultKeys.push(fullKey.replace('.fields', '').replace('Schema', ''))
//       }
//     })

//     if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
//       findMatches(value, matchArray, fullKey, resultKeys)
//     }
//   })

//   return resultKeys
// }
const findMatches = (obj) => {
  const results = []
  for (let key of obj) {
    console.log('obejct', obj)
    console.log('key', key)
    console.log('key', key.branches)
    if (key.branches.length === 0) {
      results.push(key.id)
    }
  }
  return results
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
// ;[
//   'data.loyalty.0',
//   'data.loyalty.0.rewardPoints.0',
//   'data.loyalty.0.rewardRedemption.0',
//   'data.loyalty.0.rewardRedemption.0.redemptionDate.0',
//   'data.loyalty.0.rewardRedemption.0.redemptionPoint.0',
//   'data.loyalty.0.loyaltyStatus.0',
//   'data.loyalty.0.rewardAmount.0',
//   'data.loyalty.rewardPoints.0',
//   'data.loyalty.rewardRedemption.0',
//   'data.loyalty.rewardRedemption.0.redemptionDate.0',
//   'data.loyalty.rewardRedemption.0.redemptionPoint.0',
//   'data.loyalty.rewardRedemption.redemptionDate.0',
//   'data.loyalty.rewardRedemption.redemptionPoint.0',
//   'data.loyalty.loyaltyStatus.0',
//   'data.loyalty.rewardAmount.0',
// ]
// ;[
//   'data.loyalty.0.rewardPoints',
//   'data.loyalty.0.rewardRedemption.0.redemptionDate.0',
//   'data.loyalty.0.rewardRedemption.0.redemptionPoint.0',
//   'data.loyalty.0.loyaltyStatus',
//   'data.loyalty.0.rewardAmount',
// ]
