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
      results.push(`${key.id}`)
    }
  }
  return results
}
