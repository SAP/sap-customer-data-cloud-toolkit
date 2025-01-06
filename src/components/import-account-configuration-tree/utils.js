export const handleSelectChange = (event, treeNodeId, setSwitchOptions, dispatch) => {
  let selectedButton = 'object'

  if (event.detail?.selectedOption?.dataset?.id) {
    selectedButton = event.detail.selectedOption.dataset.id
  }
  const selectedValue = event.target.selectedOption.dataset.id

  dispatch(setSwitchOptions({ checkBoxId: treeNodeId, operation: selectedButton }))
}
