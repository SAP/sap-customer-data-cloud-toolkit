import { Fragment, useState } from 'react';
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
  Text,
  ActionSheet,
} from '@ui5/webcomponents-react';
import { spacing } from '@ui5/webcomponents-react-base';
import '@ui5/webcomponents-icons/dist/navigation-down-arrow.js';
import '@ui5/webcomponents-icons/dist/navigation-right-arrow.js';
import '@ui5/webcomponents-icons/dist/add.js';
import '@ui5/webcomponents-icons/dist/decline.js';
import '@ui5/webcomponents-icons/dist/overflow.js';

import dataCenters from '../../dataCenters.json';

const SitesTableRow = ({
  tempId,
  baseDomain,
  description,
  tags,
  dataCenter,
  childSites,
  isChildSite,
}) => {
  const [actionSheetOpen, setActionSheetOpen] = useState(false);

  const dataCentersSelect = [{ value: '', label: '' }, ...dataCenters];

  const onChangeDataCenter = (event) => {
    // event.detail.selectedOption is a reference to the selected HTML Element
    // dataset contains all attributes that were passed with the data- prefix.
    console.log(event.detail.selectedOption.dataset.value);
  };

  return (
    <Fragment>
      <TableRow>
        <TableCell>
          {isChildSite ? (
            <Input
              type={InputType.Text}
              style={{ width: 'calc(100% - 82px)', marginLeft: '80px' }}
              value={baseDomain}
            />
          ) : childSites && childSites.length ? (
            <Fragment>
              <Button
                icon="navigation-down-arrow"
                design="Transparent"
                tooltip="Add Parent Site"
              ></Button>
              <Input
                type={InputType.Text}
                style={{ width: 'calc(100% - 40px)' }}
                value={baseDomain}
              />
            </Fragment>
          ) : (
            <Input
              type={InputType.Text}
              style={{ width: 'calc(100% - 40px)', marginLeft: '38px' }}
              value={baseDomain}
            />
          )}
          {/* <Button
icon="navigation-down-arrow"
design="Transparent"
></Button> */}
        </TableCell>
        <TableCell>
          <Input
            type={InputType.Text}
            style={{ width: '100%' }}
            value={description}
          />
        </TableCell>
        <TableCell>
          {isChildSite ? (
            <Text
              style={{
                marginLeft: 8,
                textAlign: 'left',
              }}
            >
              {dataCenter}
            </Text>
          ) : (
            <Select
              style={{ width: '100%' }}
              onChange={onChangeDataCenter}
              disabled={isChildSite}
            >
              {dataCentersSelect.map(({ value }) => (
                <Option
                  key={value}
                  data-value={value}
                  selected={value === dataCenter}
                >
                  {value}
                </Option>
              ))}
            </Select>
          )}
        </TableCell>
        {/* <TableCell>
          <Input type={InputType.Text} style={{ width: '100%' }} value={tags} />
        </TableCell> */}
        <TableCell style={{ textAlign: 'right' }}>
          <div style={{ position: 'relative' }}>
            {!isChildSite ? (
              <>
                {/* <Button
                  icon="add"
                  design="Transparent"
                  tooltip="Add Child Site"
                ></Button> */}
                <Button
                  icon="overflow"
                  design="Transparent"
                  onClick={() => {
                    setActionSheetOpen(true);
                  }}
                  id={`actionSheetOpener${tempId}`}
                ></Button>
                <ActionSheet
                  opener={`actionSheetOpener${tempId}`}
                  open={actionSheetOpen}
                  placementType="Bottom"
                  onAfterClose={() => {
                    setActionSheetOpen(false);
                  }}
                >
                  <Button>Create Child Site</Button>
                  <Button>Delete</Button>
                </ActionSheet>
              </>
            ) : (
              <>
                <Button
                  icon="overflow"
                  design="Transparent"
                  onClick={() => {
                    setActionSheetOpen(true);
                  }}
                  id={`actionSheetOpener${tempId}`}
                ></Button>
                <ActionSheet
                  opener={`actionSheetOpener${tempId}`}
                  open={actionSheetOpen}
                  placementType="Bottom"
                  onAfterClose={() => {
                    setActionSheetOpen(false);
                  }}
                >
                  <Button>Delete</Button>
                </ActionSheet>
              </>
            )}

            {/* <Button
  icon="decline"
  design="Transparent"
  tooltip="Remove"
></Button> */}
          </div>
        </TableCell>
      </TableRow>
      {childSites?.map((childSite) => (
        <SitesTableRow
          key={childSite.tempId}
          {...childSite}
          isChildSite={true}
        />
      ))}
    </Fragment>
  );
};

export default SitesTableRow;
