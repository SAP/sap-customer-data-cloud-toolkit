import { useState, useEffect } from 'react'
import { Bar, Button, ValueState } from '@ui5/webcomponents-react'
import { useDispatch, useSelector } from 'react-redux'
import { withNamespaces } from 'react-i18next'
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
import { areCredentialsFilled } from '../../redux/credentials/utils'
import styles from './sms-templates.styles.js'

import { errorConditions } from '../../redux/errorConditions'

const useStyles = createUseStyles(styles, { name: 'SmsTemplates' })

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

  const showErrorsList = () => (
    <DialogMessageInform
      open={showErrorDialog}
      className={classes.errorDialogStyle}
      headerText={getErrorDialogHeaderText()}
      state={ValueState.Error}
      closeButtonContent="Ok"
      id="smsTemplatesErrorPopup"
      onAfterClose={onAfterCloseErrorDialogHandler}
    >
      <MessageList messages={errors} />
    </DialogMessageInform>
  )

  const onAfterCloseCredentialsErrorDialogHandle = () => {
    setShowCredentialsErrorDialog(false)
  }

  return (
    <>
      <Bar
        className={classes.outerBarStyle}
        endContent={
          <div>
            <Button id="exportAllSmsTemplatesButton" className="fd-button fd-button--compact" onClick={onExportAllSmsTemplatesButtonClickHandler}>
              {t('GLOBAL.EXPORT_ALL')}
            </Button>

            <Button id="importAllSmsTemplatesButton" className={classes.importAllButtonStyle} onClick={onImportAllSmsTemplatesButtonClickHandler}>
              {t('GLOBAL.IMPORT_ALL')}
            </Button>
          </div>
        }
      ></Bar>
      {!isLoading && exportFile ? getDownloadElement() : ''}
      {showErrorsList()}
      {isImportPopupOpen ? <SmsImportPopup /> : ''}
      {showSuccessDialog ? (
        <DialogMessageInform
          open={showSuccessDialog}
          headerText={t('GLOBAL.SUCCESS')}
          state={ValueState.Success}
          onAfterClose={() => document.location.reload()}
          closeButtonContent="Ok"
          id="successPopup"
        >
          {t('SMS_TEMPLATES_COMPONENT.TEMPLATES_IMPORTED_SUCCESSFULLY')}
        </DialogMessageInform>
      ) : (
        ''
      )}

      <CredentialsErrorDialog open={showCredentialsErrorDialog} onAfterCloseHandle={onAfterCloseCredentialsErrorDialogHandle} />
    </>
  )
}

export default withNamespaces()(SmsTemplates)
