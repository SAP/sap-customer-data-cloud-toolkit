import { useState, useEffect } from 'react'
import { withTranslation } from 'react-i18next'
import { ValueState, BusyIndicator } from '@ui5/webcomponents-react'
import { useSelector, useDispatch } from 'react-redux'
import { createUseStyles } from 'react-jss'

import CredentialsErrorDialog from '../../components/credentials-error-dialog/credentials-error-dialog.component'
import DialogMessageConfirm from '../../components/dialog-message-confirm/dialog-message-confirm.component'
import MessageList from '../../components/message-list/message-list.component'
import ImportPopup from '../import-popup/import-popup.component'

import {
  selectIsImportPopupOpen,
  sendEmailTemplatesArrayBuffer,
  setIsImportPopupOpen,
  validateEmailTemplates,
  selectIsImportFileValid,
  setIsImportFileValid,
  selectValidationWarnings,
  clearValidationErrors,
  selectIsLoading,
} from '../../redux/emails/emailSlice'

import { selectCredentials } from '../../redux/credentials/credentialsSlice'
import { areCredentialsFilled } from '../../redux/credentials/utils'

import '@ui5/webcomponents-icons/dist/decline.js'
import './emails-import-popup.component.css'
import styles from './emails-import-popup.styles.js'

const useStyles = createUseStyles(styles, { name: 'EmailsImportPopup' })

const EmailsImportPopup = ({ t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const isImportPopupOpen = useSelector(selectIsImportPopupOpen)
  const credentials = useSelector(selectCredentials)
  const isImportFileValid = useSelector(selectIsImportFileValid)
  const validationWarnings = useSelector(selectValidationWarnings)
  const isLoading = useSelector(selectIsLoading)

  const [importFile, setImportFile] = useState(undefined)
  const [showCredentialsErrorDialog, setShowCredentialsErrorDialog] = useState(false)
  const [showValidationWarnings, setShowValidationWarnings] = useState(false)

  useEffect(() => {
    setShowValidationWarnings(validationWarnings.length > 0)
  }, [validationWarnings.length])

  const onImportValidatedFile = () => {
    dispatch(sendEmailTemplatesArrayBuffer(importFile.arrayBuffer()))
    dispatch(setIsImportFileValid(false))
    dispatch(clearValidationErrors())
  }

  const onImportButtonClickHandler = () => {
    if (areCredentialsFilled(credentials)) {
      setShowCredentialsErrorDialog(false)
      dispatch(validateEmailTemplates(importFile.arrayBuffer()))
    } else {
      setShowCredentialsErrorDialog(true)
    }
  }

  const onCancelImportButtonClickHandler = () => {
    onCloseEmailImportPopup()
  }

  const onFileUploadButtonClickHandler = (event) => {
    const file = event.target.files[0]
    if (file) {
      setImportFile(file)
    }
  }

  const onCloseEmailImportPopup = () => {
    dispatch(setIsImportPopupOpen(false))
  }

  const onAfterCloseCredentialsErrorDialogHandle = () => {
    setShowCredentialsErrorDialog(false)
    onCloseEmailImportPopup()
  }

  const onAfterCloseValidationErrorDialogHandler = () => {
    setShowValidationWarnings(false)
    dispatch(clearValidationErrors())
  }

  const showValidationWarningList = () => (
    <DialogMessageConfirm
      open={showValidationWarnings}
      headerText={t('GLOBAL.WARNING')}
      state={ValueState.Warning}
      closeButtonContent={t('GLOBAL.CANCEL')}
      id="emailTemplatesValidationErrorPopup"
      data-cy="emailTemplatesValidationErrorPopup"
      onAfterClose={onAfterCloseValidationErrorDialogHandler}
      confirmButtonClickHandler={onImportValidatedFile}
    >
      <MessageList messages={validationWarnings} type={ValueState.Warning} />
    </DialogMessageConfirm>
  )

  const showDialog = () => {
    return (
      <ImportPopup
        isImportPopupOpen={isImportPopupOpen}
        onCloseImportPopup={onCloseEmailImportPopup}
        popupHeader={t('EMAILS_IMPORT_POPUP.POPUP_HEADER')}
        specifyFileLabel={t('EMAILS_IMPORT_POPUP.SPECIFY_FILE')}
        onFileUploadButtonClickHandler={onFileUploadButtonClickHandler}
        onImportButtonClickHandler={onImportButtonClickHandler}
        importFile={importFile}
        onCancelImportButtonClickHandler={onCancelImportButtonClickHandler}
      />
    )
  }

  return (
    <>
      {isLoading ? <BusyIndicator active delay="1" className={classes.busyIndicatorStyle} /> : showDialog()}
      {isImportFileValid ? onImportValidatedFile() : ''}
      <CredentialsErrorDialog open={showCredentialsErrorDialog} onAfterCloseHandle={onAfterCloseCredentialsErrorDialogHandle} />
      {showValidationWarningList()}
    </>
  )
}

export default withTranslation()(EmailsImportPopup)
