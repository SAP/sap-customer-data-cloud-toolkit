import { passwordObjectStructure } from '../importAccounts/passwordImport/passwordObjectStructure'
import { getOptionsFromTree } from './utils/utils'

export function exportPasswordData(items) {
  const { ids: options } = getOptionsFromTree(items)
  console.log('passwordObjectStructure', passwordObjectStructure())
  const optionsKeys = findMatches(passwordObjectStructure(), options)

  const removeFields = [...new Set([...optionsKeys])]

  return removeFields
}

const findMatches = (obj, matchArray, parentKey = '', resultKeys = []) => {
  const { id, branches } = obj
  const fullKey = parentKey ? `${parentKey}.${id}` : id

  matchArray.forEach((match) => {
    if (fullKey.includes(match)) {
      resultKeys.push(fullKey)
    }
  })

  if (branches && branches.length > 0) {
    branches.forEach((branch) => {
      findMatches(branch, matchArray, fullKey, resultKeys)
    })
  }

  return resultKeys
}
