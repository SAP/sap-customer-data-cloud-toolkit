import { withNamespaces } from 'react-i18next'
import { Dialog, FileUploader, Bar, Button, Label } from '@ui5/webcomponents-react'

import { selectIsImportPopupOpen, sendEmailTemplatesArrayBuffer, setIsImportPopupOpen } from '../../redux/emails/emailSlice'
import { useSelector, useDispatch } from 'react-redux'

import '@ui5/webcomponents-icons/dist/decline.js'
import { useState } from 'react'

const EmailsImportPopup = ({ t }) => {
  const dispatch = useDispatch()
  const isImportPopupOpen = useSelector(selectIsImportPopupOpen)

  const [importFile, setImportFile] = useState()

  const onImportButtonClickHandler = async () => {
    const arrayBuffer = await importFile.arrayBuffer()
    dispatch(sendEmailTemplatesArrayBuffer(arrayBuffer))
  }

  const onFileUploaderChangeHandler = (event) => {
    setImportFile(event.detail.files[0])
  }

  const onCloseEmailImportPopup = () => {
    dispatch(setIsImportPopupOpen(false))
    setImportFile(undefined)
  }

  return (
    <>
      <Dialog
        open={isImportPopupOpen}
        onAfterClose={onCloseEmailImportPopup}
        id="emailsImportPopup"
        header={<Bar endContent={<Button id="closeEmailImportPopup" icon="decline" onClick={onCloseEmailImportPopup}></Button>}>{t('EMAILS_IMPORT_POPUP.POPUP_HEADER')}</Bar>}
        children={
          <>
            <Label>{t('EMAIL_TEMPLATES_COMPONENT.SPECIFY_FILE')}</Label>
            <br></br>
            <FileUploader accept=".zip" hideInput onChange={(event) => onFileUploaderChangeHandler(event)}>
              <Button>{t('EMAIL_TEMPLATES_COMPONENT.CHOOSE_FILE')}</Button>
            </FileUploader>
            <Label>{importFile ? importFile.name : t('EMAIL_TEMPLATES_COMPONENT.NO_FILE')}</Label>
          </>
        }
        footer={
          <Bar
            endContent={
              <div>
                <Button onClick={onImportButtonClickHandler}>{t('EMAIL_TEMPLATES_COMPONENT.IMPORT')}</Button>
                <Button onClick={onCloseEmailImportPopup}>{t('GLOBAL.CANCEL')}</Button>
              </div>
            }
          ></Bar>
        }
      ></Dialog>
    </>
  )
}

export default withNamespaces()(EmailsImportPopup)
