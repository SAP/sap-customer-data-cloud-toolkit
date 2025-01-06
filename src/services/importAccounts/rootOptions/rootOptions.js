/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
export function rootOptionsValue(obj) {
  const results = []

  const traverse = (items) => {
    for (let item of items) {
      if (item.value === true && item.branches.length === 0) {
        results.push(`${item.id}`)
      }
      if (item.branches.length > 0) {
        traverse(item.branches)
      }
    }
  }

  traverse(obj)
  return results
}
