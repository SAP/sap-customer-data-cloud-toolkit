/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import '@ui5/webcomponents-icons/dist/message-information.js'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { Tree, TreeItemCustom, CheckBox, FlexBox } from '@ui5/webcomponents-react'
import MessagePopoverButton from '../message-popover-button/message-popover-button.component.jsx'
import SchemaPropertyType from '../schema-property-type/schema-property-type.component.jsx'
import { getHighestSeverity } from '../configuration-tree/utils.js'
import { setMandatoryField, setSugestionMandatoryField, setSugestionSchema } from '../../redux/importAccounts/importAccountsSlice.js'
import { findBranchAndSiblings, handleSelectChange, shouldRenderSelect } from './utils.js'
import { isMandatoryFields } from '../../redux/importAccounts/utils.js'

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
  dispatch,
  t,
}) => {
  const schemaNodeIds = ['internal', 'data', 'profile']
  const onCheckBoxStateChangeHandler = (event) => {
    const checkBoxId = event.srcElement.id
    const value = event.srcElement.checked
    setFields(event)
    dispatch(setConfigurationStatus({ checkBoxId, value, branches }))

    if (treeNodeInputValue) {
      dispatch(setSugestionSchema({ checkBoxId, value }))
    }
  }
  const selectChildrenField = (siblings) => {
    for (let branch of siblings) {
      if (isMandatoryFields(branch.id)) {
        dispatch(setMandatoryField({ checkBoxId: branch.id, value: true, mandatory: true, config: true }))
        dispatch(setSugestionMandatoryField({ checkBoxId: branch.id, value: true, mandatory: true, config: true }))
      }
    }
  }

  const setFields = (event) => {
    const foundSiblings = findBranchAndSiblings(branches, event.srcElement.id)
    if (foundSiblings) {
      selectChildrenField(foundSiblings)
    }
  }

  const showError = (treeNode) => {
    return treeNode.error ? <MessagePopoverButton message={treeNode.error} type={getHighestSeverity(treeNode.error)} /> : ''
  }

  const isReadOnly = (treeNode) => {
    return (treeNode.branches.length === 0 && treeNode.mandatory === true) || (mandatory === true && treeNode.mandatory !== false)
  }

  const expandTree = (treeNode, isParentLoyalty = false) => {
    const isLoyaltyNode = schemaNodeIds.includes(treeNode.id) ? shouldRenderSelect(treeNode) : isParentLoyalty
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
            {isLoyaltyNode && treeNode.branches.length > 0 && !schemaNodeIds.includes(treeNode.id) && (
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
