import { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addNewParent, selectSites, selectErrors } from '../../redux/siteSlice'

import { Label, Button, Table, TableColumn, IllustratedMessage, Bar } from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/navigation-down-arrow.js'
import '@ui5/webcomponents-icons/dist/navigation-right-arrow.js'
import '@ui5/webcomponents-icons/dist/add.js'
import '@ui5/webcomponents-icons/dist/decline.js'
import '@ui5/webcomponents-icons/dist/overflow.js'
import '@ui5/webcomponents-fiori/dist/illustrations/EmptyList'

import ParentSiteTableRow from '../sites-table-parent-row/sites-table-parent-row.component'

const SitesTable = () => {
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
                <Label>Site Domain</Label>
              </TableColumn>
              <TableColumn>
                <Label>Description</Label>
              </TableColumn>
              <TableColumn>
                <Label>Data Center</Label>
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
                <Label>Actions</Label>
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
          <IllustratedMessage name="EmptyList" titleText="No sites to create" subtitleText="You can create sites from a structure or manually" />
        </Bar>
      )}

      <div style={{ textAlign: 'center' }}>
        <Button id="addParentButton" onClick={onAddParentSiteHandler} icon="add" design="Transparent" style={{ display: 'block' }}>
          Add Parent Site
        </Button>
      </div>
    </Fragment>
  )
}

export default SitesTable
