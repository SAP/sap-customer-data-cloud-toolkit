import { Bar, Button, FileUploader } from '@ui5/webcomponents-react'
import { useDispatch, useSelector } from 'react-redux'
import { getEmailTemplatesArrayBuffer, selectExportFile, selectIsLoading } from '../../redux/emails/emailSlice'

const EmailTemplates = () => {
  const dispatch = useDispatch()
  const exportFile = useSelector(selectExportFile)
  const isLoading = useSelector(selectIsLoading)

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
  }

  return (
    <>
      <Bar
        style={{ width: '300px', position: 'absolute', top: '5px', right: '30px', boxShadow: 'none', zIndex: 10, background: 'transparent' }}
        endContent={
          <div>
            <Button id="exportAllButton" className="fd-button fd-button--compact" style={{ marginLeft: '5px' }} onClick={onExportAllButtonClickHandler}>
              Export All
            </Button>
            <FileUploader accept=".zip" hideInput onChange={(event) => {}}>
              <Button id="importAllButton" className="fd-button fd-button--compact" style={{ marginLeft: '5px' }}>
                Import All
              </Button>
            </FileUploader>
          </div>
        }
      ></Bar>
      {!isLoading && exportFile ? getDownloadElement() : ''}
    </>
  )
}

export default EmailTemplates
