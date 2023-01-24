import { useState, useEffect } from 'react'
import { Bar, Button, ValueState, Text } from '@ui5/webcomponents-react'
import { useDispatch, useSelector } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { createUseStyles } from 'react-jss'

import DialogMessageInform from '../../components/dialog-message-inform/dialog-message-inform.component'
import MessageList from '../../components/message-list/message-list.component'
import EmailsImportPopup from '../../components/emails-import-popup/emails-import-popup.component'
import CredentialsErrorDialog from '../../components/credentials-error-dialog/credentials-error-dialog.component'

import {
  getEmailTemplatesArrayBuffer,
  selectExportFile,
  selectIsLoading,
  selectErrors,
  selectIsImportPopupOpen,
  setIsImportPopupOpen,
  clearExportFile,
  clearErrors,
  selectShowSuccessDialog,
  selectImportedEmailTemplatesCount,
  selectTotalEmailTemplatesToImportCount,
  selectErrorCondition,
  clearErrorCondition,
} from '../../redux/emails/emailSlice'

import { selectCredentials } from '../../redux/credentials/credentialsSlice'
import { areCredentialsFilled } from '../../redux/credentials/utils'
import styles from './email-templates.styles.js'

import { errorConditions } from '../../redux/errorConditions'

const useStyles = createUseStyles(styles, { name: 'EmailTemplates' })

const EmailTemplates = ({ t }) => {
  const dispatch = useDispatch()
  const classes = useStyles()

  const exportFile = useSelector(selectExportFile)
  const isLoading = useSelector(selectIsLoading)
  const errors = useSelector(selectErrors)
  const isImportPopupOpen = useSelector(selectIsImportPopupOpen)
  const showSuccessDialog = useSelector(selectShowSuccessDialog)
  const credentials = useSelector(selectCredentials)
  const importedEmailTemplatesCount = useSelector(selectImportedEmailTemplatesCount)
  const totalEmailTemplatesToImportCount = useSelector(selectTotalEmailTemplatesToImportCount)
  const errorCondition = useSelector(selectErrorCondition)

  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [showCredentialsErrorDialog, setShowCredentialsErrorDialog] = useState(false)

  useEffect(() => {
    setShowErrorDialog(errors.length > 0)
  }, [errors.length])

  const onExportAllEmailTemplatesButtonClickHandler = () => {
    if (areCredentialsFilled(credentials)) {
      setShowCredentialsErrorDialog(false)
      dispatch(getEmailTemplatesArrayBuffer())
    } else {
      setShowCredentialsErrorDialog(true)
    }
  }

  const onImportAllEmailTemplatesButtonClickHandler = () => {
    dispatch(setIsImportPopupOpen(true))
  }

  const onAfterCloseErrorDialogHandler = () => {
    setShowErrorDialog(false)
    dispatch(clearErrors())
    dispatch(clearErrorCondition())
  }

  const onAfterCloseSuccessDialogHandler = () => {
    document.location.reload()
  }

  const onAfterCloseCredentialsErrorDialogHandler = () => {
    setShowCredentialsErrorDialog(false)
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
        return t('EMAIL_TEMPLATES_COMPONENT.EXPORT_ERROR_HEADER_MESSAGE')
      case errorConditions.importWithCountError:
        return t('EMAIL_TEMPLATES_COMPONENT.IMPORT_ERROR_COUNT_HEADER_MESSAGE', { notImportedEmailTemplatesCount: errors.length, totalEmailTemplatesToImportCount })
      case errorConditions.importWithoutCountError:
        return t('EMAIL_TEMPLATES_COMPONENT.IMPORT_ERROR_GENERIC_HEADER_MESSAGE')
      default:
        return t('GLOBAL.ERROR')
    }
  }

  const showErrorsList = () => (
    <DialogMessageInform
      open={showErrorDialog}
      className={classes.errorDialogStyle}
      headerText={getErrorDialogHeaderText()}
      state={ValueState.Error}
      closeButtonContent={t('GLOBAL.OK')}
      id="emailTemplatesErrorPopup"
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
      onAfterClose={onAfterCloseSuccessDialogHandler}
      closeButtonContent={t('GLOBAL.OK')}
      id="successPopup"
    >
      <Text>{t('EMAIL_TEMPLATES_COMPONENT.TEMPLATES_IMPORTED_SUCCESSFULLY', { importedEmailTemplatesCount })}</Text>
    </DialogMessageInform>
  )

  return (
    <>
      <Bar
        className={classes.outerBarStyle}
        endContent={
          <div>
            <Button id="exportAllEmailTemplatesButton" className="fd-button fd-button--compact" onClick={onExportAllEmailTemplatesButtonClickHandler}>
              {t('GLOBAL.EXPORT_ALL')}
            </Button>

            <Button id="importAllEmailTemplatesButton" className={classes.importAllButtonStyle} onClick={onImportAllEmailTemplatesButtonClickHandler}>
              {t('GLOBAL.IMPORT_ALL')}
            </Button>
          </div>
        }
      ></Bar>
      {!isLoading && exportFile ? getDownloadElement() : ''}
      {showErrorsList()}
      {isImportPopupOpen ? <EmailsImportPopup /> : ''}
      {showSuccessMessage()}
      <CredentialsErrorDialog open={showCredentialsErrorDialog} onAfterCloseHandle={onAfterCloseCredentialsErrorDialogHandler} />
    </>
  )
}

export default withNamespaces()(EmailTemplates)
