import { useDispatch } from 'react-redux'
import lodash from 'lodash'

import { setConfigurationStatus } from '../../redux/copyConfigurationExtendend/copyConfigurationExtendendSlice'

import { Tree, TreeItemCustom, CheckBox } from '@ui5/webcomponents-react'

const ConfigurationTree = (treeData) => {
  const dispatch = useDispatch()

  // const areAllBranchesChecked = () => {
  //   return !treeData.value.find((branch) => branch.value === false)
  // }

  const onCheckBoxStateChangeHandler = (event) => {
    const checkBoxId = event.srcElement.id
    const value = event.srcElement.checked
    dispatch(setConfigurationStatus({ checkBoxId, value }))
  }

  const expandTree = (treeNode) => {
    return (
      <TreeItemCustom
        key={treeNode.id}
        content={<CheckBox id={`${treeNode.id}`} text={`${lodash.startCase(treeNode.name)}`} checked={treeNode.value} onChange={onCheckBoxStateChangeHandler} />}
      >
        {treeNode.branches ? treeNode.branches.map((branch) => expandTree(branch)) : ''}
      </TreeItemCustom>
    )
  }

  return (
    <>
      <Tree>{expandTree(treeData)}</Tree>
    </>
  )
}

export default ConfigurationTree
