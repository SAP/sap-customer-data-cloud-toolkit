/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { createUseStyles } from 'react-jss'

import { Card, ValueState, BusyIndicator, MessageStrip } from '@ui5/webcomponents-react'

import DialogMessageConfirm from '../../components/dialog-message-confirm/dialog-message-confirm.component'
import SearchSitesInput from '../../components/search-sites-input/search-sites-input.component'
import SiteConfigurations from '../../components/site-configurations/site-configurations.component'
import TargetSitesTooltipIcon from '../../components/target-sites-tooltip-icon/target-sites-tooltip-icon.component'
import TargetApiKeysList from '../../components/target-api-keys-list/target-api-keys-list.component'
import MessageList from '../../components/message-list/message-list.component'

import {
  clearSourceConfigurations,
  addSourceSite,
  getSourceSiteInformation,
  setConfigurationStatus,
  removeSourceSite,
  getSourceSiteConfigurations,
  selectSourceConfigurations,
  selectSourceSites,
  selectIsLoading,
  setSourceConfigurations,
  setSourceSites,
  removeSiteConfigurations,
  selectApiCardError,
  selectIsSourceInfoLoading,
  clearApiCardError,
  selectErrors,
  selectSiteId,
  selectEdit,
  selectIsCopyConfigurationDialogOpen,
  setIsCopyConfigurationDialogOpen,
  selectSourceSiteAdded,
  clearErrors,
  setDataflowVariableValue,
  setDataflowVariableValues,
  setErrors,
} from '../../redux/siteDeployerCopyConfiguration/siteDeployerCopyConfigurationSlice'

import { areConfigurationsFilled } from '../../routes/copy-configuration-extended/utils'

import { checkDataflowVariables } from '../../redux/copyConfigurationExtended/utils'

import styles from '../../routes/copy-configuration-extended/copy-configuration-extended.styles'
const useStyles = createUseStyles(styles, { name: 'CopyConfigurationDialog' })

const CopyConfigurationDialog = ({ t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const siteId = useSelector(selectSiteId)
  const edit = useSelector(selectEdit)
  const open = useSelector(selectIsCopyConfigurationDialogOpen)
  const configurations = useSelector(selectSourceConfigurations(siteId))
  const sourceSites = useSelector(selectSourceSites(siteId))
  const isLoading = useSelector(selectIsLoading)
  const apiCardError = useSelector(selectApiCardError)
  const isSourceInfoLoading = useSelector(selectIsSourceInfoLoading)
  const errors = useSelector(selectErrors)
  const sourceSiteAdded = useSelector(selectSourceSiteAdded)

  const [initialConfigurations, setInitialConfigurations] = useState([])
  const [initialSourceSites, setInitialSourceSites] = useState([])
  const [tarketApiKeyInputValue, setTarketApiKeyInputValue] = useState('')
  const [selectAllCheckboxState, setSelectAllCheckboxState] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open && edit) {
      setInitialConfigurations(configurations)
      setInitialSourceSites(sourceSites)
    }
  }, [open]) //eslint-disable-line

  useEffect(() => {
    if (sourceSiteAdded && sourceSites.length) {
      dispatch(getSourceSiteConfigurations(siteId))
    }
  }, [dispatch, sourceSiteAdded]) //eslint-disable-line

  const onSaveHandler = () => {
    if (!disableSaveButton()) {
      const responses = checkDataflowVariables(configurations)
      if (responses.length) {
        dispatch(setErrors(responses))
      } else {
        setSaving(true)
        dispatch(setIsCopyConfigurationDialogOpen(false))
      }
    }
  }

  const onSelectAllCheckboxChangeHandler = (event) => {
    const value = event.srcElement.checked
    setSelectAllCheckboxState(value)
    configurations.forEach((configuration) => {
      const checkBoxId = configuration.id
      dispatch(setConfigurationStatus({ siteId: siteId, checkBoxId, value }))
    })
  }

  const onSourceApiKeyDeleteHandler = () => {
    dispatch(removeSourceSite(siteId))
    dispatch(clearSourceConfigurations(siteId))
    setSelectAllCheckboxState(false)
  }

  const onDialogMessageConfirmAfterCloseHandle = () => {
    if (!saving) {
      if (edit) {
        dispatch(setSourceConfigurations({ siteId, configurations: initialConfigurations }))
        dispatch(setSourceSites({ siteId, sourceSites: initialSourceSites }))
      } else {
        dispatch(removeSiteConfigurations(siteId))
      }
      setTarketApiKeyInputValue('')
    } else {
      setSaving(false)
    }
    dispatch(setIsCopyConfigurationDialogOpen(false))
    dispatch(clearApiCardError())
    dispatch(clearErrors())
    setSelectAllCheckboxState(false)
  }

  const showConfigurations = () => {
    return (
      <SiteConfigurations
        siteId={siteId}
        configurations={configurations}
        selectAllCheckboxState={selectAllCheckboxState}
        onSelectAllCheckboxChangeHandler={onSelectAllCheckboxChangeHandler}
        setConfigurationStatus={setConfigurationStatus}
        setDataflowVariableValue={setDataflowVariableValue}
        setDataflowVariableValues={setDataflowVariableValues}
      />
    )
  }

  const showSourceApiKeys = () => {
    return <TargetApiKeysList targetSites={sourceSites} onTarketApiKeyDeleteHandler={onSourceApiKeyDeleteHandler} />
  }

  const showBusyIndicator = () => {
    return isLoading ? <BusyIndicator active delay="1" className={classes.inPopupBusyIndicatorStyle} /> : ''
  }

  const disableSaveButton = () => {
    return (sourceSites && sourceSites.length === 0) || !areConfigurationsFilled(configurations)
  }

  const onMessageStripCloseHandler = () => {
    dispatch(clearApiCardError())
  }

  const showMessageStripError = () => {
    return apiCardError ? (
      <MessageStrip id="messageStripError" design="Negative" onClose={onMessageStripCloseHandler}>
        {apiCardError.errorMessage}
      </MessageStrip>
    ) : (
      ''
    )
  }

  const showErrorList = () => {
    return errors.length ? (
      <div className={classes.errorListOuterDivStyle}>
        <div className={classes.errorListInnerDivStyle}>
          <Card id="errorListContainer">
            <MessageList messages={errors} />
          </Card>
        </div>
      </div>
    ) : (
      ''
    )
  }

  const showGetTargetInfoBusyIndicator = () => {
    return isSourceInfoLoading ? <BusyIndicator active delay="1" className={classes.busyIndicatorStyle} /> : ''
  }

  return (
    <DialogMessageConfirm
      id="siteCopyConfigurationDialog"
      data-cy="siteCopyConfigurationDialog"
      open={open}
      state={ValueState.None}
      headerText={t('GLOBAL.COPY_CONFIGURATION')}
      confirmButtonClickHandler={onSaveHandler}
      confirmButtonText={t('GLOBAL.SAVE')}
      onAfterClose={onDialogMessageConfirmAfterCloseHandle}
      disableSaveButton={disableSaveButton}
      className={classes.siteCopyConfigurationDialogStyle}
    >
      <div className={classes.headerOuterDivStyle}>
        <div className={classes.headerInnerDivStyle}>
          <div className={classes.targetSitesTooltipIconDivStyle}>
            <TargetSitesTooltipIcon title="" />
          </div>
          <div>
            <SearchSitesInput
              siteId={siteId}
              tarketApiKeyInputValue={tarketApiKeyInputValue}
              setTarketApiKeyInputValue={setTarketApiKeyInputValue}
              addTargetSite={addSourceSite}
              getTargetSiteInformation={getSourceSiteInformation}
            />
            {showGetTargetInfoBusyIndicator()}
            {showMessageStripError()}
          </div>

          <div>
            {sourceSites && sourceSites.length ? (
              <>
                <Card className={classes.inPopupTargetSitesListContainer}>{showSourceApiKeys()}</Card>{' '}
              </>
            ) : (
              ''
            )}
          </div>
          {showBusyIndicator()}
        </div>
      </div>
      {showConfigurations()}
      {showErrorList()}
    </DialogMessageConfirm>
  )
}

export default withTranslation()(CopyConfigurationDialog)
