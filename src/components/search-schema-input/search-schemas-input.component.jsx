import React, { useState } from 'react'
import '@ui5/webcomponents/dist/Input.js'
import '@ui5/webcomponents/dist/SuggestionItem.js'
import { Input, InputType, SuggestionItem } from '@ui5/webcomponents-react'
import { createUseStyles } from 'react-jss'
import { extractIds } from '../../routes/import-accounts/utils'
import styles from './search-schema-input.styles'

const useStyles = createUseStyles(styles, { name: 'SearchSchemaInput' })
const SearchBar = ({ dispatch, configurations, setSchemaInputValue, schemaInputValue, handleTreeNodeClick, dispatchMandatoryStatus }) => {
  const classes = useStyles()
  const [suggestions, setSuggestions] = useState([])

  const onTargetSchemaInputHandler = (event) => {
    const allNames = extractIds([configurations])
    const value = event.target.value

    setSchemaInputValue(value)
    if (value !== '') {
      const filteredSuggestions = allNames.filter((name) => name.includes(value))
      if (filteredSuggestions.length) {
        setSuggestions(filteredSuggestions)
        handleTreeNodeClick(filteredSuggestions)
      }
    }
    if (value === '') {
      handleTreeNodeClick('')
    }
  }

  const onSchemaInputKeyPressHandler = (event) => {
    const inputValue = event.target.value.trim()
    setSchemaInputValue(inputValue)
    console.log('value', inputValue)
    console.log('suggest', suggestions)
    handleTreeNodeClick(suggestions)
    if (inputValue === '') {
      handleTreeNodeClick('')
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
