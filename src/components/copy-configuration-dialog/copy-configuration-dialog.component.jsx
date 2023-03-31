import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { createUseStyles } from 'react-jss'

import { Card, CardHeader, Title, Text, TitleLevel, FlexBox, Grid, ValueState, BusyIndicator, MessageStrip } from '@ui5/webcomponents-react'

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
} from '../../redux/siteDeployerCopyConfiguration/siteDeployerCopyConfigurationSlice'

import { areConfigurationsFilled } from '../../routes/copy-configuration-extended/utils'

import styles from '../../routes/copy-configuration-extended/copy-configuration-extended.styles'
const useStyles = createUseStyles(styles, { name: 'CopyConfigurationDialog' })

const CopyConfigurationDialog = ({ siteId, edit, open, setIsCopyConfigurationDialogOpen, onAfterCloseHandler, t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const configurations = useSelector(selectSourceConfigurations(siteId))
  const sourceSites = useSelector(selectSourceSites(siteId))
  const isLoading = useSelector(selectIsLoading)
  const apiCardError = useSelector(selectApiCardError)
  const isSourceInfoLoading = useSelector(selectIsSourceInfoLoading)
  const errors = useSelector(selectErrors)

  const [initialConfigurations, setInitialConfigurations] = useState([])
  const [initialSourceSites, setInitialSourceSites] = useState([])
  const [tarketApiKeyInputValue, setTarketApiKeyInputValue] = useState('')
  const [selectAllCheckboxState, setSelectAllCheckboxState] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (edit) {
      if ((!initialConfigurations.length || saving) && configurations.length) {
        setInitialConfigurations(configurations)
      }
      if ((!initialSourceSites.length || saving) && sourceSites.length) {
        setInitialSourceSites(sourceSites)
      }
    }
  }, [initialConfigurations.length, initialSourceSites.length, configurations, sourceSites, edit, saving])

  useEffect(() => {
    if (sourceSites && sourceSites.length) {
      dispatch(getSourceSiteConfigurations(siteId))
    }
  }, [dispatch, sourceSites, siteId])

  const onSaveHandler = () => {
    setSaving(true)
    setIsCopyConfigurationDialogOpen(false)
  }

  const onSelectAllCheckboxChangeHandler = (event) => {
    const value = event.srcElement.checked
    setSelectAllCheckboxState(value)
    configurations.forEach((configuration) => {
      const checkBoxId = configuration.id
      dispatch(setConfigurationStatus({ siteId: siteId, checkBoxId, value }))
    })
  }

  const onSourceApiKeyDeleteHandler = (event) => {
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
    onAfterCloseHandler()
    setSelectAllCheckboxState(false)
    dispatch(clearApiCardError())
  }

  const showConfigurations = () => {
    return (
      <SiteConfigurations
        siteId={siteId}
        configurations={configurations}
        selectAllCheckboxState={selectAllCheckboxState}
        onSelectAllCheckboxChangeHandler={onSelectAllCheckboxChangeHandler}
        setConfigurationStatus={setConfigurationStatus}
      />
    )
  }

  const showSourceApiKeys = () => {
    return <TargetApiKeysList targetSites={sourceSites} onTarketApiKeyDeleteHandler={onSourceApiKeyDeleteHandler} />
  }

  const showBusyIndicator = () => {
    return isLoading ? <BusyIndicator active delay="1" className={classes.busyIndicatorStyle} /> : ''
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
      open={open}
      state={ValueState.None}
      headerText={t('GLOBAL.COPY_CONFIGURATION')}
      confirmButtonClickHandler={onSaveHandler}
      confirmButtonText={t('GLOBAL.SAVE')}
      onAfterClose={onDialogMessageConfirmAfterCloseHandle}
      disableSaveButton={disableSaveButton}
    >
      <div className={classes.outerDivStyle}>
        <div className={classes.headerOuterDivStyle}>
          <div className={classes.headerInnerDivStyle}>
            <FlexBox className={classes.headerTextFlexboxStyle}>
              <Text id="copyConfigDialogHeaderText" className={classes.componentTextStyle}>
                {t('COPY_CONFIGURATION_DIALOG.HEADER_TEXT')}
              </Text>
            </FlexBox>

            <Card header={<CardHeader titleText={t('COPY_CONFIGURATION_DIALOG.SELECT_SOURCE_SITE')} />}>
              <Grid>
                <>
                  <div className={classes.targetInfoContainer} data-layout-span="XL6 L6 M6 S6">
                    <TargetSitesTooltipIcon title="" />
                    <Card>
                      <div className={classes.targetInfoContainerInputContainer}>
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
                    </Card>
                  </div>
                  <div className={classes.targetInfoContainer} data-layout-span="XL6 L6 M6 S6">
                    {sourceSites && sourceSites.length ? (
                      <>
                        <Title level={TitleLevel.H5} className={classes.targetSitesListTitle}>
                          {t('COPY_CONFIGURATION_DIALOG.SOURCE_SITE')}
                        </Title>
                        <Card className={classes.targetSitesListContainer}>{showSourceApiKeys()}</Card>{' '}
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                </>
              </Grid>
              {showBusyIndicator()}
            </Card>
          </div>
        </div>
        {showConfigurations()}
        {showErrorList()}
      </div>
    </DialogMessageConfirm>
  )
}

export default withTranslation()(CopyConfigurationDialog)
