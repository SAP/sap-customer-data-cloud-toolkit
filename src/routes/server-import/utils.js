/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
export const isInputFilled = (configurations) => {
  for (let i = 0; i < configurations.length; i++) {
    if (configurations[i].name.includes('*') && (configurations[i].value === undefined || configurations[i].value === '')) {
      return false
    }
  }
  return true
}
