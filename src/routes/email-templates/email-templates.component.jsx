import { useState, useEffect } from 'react'
import { Bar, Button, ValueState } from '@ui5/webcomponents-react'
import { useDispatch, useSelector } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { createUseStyles } from 'react-jss'

import DialogMessage from '../../components/dialog-message-dialog/dialog-message.component'
import MessageList from '../../components/message-list/message-list.component'
import EmailsImportPopup from '../../components/emails-import-popup/emails-import-popup.component'

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
} from '../../redux/emails/emailSlice'

import styles from './styles.js'

const useStyles = createUseStyles(styles, { name: 'EmailTemplates' })

const EmailTemplates = ({ t }) => {
  const dispatch = useDispatch()
  const exportFile = useSelector(selectExportFile)
  const isLoading = useSelector(selectIsLoading)
  const errors = useSelector(selectErrors)
  const isImportPopupOpen = useSelector(selectIsImportPopupOpen)
  const showSuccessDialog = useSelector(selectShowSuccessDialog)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const classes = useStyles()

  useEffect(() => {
    setShowErrorDialog(errors.length > 0)
  }, [errors.length])

  const onExportAllButtonClickHandler = () => {
    dispatch(getEmailTemplatesArrayBuffer())
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

  const onImportAllButtonClickHandler = () => {
    dispatch(setIsImportPopupOpen(true))
  }

  const showErrorsList = () => (
    <DialogMessage
      open={showErrorDialog}
      className={classes.errorDialogStyle}
      headerText={t('GLOBAL.ERROR')}
      state={ValueState.Error}
      closeButtonContent="Ok"
      id="emailTemplatesErrorPopup"
      onAfterClose={() => {
        setShowErrorDialog(false)
        dispatch(clearErrors())
      }}
    >
      <MessageList messages={errors} />
    </DialogMessage>
  )

  return (
    <>
      <Bar
        className={classes.outerBarStyle}
        endContent={
          <div>
            <Button id="exportAllButton" className="fd-button fd-button--compact" onClick={onExportAllButtonClickHandler}>
              {t('EMAIL_TEMPLATES_COMPONENT.EXPORT_ALL')}
            </Button>

            <Button id="importAllButton" className={classes.importAllButtonStyle} onClick={onImportAllButtonClickHandler}>
              {t('EMAIL_TEMPLATES_COMPONENT.IMPORT_ALL')}
            </Button>
          </div>
        }
      ></Bar>
      {!isLoading && exportFile ? getDownloadElement() : ''}
      {showErrorsList()}
      {isImportPopupOpen ? <EmailsImportPopup></EmailsImportPopup> : ''}
      {showSuccessDialog ? (
        <DialogMessage
          open={showSuccessDialog}
          headerText={t('GLOBAL.SUCCESS')}
          state={ValueState.Success}
          onAfterClose={() => document.location.reload()}
          closeButtonContent="Ok"
          id="successPopup"
        >
          {t('EMAIL_TEMPLATES_COMPONENT.TEMPLATES_IMPORTED_SUCCESSFULLY')}
        </DialogMessage>
      ) : (
        ''
      )}
    </>
  )
}

export default withNamespaces()(EmailTemplates)
