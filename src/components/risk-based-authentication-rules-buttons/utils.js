/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

export const handleRadioButtonChange = (event, treeNode, setRbaRulesOperation, t, dispatch) => {
  const selectedItem = event.target
  if (selectedItem) {
    const selectedButton = selectedItem.text.trim()
    if (selectedButton === t('CONFIGURATION_TREE.BUTTON_MERGE')) {
      dispatch(setRbaRulesOperation({ checkBoxId: treeNode.id, operation: 'merge' }))
    } else {
      dispatch(setRbaRulesOperation({ checkBoxId: treeNode.id, operation: 'replace' }))
    }
  }
}

export const handleRBACheckboxChange = (checkBoxId, value, setIsRBAChecked) => {
  if (checkBoxId === 'rba' || checkBoxId === 'RBA Rules') {
    setIsRBAChecked(value)
  }
}

export const shouldShowRBARulesButtons = (treeNode, isRBAChecked) => {
  const isRiskBasedAuth = treeNode.name === 'RBA Rules'
  return isRiskBasedAuth && isRBAChecked
}
