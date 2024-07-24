// risk-based-authentication-rules-buttons.component.jsx

/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import React from 'react'
import { withTranslation } from 'react-i18next'
import { FlexBox, RadioButton } from '@ui5/webcomponents-react'
import { useDispatch } from 'react-redux'
import { handleRadioButtonChange } from './utils'

const RiskBasedAuthenticationRulesButtons = ({ treeNode, setRbaRulesMergeOrReplace, t }) => {
  const dispatch = useDispatch()
  return (
    <span>
      <FlexBox role="radiogroup">
        <RadioButton
          name="MergeReplaceButton"
          text={t('CONFIGURATION_TREE.BUTTON_REPLACE')}
          onClick={(event) => handleRadioButtonChange(event, treeNode, setRbaRulesMergeOrReplace, t, dispatch)}
        />
        <RadioButton
          name="MergeReplaceButton"
          text={t('CONFIGURATION_TREE.BUTTON_MERGE')}
          onClick={(event) => handleRadioButtonChange(event, treeNode, setRbaRulesMergeOrReplace, t, dispatch)}
          checked
        />
      </FlexBox>
    </span>
  )
}

export default withTranslation()(RiskBasedAuthenticationRulesButtons)
