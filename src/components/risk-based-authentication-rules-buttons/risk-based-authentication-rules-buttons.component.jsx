import React from 'react'
import { withTranslation } from 'react-i18next'
import { FlexBox, RadioButton } from '@ui5/webcomponents-react'
import { useDispatch } from 'react-redux'

const RiskBasedAuthenticationRulesButtons = ({ t, setSelectedSegment }) => {
  const dispatch = useDispatch()
  const handleRadioButtonChange = (event) => {
    const selectedItem = event.target
    if (selectedItem) {
      const selectedButton = selectedItem.text.trim()
      if (selectedButton === t('CONFIGURATION_TREE.BUTTON_MERGE')) {
        console.log('replace pressed')
        setSelectedSegment('merge')
        dispatch(setSelectedSegment('merge'))
      } else {
        console.log('replace pressed')
        setSelectedSegment('replace')
        dispatch(setSelectedSegment('replace'))
      }
    }
  }

  return (
    <span>
      <FlexBox role="radiogroup">
        <RadioButton name="MergeReplaceButton" text={t('CONFIGURATION_TREE.BUTTON_REPLACE')} onChange={handleRadioButtonChange} />
        <RadioButton name="MergeReplaceButton" text={t('CONFIGURATION_TREE.BUTTON_MERGE')} onChange={handleRadioButtonChange} checked />
      </FlexBox>
    </span>
  )
}

export default withTranslation()(RiskBasedAuthenticationRulesButtons)
