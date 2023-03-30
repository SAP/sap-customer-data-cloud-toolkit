import { useState } from 'react'
import { withTranslation } from 'react-i18next'
import { createUseStyles } from 'react-jss'
import { useDispatch, useSelector } from 'react-redux'
import lodash from 'lodash'

import { Input, SuggestionItem, Button, InputType } from '@ui5/webcomponents-react'

import { selectAvailableTargetSites, selectUnfilteredAvailableTargetSites } from '../../redux/copyConfigurationExtended/copyConfigurationExtendedSlice'

import { filterTargetSites, findStringInAvailableTargetSites, getTargetSiteByTargetApiKey } from './utils'

import styles from './search-sites-input.styles'

const useStyles = createUseStyles(styles, { name: 'SearchSitesInput' })

const SearchSitesInput = ({ siteId, tarketApiKeyInputValue, setTarketApiKeyInputValue: setTargetApiKeyInputValue, addTargetSite, getTargetSiteInformation, t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const availableTargetSites = useSelector(selectAvailableTargetSites)
  const unfilteredAvailableTargetSites = useSelector(selectUnfilteredAvailableTargetSites)

  const [filteredAvailableTargetSites, setFilteredAvailableTargetApiKeys] = useState(availableTargetSites)

  const onTargetApiKeysInputHandler = lodash.debounce((event) => {
    const inputValue = event.target.value
    setTargetApiKeyInputValue(inputValue)
    if (siteId) {
      setFilteredAvailableTargetApiKeys(filterTargetSites(inputValue, unfilteredAvailableTargetSites))
    } else {
      setFilteredAvailableTargetApiKeys(filterTargetSites(inputValue, availableTargetSites))
    }
  }, 500)

  const onTargetApiKeysInputKeyPressHandler = (event) => {
    const inputValue = event.target.value
    if (event.key === 'Enter' && !findStringInAvailableTargetSites(inputValue, availableTargetSites)) {
      setTargetApiKeyInputValue(inputValue)
      processInput(inputValue)
    }
  }

  const onSuggestionItemSelectHandler = (event) => {
    const targetSite = getTargetSiteByTargetApiKey(event.detail.item.additionalText, availableTargetSites)
    setTargetApiKeyInputValue('')
    if (siteId) {
      dispatch(addTargetSite({ siteId, targetSite }))
    } else {
      dispatch(addTargetSite({ targetSite }))
    }
  }

  const onAddTargetSiteButtonClickHandler = () => {
    processInput(tarketApiKeyInputValue)
  }

  const processInput = (inputValue) => {
    if (inputValue && inputValue !== '') {
      if (siteId) {
        dispatch(getTargetSiteInformation({ siteId, apiKey: inputValue }))
      } else {
        dispatch(getTargetSiteInformation(inputValue))
      }
      setTargetApiKeyInputValue('')
    }
  }

  return (
    <Input
      showSuggestions
      id="targetApiKeyInput"
      onInput={onTargetApiKeysInputHandler}
      onKeyPress={onTargetApiKeysInputKeyPressHandler}
      type={InputType.Text}
      value={tarketApiKeyInputValue}
      className={classes.targetInfoContainerInput}
      onSuggestionItemSelect={onSuggestionItemSelectHandler}
      placeholder={t('COPY_CONFIGURATION_EXTENDED.ENTER_API_KEY_OR_SITE_DOMAIN')}
    >
      {filteredAvailableTargetSites.map((availableTargetSite) => (
        <SuggestionItem
          key={availableTargetSite.apiKey}
          text={availableTargetSite.baseDomain}
          additionalText={availableTargetSite.apiKey}
          description={`${availableTargetSite.partnerName} (${availableTargetSite.partnerId})`}
          type="Navigation"
        />
      ))}
      <Button id="addTargetSiteButton" slot="icon" icon="add" onClick={onAddTargetSiteButtonClickHandler} design="Transparent"></Button>
    </Input>
  )
}

export default withTranslation()(SearchSitesInput)
