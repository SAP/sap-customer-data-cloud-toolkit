/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { createUseStyles } from 'react-jss'

import { Button, ValueState, Label, Input, InputType, FlexBox } from '@ui5/webcomponents-react'

import DialogMessageConfirm from '../dialog-message-confirm/dialog-message-confirm.component'
import { areAllVariablesSet } from './utils'

import '@ui5/webcomponents-icons/dist/settings'
import styles from './dataflow-settings.styles.js'

const useStyles = createUseStyles(styles, { name: 'DataflowSettings' })

const DataflowSettings = ({ dataFlowTreeNode, setDataflowVariableValue, setDataflowVariableValues, t }) => {
  const dispatch = useDispatch()
  const classes = useStyles()

  const [openSettingsDialog, setOpenSettingsDialog] = useState(false)
  const [saving, setSaving] = useState(false)
  const [initialVariableValues, setInitialVariableValues] = useState([])

  useEffect(() => {
    if (openSettingsDialog) {
      setInitialVariableValues(dataFlowTreeNode.variables)
    }
  }, [openSettingsDialog]) //eslint-disable-line
  console.log('dataFlowTreeNode.variables', dataFlowTreeNode.variables)
  const onDataflowSettingsButtonClickHandler = () => {
    setOpenSettingsDialog(true)
  }

  const onSaveHandler = () => {
    if (!disableSaveButton()) {
      setSaving(true)
      setOpenSettingsDialog(false)
    }
  }

  const onDialogAfterCloseHandle = () => {
    if (!saving) {
      dispatch(setDataflowVariableValues({ checkBoxId: dataFlowTreeNode.id, variables: initialVariableValues }))
    } else {
      setSaving(false)
    }
    setOpenSettingsDialog(false)
  }

  const disableSaveButton = () => {
    return !areAllVariablesSet(dataFlowTreeNode.variables)
  }

  const onInputHandler = (event, variable) => {
    dispatch(setDataflowVariableValue({ checkBoxId: dataFlowTreeNode.id, variable: variable, value: event.target.value }))
  }

  return (
    <>
      <Button icon="settings" design="Transparent" onClick={onDataflowSettingsButtonClickHandler} />
      <DialogMessageConfirm
        open={openSettingsDialog}
        state={ValueState.None}
        headerText={`Dataflow: ${dataFlowTreeNode.name}`}
        confirmButtonClickHandler={onSaveHandler}
        confirmButtonText={t('GLOBAL.SAVE')}
        onAfterClose={onDialogAfterCloseHandle}
        disableSaveButton={disableSaveButton}
        className={classes.dataflowSettingsDialogStyle}
        data-cy="dataflowSettingsDialog"
      >
        {dataFlowTreeNode.variables.map((variable) => {
          return (
            <FlexBox key={variable.variable} alignItems="Start" direction="Column">
              <Label>{variable.variable}</Label>
              <Input
                className={classes.inputStyle}
                type={InputType.Text}
                value={variable.value}
                onInput={(event) => onInputHandler(event, variable.variable)}
                data-cy="dataflowVariableInput"
              />
            </FlexBox>
          )
        })}
      </DialogMessageConfirm>
    </>
  )
}

export default withTranslation()(DataflowSettings)
