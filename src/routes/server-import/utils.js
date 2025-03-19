/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

export const isInputFilled = (configurations) => {
  for (const configuration of configurations) {
    if (configuration.name.includes('*') && (configuration.value === undefined || configuration.value === '')) {
      return false
    }
  }
  return true
}
