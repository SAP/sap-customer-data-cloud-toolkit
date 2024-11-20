export const handleSelectChange = (event, treeNodeId, setSwitchOptions, dispatch, treeData, setTreeData) => {
  const REPLACE_BUTTON_ID = 'array'
  let selectedButton = 'object'

  if (event.detail?.selectedOption?.dataset?.id) {
    selectedButton = event.detail.selectedOption.dataset.id
  }
  const selectedValue = event.target.selectedOption.dataset.id
  console.log(`Selected value: ${selectedValue}, TreeNode ID: ${treeNodeId}`)

  const switchId = { checkBoxId: treeNodeId, operation: selectedButton }
  const updateChildren = (nodes, switchId) => {
    for (let i = 0; i < nodes.length; i++) {
      dispatch(setSwitchOptions({ checkBoxId: nodes[i].id, operation: switchId.operation }))
      if (nodes[i].branches.length > 0) {
        updateChildren(nodes[i].branches, switchId)
      }
    }
  }
  console.log(' switchId ', switchId)
  console.log(' selectedValue ', selectedValue)
  dispatch(setSwitchOptions({ checkBoxId: treeNodeId, operation: selectedValue }))

  if (treeData.branches.length > 0) {
    updateChildren(treeData.branches, switchId)
  }

  setTreeData([...treeData.branches])
}
