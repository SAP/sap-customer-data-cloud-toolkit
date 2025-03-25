/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { createUseStyles } from 'react-jss'
import { useState } from 'react'
import { withTranslation } from 'react-i18next'
import '@ui5/webcomponents-icons/dist/message-information.js'
import styles from './import-accounts-configuration-tree.styles.js'
import { Tree, TreeItemCustom, CheckBox, FlexBox, Icon, Popover } from '@ui5/webcomponents-react'
import MessagePopoverButton from '../message-popover-button/message-popover-button.component.jsx'
import SchemaPropertyType from '../schema-property-type/schema-property-type.component.jsx'
import { getHighestSeverity } from '../configuration-tree/utils.js'
import { setMandatoryField, setSugestionMandatoryField, setSugestionSchema } from '../../redux/importAccounts/importAccountsSlice.js'
import { findBranchAndSiblings, handleSelectChange, shouldRenderSelect } from './utils.js'
import { isMandatoryFields, isParentMandatoryFields } from '../../redux/importAccounts/utils.js'

const useStyles = createUseStyles(styles, { name: 'ImportAccountTree' })

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
  const classes = useStyles()
  const schemaNodeIds = ['internal', 'data', 'profile']
  const [isMouseOverIcon, setIsMouseOverIcon] = useState(false)
  const [tooltipTarget, setTooltipTarget] = useState('')
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
      const parentId = branch.id.split('.')
      if (isMandatoryFields(branch.id) && isParentMandatoryFields(parentId[0])) {
        dispatch(setMandatoryField({ checkBoxId: branch.id, value: true, mandatory: true, config: true }))
        dispatch(setSugestionMandatoryField({ checkBoxId: branch.id, value: true, mandatory: true, config: true }))
      }
    }
  }

  const onMouseOverHandler = (event) => {
    if (event.target.shadowRoot) {
      setTooltipTarget(event.target.shadowRoot.host.id)
      setIsMouseOverIcon(true)
    }
  }

  const onMouseOutHandler = () => {
    setIsMouseOverIcon(false)
  }

  const openPopover = (id) => {
    return isMouseOverIcon && tooltipTarget === `${id}TooltipIcon`
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
              onChange={(event) => onCheckBoxStateChangeHandler(event)}
            />
            {treeNode.tooltip ? (
              <>
                <Icon
                  id={`${treeNode.id}TooltipIcon`}
                  name="message-information"
                  design="Neutral"
                  onMouseOver={onMouseOverHandler}
                  onMouseOut={onMouseOutHandler}
                  className={classes.tooltipIconStyle}
                />
                <Popover id={`${treeNode.id}Popover`} opener={`${treeNode.id}TooltipIcon`} open={openPopover(treeNode.id)}>
                  {t(`${treeNode.tooltip}`)}
                </Popover>
              </>
            ) : (
              ''
            )}
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
