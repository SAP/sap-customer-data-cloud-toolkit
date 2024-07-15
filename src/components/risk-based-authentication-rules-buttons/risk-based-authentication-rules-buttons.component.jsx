import React from 'react'
import { withTranslation } from 'react-i18next'
import { FlexBox, RadioButton } from '@ui5/webcomponents-react'
import { useDispatch } from 'react-redux'

const RiskBasedAuthenticationRulesButtons = ({ treeNode, setRbaRulesMergeOrReplace, t }) => {
  const dispatch = useDispatch()
  const handleRadioButtonChange = (event) => {
    const selectedItem = event.target
    if (selectedItem) {
      const selectedButton = selectedItem.text.trim()
      if (selectedButton === t('CONFIGURATION_TREE.BUTTON_MERGE')) {
        console.log('replace pressed')
        debugger
        dispatch(setRbaRulesMergeOrReplace({ checkBoxId: treeNode.id, mergeOrReplace: 'merge' }))
      } else {
        console.log('replace pressed')
        dispatch(setRbaRulesMergeOrReplace({ checkBoxId: treeNode.id, mergeOrReplace: 'replace' }))
      }
    }
  }

  return (
    <span>
      <FlexBox role="radiogroup">
        <RadioButton name="MergeReplaceButton" text={t('CONFIGURATION_TREE.BUTTON_REPLACE')} onClick={handleRadioButtonChange} />
        <RadioButton name="MergeReplaceButton" text={t('CONFIGURATION_TREE.BUTTON_MERGE')} onClick={handleRadioButtonChange} checked />
      </FlexBox>
    </span>
  )
}

export default withTranslation()(RiskBasedAuthenticationRulesButtons)
