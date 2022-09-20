import { Fragment } from 'react'
import { Label, Button, Table, TableColumn } from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/navigation-down-arrow.js'
import '@ui5/webcomponents-icons/dist/navigation-right-arrow.js'
import '@ui5/webcomponents-icons/dist/add.js'
import '@ui5/webcomponents-icons/dist/decline.js'
import '@ui5/webcomponents-icons/dist/overflow.js'

import ParentSiteTableRow from '../sites-table-parent-row/sites-table-parent-row'

import { useSelector, useDispatch } from 'react-redux'
import { addParent } from '../../redux/siteSlice'

const SitesTable = () => {
	const sitesStructure = useSelector((state) => state.sites.sites)

	const dispatch = useDispatch()

	const onAddParentSiteHandler = () => {
		dispatch(addParent())
	}

	return (
		<Fragment>
			<Table
				columns={
					<>
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
			<div style={{ textAlign: 'center' }}>
				<Button
					onClick={onAddParentSiteHandler}
					icon="add"
					design="Transparent"
					style={{ display: 'block' }}
				>
					Add Parent Site
				</Button>
			</div>
		</Fragment>
	)
}

export default SitesTable
