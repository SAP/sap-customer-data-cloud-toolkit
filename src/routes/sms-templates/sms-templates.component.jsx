/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { useState, useEffect } from 'react'
import { Bar, Button, ValueState, Text } from '@ui5/webcomponents-react'
import { useDispatch, useSelector } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { createUseStyles } from 'react-jss'

import DialogMessageInform from '../../components/dialog-message-inform/dialog-message-inform.component'
import MessageList from '../../components/message-list/message-list.component'
import SmsImportPopup from '../../components/sms-import-popup/sms-import-popup.component'
import CredentialsErrorDialog from '../../components/credentials-error-dialog/credentials-error-dialog.component'

import {
  getSmsTemplatesArrayBuffer,
  selectExportFile,
  selectIsLoading,
  selectErrors,
  selectIsImportPopupOpen,
  setIsImportPopupOpen,
  clearExportFile,
  clearErrors,
  selectShowSuccessDialog,
  selectErrorCondition,
  clearErrorCondition,
} from '../../redux/sms/smsSlice'

import { selectCredentials } from '../../redux/credentials/credentialsSlice'

import { trackUsage } from '../../lib/tracker.js'

import { areCredentialsFilled } from '../../redux/credentials/utils'
import styles from './sms-templates.styles.js'

import { errorConditions } from '../../redux/errorConditions'

const useStyles = createUseStyles(styles, { name: 'SmsTemplates' })

const PAGE_TITLE = 'SMS Templates'

const SmsTemplates = ({ t }) => {
  const dispatch = useDispatch()

  const exportFile = useSelector(selectExportFile)
  const isLoading = useSelector(selectIsLoading)
  const errors = useSelector(selectErrors)
  const isImportPopupOpen = useSelector(selectIsImportPopupOpen)
  const showSuccessDialog = useSelector(selectShowSuccessDialog)
  const credentials = useSelector(selectCredentials)
  const errorCondition = useSelector(selectErrorCondition)

  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [showCredentialsErrorDialog, setShowCredentialsErrorDialog] = useState(false)
  const classes = useStyles()

  useEffect(() => {
    setShowErrorDialog(errors.length > 0)
  }, [errors.length])

  const onExportAllSmsTemplatesButtonClickHandler = () => {
    if (areCredentialsFilled(credentials)) {
      setShowCredentialsErrorDialog(false)
      dispatch(getSmsTemplatesArrayBuffer())
    } else {
      setShowCredentialsErrorDialog(true)
    }
  }

  const getDownloadElement = () => {
    const element = document.createElement('a')
    element.setAttribute('href', URL.createObjectURL(exportFile))
    element.setAttribute('download', exportFile.name)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    dispatch(clearExportFile())
  }

  const getErrorDialogHeaderText = () => {
    switch (errorCondition) {
      case errorConditions.exportError:
        return t('SMS_TEMPLATES_COMPONENT.EXPORT_ERROR_HEADER_MESSAGE')
      case errorConditions.importWithoutCountError:
        return t('SMS_TEMPLATES_COMPONENT.IMPORT_ERROR_HEADER_MESSAGE')
      default:
        return t('GLOBAL.ERROR')
    }
  }

  const onImportAllSmsTemplatesButtonClickHandler = () => {
    dispatch(setIsImportPopupOpen(true))
  }

  const onAfterCloseErrorDialogHandler = () => {
    setShowErrorDialog(false)
    dispatch(clearErrors())
    dispatch(clearErrorCondition())
  }
  const onSuccessDialogAfterCloseHandler = async () => {
    await trackUsage({ featureName: PAGE_TITLE })
    document.location.reload()
  }

  const onAfterCloseCredentialsErrorDialogHandler = () => {
    setShowCredentialsErrorDialog(false)
  }

  const showErrorsList = () => (
    <DialogMessageInform
      open={showErrorDialog}
      className={classes.errorDialogStyle}
      headerText={getErrorDialogHeaderText()}
      state={ValueState.Error}
      closeButtonContent="Ok"
      id="smsTemplatesErrorPopup"
      data-cy="smsTemplatesErrorPopup"
      onAfterClose={onAfterCloseErrorDialogHandler}
    >
      <MessageList messages={errors} />
    </DialogMessageInform>
  )

  const showSuccessMessage = () => (
    <DialogMessageInform
      open={showSuccessDialog}
      headerText={t('GLOBAL.SUCCESS')}
      state={ValueState.Success}
      onAfterClose={onSuccessDialogAfterCloseHandler}
      closeButtonContent={t('GLOBAL.OK')}
      id="successPopup"
      data-cy="smsSuccessPopup"
    >
      <Text>{t('SMS_TEMPLATES_COMPONENT.TEMPLATES_IMPORTED_SUCCESSFULLY')}</Text>
    </DialogMessageInform>
  )

  return (
    <>
      <Bar
        className={classes.outerBarStyle}
        endContent={
          <div>
            <Button
              id="exportAllSmsTemplatesButton"
              data-cy="exportAllSmsTemplatesButton"
              className="fd-button fd-button--compact"
              onClick={onExportAllSmsTemplatesButtonClickHandler}
            >
              {t('GLOBAL.EXPORT_ALL')}
            </Button>

            <Button
              id="importAllSmsTemplatesButton"
              data-cy="importAllSmsTemplatesButton"
              className={classes.importAllButtonStyle}
              onClick={onImportAllSmsTemplatesButtonClickHandler}
            >
              {t('GLOBAL.IMPORT_ALL')}
            </Button>
          </div>
        }
      ></Bar>
      {!isLoading && exportFile ? getDownloadElement() : ''}
      {showErrorsList()}
      {isImportPopupOpen ? <SmsImportPopup /> : ''}
      {showSuccessMessage()}
      <CredentialsErrorDialog open={showCredentialsErrorDialog} onAfterCloseHandle={onAfterCloseCredentialsErrorDialogHandler} />
    </>
  )
}

export default withTranslation()(SmsTemplates)
