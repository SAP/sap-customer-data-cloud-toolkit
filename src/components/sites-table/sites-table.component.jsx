import { Fragment, 
  // useState 
} from 'react';
// import ReactDOM from "react-dom";
import {
  Label,
  Button,
  Table,
  TableColumn
} from '@ui5/webcomponents-react';
import '@ui5/webcomponents-icons/dist/navigation-down-arrow.js';
import '@ui5/webcomponents-icons/dist/navigation-right-arrow.js';
import '@ui5/webcomponents-icons/dist/add.js';
import '@ui5/webcomponents-icons/dist/decline.js';
import '@ui5/webcomponents-icons/dist/overflow.js';

import SitesTableRow from '../sites-table-row/sites-table-row.component';
// import InputDialog from '../input-dialog/input-dialog.component';

import { useSelector, useDispatch } from 'react-redux'
import { addParent, 
  // clearSites, addStructure 
} from '../../redux/siteSlice';

const SitesTable = () => {
  const sitesStructure = useSelector(state => state.sites.sites)

  const dispatch = useDispatch()

  // const [isDialogOpen, setDialogOpen] = useState(false)
  // const [newStrutureName, setNewStructureName] = useState('')

  const onAddParentSiteHandler = () => {
    dispatch(addParent())
  }

  // const getNewSiteStructure = () => {
  //   return sitesStructure.map(site => {
  //     return {
  //       baseDomain: site.baseDomain,
  //       description: site.description,
  //       dataCenter: site.dataCenter,
  //       childSites: getNewStructureChildSites(site)
  //     }
  //   })
  // }

  // const getNewStructureChildSites = (site) => {
  //   return site.childSites.map(childSite => {
  //     return {
  //       baseDomain: childSite.baseDomain,
  //       description: childSite.description,
  //       dataCenter: childSite.dataCenter
  //     }
  //   })
  // }

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
          <SitesTableRow key={site.tempId} {...site} />
        ))}
      </Table>
      <div style={{ textAlign: 'center' }}>
        <Button onClick={onAddParentSiteHandler} icon="add" design="Transparent" style={{ display: 'block' }}>
          Add Parent Site
        </Button>
      </div>

      {/* {ReactDOM.createPortal(
        <Dialog open={isDialogOpen}
          footer={<Bar endContent={[
            <Button onClick={() => {
              dispatch(addStructure({
                "_id": generateUUID(),
                "name": newStrutureName,
                "data": getNewSiteStructure()
              }))
              dispatch(clearSites())
              setNewStructureName('')
              setDialogOpen(false)
            }}>Save</Button>,
            <Button onClick={() => {
              setDialogOpen(false)
              setNewStructureName('')
            }}>Close</Button>]}></Bar>}
          header={<Bar><Title>Enter new Structure name</Title></Bar>}
          headerText="Dialog Header">
          <Input
            onInput={(event) => {
              console.log(event.target.value)
              setNewStructureName(event.target.value)
            }}>
          </Input>
        </Dialog>
        , document.body)} */}

    </Fragment>
  );
};

export default SitesTable;

