/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { withTranslation } from 'react-i18next'
import React, { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import styles from './server-import.styles.js'
import {
  Card,
  CardHeader,
  Bar,
  Title,
  Text,
  TitleLevel,
  FlexBox,
  Grid,
  Button,
  Input,
  Option,
  Select,
  Form,
  FormItem,
  Label,
  FormGroup,
  TextArea,
  ValueState,
} from '@ui5/webcomponents-react'
import { getConfigurations, getServerConfiguration, selectServerConfigurations, selectShowSuccessDialog, setDataflow } from '../../redux/serverImport/serverImportSlice.js'
import { getCurrentSiteInformation, selectCurrentSiteInformation } from '../../redux/copyConfigurationExtended/copyConfigurationExtendedSlice.js'
import { getApiKey } from '../../redux/utils.js'
import { selectCredentials } from '../../redux/credentials/credentialsSlice.js'
import { useDispatch, useSelector } from 'react-redux'
import DialogMessageInform from '../../components/dialog-message-inform/dialog-message-inform.component.jsx'
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
  const showSuccessDialog = useSelector(selectShowSuccessDialog)
  useEffect(() => {
    dispatch(getCurrentSiteInformation())
    dispatch(getConfigurations())
  }, [dispatch, apikey, credentials, currentSiteInfo.dataCenter])
  console.log('selectedOption.target.value--->', selectedOption)
  console.log('serverConfigurations.target.value--->', serverConfigurations)

  const [formData, setFormData] = useState([])
  useEffect(() => {
    setFormData(serverConfigurations)
  }) //eslint-disable-line

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value)
    console.log('selectedOption.target.value--->', selectedOption)
  }

  const handleInputChange = (event, id) => {
    console.log('selectedOption.target.value', selectedOption)
    console.log('event.target.value--->', event.target.value)
    console.log('eventid--->', id)
    dispatch(getServerConfiguration({ selectedOption, id, value: event.target.value }))
  }

  const handleSubmit = () => {
    console.log('Form Data:', formData)
    dispatch(setDataflow(selectedOption))
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
                        value={formData[field.name] || ''}
                        onInput={(event) => handleInputChange(event, field.id)}
                      />
                    </FormItem>
                  ))}
              </FormGroup>
            </Form>
          </div>
          <div>
            <Bar design="Footer" className={classes.createButtonBarStyle}>
              <Button onClick={handleSubmit} design="Emphasized" className={classes.createButtonStyle}>
                Submit
              </Button>
            </Bar>
          </div>
        </div>
      </Card>
      {showSuccessDialog && showSuccessMessage()}
    </>
  )
}

export default ServerImportComponent
