import { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withNamespaces } from 'react-i18next'

import { addNewParent, selectSites, selectErrors } from '../../redux/sites/siteSlice'

import { Label, Button, Table, TableColumn, IllustratedMessage, Bar } from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/navigation-down-arrow.js'
import '@ui5/webcomponents-icons/dist/navigation-right-arrow.js'
import '@ui5/webcomponents-icons/dist/add.js'
import '@ui5/webcomponents-icons/dist/decline.js'
import '@ui5/webcomponents-icons/dist/overflow.js'
import '@ui5/webcomponents-fiori/dist/illustrations/EmptyList'

import ParentSiteTableRow from '../sites-table-parent-row/sites-table-parent-row.component'

export const SitesTable = ({ t }) => {
  const sitesStructure = useSelector(selectSites)
  const errorList = useSelector((state) => selectErrors(state))

  const dispatch = useDispatch()

  const onAddParentSiteHandler = () => {
    dispatch(addNewParent())
  }

  const showErrorTableColumn = (list) => (list.length ? <TableColumn style={{ width: 0 }}></TableColumn> : '')

  return (
    <Fragment>
      {sitesStructure.length ? (
        <Table
          columns={
            <>
              {showErrorTableColumn(errorList)}
              <TableColumn
              // style={{
              //   width: '12rem',
              // }}
              >
                <Label>{t('GLOBAL.BASE_DOMAIN')}</Label>
              </TableColumn>
              <TableColumn>
                <Label>{t('GLOBAL.DESCRIPTION')}n</Label>
              </TableColumn>
              <TableColumn>
                <Label>{t('GLOBAL.DATA_CENTER')}</Label>
              </TableColumn>
              {/* <TableColumn>
              <Label>Tags</Label>
            </TableColumn> */}
              <TableColumn
                style={{
                  // width: '94px',
                  width: '44px',
                }}
              >
                <Label> {t('SITE_TABLE_COMPONENT.ADD_PARENT_SITE')}</Label>
                {/* <Button
            icon="add"
            design="Emphasized"
            tooltip="Add Parent Site"
          ></Button> */}
              </TableColumn>
              {/* <TableColumn>
        <Label>Applications</Label>
      </TableColumn>
      <TableColumn>
        <Label>Permission Groups</Label>
      </TableColumn> */}
            </>
          }
        >
          {sitesStructure.map((site) => (
            <ParentSiteTableRow key={site.tempId} {...site} />
          ))}
        </Table>
      ) : (
        <Bar style={{ margin: '0px 0px 3px', height: 'auto' }}>
          <IllustratedMessage size="Dialog" name="EmptyList" titleText={t('SITE_TABLE_COMPONENT.NO_SITES_TO_CREATE')} subtitleText={t('SITE_TABLE_COMPONENT.SUBTITLE_TEXT')} />
        </Bar>
      )}

      <div style={{ textAlign: 'center' }}>
        <Button id="addParentButton" onClick={onAddParentSiteHandler} icon="add" design="Transparent" style={{ display: 'block' }}>
          {t('SITE_TABLE_COMPONENT.ADD_PARENT_SITE')}
        </Button>
      </div>
    </Fragment>
  )
}

export default withNamespaces()(SitesTable)
