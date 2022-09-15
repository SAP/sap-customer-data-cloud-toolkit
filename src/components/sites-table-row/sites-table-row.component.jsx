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

import { useSelector, useDispatch } from 'react-redux'
import { deleteParent, updateParent, addChild, deleteChild, updateChild } from '../../redux/siteSlice';


const SitesTableRow = ({
  parentSiteTempId,
  tempId,
  baseDomain,
  description,
  tags,
  dataCenter,
  childSites,
  isChildSite,
}) => {
  const [isActionSheetOpen, setActionSheetOpen] = useState(false);
  const [isChildListOpen, setChildListOpen] = useState(false)

  const dataCentersSelect = [{ value: '', label: '' }, ...dataCenters];

  const dispatch = useDispatch()

  const onChangeDataCenter = (event) => {
    // event.detail.selectedOption is a reference to the selected HTML Element
    // dataset contains all attributes that were passed with the data- prefix.
    console.log(event.detail.selectedOption.dataset.value);
    const dataCenter = event.detail.selectedOption.dataset.value
    dispatch(updateParent({
      tempId,
      baseDomain,
      description,
      dataCenter
    }))
  }

  const onChangeParentDomain = (event) => {
    const baseDomain = event.target.value
    dispatch(updateParent({
      tempId,
      baseDomain,
      description,
      dataCenter
    }))
  }

  const onChangeParentDescription = (event) => {
    const description = event.target.value
    dispatch(updateParent({
      tempId,
      baseDomain,
      description,
      dataCenter,
    }))
  }

  const onChangeChildDomain = (event) => {
    const baseDomain = event.target.value
    dispatch(updateChild({
      parentSiteTempId,
      tempId,
      baseDomain,
      description,
      dataCenter,
    }))
  }

  const onChangeChildDescription = (event) => {
    const description = event.target.value
    dispatch(updateChild({
      parentSiteTempId,
      tempId,
      baseDomain,
      description,
      dataCenter,
    }))
  }

  const actionSheetOpenerHandler = () => {
    if (isActionSheetOpen) {
      setActionSheetOpen(false);
    } else {
      setActionSheetOpen(true);
    }
  }

  const actionSheetOnAfterCloseHandler = () => {
    setActionSheetOpen(false)
  }

  const onDeleteParentHandler = () => {
    dispatch(deleteParent({ tempId }))
  }

  const onDeleteChildHandler = () => {
    dispatch(deleteChild({ parentSiteTempId, tempId }))
  }

  const onAddChildHandler = () => {
    dispatch(addChild({ tempId }))
    setChildListOpen(true)
  }

  return (
    <Fragment>
      <TableRow>
        <TableCell>
          {isChildSite ? (
            <Input
              type={InputType.Text}
              style={{ width: 'calc(100% - 82px)', marginLeft: '80px' }}
              value={baseDomain}
              onInput={event => onChangeChildDomain(event)}
              required='true'
            />
          ) : childSites && childSites.length ? (
            <Fragment>
              {isChildListOpen ? (
                <Button
                  icon="navigation-down-arrow"
                  design="Transparent"
                  tooltip="Add Parent Site"
                  onClick={() => { setChildListOpen(false) }}
                ></Button>
              ) :
                <Button
                  icon="navigation-right-arrow"
                  design="Transparent"
                  tooltip="Add Parent Site"
                  onClick={() => { setChildListOpen(true) }}
                ></Button>
              }
              <Input
                type={InputType.Text}
                style={{ width: 'calc(100% - 40px)' }}
                value={baseDomain}
                onInput={event => onChangeParentDomain(event)}
                required='true'
              />
            </Fragment>
          ) : (
            <Input
              type={InputType.Text}
              style={{ width: 'calc(100% - 40px)', marginLeft: '38px' }}
              value={baseDomain}
              onInput={event => onChangeParentDomain(event)}
              required='true'
            />
          )}
        </TableCell>
        <TableCell>
          {isChildSite ? (
            <Input
              type={InputType.Text}
              style={{ width: '100%' }}
              value={description}
              onInput={event => onChangeChildDescription(event)}
            />
          ) :
            <Input
              type={InputType.Text}
              style={{ width: '100%' }}
              value={description}
              onInput={event => onChangeParentDescription(event)}
            />}
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
              required='true'
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
                <Button
                  icon="overflow"
                  design="Transparent"
                  onClick={actionSheetOpenerHandler}
                  id={`actionSheetOpener${tempId}`}
                ></Button>
                <ActionSheet
                  opener={`actionSheetOpener${tempId}`}
                  open={isActionSheetOpen}
                  placementType="Bottom"
                  onAfterClose={actionSheetOnAfterCloseHandler}
                >
                  <Button onClick={onAddChildHandler}>Create Child Site</Button>
                  <Button onClick={onDeleteParentHandler}>Delete</Button>
                </ActionSheet>
              </>
            ) : (
              <>
                <Button
                  icon="overflow"
                  design="Transparent"
                  onClick={actionSheetOpenerHandler}
                  id={`actionSheetOpener${tempId}`}
                ></Button>
                <ActionSheet
                  opener={`actionSheetOpener${tempId}`}
                  open={isActionSheetOpen}
                  placementType="Bottom"
                  onAfterClose={actionSheetOnAfterCloseHandler}
                >
                  <Button onClick={onDeleteChildHandler}>Delete</Button>
                </ActionSheet>
              </>
            )}
          </div>
        </TableCell>
      </TableRow>
      {
        isChildListOpen ?
          childSites?.map((childSite) => (
            <SitesTableRow
              key={childSite.tempId}
              {...childSite}
              isChildSite={true}
            />
          )) : console.log()
      }
    </Fragment>
  );
};

export default SitesTableRow;
