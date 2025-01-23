/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { createUseStyles } from 'react-jss'
import { useDispatch, useSelector } from 'react-redux'
import '@ui5/webcomponents/dist/features/InputElementsFormSupport.js'
import '@ui5/webcomponents/dist/MessageStrip.js'
import { Bar, Text, Button, Option, Select, ValueState, Panel, Label, MessageStrip } from '@ui5/webcomponents-react'
import FormItemWithIcon from '../../components/server-import-form/server-import-form.container.jsx'
import DialogMessageInform from '../../components/dialog-message-inform/dialog-message-inform.component.jsx'

import {
  clearConfigurations,
  getConfigurations,
  getServerConfiguration,
  selectServerConfigurations,
  selectShowSuccessDialog,
  setAccountType,
  setDataflow,
} from '../../redux/serverImport/serverImportSlice.js'
import { selectCredentials } from '../../redux/credentials/credentialsSlice.js'

import { getCurrentSiteInformation, selectCurrentSiteInformation } from '../../redux/copyConfigurationExtended/copyConfigurationExtendedSlice.js'
import { getApiKey } from '../../redux/utils.js'
import { isInputFilled } from './utils.js'
import { trackUsage } from '../../lib/tracker.js'
import styles from './server-import.styles.js'

const useStyles = createUseStyles(styles, { name: 'Server Import' })
const PAGE_TITLE = 'Deploy and Import'
const ACCOUNT_TYPE_FULL = 'Full'
const ACCOUNT_TYPE_LITE = 'Lite'
const SERVER_TYPE = 'azure'

const ServerImportComponent = ({ t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const credentials = useSelector(selectCredentials)
  const apikey = getApiKey(window.location.hash)
  const currentSiteInfo = useSelector(selectCurrentSiteInformation)
  const serverConfigurations = useSelector(selectServerConfigurations)
  const [selectedOption, setSelectedOption] = useState(SERVER_TYPE)
  const [accountOption, setAccountOption] = useState(ACCOUNT_TYPE_FULL)
  const [showDialog, setShowSuccessDialog] = useState(false)
  const [isServerImportExpanded, setServerImportExpanded] = useState(false)
  const showSuccessDialog = useSelector(selectShowSuccessDialog)
  const [createdDataflowId, setCreatedDataflowId] = useState('')

  useEffect(() => {
    dispatch(getCurrentSiteInformation())
    dispatch(getConfigurations())
  }, [dispatch, apikey, credentials, currentSiteInfo.dataCenter])

  const handleAccountOptionChange = (event) => {
    const selectedValue = event.target.value
    const setSelectedServerOption = selectedOption
    dispatch(setAccountType({ accountType: selectedValue, serverType: setSelectedServerOption }))
    setAccountOption(selectedValue)
  }

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value)
  }

  const onSuccessDialogAfterCloseHandler = async () => {
    await trackUsage({ featureName: PAGE_TITLE })
  }

  const handleInputChange = (event, id) => {
    dispatch(getServerConfiguration({ selectedOption, id, value: event.target.value, accountType: accountOption }))
  }

  const disableDeployButton = () => {
    if (serverConfigurations[selectedOption]) {
      return !isInputFilled(serverConfigurations[selectedOption])
    }
  }

  const handleSubmit = async () => {
    if (selectedOption && accountOption) {
      const resultAction = await dispatch(setDataflow({ option: selectedOption }))
      if (setDataflow.fulfilled.match(resultAction)) {
        setCreatedDataflowId(resultAction.payload)
      }
      setShowSuccessDialog(true)
    }
  }

  const onCancelHandler = () => {
    dispatch(clearConfigurations({ option: selectedOption }))
  }

  const renderFormItemsInGrid = () => {
    return serverConfigurations[selectedOption].map((field) => (
      <div key={field.id} className={classes.gridItem}>
        <FormItemWithIcon field={field} handleInputChange={handleInputChange} />
      </div>
    ))
  }

  const showSuccessMessage = () => (
    <DialogMessageInform
      open={showSuccessDialog}
      headerText="Success"
      state={ValueState.Success}
      closeButtonContent="Close"
      onAfterClose={onSuccessDialogAfterCloseHandler}
      id="serverImportSuccessPopup"
      data-cy="serverImportSuccessPopup"
    >
      <Text className={classes.successMessage}>{t('SERVER_IMPORT_COMPONENT.TEMPLATES_IMPORTED_SUCCESSFULLY', { dataflowId: createdDataflowId })}</Text>
      <div className={classes.warningMessage}>
        <MessageStrip hide-close-button design="Warning">
          {t('SERVER_IMPORT_COMPONENT.TEMPLATES_IMPORTED_WARNING')}
        </MessageStrip>
      </div>
    </DialogMessageInform>
  )

  const handleToggleCard = () => {
    setServerImportExpanded(!isServerImportExpanded)
  }

  return (
    <>
      <div className={classes.cardDiv}>
        <Panel id="serverImportPanel" className={classes.panelContainer} headerText={PAGE_TITLE} collapsed={!isServerImportExpanded} onToggle={handleToggleCard} noAnimation={true}>
          <Label>{t('SERVER_IMPORT_COMPONENT.TEMPLATES_FEATURE_DESCRIPTION')}</Label>
          <div className={classes.outerDiv}>
            <div className={classes.serverDropDown}>
              <div className={classes.smallTitle}>{t('SERVER_IMPORT_COMPONENT.TEMPLATES_SELECT_ACCOUNT_TYPE')}</div>
              <Select id="selectAccountType" onChange={handleAccountOptionChange} className={classes.selectBox}>
                <Option value={ACCOUNT_TYPE_FULL}> {t('SERVER_IMPORT_COMPONENT.TEMPLATES_FULL_ACCOUNT')}</Option>
                <Option value={ACCOUNT_TYPE_LITE}>{t('SERVER_IMPORT_COMPONENT.TEMPLATES_LITE_ACCOUNT')}</Option>
              </Select>
              <div className={classes.smallTitle}>{t('SERVER_IMPORT_COMPONENT.TEMPLATES_SELECT_LOCAL_STORAGE')}</div>
              <Select id="selectStorageServer" onChange={handleOptionChange} className={classes.selectBox}>
                {Object.keys(serverConfigurations).map((key) => (
                  <Option key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Option>
                ))}
              </Select>
            </div>
            <div className={classes.gridContainer}>{serverConfigurations[selectedOption] && renderFormItemsInGrid()}</div>
          </div>
          <Bar
            design="Footer"
            className={classes.barStyle}
            endContent={
              <div>
                <Button
                  type="submit"
                  id="serverImportSaveButton"
                  className="fd-button fd-button--emphasized fd-button--compact"
                  onClick={handleSubmit}
                  data-cy="serverImportSaveButton"
                  design="Emphasized"
                  disabled={disableDeployButton()}
                >
                  {t('SERVER_IMPORT_COMPONENT.TEMPLATES_IMPORT_BUTTON')}
                </Button>
                <Button
                  type="button"
                  id="serverImportCancelButton"
                  data-cy="serverImportCancelButton"
                  onClick={onCancelHandler}
                  className="fd-button fd-button--transparent fd-button--compact"
                >
                  {t('SERVER_IMPORT_COMPONENT.TEMPLATES_CANCEL_BUTTON')}
                </Button>
              </div>
            }
          ></Bar>
        </Panel>
      </div>
      {showDialog && showSuccessMessage()}
    </>
  )
}

export default withTranslation()(ServerImportComponent)
