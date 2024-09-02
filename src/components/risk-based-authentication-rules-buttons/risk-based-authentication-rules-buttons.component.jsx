/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import React from 'react'
import { withTranslation } from 'react-i18next'
import { Option, Select } from '@ui5/webcomponents-react'
import { useDispatch } from 'react-redux'
import { handleRadioButtonChange } from './utils'
import { createUseStyles } from 'react-jss'
import styles from './risk-based-authentication-rules-buttons.style'

const useStyles = createUseStyles(styles, { name: 'RiskBasedAuthenticationRulesButtons' })
const RiskBasedAuthenticationRulesButtons = ({ treeNode, setRbaRulesOperation, t }) => {
  const dispatch = useDispatch()
  const classes = useStyles()
  return (
    <span className={classes.rbaSelectButtonAlignment}>
      <Select
        className={`${classes.rbaButtonSize} ui5-content-density-compact`}
        onChange={(event) => handleRadioButtonChange(event, treeNode, setRbaRulesOperation, dispatch)}
        valueState="None"
      >
        <Option data-id="merge">Merge</Option>
        <Option data-id="replace">Replace</Option>
      </Select>
    </span>
  )
}

export default withTranslation()(RiskBasedAuthenticationRulesButtons)
