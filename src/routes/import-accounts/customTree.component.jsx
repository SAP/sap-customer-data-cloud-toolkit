/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { useDispatch } from 'react-redux'
import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import { createUseStyles } from 'react-jss'
import lodash from 'lodash'

import { Tree, TreeItemCustom, CheckBox, FlexBox } from '@ui5/webcomponents-react'

import MessagePopoverButton from '../../components/message-popover-button/message-popover-button.component.jsx'
import { getHighestSeverity } from '../../components/configuration-tree/utils.js'
import './configuration-tree.component.css'
import styles from './configuration-tree.styles.js'
import '@ui5/webcomponents-icons/dist/message-information.js'

const useStyles = createUseStyles(styles, { name: 'ConfigurationTree' })
const ConfigurationTree = ({ siteId, id, name, value, error, branches, tooltip, setConfigurationStatus, t }) => {
  const dispatch = useDispatch()
  const classes = useStyles()

  const onCheckBoxStateChangeHandler = (event) => {
    const checkBoxId = event.srcElement.id
    const value = event.srcElement.checked
  }

  const showError = (treeNode) => {
    return treeNode.error ? <MessagePopoverButton message={treeNode.error} type={getHighestSeverity(treeNode.error)} /> : ''
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
