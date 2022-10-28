import { Fragment, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { deleteParent, updateParentBaseDomain, updateParentDescription, updateParentDataCenter, addChild, selectErrors, selectErrorBySiteTempId } from '../../redux/siteSlice'

import { Input, InputType, Select, Option, Button, TableRow, TableCell, ActionSheet } from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/navigation-down-arrow.js'
import '@ui5/webcomponents-icons/dist/navigation-right-arrow.js'
import '@ui5/webcomponents-icons/dist/add.js'
import '@ui5/webcomponents-icons/dist/decline.js'
import '@ui5/webcomponents-icons/dist/overflow.js'

import ChildTableRow from '../sites-table-child-row/sites-table-child-row.component'
import MessagePopoverButton from '../message-popover-button/message-popover-button.component'

const SitesTableParentRow = ({ tempId, baseDomain, description, tags, dataCenter, childSites }) => {
  const [isActionSheetOpen, setActionSheetOpen] = useState(false)
  const [isChildListOpen, setChildListOpen] = useState(true)

  const dispatch = useDispatch()
  const dataCenters = useSelector((state) => state.sites.dataCenters)
  const errorList = useSelector((state) => selectErrors(state))
  const error = useSelector((state) => selectErrorBySiteTempId(state, tempId))

  const dataCentersSelect = [{ value: '', label: '' }, ...dataCenters]

  const onChangeDataCenter = (event) => {
    const newDataCenter = event.detail.selectedOption.dataset.value
    dispatch(
      updateParentDataCenter({
        tempId,
        newDataCenter,
      })
    )
  }

  const onChangeParentDomain = (event) => {
    const newBaseDomain = event.target.value
    dispatch(
      updateParentBaseDomain({
        tempId,
        newBaseDomain,
      })
    )
  }

  const onChangeParentDescription = (event) => {
    const newDescription = event.target.value
    dispatch(
      updateParentDescription({
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

  const onDeleteParentHandler = () => {
    dispatch(deleteParent({ tempId }))
  }

  const onAddChildHandler = () => {
    dispatch(addChild({ tempId }))
    setChildListOpen(true)
  }

  const checkChildSitesView = () => {
    if (childSites && childSites.length) {
      return (
        <Fragment>
          {isChildListOpen ? (
            <Button
              icon="navigation-down-arrow"
              design="Transparent"
              tooltip="Add Parent Site"
              onClick={() => {
                setChildListOpen(false)
              }}
            ></Button>
          ) : (
            <Button
              icon="navigation-right-arrow"
              design="Transparent"
              tooltip="Add Parent Site"
              onClick={() => {
                setChildListOpen(true)
              }}
            ></Button>
          )}
          <Input
            id="baseDomainInput"
            type={InputType.Text}
            style={{ width: 'calc(100% - 40px)' }}
            value={baseDomain}
            onInput={(event) => onChangeParentDomain(event)}
            required="true"
          />
        </Fragment>
      )
    } else {
      return (
        <Input
          id="baseDomainInput"
          type={InputType.Text}
          style={{ width: 'calc(100% - 40px)', marginLeft: '38px' }}
          value={baseDomain}
          onInput={(event) => onChangeParentDomain(event)}
          required="true"
        />
      )
    }
  }

  const showHideChildSites = () => {
    if (isChildListOpen) {
      return childSites?.map((childSite) => <ChildTableRow key={childSite.tempId} {...childSite} isChildSite={true} />)
    }
    return <div></div>
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
        <TableCell>{checkChildSitesView()}</TableCell>

        <TableCell>
          <Input type={InputType.Text} style={{ width: '100%' }} value={description} onInput={(event) => onChangeParentDescription(event)} />
        </TableCell>

        <TableCell>
          <Select id="dataCenterSelect" style={{ width: '100%' }} onChange={onChangeDataCenter}>
            {dataCentersSelect.map(({ label, value }) => (
              <Option key={label} data-value={value} selected={label === dataCenter || value === dataCenter}>
                {label}
              </Option>
            ))}
          </Select>
        </TableCell>

        <TableCell style={{ textAlign: 'right' }}>
          <div style={{ position: 'relative' }}>
            <>
              <Button icon="overflow" design="Transparent" onClick={actionSheetOpenerHandler} id={`actionSheetOpener${tempId}`}></Button>
              <ActionSheet opener={`actionSheetOpener${tempId}`} open={isActionSheetOpen} placementType="Bottom" onAfterClose={actionSheetOnAfterCloseHandler}>
                <Button onClick={onAddChildHandler}>Create Child Site</Button>
                <Button onClick={onDeleteParentHandler}>Delete</Button>
              </ActionSheet>
            </>
          </div>
        </TableCell>
      </TableRow>
      {showHideChildSites()}
    </Fragment>
  )
}

export default SitesTableParentRow