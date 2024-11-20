import { getOptionsFromTree } from './utils/utils'

export function exportPasswordData(items) {
  const { ids: options } = getOptionsFromTree(items)

  const removeFields = [...new Set([...options])]

  return removeFields
}
