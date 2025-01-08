import React, { useState } from 'react'
import '@ui5/webcomponents/dist/Input.js'
import '@ui5/webcomponents/dist/SuggestionItem.js'
import { Input, InputType, SuggestionItem } from '@ui5/webcomponents-react'
import { createUseStyles } from 'react-jss'
import { extractIds } from '../../routes/server-import/utils'
import styles from './search-schema-input.styles'
import { setSelectedConfiguration } from '../../redux/importAccounts/importAccountsSlice'

const useStyles = createUseStyles(styles, { name: 'SearchSchemaInput' })
const SearchBar = ({ dispatch, configurations, setSchemaInputValue, schemaInputValue, handleTreeNodeClick }) => {
  const classes = useStyles()
  const [suggestions, setSuggestions] = useState([])

  const onTargetSchemaInputHandler = (event) => {
    const allNames = extractIds([configurations])
    const value = event.target.value

    setSchemaInputValue(value)
    if (value !== '') {
      const filteredSuggestions = allNames.filter((name) => name.includes(value))
      setSuggestions(filteredSuggestions)
      if (filteredSuggestions) {
        handleTreeNodeClick(filteredSuggestions[0])
      }
    }
    if (value === '') {
      handleTreeNodeClick('')
    }
  }

  const onSchemaInputKeyPressHandler = (event) => {
    const inputValue = event.target.value.trim()
    if (event.type === 'change') {
      setSchemaInputValue(inputValue)
      handleTreeNodeClick(inputValue)
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
