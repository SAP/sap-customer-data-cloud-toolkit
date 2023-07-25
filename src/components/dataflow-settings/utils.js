/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


export const areAllVariablesSet = (dataFlowVariables) => {
  return dataFlowVariables.filter((variable) => variable.value === '').length === 0
}
