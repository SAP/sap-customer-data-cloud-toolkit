/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { withTranslation } from 'react-i18next'
import React, { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import styles from './server-import.styles.js'
import { Card, Bar, Title, Text, Button, Option, Select, Form, FormItem, FormGroup, ValueState } from '@ui5/webcomponents-react'
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
import FormItemWithIcon from '../../components/server-import-form/server-import-form.container.jsx'
const useStyles = createUseStyles(styles, { name: 'Server Import' })
const PAGE_TITLE = 'Accounts Import'
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
    console.log('setSelectedServerOption', setSelectedServerOption)
    console.log('selectedValue', selectedValue)
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
      <Text>{t('SERVER_IMPORT_COMPONENT.TEMPLATES_IMPORTED_SUCCESSFULLY')}</Text>
    </DialogMessageInform>
  )
  return (
    <>
      <Card>
        <div className={classes.outerDiv}>
          <Title className={classes.titleContainer} level="H3">
            {PAGE_TITLE}
          </Title>

          <div className={classes.outerDivContainer}>
            <div className={classes.serverDropDown}>
              <div className={classes.smallTitle}>{t('SERVER_IMPORT_COMPONENT.TEMPLATES_SELECT_ACCOUNT_TYPE')}</div>
              <Select onChange={handleAccountOptionChange} className={classes.selectBox}>
                <Option value="Full"> {t('SERVER_IMPORT_COMPONENT.TEMPLATES_FULL_ACCOUNT')}</Option>
                <Option value="Lite">{t('SERVER_IMPORT_COMPONENT.TEMPLATES_LITE_ACCOUNT')}</Option>
              </Select>
              <div className={classes.smallTitle}>{t('SERVER_IMPORT_COMPONENT.TEMPLATES_SELECT_LOCAL_STORAGE')}</div>
              <Select onChange={handleOptionChange} className={classes.selectBox}>
                {Object.keys(serverConfigurations).map((key) => (
                  <Option key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Option>
                ))}
              </Select>
            </div>
            <Form columnsS={2} columnsM={2} columnsL={2} columnsXL={2} labelSpanS={12} labelSpanM={12} labelSpanL={12} labelSpanXL={12}>
              <FormGroup>
                {serverConfigurations[selectedOption] &&
                  serverConfigurations[selectedOption].map((field) => (
                    <FormItem key={field.name} className={classes.outerDivFormItem}>
                      <FormItemWithIcon selectedOption={selectedOption} field={field} handleInputChange={handleInputChange} />
                    </FormItem>
                  ))}
              </FormGroup>
            </Form>
          </div>

          <div className={classes.selectConfigurationOuterDivStyle}>
            <div className={classes.selectConfigurationInnerDivStyle}>
              <Bar
                design="Footer"
                endContent={
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
                      {t('SERVER_IMPORT_COMPONENT.TEMPLATES_IMPORT_BUTTON')}
                    </Button>
                    <Button
                      type="button"
                      id="copyConfigExtendedCancelButton"
                      data-cy="copyConfigExtendedCancelButton"
                      onClick={onCancelHandler}
                      className="fd-button fd-button--transparent fd-button--compact"
                    >
                      {t('SERVER_IMPORT_COMPONENT.TEMPLATES_CANCEL_BUTTON')}
                    </Button>
                  </div>
                }
              ></Bar>
            </div>
          </div>
        </div>
      </Card>
      {showDialog && showSuccessMessage()}
    </>
  )
}

export default withTranslation()(ServerImportComponent)
