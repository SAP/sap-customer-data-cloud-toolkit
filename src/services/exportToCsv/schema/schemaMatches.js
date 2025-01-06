/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { getOptionsFromSchemaTree } from '../utils/utils'

export function exportSchemaData(items) {
  const options = getOptionsFromSchemaTree(items)

  return options
}
