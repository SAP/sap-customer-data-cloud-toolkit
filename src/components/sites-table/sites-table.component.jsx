import { Fragment } from 'react';

import {
  Input,
  InputType,
  Select,
  Option,
  Label,
  Button,
  Table,
  TableRow,
  TableCell,
  TableColumn,
  Bar
} from '@ui5/webcomponents-react';
import '@ui5/webcomponents-icons/dist/navigation-down-arrow.js';
import '@ui5/webcomponents-icons/dist/navigation-right-arrow.js';
import '@ui5/webcomponents-icons/dist/add.js';
import '@ui5/webcomponents-icons/dist/decline.js';
import '@ui5/webcomponents-icons/dist/overflow.js';

import { useSelector, useDispatch } from 'react-redux'

import SitesTableRow from '../sites-table-row/sites-table-row.component';
import { addParent, clearSites } from '../../redux/siteSlice';

const SitesTable = () => {
  const sitesStructure = useSelector(state => state.sites.sites)
  // [
  //   {
  //     tempId: generateUUID(),
  //     baseDomain: 'parent.dev.website.com',
  //     description: 'development parent',
  //     dataCenter: 'EU',
  //     childSites: [
  //       {
  //         tempId: generateUUID(),
  //         baseDomain: 'dev.website.com',
  //         description: 'development',
  //         dataCenter: 'EU',
  //       },
  //     ],
  //   },
  //   {
  //     tempId: generateUUID(),
  //     baseDomain: 'stag.website.com',
  //     description: 'staging',
  //     dataCenter: 'EU',
  //   },
  //   {
  //     tempId: generateUUID(),
  //     baseDomain: 'mig.website.com',
  //     description: 'migration',
  //     dataCenter: 'EU',
  //   },
  //   {
  //     tempId: generateUUID(),
  //     baseDomain: 'prod.eu.website.com',
  //     description: 'production Europe',
  //     dataCenter: 'EU',
  //   },
  //   {
  //     tempId: generateUUID(),
  //     baseDomain: 'prod.us.website.com',
  //     description: 'production United States',
  //     dataCenter: 'US',
  //   },
  //   {
  //     tempId: generateUUID(),
  //     baseDomain: 'prod.au.website.com',
  //     description: 'production Japan',
  //     dataCenter: 'AU',
  //   },
  // ];

  const dispatch = useDispatch()

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
        {/* <TableRow>
          <TableCell>
            <Button
              icon="navigation-down-arrow"
              design="Transparent"
              tooltip="Add Parent Site"
            ></Button>
            <Input
              type={InputType.Text}
              style={{ width: 'calc(100% - 40px)' }}
            />
          </TableCell>
          <TableCell>
            <Input type={InputType.Text} style={{ width: '100%' }} />
          </TableCell>
          <TableCell>
            <Select style={{ width: '100%' }}>
              <Option></Option>
              <Option>US</Option>
              <Option>EU</Option>
              <Option>AU</Option>
            </Select>
          </TableCell>
          <TableCell>
            <Button
              icon="add"
              design="Transparent"
              tooltip="Add Child Site"
            ></Button>
            <Button
              icon="overflow"
              design="Transparent"
              tooltip="Remove"
            ></Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Input
              type={InputType.Text}
              style={{ width: 'calc(100% - 82px)', marginLeft: '80px' }}
            />
          </TableCell>
          <TableCell>
            <Input type={InputType.Text} style={{ width: '100%' }} />
          </TableCell>
          <TableCell>
            <Select style={{ width: '100%' }}>
              <Option></Option>
              <Option>US</Option>
              <Option>EU</Option>
              <Option>AU</Option>
            </Select>
          </TableCell>
          <TableCell>
            <Button
              icon="add"
              design="Transparent"
              tooltip="Add Child Site"
              style={{ visibility: 'hidden' }}
            ></Button>
            <Button
              icon="overflow"
              design="Transparent"
              tooltip="Remove"
            ></Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Button
              icon="navigation-right-arrow"
              design="Transparent"
              tooltip="Add Parent Site"
            ></Button>
            <Input
              type={InputType.Text}
              style={{ width: 'calc(100% - 40px)' }}
            />
          </TableCell>
          <TableCell>
            <Input type={InputType.Text} style={{ width: '100%' }} />
          </TableCell>
          <TableCell>
            <Select style={{ width: '100%' }}>
              <Option></Option>
              <Option>US</Option>
              <Option>EU</Option>
              <Option>AU</Option>
            </Select>
          </TableCell>
          <TableCell>
            <Button
              icon="add"
              design="Transparent"
              tooltip="Add Child Site"
            ></Button>
            <Button
              icon="overflow"
              design="Transparent"
              tooltip="Remove"
            ></Button>
          </TableCell>
        </TableRow> */}
      </Table>
      <div style={{ textAlign: 'center' }}>
        <Button onClick={() => { dispatch(addParent()) }} icon="add" design="Transparent" style={{ display: 'block' }}>
          Add Parent Site
        </Button>
      </div>
      {sitesStructure.length ? (
        <Bar design="FloatingFooter" >
          <div style={{ textAlign: 'right' }}>
            {/* <fd-layout-panel-header class="fd-layout-panel__header">
              <fd-layout-panel-actions class="fd-layout-panel__actions"> */}
            <button type="submit" id="save-main" class="fd-button fd-button--emphasized fd-button--compact"
              onClick={() => {
                // TODO: submit sitesStructure to backend
              }}>Save</button>
            <button type="button" fd-button="" id="cancel-main" class="fd-button fd-button--transparent fd-button--compact"
              onClick={() => dispatch(clearSites())}>Cancel</button>
            {/* </fd-layout-panel-actions>
            </fd-layout-panel-header> */}
          </div>
        </Bar>
      ) : console.log()}
    </Fragment>
  );
};

export default SitesTable;

