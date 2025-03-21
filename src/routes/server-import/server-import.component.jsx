/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { useEffect, useState } from 'react'
import { Trans, withTranslation } from 'react-i18next'
import { createUseStyles } from 'react-jss'
import { useDispatch, useSelector } from 'react-redux'
import '@ui5/webcomponents/dist/features/InputElementsFormSupport.js'
import '@ui5/webcomponents/dist/MessageStrip.js'
import { Bar, Text, Button, Option, Select, ValueState, Panel, Label, MessageStrip } from '@ui5/webcomponents-react'
import FormItemWithIcon from '../../components/server-import-form/server-import-form.container.jsx'
import DialogMessageInform from '../../components/dialog-message-inform/dialog-message-inform.component.jsx'
import {
  clearServerConfigurations,
  getConfigurations,
  getDataflowRedirection,
  getServerConfiguration,
  selectServerConfigurations,
  selectServerProvider,
  selectShowSuccessDialog,
  setAccountType,
  setDataflow,
  setServerProvider,
  updateServerProvider,
  selectErrors,
  clearErrors,
  selectShowErrorDialog,
} from '../../redux/serverImport/serverImportSlice.js'
import { selectCredentials } from '../../redux/credentials/credentialsSlice.js'
import { getCurrentSiteInformation, selectCurrentSiteApiKey, selectCurrentSiteInformation } from '../../redux/copyConfigurationExtended/copyConfigurationExtendedSlice.js'
import { isInputFilled } from './utils.js'
import { trackUsage } from '../../lib/tracker.js'
import styles from './server-import.styles.js'
import { AccountType } from '../../services/importAccounts/accountType.js'

const useStyles = createUseStyles(styles, { name: 'Server Import' })

const PAGE_TITLE = 'Deploy and Import'

const ServerImportComponent = ({ t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const credentials = useSelector(selectCredentials)
  const apikey = useSelector(selectCurrentSiteApiKey)
  const currentSiteInfo = useSelector(selectCurrentSiteInformation)
  const serverConfigurations = useSelector(selectServerConfigurations)
  const errors = useSelector(selectErrors)
  const [accountOption, setAccountOption] = useState(AccountType.Full)
  const [showDialog, setShowSuccessDialog] = useState(false)
  const [isServerImportExpanded, setServerImportExpanded] = useState(false)
  const showSuccessDialog = useSelector(selectShowSuccessDialog)
  const showErrorDialog = useSelector(selectShowErrorDialog)
  const [createdDataflowId, setCreatedDataflowId] = useState('')
  const [redirectionDataflowURL, setRedirectionDataflowURL] = useState('')
  const serverProviderOption = useSelector(selectServerProvider)
  useEffect(() => {
    const fetchDataflowURL = async () => {
      const url = await dispatch(getDataflowRedirection())
      if (getDataflowRedirection.fulfilled.match(url)) {
        setRedirectionDataflowURL(url.payload)
      }
    }
    fetchDataflowURL()
    dispatch(getCurrentSiteInformation())
    dispatch(getConfigurations())
    dispatch(setServerProvider())
  }, [dispatch, apikey, credentials, redirectionDataflowURL, currentSiteInfo.dataCenter])

  const handleAccountOptionChange = (event) => {
    const selectedValue = event.target.value
    dispatch(setAccountType({ accountType: selectedValue, serverType: serverProviderOption }))
    setAccountOption(selectedValue)
  }

  const showErrors = () =>
    errors.length ? (
      <DialogMessageInform
        open={showErrorDialog}
        headerText="Error"
        state={ValueState.Error}
        closeButtonContent="Close"
        onAfterClose={onErrorDialogAfterCloseHandler}
        id="serverImportErrorPopup"
        data-cy="serverImportErrorPopup"
      >
        <Text className={classes.errorMessage}>
          {errors[0].errorMessage}
          <br />
          {errors[0].errorDetails}
        </Text>
      </DialogMessageInform>
    ) : (
      ''
    )

  const handleOptionChange = (event) => {
    dispatch(updateServerProvider(event.target.value))
  }

  const onErrorDialogAfterCloseHandler = async () => {
    dispatch(clearErrors())
    await trackUsage({ featureName: PAGE_TITLE })
  }
  const onSuccessDialogAfterCloseHandler = async () => {
    setShowSuccessDialog(false)
    await trackUsage({ featureName: PAGE_TITLE })
  }

  const handleInputChange = (event, id) => {
    dispatch(getServerConfiguration({ id, value: event.target.value, accountType: accountOption }))
  }

  const disableDeployButton = () => {
    if (serverConfigurations[serverProviderOption]) {
      return !isInputFilled(serverConfigurations[serverProviderOption])
    }
  }

  const handleSubmit = async () => {
    if (serverProviderOption && accountOption) {
      const resultAction = await dispatch(setDataflow({ option: serverProviderOption }))
      if (setDataflow.fulfilled.match(resultAction)) {
        setCreatedDataflowId(resultAction.payload)
      }
      setShowSuccessDialog(true)
    }
  }

  const onCancelHandler = () => {
    dispatch(clearServerConfigurations({ option: serverProviderOption }))
  }

  const handleLinkClick = async () => {
    setShowSuccessDialog(false)
    await trackUsage({ featureName: PAGE_TITLE })
  }

  const renderFormItemsInGrid = () => {
    return serverConfigurations[serverProviderOption].map((field) => (
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
          <div className={classes.warningDataflow}>
            <Trans i18nKey="SERVER_IMPORT_COMPONENT.TEMPLATES_IMPORTED_WARNING">
              <a href={redirectionDataflowURL} onClick={handleLinkClick}>
                {t('SERVER_IMPORT_COMPONENT.TEMPLATES_DATAFLOW_LINK')}
              </a>
            </Trans>
          </div>
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
                <Option id="fullAccountOption" value={AccountType.Full}>
                  {t('SERVER_IMPORT_COMPONENT.TEMPLATES_FULL_ACCOUNT')}
                </Option>
                <Option id="liteAccountOption" value={AccountType.Lite}>
                  {t('SERVER_IMPORT_COMPONENT.TEMPLATES_LITE_ACCOUNT')}
                </Option>
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
            <div className={classes.gridContainer}>{serverConfigurations[serverProviderOption] && renderFormItemsInGrid()}</div>
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
      {showErrors()}
    </>
  )
}

export default withTranslation()(ServerImportComponent)
