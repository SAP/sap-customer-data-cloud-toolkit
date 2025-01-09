/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
export const handleSelectChange = (event, treeNodeId, setSwitchOptions, dispatch) => {
  let selectedButton = 'object'

  if (event.detail?.selectedOption?.dataset?.id) {
    selectedButton = event.detail.selectedOption.dataset.id
  }

  dispatch(setSwitchOptions({ checkBoxId: treeNodeId, operation: selectedButton }))
}
