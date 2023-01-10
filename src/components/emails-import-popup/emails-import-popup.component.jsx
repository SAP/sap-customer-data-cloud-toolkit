import { useState, useEffect } from 'react'
import { withNamespaces } from 'react-i18next'
import { Dialog, Button, Label, ValueState } from '@ui5/webcomponents-react'
import { useSelector, useDispatch } from 'react-redux'
import { createUseStyles } from 'react-jss'

import CredentialsErrorDialog from '../../components/credentials-error-dialog/credentials-error-dialog.component'
import DialogMessageConfirm from '../../components/dialog-message-confirm/dialog-message-confirm.component'
import MessageList from '../../components/message-list/message-list.component'

import {
  selectIsImportPopupOpen,
  sendEmailTemplatesArrayBuffer,
  setIsImportPopupOpen,
  validateEmailTemplates,
  selectIsImportFileValid,
  setIsImportFileValid,
  selectValidationErrors,
  clearValidationErrors,
} from '../../redux/emails/emailSlice'

import { selectCredentials, areCredentialsFilled } from '../../redux/credentials/credentialsSlice'

import '@ui5/webcomponents-icons/dist/decline.js'
import './emails-import-popup.component.css'

import styles from './styles.js'

const useStyles = createUseStyles(styles, { name: 'EmailsImportPopup' })

const EmailsImportPopup = ({ t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const isImportPopupOpen = useSelector(selectIsImportPopupOpen)
  const credentials = useSelector(selectCredentials)
  const isImportFileValid = useSelector(selectIsImportFileValid)
  const validationErrors = useSelector(selectValidationErrors)

  const [importFile, setImportFile] = useState(undefined)
  const [showCredentialsErrorDialog, setShowCredentialsErrorDialog] = useState(false)
  const [showValidationErrors, setShowValidationErrors] = useState(false)

  useEffect(() => {
    setShowValidationErrors(validationErrors.length > 0)
  }, [validationErrors.length])

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
    setShowValidationErrors(false)
    dispatch(clearValidationErrors())
  }

  const showValidationErrorsList = () => (
    <DialogMessageConfirm
      open={showValidationErrors}
      className={classes.errorDialogStyle}
      headerText={t('GLOBAL.ERROR')}
      state={ValueState.Error}
      closeButtonContent={t('GLOBAL.CANCEL')}
      id="emailTemplatesValidationErrorPopup"
      onAfterClose={onAfterCloseValidationErrorDialogHandler}
      confirmButtonClickHandler={onImportValidatedFile}
    >
      <MessageList messages={validationErrors} />
    </DialogMessageConfirm>
  )

  return (
    <>
      <Dialog
        className="ui-dialog"
        open={isImportPopupOpen}
        onAfterClose={onCloseEmailImportPopup}
        id="emailsImportPopup"
        header={
          <div id="header" className={classes.headerOuterDivStyle}>
            <div className={classes.headerInnerDivStyle}>{t('EMAILS_IMPORT_POPUP.POPUP_HEADER')}</div>
            <div>
              <Button id="closeEmailImportPopup" icon="decline" onClick={onCloseEmailImportPopup} design="Transparent" className="ui-dialog-titlebar-close"></Button>
            </div>
          </div>
        }
        children={
          <div>
            <div className={classes.specifyFileLableStyle}>
              <Label id="specifyFileLabel">{t('EMAILS_IMPORT_POPUP.SPECIFY_FILE')}</Label>
            </div>
            <div>
              <input id="zipFileInput" type="file" accept="application/zip" onChange={onFileUploadButtonClickHandler}></input>
            </div>
          </div>
        }
        footer={
          <div className={classes.footerOuterDivStyle}>
            <Button id="importZipButton" className="btn dialog-button-1" onClick={onImportButtonClickHandler} disabled={!importFile}>
              {t('GLOBAL.IMPORT')}
            </Button>

            <Button id="cancelImportZipButton" className="btn dialog-button-2" onClick={onCancelImportButtonClickHandler}>
              {t('GLOBAL.CANCEL')}
            </Button>
          </div>
        }
      ></Dialog>

      <CredentialsErrorDialog open={showCredentialsErrorDialog} onAfterCloseHandle={onAfterCloseCredentialsErrorDialogHandle} />
      <>{isImportFileValid ? onImportValidatedFile() : ''}</>
      {showValidationErrorsList()}
      <input type="text"></input>
    </>
  )
}

export default withNamespaces()(EmailsImportPopup)
