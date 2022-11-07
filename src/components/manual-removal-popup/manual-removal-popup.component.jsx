import { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { Dialog, Button, CheckBox, Table, TableRow, TableCell, Label, TableColumn, Bar, ValueState, Toast } from '@ui5/webcomponents-react'
import { selectSitesToDeleteManually, clearSitesToDeleteManually } from '../../redux/siteSlice'

const generateListString = (sitesToDeleteManually) => {
  let listString = 'Base Domain; Site Id; Api Key\n'
  sitesToDeleteManually.forEach((siteToDeleteManually) => (listString += `${siteToDeleteManually.baseDomain};${siteToDeleteManually.siteId};${siteToDeleteManually.apiKey}\n`))
  return listString
}

const ManualRemovalPopup = () => {
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
        headerText="Manual Action Required!"
        open={dialogIsOpen}
        state={ValueState.Warning}
        children={
          <>
            <h4>
              The command was executed with errors, but some sites were created and could not be deleted. <br />
              Please delete the following sites before repeating the command:
            </h4>
            <Table
              columns={
                <>
                  <TableColumn>
                    <Label>Base Domain</Label>
                  </TableColumn>
                  <TableColumn>
                    <Label>Site Id</Label>
                  </TableColumn>
                  <TableColumn>
                    <Label>Api Key</Label>
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
                <CheckBox
                  id="manualRemovalCheckbox"
                  text="I understand that manual action is required to avoid data duplication."
                  onChange={onCheckBoxChangeHandler}
                  checked={checkBoxIsChecked}
                ></CheckBox>
              }
              endContent={
                <Button id="manualRemovalConfirmButton" onClick={onConfirmHandler} design="Emphasized" disabled={!checkBoxIsChecked}>
                  Confirm
                </Button>
              }
            />
          </>
        }
        onBeforeClose={onBeforeCloseHandler}
      ></Dialog>
      <Toast ref={ref} duration={5000} placement={'MiddleCenter'} children={'Site list was copied to the clipboard'} />
    </>
  )
}

export default ManualRemovalPopup
