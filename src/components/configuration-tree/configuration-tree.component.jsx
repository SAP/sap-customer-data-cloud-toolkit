/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { withTranslation } from 'react-i18next'
import { createUseStyles } from 'react-jss'
import lodash from 'lodash'

import { Tree, TreeItemCustom, CheckBox, FlexBox, Icon, Popover } from '@ui5/webcomponents-react'

import MessagePopoverButton from '../message-popover-button/message-popover-button.component'
import DataflowSettings from '../dataflow-settings/dataflow-settings.component'
import { getHighestSeverity } from './utils'

import '@ui5/webcomponents-icons/dist/message-information.js'
import './configuration-tree.component.css'
import styles from './configuration-tree.styles.js'

const useStyles = createUseStyles(styles, { name: 'ConfigurationTree' })

const ConfigurationTree = ({ siteId, id, name, value, error, branches, tooltip, setConfigurationStatus, setDataflowVariableValue, setDataflowVariableValues, t }) => {
  const dispatch = useDispatch()
  const classes = useStyles()

  const [isMouseOverIcon, setIsMouseOverIcon] = useState(false)
  const [tooltipTarget, setTooltipTarget] = useState('')

  const onCheckBoxStateChangeHandler = (event) => {
    const checkBoxId = event.srcElement.id
    const value = event.srcElement.checked
    if (siteId) {
      dispatch(setConfigurationStatus({ siteId, checkBoxId, value }))
    } else {
      dispatch(setConfigurationStatus({ checkBoxId, value }))
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

  const showDataflowSettings = (treeNode) => {
    return treeNode.value && treeNode.variables ? (
      <DataflowSettings dataFlowTreeNode={treeNode} setDataflowVariableValue={setDataflowVariableValue} setDataflowVariableValues={setDataflowVariableValues} />
    ) : (
      ''
    )
  }

  const expandTree = (treeNode) => {
    return (
      <TreeItemCustom
        key={treeNode.id}
        content={
          <FlexBox direction="Row" justifyContent="Start">
            <CheckBox
              id={`${treeNode.id}`}
              text={treeNode.formatName === false ? treeNode.name : `${lodash.startCase(treeNode.name)}`}
              checked={treeNode.value}
              onChange={onCheckBoxStateChangeHandler}
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
                  {t(`CONFIGURATION_TREE.TOOLTIP_${treeNode.tooltip}`)}
                </Popover>
              </>
            ) : (
              ''
            )}
            {showDataflowSettings(treeNode)}
            {showError(treeNode)}
          </FlexBox>
        }
      >
        {treeNode.branches ? treeNode.branches.map((branch) => expandTree(branch)) : ''}
      </TreeItemCustom>
    )
  }

  return (
    <>
      <Tree>{expandTree({ id, name, value, error, branches, tooltip })}</Tree>
    </>
  )
}

export default withTranslation()(ConfigurationTree)
