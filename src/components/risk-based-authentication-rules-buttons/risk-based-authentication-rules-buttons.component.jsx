/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import React from 'react'
import { withTranslation } from 'react-i18next'
import { Option, Select } from '@ui5/webcomponents-react'
import { useDispatch } from 'react-redux'
import { handleRadioButtonChange } from './utils'

const RiskBasedAuthenticationRulesButtons = ({ treeNode, setRbaRulesOperation, t }) => {
  const dispatch = useDispatch()
  return (
    <span>
      <Select label={{}} onChange={(event) => handleRadioButtonChange(event, treeNode, setRbaRulesOperation, t, dispatch)} value="" valueState="None">
        <Option data-id="merge">Merge</Option>
        <Option data-id="replace">Replace</Option>
      </Select>
    </span>
  )
}

export default withTranslation()(RiskBasedAuthenticationRulesButtons)
