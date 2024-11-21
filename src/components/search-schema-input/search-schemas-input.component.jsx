import React, { useState, useEffect } from 'react'
import '@ui5/webcomponents/dist/Input.js'
import '@ui5/webcomponents/dist/SuggestionItem.js'
import { Button, Input, InputType, SuggestionItem } from '@ui5/webcomponents-react'
import lodash from 'lodash'
import { createUseStyles } from 'react-jss'
import { filterTargetSchemas, findStringInAvailableTreeNode } from './utils'
import { extractIds } from '../../routes/import-accounts/utils'
import styles from './search-schema-input.styles'
import { useDispatch } from 'react-redux'

const useStyles = createUseStyles(styles, { name: 'SearchSchemaInput' })
const SearchBar = ({ configurations, setSchemaInputValue, schemaInputValue, handleTreeNodeClick }) => {
  const classes = useStyles()
  const [suggestions, setSuggestions] = useState([])

  const onTargetSchemaInputHandler = lodash.debounce((event) => {
    const allNames = extractIds(configurations)
    const value = event.target.value
    setSchemaInputValue(value)
    if (value !== '') {
      const filteredSuggestions = allNames.filter((name) => name.includes(value))
      setSuggestions(filteredSuggestions)
    }
  })

  const onSuggestionItemSelectHandler = (event) => {
    const inputValue = event.target.value.trim()
    handleTreeNodeClick(inputValue)
    setSchemaInputValue('')
  }
  const onAddSchemaClickHandler = () => {
    if (schemaInputValue && schemaInputValue !== '') {
      setSuggestions('')
      processInput(schemaInputValue)
    }
  }
  const onSchemaInputKeyPressHandler = (event) => {
    const inputValue = event.target.value.trim()
    console.log('event--->', event)
    if (event.type === 'change') {
      setSchemaInputValue(inputValue)
      processInput(inputValue)
    }
  }
  const processInput = (inputValue) => {
    if (inputValue && inputValue !== '') {
      setSchemaInputValue('')
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
      onSuggestionItemSelect={onSuggestionItemSelectHandler}
    >
      {suggestions.map((name) => (
        <SuggestionItem key={name} text={name} />
      ))}
      <Button id="searchSchemaField" data-cy="searchSchemaField" slot="icon" icon="add" onClick={onAddSchemaClickHandler} design="Transparent"></Button>
    </Input>
  )
}

export default SearchBar
