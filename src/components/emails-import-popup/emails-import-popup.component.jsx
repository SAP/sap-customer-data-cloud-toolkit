import { withNamespaces } from 'react-i18next'
import { Dialog, Bar, Button, Label } from '@ui5/webcomponents-react'

import { selectIsImportPopupOpen, sendEmailTemplatesArrayBuffer, setIsImportPopupOpen } from '../../redux/emails/emailSlice'
import { useSelector, useDispatch } from 'react-redux'

import '@ui5/webcomponents-icons/dist/decline.js'
import { useState } from 'react'

import './emails-import-popup.component.css'

const EmailsImportPopup = ({ t }) => {
  const dispatch = useDispatch()
  const isImportPopupOpen = useSelector(selectIsImportPopupOpen)

  const [importFile, setImportFile] = useState(undefined)

  const onImportButtonClickHandler = async () => {
    dispatch(sendEmailTemplatesArrayBuffer(importFile.arrayBuffer()))
  }

  const onCancelImportButtonClickHandler = () => {
    onCloseEmailImportPopup()
  }

  const onFileUploadButtonClickHandler = async (event) => {
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
        className="ui-dialog ui-widget ui-corner-all gigya-jq-dialog"
        style={{ height: 'auto', width: '400px', top: ' 324px', left: '120px' }}
        open={isImportPopupOpen}
        onAfterClose={onCloseEmailImportPopup}
        id="emailsImportPopup"
        header={
          <Bar
            startContent={<div>{t('EMAILS_IMPORT_POPUP.POPUP_HEADER')}</div>}
            endContent={<Button id="closeEmailImportPopup" icon="decline" onClick={onCloseEmailImportPopup} design="Transparent"></Button>}
          ></Bar>
        }
        children={
          <>
            <Label>{t('EMAIL_TEMPLATES_COMPONENT.SPECIFY_FILE')}</Label>
            <br></br>
            <input type={'file'} accept="application/zip" onChange={(event) => onFileUploadButtonClickHandler(event)}></input>
          </>
        }
        footer={
          <Bar
            endContent={
              <div>
                <Button className="btn dialog-button-1" onClick={onImportButtonClickHandler} disabled={!importFile}>
                  {t('EMAIL_TEMPLATES_COMPONENT.IMPORT')}
                </Button>
                <Button className="btn dialog-button-2" onClick={onCancelImportButtonClickHandler}>
                  {t('GLOBAL.CANCEL')}
                </Button>
              </div>
            }
          ></Bar>
        }
      ></Dialog>

      {/* TODO: delete code below after make all design adjustments to the popup */}
      {/* <div
        className="ui-dialog ui-widget ui-corner-all gigya-jq-dialog"
        tabindex="-1"
        role="dialog"
        aria-labelledby="ui-dialog-title-2"
        style={{ height: 'auto', width: '400px', top: ' 324px', left: '120px' }}
      >
        <div className="ui-dialog-title-left-corner"></div>
        <div className="ui-dialog-titlebar" style={{ width: '376px' }}>
          <span className="ui-dialog-title" id="ui-dialog-title-2">
            {t('EMAILS_IMPORT_POPUP.POPUP_HEADER')}
          </span>
          <span className="ui-dialog-titlebar-close" role="button"></span>
        </div>
        <div className="ui-dialog-title-right-corner"></div>
        <div className="ui-dialog-content-custom" style={{ display: 'block' }}>
          <gigya-dialog _ngcontent-c11="" scrolltop="0" scrollleft="0" style={{ width: 'auto', height: '99px' }}>
            <p _ngcontent-c11="">{t('EMAIL_TEMPLATES_COMPONENT.SPECIFY_FILE')}</p>
            <label _ngcontent-c11="">
              <div _ngcontent-c11="" class="label">
                CSV:{' '}
                <span _ngcontent-c11="" class="red">
                  *
                </span>
              </div>
              <input _ngcontent-c11="" type="file" />
            </label>
            <div class="form-error">&nbsp;</div>
          </gigya-dialog>
          <div className="summary-holder">
            <div className="validation-summary" id="undefinedValidationSummary"></div>
            <div className="ui-dialog-buttonpane-custom">
              <div className="ui-dialog-buttonset">
                <button type="button" className="btn dialog-button-1">
                  Import
                </button>
                <button type="button" className="btn dialog-button-2">
                  Cancel
                </button>
              </div>
            </div>
          </div>
          <div className="clear"></div>
        </div>
        <div className="ui-dialog-footer-left-corner"></div>
        <div className="ui-dialog-footer" style={{ width: '376px' }}></div>
        <div className="ui-dialog-footer-right-corner"></div>
      </div> */}
    </>
  )
}

export default withNamespaces()(EmailsImportPopup)
