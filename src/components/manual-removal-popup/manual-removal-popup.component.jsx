import { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { Dialog, Button, CheckBox, Table, TableRow, TableCell, Label, TableColumn, Bar, ValueState, Toast } from '@ui5/webcomponents-react'

import { selectSitesToDeleteManually, clearSitesToDeleteManually } from '../../redux/sites/siteSlice'

const generateListString = (sitesToDeleteManually) => {
  let listString = 'Base Domain; Site Id; Api Key\n'
  sitesToDeleteManually.forEach((siteToDeleteManually) => (listString += `${siteToDeleteManually.baseDomain};${siteToDeleteManually.siteId};${siteToDeleteManually.apiKey}\n`))
  return listString
}

const ManualRemovalPopup = ({ t }) => {
  const [checkBoxIsChecked, setBoxIsChecked] = useState(false)
  const sitesToDeleteManually = useSelector(selectSitesToDeleteManually)
  const [dialogIsOpen, setDialogIsOpen] = useState(sitesToDeleteManually.length > 0)

  const dispatch = useDispatch()

  const ref = useRef()

  const onConfirmHandler = () => {
    setBoxIsChecked(false)
    setDialogIsOpen(false)
    dispatch(clearSitesToDeleteManually())
  }

  const onCheckBoxChangeHandler = () => {
    setBoxIsChecked(!checkBoxIsChecked)
    if (!checkBoxIsChecked) {
      navigator.clipboard.writeText(generateListString(sitesToDeleteManually)).then(() => {
        ref.current.show()
      })
    }
  }

  const onBeforeCloseHandler = (event) => {
    if (event.detail.escPressed) {
      event.preventDefault()
    }
  }

  useEffect(() => {
    setDialogIsOpen(sitesToDeleteManually.length > 0)
  }, [sitesToDeleteManually])

  return (
    <>
      <Dialog
        id="manualRemovalPopup"
        headerText={t('MANUAL_REMOVAL_POPUP.MANUAL_ACTION_REQUIRED')}
        open={dialogIsOpen}
        state={ValueState.Warning}
        children={
          <>
            <h4>
              {t('MANUAL_REMOVAL_POPUP.ERROR_MESSAGE')}
              <br />
            </h4>
            <Table
              columns={
                <>
                  <TableColumn>
                    <Label>{t('GLOBAL.BASE_DOMAIN')}</Label>
                  </TableColumn>
                  <TableColumn>
                    <Label>{t('GLOBAL.SITE_ID')}</Label>
                  </TableColumn>
                  <TableColumn>
                    <Label>{t('GLOBAL.API_KEY')}</Label>
                  </TableColumn>
                </>
              }
            >
              {sitesToDeleteManually.map((siteToDeleteManually) => {
                return (
                  <TableRow>
                    <TableCell>
                      <Label>{siteToDeleteManually.baseDomain}</Label>
                    </TableCell>
                    <TableCell>
                      <Label>{siteToDeleteManually.siteId}</Label>
                    </TableCell>
                    <TableCell>
                      <Label>{siteToDeleteManually.apiKey}</Label>
                    </TableCell>
                  </TableRow>
                )
              })}
            </Table>
            <Bar
              design="Subheader"
              startContent={
                <CheckBox id="manualRemovalCheckbox" text={t('MANUAL_REMOVAL_POPUP.CHECKBOX_TEXT')} onChange={onCheckBoxChangeHandler} checked={checkBoxIsChecked}></CheckBox>
              }
              endContent={
                <Button id="manualRemovalConfirmButton" onClick={onConfirmHandler} design="Emphasized" disabled={!checkBoxIsChecked}>
                  {t('GLOBAL.CONFIRM')}
                </Button>
              }
            />
          </>
        }
        onBeforeClose={onBeforeCloseHandler}
      ></Dialog>
      <Toast ref={ref} duration={5000} placement={'MiddleCenter'} children={t('MANUAL_REMOVAL_POPUP.TOAST_TEXT')} onChange={onCheckBoxChangeHandler} />
    </>
  )
}

export default withNamespaces()(ManualRemovalPopup)
