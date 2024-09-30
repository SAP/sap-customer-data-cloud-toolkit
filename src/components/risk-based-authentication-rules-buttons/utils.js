/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

export const handleRadioButtonChange = (event, treeNode, setRbaRulesOperation,    dispatch) => {
  const REPLACE_BUTTON_ID = 'replace'

  var selectedButton = 'merge'

  if (event.detail?.selectedOption?.dataset?.id) selectedButton = event.detail.selectedOption.dataset.id

  if (selectedButton === REPLACE_BUTTON_ID) {
    dispatch(setRbaRulesOperation({ checkBoxId: treeNode.id, operation: 'replace' }))
  } else {
    dispatch(setRbaRulesOperation({ checkBoxId: treeNode.id, operation: 'merge' }))
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
