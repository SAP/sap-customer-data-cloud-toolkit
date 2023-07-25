/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import { Fragment, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Input, InputType, Button, TableRow, TableCell, Text, ActionSheet } from '@ui5/webcomponents-react'
import { createUseStyles } from 'react-jss'

import { deleteChild, updateChildBaseDomain, updateChildDescription, selectErrors, selectErrorBySiteTempId } from '../../redux/sites/siteSlice'
import { selectDataCenters } from '../../redux/dataCenters/dataCentersSlice'

import MessagePopoverButton from '../message-popover-button/message-popover-button.component'
import SitesCopyConfigurationButtonPannel from '../../components/sites-copy-configuration-button-pannel/sites-copy-configuration-button-pannel.component'

import styles from './sites-table-child-row.styles.js'

const useStyles = createUseStyles(styles, { name: 'SitesTableChildRow' })

const SitesTableChildRow = ({ parentSiteTempId, tempId, baseDomain, description, tags, dataCenter, t }) => {
  const [isActionSheetOpen, setActionSheetOpen] = useState(false)

  const dispatch = useDispatch()

  const dataCenters = useSelector(selectDataCenters)
  const errorList = useSelector((state) => selectErrors(state))
  const error = useSelector((state) => selectErrorBySiteTempId(state, tempId))

  const classes = useStyles()

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
    return <TableCell className={classes.errorTableCellStyle}>{message ? <MessagePopoverButton message={message} /> : ''}</TableCell>
  }

  return (
    <Fragment>
      <TableRow>
        {showErrorTableCell(errorList, error)}
        <TableCell>
          <Input
            id="childBaseDomainInput"
            data-cy="childBaseDomainInput"
            type={InputType.Text}
            className={classes.childBaseDomainInputStyle}
            value={baseDomain}
            onInput={(event) => onChangeChildDomain(event)}
          />
        </TableCell>

        <TableCell>
          <Input
            id="childDescriptionInput"
            data-cy="childDescriptionInput"
            type={InputType.Text}
            className={classes.childDescriptionInputStyle}
            value={description}
            onInput={(event) => onChangeChildDescription(event)}
          />
        </TableCell>

        <TableCell>
          <Text className={classes.childDataCenterCellStyle}>{getDataCenterLabel(dataCenter)}</Text>
        </TableCell>

        <TableCell>
          <SitesCopyConfigurationButtonPannel siteId={tempId} />
        </TableCell>

        <TableCell className={classes.actionSheetTableCellStyle}>
          <div className={classes.actionSheetOuterDivStyle}>
            <>
              <Button icon="overflow" design="Transparent" onClick={actionSheetOpenerHandler} id={`actionSheetOpener${tempId}`}></Button>

              <ActionSheet opener={`actionSheetOpener${tempId}`} open={isActionSheetOpen} placementType="Bottom" onAfterClose={actionSheetOnAfterCloseHandler}>
                <Button onClick={onDeleteChildHandler}>{t('GLOBAL.DELETE')}</Button>
              </ActionSheet>
            </>
          </div>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}

export default withTranslation()(SitesTableChildRow)
