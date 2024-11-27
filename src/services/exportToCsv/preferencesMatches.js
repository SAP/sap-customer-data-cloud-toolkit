import { getOptionsFromTree, processArray } from './utils/utils'

export function exportPreferencesData(items, preferencesData) {
  const { ids: options, switchIds: switchOptions } = getOptionsFromTree(items)
  const optionKeys = findMatches(options)
  if (optionKeys === undefined) {
    return
  }
  let switchRemoveFields = []
  if (switchOptions.length > 0) {
    const switchKeys = findMatches(preferencesData, switchOptions)
    switchRemoveFields = switchKeys.map((item) => {
      return item.replace('.fields', '').replace('Schema', '')
    })
    switchRemoveFields = processArray(switchRemoveFields)
  }
  const removeFields = [...new Set([...optionKeys, ...switchRemoveFields])]
  console.log('removeFieldspreferences', removeFields)
  return removeFields
}
const findMatches = (obj) => {
  const results = []
  for (let key of obj) {
    if (key.branches.length === 0) {
      results.push(`preferences.${key.id}`)
    }
  }
  return results
}
// const findMatches = (obj, matchArray, parentKey = '', resultKeys = []) => {
//   Object.entries(obj).forEach(([key, value]) => {
//     matchArray.forEach((match) => {
//       if (key === 'preferences') {
//         resultKeys.push(...preferencesKeys(value, match, key))
//         return resultKeys
//       }
//     })
//   })
// }
// const preferencesKeys = (obj, matchString, indexKey, resultKeys = []) => {
//   const part = matchString.split('.')
//   console.log('indexKey', indexKey)
//   const matchingKeys = Object.keys(obj).filter((key) => key.startsWith(part[0]))
//   if (matchingKeys.length > 0 && part.length > 2) {
//     console.log('part', part)
//     console.log('part.length', part.length)
//     console.log('matchString', matchString)
//     // Check if each segment length is greater than 3
//     resultKeys.push(`${indexKey}.${matchString}`)
//     // resultKeys.push(`${indexKey}.${matchString}`)
//     console.log('resultKeys', resultKeys)

//     return resultKeys
//   }

//   return resultKeys
// }
