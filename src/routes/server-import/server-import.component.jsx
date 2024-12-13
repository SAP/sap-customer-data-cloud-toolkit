/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import React, { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import styles from './server-import.styles.js'
import { Card, Bar, Title, Text, Button, Input, Option, Select, Form, FormItem, Label, FormGroup, ValueState } from '@ui5/webcomponents-react'
import {
  clearConfigurations,
  getConfigurations,
  getServerConfiguration,
  selectServerConfigurations,
  selectShowSuccessDialog,
  setAccountType,
  setDataflow,
} from '../../redux/serverImport/serverImportSlice.js'
import { getCurrentSiteInformation, selectCurrentSiteInformation } from '../../redux/copyConfigurationExtended/copyConfigurationExtendedSlice.js'
import { getApiKey } from '../../redux/utils.js'
import { selectCredentials } from '../../redux/credentials/credentialsSlice.js'
import { useDispatch, useSelector } from 'react-redux'
import DialogMessageInform from '../../components/dialog-message-inform/dialog-message-inform.component.jsx'
import { isInputFilled } from './utils.js'
const useStyles = createUseStyles(styles, { name: 'Server Import' })
const PAGE_TITLE = 'Server Import'
const ServerImportComponent = ({ t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const credentials = useSelector(selectCredentials)
  const apikey = getApiKey(window.location.hash)
  const currentSiteInfo = useSelector(selectCurrentSiteInformation)
  const serverConfigurations = useSelector(selectServerConfigurations)
  const [selectedOption, setSelectedOption] = useState('azure')
  const [accountOption, setAccountOption] = useState('Full')
  const [showDialog, setShowSuccessDialog] = useState(false)
  const showSuccessDialog = useSelector(selectShowSuccessDialog)
  useEffect(() => {
    dispatch(getCurrentSiteInformation())
    dispatch(getConfigurations())
    setFormData(serverConfigurations)
  }, [dispatch, apikey, credentials, currentSiteInfo.dataCenter])

  const [formData, setFormData] = useState([])

  const handleAccountOptionChange = (event) => {
    const selectedValue = event.target.value
    const setSelectedServerOption = selectedOption
    dispatch(setAccountType({ accountType: selectedValue, serverType: setSelectedServerOption }))
    setAccountOption(selectedValue)
  }
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value)
  }

  const handleInputChange = (event, id) => {
    dispatch(getServerConfiguration({ selectedOption, id, value: event.target.value, accountType: accountOption }))
  }
  const disableDeployButton = () => {
    if (serverConfigurations[selectedOption]) {
      return !isInputFilled(serverConfigurations[selectedOption])
    }
  }
  const handleSubmit = () => {
    if (selectedOption && accountOption) {
      dispatch(setDataflow({ option: selectedOption }))
      setShowSuccessDialog(true)
    }
  }

  const onCancelHandler = () => {
    dispatch(clearConfigurations({ option: selectedOption }))
    setFormData(serverConfigurations)
  }

  const showSuccessMessage = () => (
    <DialogMessageInform
      open={showSuccessDialog}
      headerText="Success"
      state={ValueState.Success}
      closeButtonContent="Close"
      id="copyConfigSuccessPopup"
      data-cy="copyConfigSuccessPopup"
    >
      <Text>SuccessFull</Text>
    </DialogMessageInform>
  )

  return (
    <>
      <Card>
        <div className={classes.outerDiv}>
          <Title className={classes.titleContainer} level="H3">
            {PAGE_TITLE}
          </Title>

          <div id="container" style={{ maxWidth: '1500px', width: '800px', overflowX: 'auto' }}>
            <div className={classes.serverDropDown}>
              <Select onChange={handleAccountOptionChange} className={classes.selectBox}>
                <Option>Full</Option>
                <Option>Lite</Option>
              </Select>
              <Select onChange={handleOptionChange} className={classes.selectBox}>
                {Object.keys(serverConfigurations).map((key) => (
                  <Option key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Option>
                ))}
              </Select>
            </div>
            <Form title="Test Form" columnsS={2} columnsM={2} columnsL={2} columnsXL={2} labelSpanS={12} labelSpanM={12} labelSpanL={12} labelSpanXL={12}>
              <FormGroup>
                {serverConfigurations[selectedOption] &&
                  serverConfigurations[selectedOption].map((field) => (
                    <FormItem key={field.name} label={<Label>{field.name}</Label>}>
                      <Input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={field.value !== undefined ? field.value : ''}
                        onInput={(event) => handleInputChange(event, field.id)}
                      />
                    </FormItem>
                  ))}
              </FormGroup>
            </Form>
          </div>
          <Bar design="Footer" className={classes.createButtonBarStyle}>
            <div>
              <Button
                type="submit"
                id="copyConfigExtendedSaveButton"
                className="fd-button fd-button--emphasized fd-button--compact"
                onClick={handleSubmit}
                data-cy="copyConfigExtendedSaveButton"
                design="Emphasized"
                disabled={disableDeployButton()}
              >
                Deploy
              </Button>
              <Button
                type="button"
                id="copyConfigExtendedCancelButton"
                data-cy="copyConfigExtendedCancelButton"
                onClick={onCancelHandler}
                className="fd-button fd-button--transparent fd-button--compact"
              >
                Cancel
              </Button>
            </div>
          </Bar>
        </div>
      </Card>
      {showDialog && showSuccessMessage()}
    </>
  )
}

export default ServerImportComponent
