/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { createUseStyles } from 'react-jss'

import { Label, Button, Table, TableColumn, IllustratedMessage, Bar } from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/navigation-down-arrow.js'
import '@ui5/webcomponents-icons/dist/navigation-right-arrow.js'
import '@ui5/webcomponents-icons/dist/add.js'
import '@ui5/webcomponents-icons/dist/decline.js'
import '@ui5/webcomponents-icons/dist/overflow.js'
import '@ui5/webcomponents-fiori/dist/illustrations/EmptyList'

import CopyConfigurationDialog from '../copy-configuration-dialog/copy-configuration-dialog.component'
import ParentSiteTableRow from '../sites-table-parent-row/sites-table-parent-row.component'

import { addNewParent, selectSites, selectErrors } from '../../redux/sites/siteSlice'

import styles from './sites-table.styles.js'

const useStyles = createUseStyles(styles, { name: 'SitesTable' })

export const SitesTable = ({ t }) => {
  const dispatch = useDispatch()
  const classes = useStyles()

  const sitesStructure = useSelector(selectSites)
  const errorList = useSelector((state) => selectErrors(state))

  const onAddParentSiteHandler = () => {
    dispatch(addNewParent())
  }

  const showErrorTableColumn = (list) => (list.length ? <TableColumn className={classes.errorTableColumnStyle}></TableColumn> : '')

  const showCopyConfigDialog = () => {
    return <CopyConfigurationDialog />
  }

  return (
    <>
      <Fragment>
        {sitesStructure.length ? (
          <Table
            columns={
              <>
                {showErrorTableColumn(errorList)}
                <TableColumn className={classes.siteDomainColumnStyle}>
                  <Label>{t('GLOBAL.SITE_DOMAIN')}</Label>
                </TableColumn>
                <TableColumn className={classes.descriptionColumnStyle}>
                  <Label>{t('GLOBAL.DESCRIPTION')}</Label>
                </TableColumn>
                <TableColumn className={classes.dataCenterColumnStyle}>
                  <Label>{t('GLOBAL.DATA_CENTER')}</Label>
                </TableColumn>
                <TableColumn className={classes.copyConfigurationColumnStyle}>
                  <Label>{t('GLOBAL.COPY_CONFIGURATION')}</Label>
                </TableColumn>
                <TableColumn className={classes.addParentSiteColumnStyle}>
                  <Label> {t('SITE_TABLE_COMPONENT.ACTIONS')}</Label>
                </TableColumn>
              </>
            }
          >
            {sitesStructure.map((site) => (
              <ParentSiteTableRow key={site.tempId} {...site} />
            ))}
          </Table>
        ) : (
          <Bar className={classes.illustratedMessageBarStyle}>
            <IllustratedMessage size="Dialog" name="EmptyList" titleText={t('SITE_TABLE_COMPONENT.NO_SITES_TO_CREATE')} subtitleText={t('SITE_TABLE_COMPONENT.SUBTITLE_TEXT')} />
          </Bar>
        )}

        <div className={classes.addParentButtonOuterDivStyle}>
          <Button id="addParentButton" data-cy="addParentButton" onClick={onAddParentSiteHandler} icon="add" design="Transparent" className={classes.addParentButtonStyle}>
            {t('SITE_TABLE_COMPONENT.ADD_PARENT_SITE')}
          </Button>
        </div>
        {showCopyConfigDialog()}
      </Fragment>
    </>
  )
}

export default withTranslation()(SitesTable)
