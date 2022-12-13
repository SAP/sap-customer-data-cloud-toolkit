import { withNamespaces } from 'react-i18next'
import { Dialog, Button, Label } from '@ui5/webcomponents-react'

import { selectIsImportPopupOpen, sendEmailTemplatesArrayBuffer, setIsImportPopupOpen } from '../../redux/emails/emailSlice'
import { useSelector, useDispatch } from 'react-redux'

import '@ui5/webcomponents-icons/dist/decline.js'
import { useState } from 'react'

import './emails-import-popup.component.css'

const EmailsImportPopup = ({ t }) => {
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
        style={{ height: 'auto', width: '400px', top: ' 324px', left: '120px' }}
        open={isImportPopupOpen}
        onAfterClose={onCloseEmailImportPopup}
        id="emailsImportPopup"
        header={
          <div style={{ height: '50px' }}>
            <div style={{ position: 'absolute', top: '30%', right: 325 }}>{t('EMAILS_IMPORT_POPUP.POPUP_HEADER')}</div>
            <div>
              <Button
                style={{ position: 'absolute', top: '1%', right: 0 }}
                id="closeEmailImportPopup"
                icon="decline"
                onClick={onCloseEmailImportPopup}
                design="Transparent"
                className="ui-dialog-titlebar-close"
              ></Button>
            </div>
          </div>
        }
        children={
          <div>
            <div style={{ paddingBottom: '12px' }}>
              <Label id="specifyFileLabel">{t('EMAIL_TEMPLATES_COMPONENT.SPECIFY_FILE')}</Label>
            </div>
            <div>
              <input id="zipFileInput" type={'file'} accept="application/zip" onChange={(event) => onFileUploadButtonClickHandler(event)}></input>
            </div>
          </div>
        }
        footer={
          <div style={{ paddingTop: '12px', position: 'relative', left: 175 }}>
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
