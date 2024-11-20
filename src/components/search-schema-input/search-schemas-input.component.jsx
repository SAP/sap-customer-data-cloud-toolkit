import React, { useState, useEffect } from 'react'
import '@ui5/webcomponents/dist/Input.js'
import '@ui5/webcomponents/dist/SuggestionItem.js'
import { Button, Input, SuggestionItem } from '@ui5/webcomponents-react'
import lodash from 'lodash'
import { createUseStyles } from 'react-jss'
import { filterTargetSchemas, findStringInAvailableTreeNode } from './utils'
import { extractIds } from '../../routes/import-accounts/utils'
import styles from './search-schema-input.styles'
import { useDispatch } from 'react-redux'
const useStyles = createUseStyles(styles, { name: 'SearchSchemaInput' })
const SearchBar = ({ configurations, setSchemaInputValue, setSugestionSchema }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [suggestions, setSuggestions] = useState([])
  const [inputValue, setInputValue] = useState('')

  const onTargetSchemaInputHandler = lodash.debounce((event) => {
    const allNames = extractIds(configurations)
    const value = event.target.value
    setInputValue(value)
    if (value !== '') {
      setSchemaInputValue(value)
      const filteredSuggestions = allNames.filter((name) => name.includes(value))
      setSuggestions(filteredSuggestions)
    } else {
      setSuggestions([])
    }
  }, 500)
  const onSuggestionItemSelectHandler = (event) => {
    setSchemaInputValue('')
  }
  const onTargetSchemaInputPressHandler = (event) => {
    const inputValue = event.target.value.trim()

    const optionClicked = true
    if (event.type === 'change' && inputValue !== '') {
      setSchemaInputValue(inputValue)
      processInput(inputValue)
      dispatch(setSugestionSchema({ inputValue, value: optionClicked }))
    }
    setSchemaInputValue('')
  }
  const processInput = (value) => {
    if (value && value !== '') {
      setSchemaInputValue('')
      setSuggestions([])
    }
  }

  return (
    <Input
      show-suggestions
      placeholder="Search..."
      onInput={onTargetSchemaInputHandler}
      onChange={onTargetSchemaInputPressHandler}
      className={classes.targetInfoContainerInput}
      value={inputValue}
      onSuggestionItemSelect={onSuggestionItemSelectHandler}
    >
      {suggestions.map((name) => (
        <SuggestionItem key={name} text={name} />
      ))}
      <Button id="searchSchemaField" data-cy="searchSchemaField" slot="icon" icon="add" design="Transparent"></Button>
    </Input>
  )
}

export default SearchBar
