/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { findMatchesInTree } from '../preferences/preferencesMatches'

export function exportPasswordData(items) {
  const optionsKeys = findMatchesInTree(items)

  return optionsKeys
}

const findMatches = (obj) => {
  const results = []

  const traverse = (node) => {
    if (node.branches.length === 0 && node.value === true) {
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
