import { Fragment, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { deleteChild, updateChildBaseDomain, updateChildDescription, selectErrors, selectErrorBySiteTempId } from '../../redux/sites/siteSlice'

import { Input, InputType, Button, TableRow, TableCell, Text, ActionSheet } from '@ui5/webcomponents-react'
import MessagePopoverButton from '../message-popover-button/message-popover-button.component'

const SitesTableChildRow = ({ parentSiteTempId, tempId, baseDomain, description, tags, dataCenter }) => {
  const [isActionSheetOpen, setActionSheetOpen] = useState(false)
  const dispatch = useDispatch()
  const dataCenters = useSelector((state) => state.sites.dataCenters)
  const errorList = useSelector((state) => selectErrors(state))
  const error = useSelector((state) => selectErrorBySiteTempId(state, tempId))

  const getDataCenterLabel = (dataCenterValue) => {
    if (dataCenter === '') {
      return dataCenter
    }
    return dataCenters.filter((dataCenterentry) => dataCenterentry.value === dataCenterValue)[0].label
  }

  const onChangeChildDomain = (event) => {
    const newBaseDomain = event.target.value
    dispatch(
      updateChildBaseDomain({
        parentSiteTempId,
        tempId,
        newBaseDomain,
      })
    )
  }

  const onChangeChildDescription = (event) => {
    const newDescription = event.target.value
    dispatch(
      updateChildDescription({
        parentSiteTempId,
        tempId,
        newDescription,
      })
    )
  }

  const actionSheetOpenerHandler = () => {
    setActionSheetOpen(!isActionSheetOpen)
  }

  const actionSheetOnAfterCloseHandler = () => {
    setActionSheetOpen(false)
  }

  const onDeleteChildHandler = () => {
    dispatch(deleteChild({ parentSiteTempId, tempId }))
  }

  const showErrorTableCell = (messages, message) => {
    if (!messages.length) {
      return ''
    }
    return <TableCell style={{ width: 0 }}>{message ? <MessagePopoverButton message={message} /> : ''}</TableCell>
  }

  return (
    <Fragment>
      <TableRow>
        {showErrorTableCell(errorList, error)}
        <TableCell>
          <Input
            type={InputType.Text}
            style={{ width: 'calc(100% - 82px)', marginLeft: '80px' }}
            value={baseDomain}
            onInput={(event) => onChangeChildDomain(event)}
            required="true"
          />
        </TableCell>

        <TableCell>
          <Input type={InputType.Text} style={{ width: '100%' }} value={description} onInput={(event) => onChangeChildDescription(event)} />
        </TableCell>

        <TableCell>
          <Text
            style={{
              marginLeft: 8,
              textAlign: 'left',
            }}
          >
            {getDataCenterLabel(dataCenter)}
          </Text>
        </TableCell>

        <TableCell style={{ textAlign: 'right' }}>
          <div style={{ position: 'relative' }}>
            <>
              <Button icon="overflow" design="Transparent" onClick={actionSheetOpenerHandler} id={`actionSheetOpener${tempId}`}></Button>

              <ActionSheet opener={`actionSheetOpener${tempId}`} open={isActionSheetOpen} placementType="Bottom" onAfterClose={actionSheetOnAfterCloseHandler}>
                <Button onClick={onDeleteChildHandler}>Delete</Button>
              </ActionSheet>
            </>
          </div>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}

export default SitesTableChildRow
