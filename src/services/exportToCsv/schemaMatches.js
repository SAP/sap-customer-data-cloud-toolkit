import { getOptionsFromSchemaTree } from './utils/utils'

export function exportSchemaData(items) {
  const options = getOptionsFromSchemaTree(items)

  return options
}
