export const handleSelectChange = (event, treeNodeId, setSwitchOptions, dispatch, treeData, setTreeData) => {
  const REPLACE_BUTTON_ID = 'array'
  let selectedButton = 'object'

  if (event.detail?.selectedOption?.dataset?.id) {
    selectedButton = event.detail.selectedOption.dataset.id
  }

  console.log(' handleSelectChange={handleSelectChange} ', handleSelectChange)
  const selectedValue = event.target.selectedOption.dataset.id
  console.log(`Selected value: ${selectedValue}, TreeNode ID: ${treeNodeId}`)

  const switchId = { checkBoxId: treeNodeId, operation: selectedButton }
  const parts = treeNodeId.split('.')
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
  // Dispatch for the parent node
  dispatch(setSwitchOptions({ checkBoxId: treeNodeId, operation: selectedValue }))

  // Find the parent node in the treeData

  if (treeData.branches.length > 0) {
    // Recursively dispatch for all child nodes
    updateChildren(treeData.branches, switchId)
  }

  // Assuming the dispatch updates the treeData, you can call setTreeData to refresh the state
  setTreeData([...treeData.branches])
}
