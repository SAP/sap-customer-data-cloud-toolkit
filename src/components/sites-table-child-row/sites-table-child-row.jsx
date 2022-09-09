
import { Fragment, useState } from 'react';
import {
    Input,
    InputType,
    Button,
    TableCell,
    Text,
    ActionSheet,
} from '@ui5/webcomponents-react';

import { useDispatch } from 'react-redux'
import { deleteChild, updateChild } from '../../redux/siteSlice';


const ChildTableRow = ({
    childSiteId,
    parentSiteId,
    baseDomain,
    description,
    tags,
    dataCenter,
}) => {
    const [actionSheetOpen, setActionSheetOpen] = useState(false);
    const dispatch = useDispatch()

    return (

        <Fragment>

            <TableCell>
                <Input
                    type={InputType.Text}
                    style={{ width: 'calc(100% - 82px)', marginLeft: '80px' }}
                    value={baseDomain}
                />
            </TableCell>

            <TableCell>
                <Input
                    type={InputType.Text}
                    style={{ width: '100%' }}
                    value={description}
                />
            </TableCell>
            <TableCell>
                <Text
                    style={{
                        marginLeft: 8,
                        textAlign: 'left',
                    }}
                >
                    {dataCenter}
                </Text>
            </TableCell>

            <TableCell>
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
                            id={`actionSheetOpener${childSiteId}`}
                        ></Button>
                        <ActionSheet
                            opener={`actionSheetOpener${childSiteId}`}
                            open={actionSheetOpen}
                            placementType="Bottom"
                            onAfterClose={() => {
                                setActionSheetOpen(false);
                            }}
                        >
                            <Button onClick={() => { dispatch(deleteChild({ parentSiteId, childSiteId })) }}>Delete</Button>
                        </ActionSheet>
                    </>
                </div>
            </TableCell>
        </Fragment>
    )
}

export default ChildTableRow