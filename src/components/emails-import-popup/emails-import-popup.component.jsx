import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { Dialog, Button, Label } from '@ui5/webcomponents-react'
import { createUseStyles } from 'react-jss'

import { selectIsImportPopupOpen, sendEmailTemplatesArrayBuffer, setIsImportPopupOpen } from '../../redux/emails/emailSlice'
import '@ui5/webcomponents-icons/dist/decline.js'
import './emails-import-popup.component.css'
import styles from './styles.js'

const useStyles = createUseStyles(styles, { name: 'EmailsImportPopup' })

const EmailsImportPopup = ({ t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const isImportPopupOpen = useSelector(selectIsImportPopupOpen)

  const [importFile, setImportFile] = useState(undefined)

  const onImportButtonClickHandler = () => {
    dispatch(sendEmailTemplatesArrayBuffer(importFile.arrayBuffer()))
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
    setImportFile(undefined)
  }

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
              <Label id="specifyFileLabel">{t('EMAIL_TEMPLATES_COMPONENT.SPECIFY_FILE')}</Label>
            </div>
            <div>
              <input id="zipFileInput" type={'file'} accept="application/zip" onChange={(event) => onFileUploadButtonClickHandler(event)}></input>
            </div>
          </div>
        }
        footer={
          <div className={classes.footerOuterDivStyle}>
            <Button id="importZipButton" className="btn dialog-button-1" onClick={onImportButtonClickHandler} disabled={!importFile}>
              {t('EMAIL_TEMPLATES_COMPONENT.IMPORT')}
            </Button>

            <Button id="cancelImportZipButton" className="btn dialog-button-2" onClick={onCancelImportButtonClickHandler}>
              {t('GLOBAL.CANCEL')}
            </Button>
          </div>
        }
      ></Dialog>
    </>
  )
}

export default withNamespaces()(EmailsImportPopup)