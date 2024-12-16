/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import React, { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import styles from './server-import.styles.js'
import {
  Card,
  Bar,
  Title,
  Text,
  Button,
  Input,
  Option,
  Select,
  Form,
  FormItem,
  Label,
  FormGroup,
  ValueState,
  Icon,
  Popover,
  FlexBoxDirection,
  FlexBox,
  FlexBoxJustifyContent,
  FlexBoxAlignItems,
} from '@ui5/webcomponents-react'
import {
  clearConfigurations,
  getConfigurations,
  getServerConfiguration,
  selectServerConfigurations,
  selectShowSuccessDialog,
  setAccountType,
  setDataflow,
} from '../../redux/serverImport/serverImportSlice.js'
import { getCurrentSiteInformation, selectCurrentSiteInformation } from '../../redux/copyConfigurationExtended/copyConfigurationExtendedSlice.js'
import { getApiKey } from '../../redux/utils.js'
import { selectCredentials } from '../../redux/credentials/credentialsSlice.js'
import { useDispatch, useSelector } from 'react-redux'
import DialogMessageInform from '../../components/dialog-message-inform/dialog-message-inform.component.jsx'
import { isInputFilled } from './utils.js'
import FormItemWithIcon from '../../components/server-import-form/server-import-form.container.jsx'
const useStyles = createUseStyles(styles, { name: 'Server Import' })
const PAGE_TITLE = 'Accounts Import'
const ServerImportComponent = ({ t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const credentials = useSelector(selectCredentials)
  const apikey = getApiKey(window.location.hash)
  const currentSiteInfo = useSelector(selectCurrentSiteInformation)
  const serverConfigurations = useSelector(selectServerConfigurations)
  const [selectedOption, setSelectedOption] = useState('azure')
  const [accountOption, setAccountOption] = useState('Full')
  const [showDialog, setShowSuccessDialog] = useState(false)
  const [isMouseOverIcon, setIsMouseOverIcon] = useState(false)
  const [tooltipTarget, setTooltipTarget] = useState('')
  const showSuccessDialog = useSelector(selectShowSuccessDialog)
  useEffect(() => {
    dispatch(getCurrentSiteInformation())
    dispatch(getConfigurations())
    setFormData(serverConfigurations)
  }, [dispatch, apikey, credentials, currentSiteInfo.dataCenter])

  const [formData, setFormData] = useState([])

  const handleAccountOptionChange = (event) => {
    const selectedValue = event.target.value
    const setSelectedServerOption = selectedOption
    dispatch(setAccountType({ accountType: selectedValue, serverType: setSelectedServerOption }))
    setAccountOption(selectedValue)
  }
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value)
  }

  const onMouseOverHandler = (event) => {
    console.log('event-tartet', event.target.shadowRoot.host.id)
    console.log(`${event.target}TooltipIcon`)
    if (event.target.shadowRoot) {
      setTooltipTarget(event.target.shadowRoot.host.id)
      setIsMouseOverIcon(true)
    }
  }
  const onMouseOutHandler = () => {
    setIsMouseOverIcon(false)
  }

  const openPopover = (id) => {
    console.log('id--->', id)
    console.log('tooltipTarget--->', tooltipTarget)
    return isMouseOverIcon && tooltipTarget === `${id}TooltipIcon`
  }
  const handleInputChange = (event, id) => {
    dispatch(getServerConfiguration({ selectedOption, id, value: event.target.value, accountType: accountOption }))
  }
  const disableDeployButton = () => {
    if (serverConfigurations[selectedOption]) {
      return !isInputFilled(serverConfigurations[selectedOption])
    }
  }
  const handleSubmit = () => {
    if (selectedOption && accountOption) {
      dispatch(setDataflow({ option: selectedOption }))
      setShowSuccessDialog(true)
    }
  }

  const onCancelHandler = () => {
    dispatch(clearConfigurations({ option: selectedOption }))
    setFormData(serverConfigurations)
  }

  const showSuccessMessage = () => (
    <DialogMessageInform
      open={showSuccessDialog}
      headerText="Success"
      state={ValueState.Success}
      closeButtonContent="Close"
      id="copyConfigSuccessPopup"
      data-cy="copyConfigSuccessPopup"
    >
      <Text>SuccessFull</Text>
    </DialogMessageInform>
  )
  return (
    <>
      <Card>
        <div className={classes.outerDiv}>
          <Title className={classes.titleContainer} level="H3">
            {PAGE_TITLE}
          </Title>

          <div className={classes.outerDivContainer}>
            <div className={classes.serverDropDown}>
              <div className={classes.smallTitle}>Select Account Type</div>
              <Select onChange={handleAccountOptionChange} className={classes.selectBox}>
                <Option value="Full">Full Account</Option>
                <Option value="Lite">Lite Account</Option>
              </Select>
              <div className={classes.smallTitle}>Select your storage server</div>
              <Select onChange={handleOptionChange} className={classes.selectBox}>
                {Object.keys(serverConfigurations).map((key) => (
                  <Option key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Option>
                ))}
              </Select>
            </div>
            <Form title="Test Form" columnsS={2} columnsM={2} columnsL={2} columnsXL={2} labelSpanS={12} labelSpanM={12} labelSpanL={12} labelSpanXL={12}>
              <FormGroup>
                {serverConfigurations[selectedOption] &&
                  serverConfigurations[selectedOption].map((field) => (
                    <FormItem key={field.name}>
                      <FormItemWithIcon
                        field={field}
                        onMouseOverHandler={onMouseOverHandler}
                        onMouseOutHandler={onMouseOutHandler}
                        handleInputChange={handleInputChange}
                        openPopover={openPopover}
                      />
                    </FormItem>
                  ))}
              </FormGroup>
            </Form>
          </div>
          <div className={classes.selectConfigurationOuterDivStyle}>
            <Bar design="Footer" className={classes.createButtonBarStyle}>
              <div>
                <Button
                  type="submit"
                  id="copyConfigExtendedSaveButton"
                  className="fd-button fd-button--emphasized fd-button--compact"
                  onClick={handleSubmit}
                  data-cy="copyConfigExtendedSaveButton"
                  design="Emphasized"
                  disabled={disableDeployButton()}
                >
                  Import
                </Button>
                <Button
                  type="button"
                  id="copyConfigExtendedCancelButton"
                  data-cy="copyConfigExtendedCancelButton"
                  onClick={onCancelHandler}
                  className="fd-button fd-button--transparent fd-button--compact"
                >
                  Cancel
                </Button>
              </div>
            </Bar>
          </div>
        </div>
      </Card>
      {showDialog && showSuccessMessage()}
    </>
  )
}

export default ServerImportComponent
