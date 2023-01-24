import { Fragment, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { createUseStyles } from 'react-jss'

import { Input, InputType, Select, Option, Button, TableRow, TableCell, ActionSheet } from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/navigation-down-arrow.js'
import '@ui5/webcomponents-icons/dist/navigation-right-arrow.js'
import '@ui5/webcomponents-icons/dist/add.js'
import '@ui5/webcomponents-icons/dist/decline.js'
import '@ui5/webcomponents-icons/dist/overflow.js'

import { deleteParent, updateParentBaseDomain, updateParentDescription, updateParentDataCenter, addChild, selectErrors, selectErrorBySiteTempId } from '../../redux/sites/siteSlice'
import { selectDataCenters } from '../../redux/dataCenters/dataCentersSlice'
import ChildTableRow from '../sites-table-child-row/sites-table-child-row.component'
import MessagePopoverButton from '../message-popover-button/message-popover-button.component'
import ShowHideChildListButton from '../show-hide-child-list-button/show-hide-child-list-button.component'

import styles from './sites-table-parent-row.styles.js'

const useStyles = createUseStyles(styles, { name: 'SitesTableParentRow' })

const SitesTableParentRow = ({ tempId, baseDomain, description, tags, dataCenter, childSites, t }) => {
  const [isActionSheetOpen, setActionSheetOpen] = useState(false)
  const [isChildListOpen, setChildListOpen] = useState(true)
  const classes = useStyles()

  const dispatch = useDispatch()
  const dataCenters = useSelector(selectDataCenters)
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

  const showChildListButtonClickHandler = () => {
    setChildListOpen(true)
  }

  const hideChildListButtonClickHandler = () => {
    setChildListOpen(false)
  }

  const checkChildSitesView = () => {
    if (childSites && childSites.length) {
      return (
        <Fragment>
          {isChildListOpen ? (
            <ShowHideChildListButton icon="navigation-down-arrow" tooltipKey="SITE_TABLE_PARENT_COMPONENT.HIDE_CHILD_TOOLTIP" onClickHandler={hideChildListButtonClickHandler} />
          ) : (
            <ShowHideChildListButton icon="navigation-right-arrow" tooltipKey="SITE_TABLE_PARENT_COMPONENT.SHOW_CHILD_TOOLTIP" onClickHandler={showChildListButtonClickHandler} />
          )}
          <Input
            id="baseDomainInput"
            type={InputType.Text}
            className={classes.baseDomainInputWithChildsStyle}
            value={baseDomain}
            onInput={(event) => onChangeParentDomain(event)}
          />
        </Fragment>
      )
    } else {
      return (
        <Input
          id="baseDomainInput"
          type={InputType.Text}
          className={classes.baseDomainInputWithoutChildsStyle}
          value={baseDomain}
          onInput={(event) => onChangeParentDomain(event)}
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
    return <TableCell className={classes.errorTableCellStyle}>{message ? <MessagePopoverButton message={message} /> : ''}</TableCell>
  }

  return (
    <Fragment>
      <TableRow>
        {showErrorTableCell(errorList, error)}
        <TableCell>{checkChildSitesView()}</TableCell>

        <TableCell>
          <Input type={InputType.Text} id="descriptionInput" className={classes.descriptionInputStyle} value={description} onInput={(event) => onChangeParentDescription(event)} />
        </TableCell>

        <TableCell>
          <Select id="dataCenterSelect" className={classes.dataCenterSelectStyle} onChange={onChangeDataCenter}>
            {dataCentersSelect.map(({ label, value }) => (
              <Option key={label} data-value={value} selected={label === dataCenter || value === dataCenter}>
                {label}
              </Option>
            ))}
          </Select>
        </TableCell>

        <TableCell className={classes.actionSheetTableCellStyle}>
          <div className={classes.actionSheetOuterDivStyle}>
            <>
              <Button icon="overflow" design="Transparent" onClick={actionSheetOpenerHandler} id={`actionSheetOpener${tempId}`}></Button>
              <ActionSheet opener={`actionSheetOpener${tempId}`} open={isActionSheetOpen} placementType="Bottom" onAfterClose={actionSheetOnAfterCloseHandler}>
                <Button onClick={onAddChildHandler}>{t('SITE_TABLE_PARENT_COMPONENT.CREATE_CHILD_SITE')}</Button>
                <Button onClick={onDeleteParentHandler}>{t('GLOBAL.DELETE')}</Button>
              </ActionSheet>
            </>
          </div>
        </TableCell>
      </TableRow>
      {showHideChildSites()}
    </Fragment>
  )
}

export default withNamespaces()(SitesTableParentRow)
