/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import React from 'react'
import { withTranslation } from 'react-i18next'
import { Option, Select } from '@ui5/webcomponents-react'
import { useDispatch } from 'react-redux'
import { createUseStyles } from 'react-jss'
import styles from './array-object-output-buttons.style'

const useStyles = createUseStyles(styles, { name: 'ArrayObjectOutputButtons' })
const ArrayObjectOutputButtons = ({ handleSelectChange, t, setSwitchOptions, treeNode, setTreeData, treeData }) => {
  const dispatch = useDispatch()
  const classes = useStyles()
  return (
    <div className={classes.outputSelectButtonAlignment}>
      <span>
        <Select
          onChange={(event) => handleSelectChange(event, treeNode.id, setSwitchOptions, dispatch, treeData, setTreeData)}
          className={`${classes.outputButtonSize} `}
          valueState="None"
        >
          <Option data-id="object" selected={treeNode.switchId?.operation === 'object'}>
            Object
          </Option>
          <Option data-id="array" selected={treeNode.switchId?.operation === 'array'}>
            Array
          </Option>
        </Select>
      </span>
    </div>
  )
}

export default withTranslation()(ArrayObjectOutputButtons)
