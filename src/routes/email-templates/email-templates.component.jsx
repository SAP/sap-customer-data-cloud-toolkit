import { Bar, Button, Card } from '@ui5/webcomponents-react'
import { useDispatch, useSelector } from 'react-redux'
import { withNamespaces } from 'react-i18next'

import { spacing } from '@ui5/webcomponents-react-base'

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
} from '../../redux/emails/emailSlice'

const EmailTemplates = ({ t }) => {
  const dispatch = useDispatch()
  const exportFile = useSelector(selectExportFile)
  const isLoading = useSelector(selectIsLoading)
  const errors = useSelector(selectErrors)
  const isImportPopupOpen = useSelector(selectIsImportPopupOpen)

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

  const showErrorsList = (messages) =>
    !messages.length ? (
      ''
    ) : (
      <div style={spacing.sapUiSmallMargin}>
        <div style={spacing.sapUiTinyMargin}>
          <Card>
            <MessageList messages={messages} />
          </Card>
        </div>
      </div>
    )

  return (
    <>
      <Bar
        style={{ width: '300px', position: 'absolute', top: '5px', right: '30px', boxShadow: 'none', zIndex: 10, background: 'transparent' }}
        endContent={
          <div>
            <Button id="exportAllButton" className="fd-button fd-button--compact" style={{ marginLeft: '5px' }} onClick={onExportAllButtonClickHandler}>
              {t('EMAIL_TEMPLATES_COMPONENT.EXPORT_ALL')}
            </Button>

            <Button id="importAllButton" className="fd-button fd-button--compact" style={{ marginLeft: '5px' }} onClick={onImportAllButtonClickHandler}>
              {t('EMAIL_TEMPLATES_COMPONENT.IMPORT_ALL')}
            </Button>
          </div>
        }
      ></Bar>
      {!isLoading && exportFile ? getDownloadElement() : ''}
      {showErrorsList(errors)}
      {isImportPopupOpen ? <EmailsImportPopup></EmailsImportPopup> : ''}
    </>
  )
}

export default withNamespaces()(EmailTemplates)
