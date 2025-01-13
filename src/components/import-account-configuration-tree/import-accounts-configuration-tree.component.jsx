/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { useDispatch } from 'react-redux'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { setMandatoryFields, setMandatoryStatus, setSugestionSchema, setSuggestionTreeMandatoryStatus } from '../../redux/importAccounts/importAccountsSlice.js'
import { Tree, TreeItemCustom, CheckBox, FlexBox } from '@ui5/webcomponents-react'
import MessagePopoverButton from '../message-popover-button/message-popover-button.component.jsx'
import { getHighestSeverity } from '../configuration-tree/utils.js'
import '@ui5/webcomponents-icons/dist/message-information.js'
import SchemaPropertyType from '../schema-property-type/schema-property-type.component.jsx'
import { handleSelectChange } from './utils.js'

const ImportAccountConfigurationTree = ({
  id,
  name,
  value,
  error,
  branches,
  tooltip,
  mandatory,
  setConfigurationStatus,
  setSwitchOptions,
  expandableNode,
  treeNodeInputValue,
  t,
}) => {
  const dispatch = useDispatch()
  const onCheckBoxStateChangeHandler = (event, treeNodeId, parentNode) => {
    const checkBoxId = event.srcElement.id
    const value = event.srcElement.checked
    mandatoryFields(treeNodeId)
    setFields(event)
    dispatch(setConfigurationStatus({ checkBoxId, value, branches }))

    if (treeNodeInputValue) {
      dispatch(setSugestionSchema({ checkBoxId, value }))
    }
  }

  const findBranchAndSiblings = (structure, targetId) => {
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
  const returnMandatoryField = (siblings) => {
    for (let branch of siblings) {
      if (branch.id.includes('status')) {
        dispatch(setMandatoryStatus({ checkBoxId: branch.id, value: true }))
        dispatch(setSuggestionTreeMandatoryStatus({ checkBoxId: branch.id, value: true }))
        return true
      }
    }
    return false
  }

  const setFields = (event) => {
    const findSiblings = findBranchAndSiblings(branches, event.srcElement.id)
    if (findSiblings) {
      selectChildrenField(findSiblings)
    }
  }

  const selectChildrenField = (siblings) => {
    for (let branch of siblings) {
      if (branch.id.includes('isSubscribed')) {
        dispatch(setMandatoryFields({ checkBoxId: branch.id, value: true, mandatory: true }))
      } else if (branch.id.includes('isConsentGranted')) {
        dispatch(setMandatoryFields({ checkBoxId: branch.id, value: true, mandatory: true }))
      }
    }
  }
  const mandatoryFields = (event) => {
    const findSiblings = findBranchAndSiblings(branches, event)
    if (findSiblings) {
      const isMandatory = returnMandatoryField(findSiblings)
      return isMandatory
    }
  }
  const showError = (treeNode) => {
    return treeNode.error ? <MessagePopoverButton message={treeNode.error} type={getHighestSeverity(treeNode.error)} /> : ''
  }
  const shouldRenderSelect = (node) => {
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
  const isReadOnly = (treeNode) => {
    if ((treeNode.branches.length === 0 && treeNode.mandatory === true) || (mandatory === true && treeNode.mandatory !== false)) {
      return true
    }

    return false
  }

  const expandTree = (treeNode, isParentLoyalty = false) => {
    const isLoyaltyNode = ['internal', 'data', 'profile'].includes(treeNode.id) ? shouldRenderSelect(treeNode) : isParentLoyalty
    return (
      <TreeItemCustom
        key={treeNode.id}
        expanded={expandableNode}
        content={
          <FlexBox direction="Row" justifyContent="Start">
            <CheckBox
              id={`${treeNode.id}`}
              readonly={isReadOnly(treeNode)}
              text={treeNode.name}
              checked={treeNode.value}
              onChange={(event) => onCheckBoxStateChangeHandler(event, treeNode.id, treeNode)}
            />

            {showError(treeNode)}
            {isLoyaltyNode && treeNode.branches.length > 0 && treeNode.id !== 'data' && treeNode.id !== 'internal' && treeNode.id !== 'profile' && (
              <SchemaPropertyType treeNode={treeNode} t={t} handleSelectChange={(event) => handleSelectChange(event, treeNode.id, setSwitchOptions, dispatch)} />
            )}
          </FlexBox>
        }
      >
        {treeNode.branches.length > 0 && treeNode.branches.map((branch) => expandTree(branch, isLoyaltyNode))}
      </TreeItemCustom>
    )
  }

  return (
    <>
      <Tree>{expandTree({ id, name, value, error, branches, tooltip })}</Tree>
    </>
  )
}

export default withTranslation()(ImportAccountConfigurationTree)
