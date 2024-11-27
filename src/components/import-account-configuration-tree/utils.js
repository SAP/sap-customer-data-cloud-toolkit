export const handleSelectChange = (event, treeNodeId, setSwitchOptions, dispatch, treeData, setTreeData) => {
  let selectedButton = 'object'

  if (event.detail?.selectedOption?.dataset?.id) {
    selectedButton = event.detail.selectedOption.dataset.id
  }
  console.log('SELECTED BUTTON ', selectedButton)
  const selectedValue = event.target.selectedOption.dataset.id
  console.log(`Selected value: ${selectedValue}, TreeNode ID: ${treeNodeId}`)

  dispatch(setSwitchOptions({ checkBoxId: treeNodeId, operation: selectedButton }))

  dispatch(setSwitchOptions({ checkBoxId: treeNodeId, operation: selectedValue }))

  setTreeData([...treeData.branches])
}
