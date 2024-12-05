import { passwordObjectStructure } from '../importAccounts/passwordImport/passwordObjectStructure'
import { getOptionsFromTree } from './utils/utils'

export function exportPasswordData(items) {
  const options = getOptionsFromTree(items)
  const optionsKeys = findMatches(items)

  return optionsKeys
}

const findMatches = (obj) => {
  const results = []

  const traverse = (node) => {
    if (node.branches.length === 0) {
      results.push(`${node.id}`)
    } else {
      for (let branch of node.branches) {
        traverse(branch)
      }
    }
  }

  for (let key of obj) {
    traverse(key)
  }

  return results
}
