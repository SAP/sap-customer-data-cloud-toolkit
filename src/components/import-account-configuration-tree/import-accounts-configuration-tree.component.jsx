/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { useDispatch, useSelector } from 'react-redux'
import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import { createUseStyles } from 'react-jss'
import { selectSwitchId } from '../../redux/importAccounts/importAccountsSlice.js'
import { Tree, TreeItemCustom, CheckBox, FlexBox, Icon, Popover } from '@ui5/webcomponents-react'
import MessagePopoverButton from '../message-popover-button/message-popover-button.component.jsx'
import { getHighestSeverity } from '../configuration-tree/utils.js'
import './import-accounts-configuration-tree.component.css'
import styles from './import-accounts-configuration-tree.styles.js'
import '@ui5/webcomponents-icons/dist/message-information.js'
import ArrayObjectOutputButtons from '../array-object-output-buttons/array-object-output-buttons.component.jsx'
import { handleSelectChange } from './utils.js'
const useStyles = createUseStyles(styles, { name: 'ImportAccountConfigurationTree' })

const ImportAccountConfigurationTree = ({ siteId, id, name, value, error, branches, tooltip, setConfigurationStatus, setSwitchOptions, t }) => {
  const dispatch = useDispatch()
  const classes = useStyles()

  const [selectedValues, setSelectedValues] = useState({})
  const [treeData, setTreeData] = useState([{ id, name, value, error, branches, tooltip }])

  const [isMouseOverIcon, setIsMouseOverIcon] = useState(false)
  const [tooltipTarget, setTooltipTarget] = useState('')
  const switchConfig = useSelector(selectSwitchId)
  const onCheckBoxStateChangeHandler = (event) => {
    const checkBoxId = event.srcElement.id
    const value = event.srcElement.checked

    if (siteId) {
      dispatch(setConfigurationStatus({ siteId, checkBoxId, value }))
      console.log('switchConfig-->', switchConfig)
    } else {
      dispatch(setConfigurationStatus({ checkBoxId, value }))
      console.log('switchConfig-->', switchConfig)
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

  const expandTree = (treeNode, isParentLoyalty = false, level = 0) => {
    const isLoyaltyNode = ['internalSchema', 'dataSchema', 'soldTo.addressesSchema', 'shipTo.addressesSchema'].includes(treeNode.id)
      ? shouldRenderSelect(treeNode)
      : isParentLoyalty

    return (
      <TreeItemCustom
        key={treeNode.id}
        content={
          <FlexBox direction="Row" justifyContent="Start">
            <CheckBox id={`${treeNode.id}`} text={treeNode.formatName === false ? treeNode.name : treeNode.name} checked={treeNode.value} onChange={onCheckBoxStateChangeHandler} />
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
                  {t(`CONFIGURATION_TREE.TOOLTIP_${treeNode.tooltip}`)}
                </Popover>
              </>
            ) : (
              ''
            )}
            {showError(treeNode)}
            {isLoyaltyNode && treeNode.branches.length > 0 && treeNode.id !== 'dataSchema' && treeNode.id !== 'internalSchema' && (
              <ArrayObjectOutputButtons
                treeNode={treeNode}
                t={t}
                handleSelectChange={(event) => handleSelectChange(event, treeNode.id, setSwitchOptions, dispatch, treeNode, setSelectedValues)}
              />
            )}
          </FlexBox>
        }
      >
        {treeNode.branches.length > 0 && treeNode.branches.map((branch) => expandTree(branch, isLoyaltyNode, level + 1))}
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
