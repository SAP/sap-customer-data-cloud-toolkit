import { useDispatch } from 'react-redux'
import lodash from 'lodash'

import { setConfigurationStatus } from '../../redux/copyConfigurationExtendend/copyConfigurationExtendendSlice'

import { Tree, TreeItemCustom, CheckBox, FlexBox } from '@ui5/webcomponents-react'

import MessagePopoverButton from '../message-popover-button/message-popover-button.component'

import './configuration-tree.component.css'

const ConfigurationTree = (treeData) => {
  const dispatch = useDispatch()

  const onCheckBoxStateChangeHandler = (event) => {
    const checkBoxId = event.srcElement.id
    const value = event.srcElement.checked
    dispatch(setConfigurationStatus({ checkBoxId, value }))
  }

  const expandTree = (treeNode) => {
    return (
      <TreeItemCustom
        key={treeNode.id}
        content={
          <FlexBox direction="Row" justifyContent="Center">
            <CheckBox id={`${treeNode.id}`} text={`${lodash.startCase(treeNode.name)}`} checked={treeNode.value} onChange={onCheckBoxStateChangeHandler} />
            {treeNode.error ? <MessagePopoverButton message={treeNode.error} /> : ''}
          </FlexBox>
        }
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
