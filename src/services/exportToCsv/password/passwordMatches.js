/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { findMatchesInTree } from '../preferences/preferencesMatches'

export function exportPasswordData(items) {
  const optionsKeys = findMatchesInTree(items)

  return optionsKeys
}
