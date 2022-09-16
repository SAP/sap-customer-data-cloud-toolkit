
import { Fragment, useState } from 'react';
import {
    Input,
    InputType,
    Button,
    TableRow,
    TableCell,
    Text,
    ActionSheet,
} from '@ui5/webcomponents-react';

import { useDispatch } from 'react-redux'
import { deleteChild, updateChild } from '../../redux/siteSlice';


const ChildTableRow = ({
    parentSiteTempId,
    tempId,
    baseDomain,
    description,
    tags,
    dataCenter,
}) => {
    const [isActionSheetOpen, setActionSheetOpen] = useState(false);
    const dispatch = useDispatch()

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

    const onDeleteChildHandler = () => {
        dispatch(deleteChild({ parentSiteTempId, tempId }))
    }


    return (
        <Fragment>
            <TableRow>
                <TableCell>
                    <Input
                        type={InputType.Text}
                        style={{ width: 'calc(100% - 82px)', marginLeft: '80px' }}
                        value={baseDomain}
                        onInput={event => onChangeChildDomain(event)}
                        required='true'
                    />
                </TableCell>

                <TableCell>
                    <Input
                        type={InputType.Text}
                        style={{ width: '100%' }}
                        value={description}
                        onInput={event => onChangeChildDescription(event)}
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
                    </div>
                </TableCell>
            </TableRow>
        </Fragment>
    )
}

export default ChildTableRow