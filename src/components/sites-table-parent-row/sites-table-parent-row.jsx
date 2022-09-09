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
    parentSiteId,
    baseDomain,
    description,
    tags,
    dataCenter,
    childSites,
}) => {
    const [actionSheetOpen, setActionSheetOpen] = useState(false);
    const [isChildListOpen, setChildListOpen] = useState(false)

    const dataCentersSelect = [{ value: '', label: '' }, ...dataCenters];

    const onChangeDataCenter = (event) => {
        // event.detail.selectedOption is a reference to the selected HTML Element
        // dataset contains all attributes that were passed with the data- prefix.
        console.log(event.detail.selectedOption.dataset.value);
    };

    const dispatch = useDispatch()

    return (
        <Fragment>
            <TableRow>

                <TableCell>
                    {() => {
                        if (childSites && childSites.length) {
                            isChildListOpen ?
                                (<Button
                                    icon="navigation-down-arrow"
                                    design="Transparent"
                                    tooltip="Hide childs"
                                    onClick={() => setChildListOpen(false)}
                                ></Button>)
                                    (<Input
                                        type={InputType.Text}
                                        style={{ width: 'calc(100% - 40px)' }}
                                        value={baseDomain}
                                    />) :
                                (<Button
                                    icon="navigation-right-arrow"
                                    design="Transparent"
                                    tooltip="Show childs"
                                    onClick={() => setChildListOpen(true)}
                                ></Button>)
                                    (<Input
                                        type={InputType.Text}
                                        style={{ width: 'calc(100% - 40px)', marginLeft: '38px' }}
                                        value={baseDomain}
                                    />)
                        }
                    }
                    }
                </TableCell>

                <TableCell>
                    <Input
                        type={InputType.Text}
                        style={{ width: '100%' }}
                        value={description}
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
                                onClick={() => {
                                    if (actionSheetOpen) {
                                        setActionSheetOpen(false);
                                    } else {
                                        setActionSheetOpen(true);
                                    }
                                }}
                                id={`actionSheetOpener${parentSiteId}`}
                            ></Button>
                            <ActionSheet
                                opener={`actionSheetOpener${parentSiteId}`}
                                open={actionSheetOpen}
                                placementType="Bottom"
                                onAfterClose={() => {
                                    setActionSheetOpen(false);
                                }}
                            >
                                <Button onClick={() => { dispatch(addChild({ parentSiteId })) }}>Create Child Site</Button>
                                <Button onClick={() => { dispatch(deleteParent({ parentSiteId })) }}>Delete</Button>
                            </ActionSheet>
                        </>
                    </div>
                </TableCell>

            </TableRow>
            {() => {
                if (isChildListOpen) {
                    childSites?.map((childSite) => (
                        <ChildTableRow
                            key={childSite.childId}
                            {...childSite}
                        />
                    ))
                }
            }
            }
        </Fragment>)
}

export default ParentSiteTableRow