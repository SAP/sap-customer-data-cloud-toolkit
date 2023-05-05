export const areAllVariablesSet = (dataFlowVariables) => {
  return dataFlowVariables.filter((variable) => variable.value === '').length === 0
}
