/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import lodash from 'lodash'
import { useState } from 'react'
import { withTranslation } from 'react-i18next'
import { createUseStyles } from 'react-jss'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Input, InputType, SuggestionItem } from '@ui5/webcomponents-react'

import { selectAvailableTargetSites, selectUnfilteredAvailableTargetSites } from '../../redux/copyConfigurationExtended/copyConfigurationExtendedSlice'

import { filterTargetSites, findStringInAvailableTargetSites, getTargetSiteByTargetApiKey } from './utils'

import styles from './search-sites-input.styles'

const useStyles = createUseStyles(styles, { name: 'SearchSitesInput' })

const SearchSitesInput = ({ siteId, tarketApiKeyInputValue, setTarketApiKeyInputValue: setTargetApiKeyInputValue, addTargetSite, getTargetSiteInformation, t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const availableTargetSites = useSelector(selectAvailableTargetSites)
  const unfilteredAvailableTargetSites = useSelector(selectUnfilteredAvailableTargetSites)

  const [filteredAvailableTargetSites, setFilteredAvailableTargetSites] = useState([])

  const onTargetApiKeysInputHandler = lodash.debounce((event) => {
    const inputValue = event.target.value
    setTargetApiKeyInputValue(inputValue)
    if (siteId) {
      setFilteredAvailableTargetSites(filterTargetSites(inputValue, unfilteredAvailableTargetSites))
    } else {
      setFilteredAvailableTargetSites(filterTargetSites(inputValue, availableTargetSites))
    }
  }, 500)

  const onTargetApiKeysInputKeyPressHandler = (event) => {
    const inputValue = event.target.value.trim()
    if (event.key === 'Enter' && !findStringInAvailableTargetSites(inputValue, filteredAvailableTargetSites)) {
      setTargetApiKeyInputValue(inputValue)
      processInput(inputValue)
    }
  }

  const onSuggestionItemSelectHandler = (event) => {
    const targetSite = getTargetSiteByTargetApiKey(event.detail.item.additionalText, filteredAvailableTargetSites)
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

  const getPlaceHolderText = () => {
    return siteId ? t('COPY_CONFIGURATION_EXTENDED.ENTER_SOURCE_API_KEY_OR_SITE_DOMAIN') : t('COPY_CONFIGURATION_EXTENDED.ENTER_TARGET_API_KEY_OR_SITE_DOMAIN')
  }

  return (
    <Input
      showSuggestions
      id="apiKeyInput"
      data-cy="apiKeyInput"
      onInput={onTargetApiKeysInputHandler}
      onChange={onTargetApiKeysInputKeyPressHandler}
      type={InputType.Text}
      value={tarketApiKeyInputValue}
      className={classes.targetInfoContainerInput}
      onSuggestionItemSelect={onSuggestionItemSelectHandler}
      placeholder={getPlaceHolderText()}
      noTypeahead={true}
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
      <Button id="addTargetSiteButton" data-cy="addTargetSiteButton" slot="icon" icon="add" onClick={onAddTargetSiteButtonClickHandler} design="Transparent"></Button>
    </Input>
  )
}

export default withTranslation()(SearchSitesInput)
