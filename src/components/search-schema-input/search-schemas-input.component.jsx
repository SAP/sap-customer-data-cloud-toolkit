/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import '@ui5/webcomponents/dist/Input.js'
import '@ui5/webcomponents/dist/SuggestionItem.js'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import { Input, InputType, SuggestionItem } from '@ui5/webcomponents-react'
import { extractIds } from '../../routes/import-accounts/utils'
import styles from './search-schema-input.styles'

const useStyles = createUseStyles(styles, { name: 'SearchSchemaInput' })

const SearchBar = ({ handleSuggestionClick, configurations, setSchemaInputValue, schemaInputValue, handleTreeNodeClick }) => {
  const classes = useStyles()
  const [suggestions, setSuggestions] = useState([])

  const onTargetSchemaInputHandler = (event) => {
    const allNames = extractIds([configurations])
    const value = event.target.value
    setSchemaInputValue(value)
    const filteredSuggestions = allNames.filter((name) => name.includes(value))
    if (value !== '') {
      if (filteredSuggestions.length > 0) {
        setSuggestions(filteredSuggestions)
        handleTreeNodeClick(filteredSuggestions)
      } else {
        console.log('No suggestions found')
        handleTreeNodeClick('')
        setSuggestions([])
      }
    }
    if (value === '') {
      handleTreeNodeClick('')
    }
  }

  const onSchemaInputKeyPressHandler = (event) => {
    const inputValue = event.target.value.trim()
    setSchemaInputValue(inputValue)
    handleSuggestionClick(inputValue)
    if (inputValue === '') {
      handleSuggestionClick('')
    }
  }

  return (
    <Input
      show-suggestions
      id="schemaInput"
      data-cy="schemaInput"
      placeholder="Search..."
      onInput={onTargetSchemaInputHandler}
      onChange={onSchemaInputKeyPressHandler}
      type={InputType.Text}
      value={schemaInputValue}
      className={classes.targetInfoContainerInput}
    >
      {suggestions.map((name) => (
        <SuggestionItem key={name} text={name} />
      ))}
    </Input>
  )
}

export default SearchBar
