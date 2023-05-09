import { useState } from 'react'
import { withTranslation } from 'react-i18next'
import { BusyIndicator } from '@ui5/webcomponents-react'
import { useSelector, useDispatch } from 'react-redux'
import { createUseStyles } from 'react-jss'

import CredentialsErrorDialog from '../../components/credentials-error-dialog/credentials-error-dialog.component'
import ImportPopup from '../import-popup/import-popup.component'

import { selectIsImportPopupOpen, sendSmsTemplatesArrayBuffer, setIsImportPopupOpen, selectIsLoading } from '../../redux/sms/smsSlice'

import { selectCredentials } from '../../redux/credentials/credentialsSlice'
import { areCredentialsFilled } from '../../redux/credentials/utils'

import '@ui5/webcomponents-icons/dist/decline.js'
import './sms-import-popup.component.css'

import styles from './sms-import-popup.styles.js'

const useStyles = createUseStyles(styles, { name: 'SmsImportPopup' })

const SmsImportPopup = ({ t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const isImportPopupOpen = useSelector(selectIsImportPopupOpen)
  const credentials = useSelector(selectCredentials)
  const isLoading = useSelector(selectIsLoading)

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

  const showDialog = () => (
    <ImportPopup
      isImportPopupOpen={isImportPopupOpen}
      onCloseImportPopup={onCloseSmsImportPopup}
      popupHeader={t('SMS_IMPORT_POPUP.POPUP_HEADER')}
      specifyFileLabel={t('SMS_IMPORT_POPUP.SPECIFY_FILE')}
      onFileUploadButtonClickHandler={onFileUploadButtonClickHandler}
      onImportButtonClickHandler={onImportButtonClickHandler}
      importFile={importFile}
      onCancelImportButtonClickHandler={onCancelImportButtonClickHandler}
    />
  )

  return (
    <>
      {isLoading ? <BusyIndicator active delay="1" className={classes.busyIndicatorStyle} /> : showDialog()}
      <CredentialsErrorDialog open={showCredentialsErrorDialog} onAfterCloseHandle={onAfterCloseCredentialsErrorDialogHandle} />
    </>
  )
}

export default withTranslation()(SmsImportPopup)
