import { Fragment, useState } from 'react';
import {
    Input,
    InputType,
    Select,
    Option,
    Button,
    TableRow,
    TableCell,
    ActionSheet,
} from '@ui5/webcomponents-react';
import '@ui5/webcomponents-icons/dist/navigation-down-arrow.js';
import '@ui5/webcomponents-icons/dist/navigation-right-arrow.js';
import '@ui5/webcomponents-icons/dist/add.js';
import '@ui5/webcomponents-icons/dist/decline.js';
import '@ui5/webcomponents-icons/dist/overflow.js';

import ChildTableRow from '../sites-table-child-row/sites-table-child-row';

import dataCenters from '../../dataCenters.json';

import { useDispatch } from 'react-redux'
import { deleteParent, updateParent, addChild } from '../../redux/siteSlice';


const ParentSiteTableRow = ({
    tempId,
    baseDomain,
    description,
    tags,
    dataCenter,
    childSites,
}) => {
    const [isActionSheetOpen, setActionSheetOpen] = useState(false);
    const [isChildListOpen, setChildListOpen] = useState(false)

    const dataCentersSelect = [{ value: '', label: '' }, ...dataCenters];

    const dispatch = useDispatch()

    const onChangeDataCenter = (event) => {
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

    return (
        <Fragment>
            <TableRow>
                <TableCell>
                    {childSites && childSites.length ? (
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
                    <Input
                        type={InputType.Text}
                        style={{ width: '100%' }}
                        value={description}
                        onInput={event => onChangeParentDescription(event)}
                    />
                </TableCell>

                <TableCell>
                    <Select
                        style={{ width: '100%' }}
                        onChange={onChangeDataCenter}
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
                </TableCell>

                <TableCell style={{ textAlign: 'right' }}>
                    <div style={{ position: 'relative' }}>
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
                    </div>
                </TableCell>
            </TableRow>
            {isChildListOpen ?
                childSites?.map((childSite) => (
                    <ChildTableRow
                        key={childSite.tempId}
                        {...childSite}
                        isChildSite={true}
                    />
                )) : console.log()
            }
        </Fragment>)
}

export default ParentSiteTableRow