import { useState } from 'react'
import { withNamespaces } from 'react-i18next'
import { Dialog, Button, Label } from '@ui5/webcomponents-react'
import { useSelector, useDispatch } from 'react-redux'
import { createUseStyles } from 'react-jss'

import CredentialsErrorDialog from '../../components/credentials-error-dialog/credentials-error-dialog.component'

import { selectIsImportPopupOpen, sendSmsTemplatesArrayBuffer, setIsImportPopupOpen } from '../../redux/sms/smsSlice'
import { selectCredentials, areCredentialsFilled } from '../../redux/credentials/credentialsSlice'

import '@ui5/webcomponents-icons/dist/decline.js'
import './sms-import-popup.component.css'

import styles from './styles.js'

const useStyles = createUseStyles(styles, { name: 'SmsImportPopup' })

const SmsImportPopup = ({ t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const isImportPopupOpen = useSelector(selectIsImportPopupOpen)
  const credentials = useSelector(selectCredentials)

  const [importFile, setImportFile] = useState(undefined)
  const [showCredentialsErrorDialog, setShowCredentialsErrorDialog] = useState(false)

  const onImportButtonClickHandler = () => {
    if (areCredentialsFilled(credentials)) {
      setShowCredentialsErrorDialog(false)
      dispatch(sendSmsTemplatesArrayBuffer(importFile.arrayBuffer()))
    } else {
      setShowCredentialsErrorDialog(true)
    }
  }

  const onCancelImportButtonClickHandler = () => {
    onCloseSmsImportPopup()
  }

  const onFileUploadButtonClickHandler = (event) => {
    const file = event.target.files[0]
    if (file) {
      setImportFile(file)
    }
  }

  const onCloseSmsImportPopup = () => {
    dispatch(setIsImportPopupOpen(false))
    setImportFile(undefined)
  }

  const onAfterCloseCredentialsErrorDialogHandle = () => {
    setShowCredentialsErrorDialog(false)
    onCloseSmsImportPopup()
  }

  return (
    <>
      <Dialog
        className="ui-dialog"
        open={isImportPopupOpen}
        onAfterClose={onCloseSmsImportPopup}
        id="smsImportPopup"
        header={
          <div id="header" className={classes.headerOuterDivStyle}>
            <div className={classes.headerInnerDivStyle}>{t('SMS_IMPORT_POPUP.POPUP_HEADER')}</div>
            <div>
              <Button id="closeSmsImportPopup" icon="decline" onClick={onCloseSmsImportPopup} design="Transparent" className="ui-dialog-titlebar-close"></Button>
            </div>
          </div>
        }
        children={
          <div>
            <div className={classes.specifyFileLableStyle}>
              <Label id="specifyFileLabel">{t('SMS_IMPORT_POPUP.SPECIFY_FILE')}</Label>
            </div>
            <div>
              <input id="zipFileInput" type='file'></input>
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
    </>
  )
}

export default withNamespaces()(SmsImportPopup)
