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

export const findBranchAndSiblings = (structure, targetId) => {
  let result = null

  const traverse = (branches) => {
    for (let branch of branches) {
      if (branch.id === targetId) {
        result = branches
        return
      }
      if (branch.branches.length > 0) {
        traverse(branch.branches)
        if (result) return
      }
    }
  }

  traverse(structure)
  return result
}
export const shouldRenderSelect = (node) => {
  for (const branch of node.branches) {
    if (branch.branches.length === 0) {
      return true
    }
    if (shouldRenderSelect(branch)) {
      return true
    }
  }
  return false
}
