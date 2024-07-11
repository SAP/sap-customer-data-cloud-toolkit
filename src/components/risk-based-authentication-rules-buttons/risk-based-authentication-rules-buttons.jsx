import React from 'react'
import { withTranslation } from 'react-i18next'
import { FlexBox, RadioButton } from '@ui5/webcomponents-react'

const RiskBasedAuthenticationRulesButtons = ({ t, setSelectedSegment }) => {
  const handleRadioButtonChange = (event) => {
    const selectedItem = event.target
    if (selectedItem) {
      const selectedButton = selectedItem.text.trim()
      if (selectedButton === 'Replace') {
        console.log('replace pressed')
        setSelectedSegment('replaceAction')
      } else {
        console.log('merge pressed')
        setSelectedSegment('mergeAction')
      }
    }
  }

  return (
    <span>
      <FlexBox role="radiogroup">
        <RadioButton name="MergeReplaceButton" text={t('CONFIGURATINON_TREE.BUTTON_MERGE')} onChange={handleRadioButtonChange} />
        <RadioButton name="MergeReplaceButton" text={t('CONFIGURATINON_TREE.BUTTON_REPLACE')} onChange={handleRadioButtonChange} checked />
      </FlexBox>
    </span>
  )
}

export default withTranslation()(RiskBasedAuthenticationRulesButtons)
